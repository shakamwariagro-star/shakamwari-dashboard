/**
 * STL Dashboard — Supabase sync adapter
 * ====================================================================
 * Loaded alongside lab-dashboard.html. Bridges the dashboard's
 * localStorage-only persistence to a shared Supabase dashboard_state
 * row so every device sees the same data in real time.
 *
 * Architecture:
 *   - The dashboard still reads/writes localStorage["lab_mgmt_app_v2"]
 *     unchanged. This adapter intercepts setItem to fire-and-forget
 *     a push to Supabase, and subscribes to realtime UPDATE events to
 *     pull fresh data back into localStorage + re-render the active view.
 *   - Auth stays with the dashboard's own hashed-user table (no Supabase
 *     Auth session required). The anon role has RLS-allowed access to
 *     the singleton row (see migration 010_dashboard_state_anon.sql).
 *
 * Conflict model: last-write-wins. Acceptable for ≤ ~10 concurrent users.
 *
 * Re-apply after every client HTML update:
 *   1. Drop the new HTML at public/lab-dashboard.html.
 *   2. Make sure the inline <script src="stl-adapter.js"></script> line
 *      is still in <head> of the HTML (one-time edit; survives if the
 *      client doesn't strip it).
 * ==================================================================== */

(function () {
  'use strict';

  // ---- Config ----
  const SUPABASE_URL  = 'https://fpneganhxhuxwxtaaodn.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwbmVnYW5oeGh1eHd4dGFhb2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTU1ODQsImV4cCI6MjA5MzAzMTU4NH0.RtGpYELDKmRVTGMC9PHiCdJQ_hQptO_B4ZfxjKVV9Z4';
  const STORAGE_KEY   = 'lab_mgmt_app_v2';
  const PUSH_DEBOUNCE_MS = 600;
  const SELF_ECHO_GUARD_MS = 1500; // ignore realtime updates that arrive within this window of our own push
  const SESSION_ID = 'sess_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now();

  // ---- State ----
  let supabase = null;
  let pushTimer = null;
  let lastLocalPushAt = 0;
  let lastRemoteApplyAt = 0;
  let pendingState = null;
  let realtimeChannel = null;
  let statusEl = null;
  let bootDone = false;

  // ---- Status pill (tiny indicator) ----
  function buildStatusPill() {
    if (statusEl) return;
    statusEl = document.createElement('div');
    statusEl.id = 'stl-sync-status';
    statusEl.style.cssText = [
      'position:fixed','top:8px','right:10px','z-index:99999',
      'font:600 11px/1 system-ui,-apple-system,sans-serif',
      'padding:5px 9px','border-radius:999px',
      'background:#fff','color:#0a1f04',
      'border:1px solid #6f9043','box-shadow:0 1px 3px rgba(15,60,15,0.18)',
      'cursor:default','user-select:none','pointer-events:none','opacity:0.92'
    ].join(';');
    statusEl.textContent = '○ syncing…';
    document.body.appendChild(statusEl);
  }
  function setStatus(text, color) {
    if (!statusEl) buildStatusPill();
    statusEl.textContent = text;
    statusEl.style.borderColor = color || '#6f9043';
    statusEl.style.color = color || '#0a1f04';
  }

  // ---- Load Supabase JS from CDN dynamically ----
  function loadSupabaseSDK() {
    return new Promise((resolve, reject) => {
      if (window.supabase && window.supabase.createClient) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      s.async = false;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load Supabase SDK'));
      document.head.appendChild(s);
    });
  }

  // ---- localStorage wrapper ----
  // Install the setItem hook synchronously so writes during initial dashboard
  // boot still get queued for upload. getItem stays untouched — the dashboard
  // reads localStorage directly and that's fine; we'll refresh from remote
  // once Supabase loads and explicitly call loadFullState() + re-render.
  const origSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, val) {
    origSetItem.call(this, key, val);
    if (this === localStorage && key === STORAGE_KEY) schedulePush(val);
  };

  function schedulePush(serialized) {
    pendingState = serialized;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(pushToSupabase, PUSH_DEBOUNCE_MS);
  }

  async function pushToSupabase() {
    if (!supabase || !pendingState) return;
    const payloadStr = pendingState;
    pendingState = null;
    try {
      const data = JSON.parse(payloadStr);
      data._sessionId = SESSION_ID;
      data._savedAt = new Date().toISOString();
      lastLocalPushAt = Date.now();
      setStatus('● saving…', '#92400e');
      const { error } = await supabase
        .from('dashboard_state')
        .update({ data: data, updated_at: data._savedAt })
        .eq('id', 1);
      if (error) {
        setStatus('⚠ save failed', '#991b1b');
        console.error('[stl-adapter] push failed:', error.message);
      } else {
        setStatus('✓ synced', '#166534');
      }
    } catch (e) {
      console.error('[stl-adapter] push exception:', e);
      setStatus('⚠ save error', '#991b1b');
    }
  }

  // ---- Apply remote data to local store ----
  function applyRemote(remoteData, opts) {
    opts = opts || {};
    if (!remoteData || typeof remoteData !== 'object') return false;
    // If the remote payload originated from our own session within the echo
    // guard window, ignore it — we already have this state locally.
    if (remoteData._sessionId === SESSION_ID && (Date.now() - lastLocalPushAt) < SELF_ECHO_GUARD_MS) {
      return false;
    }
    // Strip our internal metadata before handing to the dashboard.
    const clean = Object.assign({}, remoteData);
    delete clean._sessionId;
    delete clean._savedAt;
    const serialized = JSON.stringify(clean);
    // Avoid no-op re-application when local already matches remote.
    if (localStorage.getItem(STORAGE_KEY) === serialized) return false;
    // Write to localStorage WITHOUT triggering our own push (use origSetItem).
    origSetItem.call(localStorage, STORAGE_KEY, serialized);
    lastRemoteApplyAt = Date.now();
    // Ask the dashboard to re-read state and re-render whatever is active.
    try { if (typeof loadFullState === 'function') loadFullState(); } catch (e) { console.error('loadFullState err', e); }
    try { rerenderActive(); } catch (e) { console.error('rerender err', e); }
    setStatus('↻ updated', '#075985');
    setTimeout(() => setStatus('✓ synced', '#166534'), 800);
    return true;
  }

  function rerenderActive() {
    // Best-effort: trigger the render function matching the active view.
    const av = document.querySelector('.view.active');
    if (!av) return;
    const id = av.id || '';
    const map = {
      'view-dashboard':    'renderDashboard',
      'view-hisabkitab':   'renderHisabKitab',
      'view-charts':       'renderCharts',
      'view-labs':         'renderLabsCurrentTab',
      'view-expenses':     'renderExpenses',
      'view-payments':     'renderPayments',
      'view-manager':      'renderManager',
      'view-account':      'renderAccountView',
      'view-hr':           'renderHR',
      'view-demand':       'renderAdminDemand',
      'view-tasks':        'renderTasks',
      'view-mytasks':      'renderMyTasks',
      'view-admin':        'renderAdminPanel',
      'view-leaderboard':  'renderLeaderboard',
      'view-contacts':     'renderAdminContacts',
      'view-admtender':    'renderAdminTenderPanel',
      'view-mgrdispatch':  'renderMgrDispatch',
      'view-docschecklist':'renderDocsChecklist',
    };
    const fn = map[id];
    if (fn && typeof window[fn] === 'function') {
      try { window[fn](); } catch (e) { /* swallow */ }
    }
  }

  // ---- Initial sync: pull remote, reconcile with local ----
  async function initialSync() {
    setStatus('○ loading…', '#075985');
    const { data: row, error } = await supabase
      .from('dashboard_state')
      .select('data, updated_at')
      .eq('id', 1)
      .maybeSingle();
    if (error) {
      setStatus('⚠ offline', '#991b1b');
      console.error('[stl-adapter] initial fetch failed:', error.message);
      return;
    }
    const remoteData = row && row.data && typeof row.data === 'object' ? row.data : {};
    const remoteSize = JSON.stringify(remoteData).length;
    const localRaw = localStorage.getItem(STORAGE_KEY);
    const localData = localRaw ? safeParse(localRaw) : null;
    const localSize = localRaw ? localRaw.length : 0;

    // Decide direction:
    //   • Remote empty AND local has data  → push local up (first device).
    //   • Local empty AND remote has data  → pull remote down.
    //   • Both have data                   → newer wins (compare _savedAt vs row.updated_at).
    //   • Both empty                       → nothing to do.
    const remoteHasData = remoteSize > 50;        // bigger than "{}"
    const localHasData  = localSize > 50;

    if (!remoteHasData && localHasData) {
      // Push local → remote (first-mover wins the seeding)
      schedulePush(localRaw);
      // Don't await; just flush immediately
      pendingState = localRaw;
      await pushToSupabase();
    } else if (remoteHasData && !localHasData) {
      applyRemote(remoteData);
    } else if (remoteHasData && localHasData) {
      const remoteTs = new Date(remoteData._savedAt || row.updated_at || 0).getTime();
      const localTs  = localData && (localData._savedAt ? new Date(localData._savedAt).getTime() : 0);
      if (remoteTs > localTs) {
        applyRemote(remoteData);
      } else {
        // Local is newer — push up so other devices catch up
        schedulePush(localRaw);
      }
    } else {
      setStatus('✓ ready', '#166534');
    }
  }

  function safeParse(s) {
    try { return JSON.parse(s); } catch (e) { return null; }
  }

  // ---- Realtime subscription ----
  function subscribeRealtime() {
    if (realtimeChannel) return;
    realtimeChannel = supabase
      .channel('stl-dashboard-state')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'dashboard_state', filter: 'id=eq.1' },
        (payload) => {
          const newData = payload && payload.new && payload.new.data;
          if (!newData) return;
          applyRemote(newData);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED' && !bootDone) {
          bootDone = true;
          setStatus('✓ synced · live', '#166534');
        }
      });
  }

  // ---- Boot sequence ----
  async function boot() {
    buildStatusPill();
    try {
      await loadSupabaseSDK();
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
        realtime: { params: { eventsPerSecond: 5 } }
      });
      await initialSync();
      subscribeRealtime();
    } catch (e) {
      setStatus('⚠ offline (local-only)', '#991b1b');
      console.error('[stl-adapter] boot failed:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
