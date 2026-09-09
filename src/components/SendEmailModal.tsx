import React, { useState } from 'react';
import { Mail, Send, X, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: string, notes: string) => void;
  defaultRecipient: string;
}

export const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  onSend,
  defaultRecipient
}) => {
  const [email, setEmail] = useState(defaultRecipient);
  const [notes, setNotes] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Masukkan alamat email tujuan yang valid.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onSend(email, notes);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#0e1320] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0B2545] via-[#132C56] to-[#B4001F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-900 font-extrabold flex items-center justify-center font-serif text-sm shadow">
              AJI
            </div>
            <div>
              <p className="text-[9px] tracking-wider text-[#C9A15A] uppercase font-bold">PT AJINOMOTO INDONESIA - PT AJINEX INTERNATIONAL, MOJOKERTO FACTORY</p>
              <h4 className="text-base font-bold tracking-tight">Kirim Laporan via Email</h4>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-slate-300">
            <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Dokumen <b>Executive Budget Report (PDF)</b> beserta rincian KPI pengeluaran akan otomatis dilampirkan dan dikirim ke email tujuan.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Alamat Email Penerima</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@ajinomoto.co.id"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Catatan Tambahan untuk Manajemen (Opsional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Contoh: Mohon review realisasi anggaran pelatihan Q1 yang telah mencapai batas warning..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-red-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Mengirim...' : 'Kirim Sekarang'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
