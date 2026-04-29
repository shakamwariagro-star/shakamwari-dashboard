'use client';

import { useEffect, useState } from 'react';
import { getCoordinatorById, getLabsForCoordinator } from '@/lib/coordinatorData';
import { MOCK_STOCK_ITEMS, IS_PREVIEW } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';
import { STOCK_CATEGORIES } from '@/lib/constants';
import StatusBadge from '@/components/common/StatusBadge';
import type { Lab, StockItem } from '@/lib/types';

export default function CoordinatorStockPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [items, setItems] = useState<StockItem[]>([]);
  const [selectedLab, setSelectedLab] = useState<number | null>(null);
  const [supplyEdit, setSupplyEdit] = useState<{ id: number; value: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'er'; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ item_name: '', category: 'chemicals' as string, indent_demand: 1, remark: '', lab_id: 0 });
  const [coordName, setCoordName] = useState('');

  useEffect(() => {
    const storedId = localStorage.getItem('shakamwari_coordinator_id');
    if (!storedId) return;
    const coord = getCoordinatorById(storedId);
    if (!coord) return;
    setCoordName(coord.full_name);
    const coordLabs = getLabsForCoordinator(coord.full_name);
    setLabs(coordLabs);

    const labIds = coordLabs.map(l => l.id);
    if (IS_PREVIEW) {
      setItems(MOCK_STOCK_ITEMS.filter(s => labIds.includes(s.lab_id)));
      return;
    }

    const supabase = createClient();
    supabase
      .from('stock_items')
      .select('*')
      .in('lab_id', labIds)
      .order('updated_at', { ascending: false })
      .then(({ data }) => { if (data) setItems(data); });
  }, []);

  const handleSupply = async (itemId: number) => {
    if (!supplyEdit || supplyEdit.id !== itemId) return;
    setSaving(true);

    const supplyVal = supplyEdit.value;
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const updateData = {
      supply: supplyVal,
      status: 'done' as const,
      updated_at: new Date().toISOString(),
    };

    if (IS_PREVIEW) {
      setItems(items.map(i => i.id === itemId ? { ...i, ...updateData } : i));
      setSupplyEdit(null);
      setSaving(false);
      setMessage({ type: 'ok', text: `Supply recorded for "${item.item_name}"` });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from('stock_items').update(updateData).eq('id', itemId);
    if (!error) {
      setItems(items.map(i => i.id === itemId ? { ...i, ...updateData } : i));
      setMessage({ type: 'ok', text: `Supply recorded for "${item.item_name}"` });
    } else {
      setMessage({ type: 'er', text: error.message });
    }
    setSupplyEdit(null);
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddItem = async () => {
    if (!form.item_name.trim() || !form.lab_id) {
      setMessage({ type: 'er', text: 'Please enter item name and select a lab' });
      return;
    }
    setSaving(true);

    const newItem: StockItem = {
      id: Date.now(),
      lab_id: form.lab_id,
      item_name: form.item_name.trim(),
      category: form.category as StockItem['category'],
      indent_demand: form.indent_demand,
      supply: 0,
      status: 'pending',
      remark: form.remark.trim() || null,
      requested_by: coordName,
      updated_at: new Date().toISOString(),
    };

    if (IS_PREVIEW) {
      setItems([newItem, ...items]);
      setShowForm(false);
      setForm({ item_name: '', category: 'chemicals', indent_demand: 1, remark: '', lab_id: labs[0]?.id || 0 });
      setMessage({ type: 'ok', text: `Stock item "${newItem.item_name}" added` });
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.from('stock_items').insert({
      lab_id: newItem.lab_id,
      item_name: newItem.item_name,
      category: newItem.category,
      indent_demand: newItem.indent_demand,
      supply: 0,
      status: 'pending',
      remark: newItem.remark,
      requested_by: coordName,
    }).select().single();

    if (data) setItems([data, ...items]);
    else if (error) setMessage({ type: 'er', text: error.message });

    setShowForm(false);
    setForm({ item_name: '', category: 'chemicals', indent_demand: 1, remark: '', lab_id: labs[0]?.id || 0 });
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredItems = selectedLab ? items.filter(i => i.lab_id === selectedLab) : items;
  const pendingItems = items.filter(i => i.status === 'pending');
  const doneItems = items.filter(i => i.status === 'done');
  const labsWithPending = new Set(pendingItems.map(i => i.lab_id)).size;

  const getLabInfo = (labId: number) => labs.find(l => l.id === labId);
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
        <div className="sec-label" style={{ marginBottom: 0 }}>Stock & Indent Management</div>
        <button
          onClick={() => { setShowForm(!showForm); if (!form.lab_id && labs.length) setForm({ ...form, lab_id: labs[0].id }); }}
          className="px-3.5 py-2 rounded-[9px] text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)', boxShadow: '0 2px 8px rgba(61,107,48,0.35)' }}
        >
          {showForm ? 'Cancel' : '+ Add Stock Item'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5">
        <div className="mcard">
          <div className="mcard-label">Total Items</div>
          <div className="mcard-value">{items.length}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Pending Requests</div>
          <div className="mcard-value" style={{ color: pendingItems.length > 0 ? 'var(--color-wn)' : 'var(--color-ok)' }}>{pendingItems.length}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Supplied</div>
          <div className="mcard-value" style={{ color: 'var(--color-ok)' }}>{doneItems.length}</div>
        </div>
        <div className="mcard">
          <div className="mcard-label">Labs with Pending</div>
          <div className="mcard-value" style={{ color: labsWithPending > 0 ? 'var(--color-er)' : 'var(--color-ok)' }}>{labsWithPending}</div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="theme-card space-y-3">
          <div className="theme-card-title">Add Stock Item</div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5">
            <div>
              <label style={labelStyle}>Lab *</label>
              <select value={form.lab_id} onChange={e => setForm({ ...form, lab_id: Number(e.target.value) })} style={inputStyle}>
                {labs.map(l => <option key={l.id} value={l.id}>{l.lab_code} — {l.block}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Item Name *</label>
              <input type="text" value={form.item_name} onChange={e => setForm({ ...form, item_name: e.target.value })} style={inputStyle} placeholder="e.g. pH Buffer" autoFocus />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                {STOCK_CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Quantity</label>
              <input type="number" value={form.indent_demand} onChange={e => setForm({ ...form, indent_demand: Number(e.target.value) })} style={inputStyle} min={1} />
            </div>
            <div>
              <label style={labelStyle}>Remark</label>
              <input type="text" value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} style={inputStyle} placeholder="Optional" />
            </div>
          </div>
          <div className="flex justify-end pt-2" style={{ borderTop: '1px solid var(--color-bd)' }}>
            <button onClick={handleAddItem} disabled={saving} className="px-4 py-2 rounded-[9px] text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </div>
      )}

      {/* Lab filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedLab(null)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{
            background: !selectedLab ? 'var(--color-ok-bg)' : 'transparent',
            color: !selectedLab ? 'var(--color-ok)' : 'var(--color-tx-d)',
            border: `1.5px solid ${!selectedLab ? 'rgba(45,110,31,0.3)' : 'var(--color-bd)'}`,
          }}
        >
          All Labs
        </button>
        {labs.map(lab => {
          const labPending = items.filter(i => i.lab_id === lab.id && i.status === 'pending').length;
          return (
            <button
              key={lab.id}
              onClick={() => setSelectedLab(lab.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{
                background: selectedLab === lab.id ? 'var(--color-ok-bg)' : 'transparent',
                color: selectedLab === lab.id ? 'var(--color-ok)' : 'var(--color-tx-d)',
                border: `1.5px solid ${selectedLab === lab.id ? 'rgba(45,110,31,0.3)' : 'var(--color-bd)'}`,
              }}
            >
              {lab.lab_code}
              {labPending > 0 && <span className="ml-1 text-[9px] font-bold px-1 rounded" style={{ background: 'rgba(180,80,20,0.15)', color: 'var(--color-wn)' }}>{labPending}</span>}
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
                {['Lab', 'Item', 'Category', 'Demand', 'Supplied', 'Status', 'Requested By', 'Remark', 'Action'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left whitespace-nowrap" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const lab = getLabInfo(item.lab_id);
                const isEditingSupply = supplyEdit?.id === item.id;
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}>
                    <td className="px-3 py-2.5">
                      <span className="text-xs font-bold" style={{ color: 'var(--color-g3)' }}>{lab?.lab_code}</span>
                      <span className="text-[9px] ml-1" style={{ color: 'var(--color-tx-f)' }}>{lab?.block}</span>
                    </td>
                    <td className="px-3 py-2.5 text-sm font-semibold" style={{ color: 'var(--color-tx)' }}>{item.item_name}</td>
                    <td className="px-3 py-2.5">
                      <span className="pill text-[9px]" style={{ background: 'var(--color-g8)', color: 'var(--color-tx-d)' }}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 mn font-bold">{item.indent_demand}</td>
                    <td className="px-3 py-2.5">
                      {isEditingSupply ? (
                        <input
                          type="number"
                          value={supplyEdit.value}
                          onChange={e => setSupplyEdit({ ...supplyEdit, value: Number(e.target.value) })}
                          className="w-16 text-sm mn font-bold rounded-lg px-2 py-1"
                          style={{ border: '1.5px solid var(--color-bd2)', outline: 'none', background: '#fff' }}
                          min={0}
                          max={item.indent_demand}
                          autoFocus
                          onKeyDown={e => { if (e.key === 'Enter') handleSupply(item.id); if (e.key === 'Escape') setSupplyEdit(null); }}
                        />
                      ) : (
                        <span className="mn font-bold" style={{ color: item.supply > 0 ? 'var(--color-ok)' : 'var(--color-tx-f)' }}>
                          {item.supply > 0 ? item.supply : '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5"><StatusBadge status={item.status} /></td>
                    <td className="px-3 py-2.5 text-[11px]" style={{ color: 'var(--color-tx-f)' }}>{item.requested_by || '-'}</td>
                    <td className="px-3 py-2.5 text-[11px]" style={{ color: 'var(--color-tx-f)', maxWidth: '150px' }}>{item.remark || '-'}</td>
                    <td className="px-3 py-2.5">
                      {item.status === 'pending' && !isEditingSupply && (
                        <button
                          onClick={() => setSupplyEdit({ id: item.id, value: item.indent_demand })}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #3d6b30, #4e8a3e)' }}
                        >
                          Supply
                        </button>
                      )}
                      {isEditingSupply && (
                        <div className="flex gap-1">
                          <button onClick={() => handleSupply(item.id)} disabled={saving} className="px-2 py-1 rounded-lg text-[10px] font-bold text-white" style={{ background: '#3d6b30' }}>
                            {saving ? '...' : 'Save'}
                          </button>
                          <button onClick={() => setSupplyEdit(null)} className="px-2 py-1 rounded-lg text-[10px] font-bold" style={{ border: '1px solid var(--color-bd2)', color: 'var(--color-tx-d)' }}>
                            X
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="theme-card text-center py-8">
          <p className="text-3xl mb-2">📦</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-tx-d)' }}>
            {selectedLab ? 'No stock items for this lab' : 'No stock items yet'}
          </p>
        </div>
      )}
    </div>
  );
}
