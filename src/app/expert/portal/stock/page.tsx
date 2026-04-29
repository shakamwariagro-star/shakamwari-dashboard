'use client';

import { useEffect, useState } from 'react';
import { getExpertById } from '@/lib/expertData';
import { MOCK_STOCK_ITEMS, IS_PREVIEW } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';
import { STOCK_CATEGORIES } from '@/lib/constants';
import StatusBadge from '@/components/common/StatusBadge';
import type { StockItem } from '@/lib/types';

export default function ExpertStockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [labId, setLabId] = useState<number>(0);
  const [expertName, setExpertName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'er'; text: string } | null>(null);
  const [form, setForm] = useState({ item_name: '', category: 'chemicals' as string, indent_demand: 1, remark: '' });
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('all');

  useEffect(() => {
    const storedId = localStorage.getItem('shakamwari_expert_id');
    if (!storedId) return;
    const expert = getExpertById(storedId);
    if (!expert) return;
    setLabId(expert.assigned_lab_id);
    setExpertName(expert.full_name);

    if (IS_PREVIEW) {
      setItems(MOCK_STOCK_ITEMS.filter(s => s.lab_id === expert.assigned_lab_id));
      return;
    }

    const supabase = createClient();
    supabase
      .from('stock_items')
      .select('*')
      .eq('lab_id', expert.assigned_lab_id)
      .order('updated_at', { ascending: false })
      .then(({ data }) => { if (data) setItems(data); });
  }, []);

  const handleSubmit = async () => {
    if (!form.item_name.trim()) {
      setMessage({ type: 'er', text: 'Please enter an item name' });
      return;
    }
    setSaving(true);

    const newItem: StockItem = {
      id: Date.now(),
      lab_id: labId,
      item_name: form.item_name.trim(),
      category: form.category as StockItem['category'],
      indent_demand: form.indent_demand,
      supply: 0,
      status: 'pending',
      remark: form.remark.trim() || null,
      requested_by: expertName,
      updated_at: new Date().toISOString(),
    };

    if (IS_PREVIEW) {
      setItems([newItem, ...items]);
      setShowForm(false);
      setForm({ item_name: '', category: 'chemicals', indent_demand: 1, remark: '' });
      setMessage({ type: 'ok', text: `Indent request for "${newItem.item_name}" submitted` });
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.from('stock_items').insert({
      lab_id: labId,
      item_name: newItem.item_name,
      category: newItem.category,
      indent_demand: newItem.indent_demand,
      supply: 0,
      status: 'pending',
      remark: newItem.remark,
      requested_by: expertName,
    }).select().single();

    if (data) setItems([data, ...items]);
    else if (error) setMessage({ type: 'er', text: error.message });

    setShowForm(false);
    setForm({ item_name: '', category: 'chemicals', indent_demand: 1, remark: '' });
    setMessage({ type: 'ok', text: `Indent request for "${newItem.item_name}" submitted` });
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if (IS_PREVIEW) {
      setItems(items.filter(i => i.id !== id));
      return;
    }
    const supabase = createClient();
    await supabase.from('stock_items').delete().eq('id', id);
    setItems(items.filter(i => i.id !== id));
  };

  const filteredItems = filterCat === 'all' ? items : items.filter(i => i.category === filterCat);
  const pendingCount = items.filter(i => i.status === 'pending').length;
  const doneCount = items.filter(i => i.status === 'done').length;

  const getCategoryLabel = (key: string) => STOCK_CATEGORIES.find(c => c.key === key)?.label || key;

  const inputStyle = {
    border: '1.5px solid var(--color-bd2)',
    borderRadius: '9px',
    padding: '9px 11px',
    fontSize: '13px',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 500,
    background: '#fff',
    color: 'var(--color-tx)',
    outline: 'none',
    width: '100%',
  } as const;

  const labelStyle = {
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--color-tx-d)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    fontFamily: "'Fira Mono', monospace",
    marginBottom: '4px',
    display: 'block',
  };

  return (
    <div className="space-y-5">
      {message && (
        <div
          className="px-4 py-2.5 rounded-xl text-xs font-bold"
          style={{
            background: message.type === 'ok' ? 'var(--color-ok-bg)' : 'var(--color-er-bg)',
            color: message.type === 'ok' ? 'var(--color-ok)' : 'var(--color-er)',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="sec-label" style={{ marginBottom: 0 }}>Stock & Indent</div>
          <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-f)' }}>
            Raise indent requests for chemicals, equipment, and consumables.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3.5 py-2 rounded-[9px] text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)', boxShadow: '0 2px 8px rgba(61,107,48,0.35)' }}
        >
          {showForm ? 'Cancel' : '+ Raise Indent'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="mcard">
          <div className="mcard-label">Total Items</div>
          <div className="mcard-value">{items.length}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Pending</div>
          <div className="mcard-value" style={{ color: pendingCount > 0 ? 'var(--color-wn)' : 'var(--color-ok)' }}>{pendingCount}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Supplied</div>
          <div className="mcard-value" style={{ color: 'var(--color-ok)' }}>{doneCount}</div>
        </div>
      </div>

      {/* Add indent form */}
      {showForm && (
        <div className="theme-card space-y-3">
          <div className="theme-card-title">New Indent Request</div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5">
            <div>
              <label style={labelStyle}>Item Name *</label>
              <input
                type="text"
                value={form.item_name}
                onChange={e => setForm({ ...form, item_name: e.target.value })}
                style={inputStyle}
                placeholder="e.g. pH Buffer Solution"
                autoFocus
              />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={inputStyle}
              >
                {STOCK_CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Quantity Needed</label>
              <input
                type="number"
                value={form.indent_demand}
                onChange={e => setForm({ ...form, indent_demand: Number(e.target.value) })}
                style={inputStyle}
                min={1}
              />
            </div>
            <div>
              <label style={labelStyle}>Remark</label>
              <input
                type="text"
                value={form.remark}
                onChange={e => setForm({ ...form, remark: e.target.value })}
                style={inputStyle}
                placeholder="Optional note"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2" style={{ borderTop: '1px solid var(--color-bd)' }}>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 rounded-[9px] text-xs font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)',
                boxShadow: '0 2px 8px rgba(61,107,48,0.35)',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Submitting...' : 'Submit Indent'}
            </button>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCat('all')}
          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
          style={{
            background: filterCat === 'all' ? 'var(--color-ok-bg)' : 'transparent',
            color: filterCat === 'all' ? 'var(--color-ok)' : 'var(--color-tx-d)',
            border: `1.5px solid ${filterCat === 'all' ? 'rgba(45,110,31,0.3)' : 'var(--color-bd)'}`,
          }}
        >
          All
        </button>
        {STOCK_CATEGORIES.map(cat => {
          const count = items.filter(i => i.category === cat.key).length;
          return (
            <button
              key={cat.key}
              onClick={() => setFilterCat(cat.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: filterCat === cat.key ? 'var(--color-ok-bg)' : count > 0 ? 'var(--color-g8)' : 'transparent',
                color: filterCat === cat.key ? 'var(--color-ok)' : count > 0 ? 'var(--color-g3)' : 'var(--color-tx-d)',
                border: `1.5px solid ${filterCat === cat.key ? 'rgba(45,110,31,0.3)' : count > 0 ? 'var(--color-bd2)' : 'var(--color-bd)'}`,
              }}
            >
              {cat.label} {count > 0 && <span className="ml-1 text-[9px] opacity-60">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Stock items table */}
      {filteredItems.length > 0 ? (
        <div className="theme-table-wrap">
          <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ background: 'var(--color-g8)' }}>
                {['Item', 'Category', 'Demand', 'Supplied', 'Status', 'Remark', ''].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left whitespace-nowrap" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}>
                  <td className="px-3 py-2.5 text-sm font-semibold" style={{ color: 'var(--color-tx)' }}>{item.item_name}</td>
                  <td className="px-3 py-2.5">
                    <span className="pill text-[9px]" style={{ background: 'var(--color-g8)', color: 'var(--color-tx-d)' }}>
                      {getCategoryLabel(item.category)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 mn font-bold text-sm" style={{ color: 'var(--color-tx)' }}>{item.indent_demand}</td>
                  <td className="px-3 py-2.5 mn font-bold text-sm" style={{ color: item.supply > 0 ? 'var(--color-ok)' : 'var(--color-tx-f)' }}>
                    {item.supply > 0 ? item.supply : '-'}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-3 py-2.5 text-[11px]" style={{ color: 'var(--color-tx-f)', maxWidth: '180px' }}>
                    {item.remark || '-'}
                  </td>
                  <td className="px-3 py-2.5">
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-[10px] font-bold px-2 py-1 rounded-lg"
                        style={{ color: 'var(--color-er)', background: 'var(--color-er-bg)' }}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="theme-card text-center py-8">
          <p className="text-3xl mb-2">📦</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-tx-d)' }}>No stock items yet</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--color-tx-f)' }}>
            Raise an indent request to get supplies for your lab
          </p>
        </div>
      )}
    </div>
  );
}
