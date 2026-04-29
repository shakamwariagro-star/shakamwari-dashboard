'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getExpertById } from '@/lib/expertData';
import { IS_PREVIEW } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';
import { REGISTER_TYPES, MONTHS } from '@/lib/constants';
import StatusBadge from '@/components/common/StatusBadge';
import type { Register, UploadedDocument } from '@/lib/types';

// Helper: get current fiscal month name
function getCurrentMonthName(): string {
  const now = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return monthNames[now.getMonth()];
}

export default function ExpertRegistersPage() {
  const [registers, setRegisters] = useState<Register[]>([]);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [labId, setLabId] = useState<number>(0);
  const [expertId, setExpertId] = useState<string>('');
  const [uploadingCell, setUploadingCell] = useState<{ type: string; month: string } | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'er'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('shakamwari_expert_id');
    if (!storedId) return;
    const expert = getExpertById(storedId);
    if (!expert) return;
    setLabId(expert.assigned_lab_id);
    setExpertId(expert.id);

    if (IS_PREVIEW) {
      setRegisters([]);
      setDocuments([]);
      return;
    }

    const supabase = createClient();
    supabase
      .from('registers')
      .select('*')
      .eq('lab_id', expert.assigned_lab_id)
      .order('month')
      .then(({ data }) => { if (data) setRegisters(data); });

    supabase
      .from('uploaded_documents')
      .select('*')
      .eq('lab_id', expert.assigned_lab_id)
      .eq('doc_type', 'register_scan')
      .order('uploaded_at', { ascending: false })
      .then(({ data }) => { if (data) setDocuments(data); });
  }, []);

  // Get register status for a cell
  const getStatus = (type: string, month: string) =>
    registers.find((r) => r.register_type === type && r.month.toLowerCase() === month.toLowerCase())?.status || 'pending';

  // Check if a document exists for a cell
  const getDocument = (type: string, month: string) =>
    documents.find((d) => d.register_type === type && d.month?.toLowerCase() === month.toLowerCase());

  // Trigger file upload for a specific cell
  const triggerUpload = (type: string, month: string) => {
    setUploadingCell({ type, month });
    // Small delay to ensure state is set before triggering click
    setTimeout(() => fileInputRef.current?.click(), 50);
  };

  // Handle file selection
  const handleFileSelected = useCallback(async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !uploadingCell) return;

    const { type, month } = uploadingCell;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'er', text: 'Only PDF, JPG, and PNG files are allowed' });
      setUploadingCell(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'er', text: 'File size must be under 10MB' });
      setUploadingCell(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (IS_PREVIEW) {
      // Mock upload — add document to state
      const newDoc: UploadedDocument = {
        id: Date.now(),
        lab_id: labId,
        uploaded_by: expertId,
        doc_type: 'register_scan',
        register_type: type,
        month: month,
        file_name: file.name,
        file_url: URL.createObjectURL(file),
        file_size: file.size,
        uploaded_at: new Date().toISOString(),
      };
      setDocuments((prev) => [newDoc, ...prev]);

      // Update register status to 'done'
      const existing = registers.find((r) => r.register_type === type && r.month.toLowerCase() === month.toLowerCase());
      if (existing) {
        setRegisters((prev) => prev.map((r) => (r.id === existing.id ? { ...r, status: 'done' as const, file_url: newDoc.file_url } : r)));
      } else {
        setRegisters((prev) => [...prev, {
          id: Date.now() + 1,
          lab_id: labId,
          register_type: type,
          month: month.toLowerCase(),
          year: 2026,
          status: 'done' as const,
          file_url: newDoc.file_url,
          updated_at: new Date().toISOString(),
        }]);
      }

      const regLabel = REGISTER_TYPES.find((r) => r.key === type)?.label || type;
      setMessage({ type: 'ok', text: `${file.name} uploaded for ${regLabel} — ${month} (preview)` });
      setUploadingCell(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Real Supabase upload
    const supabase = createClient();
    const filePath = `lab-${labId}/register_scan/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);

    if (uploadError) {
      setMessage({ type: 'er', text: 'Upload failed: ' + uploadError.message });
      setUploadingCell(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath);

    // Insert document record
    const { data: docData, error: docError } = await supabase.from('uploaded_documents').insert({
      lab_id: labId,
      uploaded_by: expertId,
      doc_type: 'register_scan',
      register_type: type,
      month: month,
      file_name: file.name,
      file_url: urlData.publicUrl,
      file_size: file.size,
    }).select().single();

    if (docData) {
      setDocuments((prev) => [docData, ...prev]);
    } else if (docError) {
      setMessage({ type: 'er', text: docError.message });
    }

    // Update register status to 'done'
    const existing = registers.find((r) => r.register_type === type && r.month.toLowerCase() === month.toLowerCase());
    if (existing) {
      await supabase.from('registers').update({ status: 'done', file_url: urlData.publicUrl }).eq('id', existing.id);
      setRegisters((prev) => prev.map((r) => (r.id === existing.id ? { ...r, status: 'done' as const, file_url: urlData.publicUrl } : r)));
    } else {
      const { data: regData } = await supabase.from('registers').insert({
        lab_id: labId,
        register_type: type,
        month: month.toLowerCase(),
        year: 2026,
        status: 'done',
        file_url: urlData.publicUrl,
      }).select().single();
      if (regData) setRegisters((prev) => [...prev, regData]);
    }

    const regLabel = REGISTER_TYPES.find((r) => r.key === type)?.label || type;
    setMessage({ type: 'ok', text: `${file.name} uploaded for ${regLabel} — ${month}` });
    setUploadingCell(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setMessage(null), 3000);
  }, [uploadingCell, labId, expertId, registers]);

  // Toggle status for cells that already have uploads (Done → Approved → Done)
  const toggleApproval = async (type: string, month: string) => {
    const existing = registers.find((r) => r.register_type === type && r.month.toLowerCase() === month.toLowerCase());
    if (!existing || existing.status === 'pending') return;

    const nextStatus = existing.status === 'done' ? 'approved' : 'done';

    if (IS_PREVIEW) {
      setRegisters((prev) => prev.map((r) => (r.id === existing.id ? { ...r, status: nextStatus as any } : r)));
      setMessage({ type: 'ok', text: `Status updated to ${nextStatus}` });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from('registers').update({ status: nextStatus }).eq('id', existing.id);
    if (!error) {
      setRegisters((prev) => prev.map((r) => (r.id === existing.id ? { ...r, status: nextStatus as any } : r)));
    }
  };

  // Month-end reminder logic
  const now = new Date();
  const currentMonthName = getCurrentMonthName();
  const dayOfMonth = now.getDate();
  const isMonthEnd = dayOfMonth >= 25;
  const pendingCount = isMonthEnd
    ? REGISTER_TYPES.filter((reg) => getStatus(reg.key, currentMonthName) === 'pending').length
    : 0;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />

      {/* Month-end reminder banner */}
      {isMonthEnd && pendingCount > 0 && (
        <div
          className="px-4 py-3 rounded-xl flex items-start gap-2.5"
          style={{
            background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
            border: '1.5px solid #ffb74d',
          }}
        >
          <span className="text-lg flex-shrink-0">⚠️</span>
          <div>
            <p className="text-xs font-bold" style={{ color: '#e65100' }}>
              {pendingCount} register{pendingCount > 1 ? 's' : ''} still pending for {currentMonthName}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: '#bf360c' }}>
              Please upload register images/PDFs before month-end to avoid delays.
            </p>
          </div>
        </div>
      )}

      {/* Success/Error message */}
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

      <div className="sec-label">Register Status</div>
      <p className="text-[11px] -mt-3 mb-2" style={{ color: 'var(--color-tx-f)' }}>
        Click <span style={{ fontSize: '13px' }}>📤</span> to upload register image/PDF. Status updates to <strong>Done</strong> after upload. Click <strong>Done</strong> badge to mark as <strong>Approved</strong>.
      </p>

      {/* Register × Month table */}
      <div className="theme-table-wrap">
        <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: 'var(--color-g8)' }}>
              <th
                className="px-4 py-2.5 text-left"
                style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)', minWidth: '180px' }}
              >
                Register
              </th>
              {MONTHS.map((m) => (
                <th key={m} className="px-2 py-2.5 text-center" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>
                  {m.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REGISTER_TYPES.map((reg) => (
              <tr key={reg.key} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}>
                <td className="px-4 py-2.5 text-sm whitespace-nowrap" style={{ color: 'var(--color-tx)' }}>{reg.label}</td>
                {MONTHS.map((month) => {
                  const status = getStatus(reg.key, month);
                  const doc = getDocument(reg.key, month);
                  const isUploading = uploadingCell?.type === reg.key && uploadingCell?.month === month;

                  return (
                    <td key={month} className="px-1.5 py-2 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {/* Status badge */}
                        {status !== 'pending' ? (
                          <button
                            onClick={() => toggleApproval(reg.key, month)}
                            className="inline-block cursor-pointer"
                            title={status === 'done' ? 'Click to mark Approved' : 'Click to revert to Done'}
                          >
                            <StatusBadge status={status} />
                          </button>
                        ) : (
                          <StatusBadge status="pending" />
                        )}

                        {/* Upload / file indicator */}
                        {status === 'pending' ? (
                          <button
                            onClick={() => triggerUpload(reg.key, month)}
                            disabled={isUploading}
                            className="text-sm transition-transform hover:scale-110"
                            title="Upload register scan"
                            style={{ opacity: isUploading ? 0.4 : 0.7, lineHeight: 1 }}
                          >
                            {isUploading ? (
                              <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-g4)' }} />
                            ) : (
                              '📤'
                            )}
                          </button>
                        ) : doc ? (
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm transition-transform hover:scale-110"
                            title={`View: ${doc.file_name}`}
                            style={{ opacity: 0.7, lineHeight: 1 }}
                          >
                            📄
                          </a>
                        ) : null}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recently uploaded documents */}
      {documents.length > 0 && (
        <>
          <div className="sec-label">Uploaded Documents</div>
          <div className="theme-table-wrap">
            <table className="min-w-full" style={{ borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ background: 'var(--color-g8)' }}>
                  {['File Name', 'Register', 'Month', 'Size', 'Uploaded'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left whitespace-nowrap" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-tx-d)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Fira Mono', monospace", borderBottom: '1.5px solid var(--color-bd2)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid rgba(61,107,48,0.06)' }}>
                    <td className="px-3 py-2.5">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold hover:underline"
                        style={{ color: 'var(--color-g3)' }}
                      >
                        {doc.file_name}
                      </a>
                    </td>
                    <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx-d)' }}>
                      {doc.register_type ? REGISTER_TYPES.find((r) => r.key === doc.register_type)?.label || doc.register_type : '-'}
                    </td>
                    <td className="px-3 py-2.5 text-sm" style={{ color: 'var(--color-tx-d)' }}>{doc.month || '-'}</td>
                    <td className="px-3 py-2.5 mn" style={{ color: 'var(--color-tx-d)' }}>{formatSize(doc.file_size)}</td>
                    <td className="px-3 py-2.5 mn" style={{ color: 'var(--color-tx-f)' }}>
                      {new Date(doc.uploaded_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
