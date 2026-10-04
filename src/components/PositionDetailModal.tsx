import React, { useState } from 'react';
import { Area, Line, Position, MonitoringRecord } from '../types';
import { formatIndonesianDate } from '../context/MonitoringContext';
import {
  X,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Layers,
  Maximize2,
  Lock,
  ClipboardList,
} from 'lucide-react';

interface PositionDetailModalProps {
  position: Position;
  area: Area;
  line?: Line;
  record: MonitoringRecord;
  onClose: () => void;
}

export const PositionDetailModal: React.FC<PositionDetailModalProps> = ({
  position,
  area,
  line,
  record,
  onClose,
}) => {
  const [activePhotoZoom, setActivePhotoZoom] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 flex flex-col">
        {/* Header */}
        <div className="bg-[#123C6E] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-white/10 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFB800]/20 text-[#FFB800] flex items-center justify-center border border-[#FFB800]/40">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-type-caption font-mono text-[#FFB800] font-bold uppercase tracking-wider">
                AUDIT SELESAI · TERKUNCI (PT HEINZ ABC INDONESIA)
              </div>
              <h2 className="text-type-h3 font-bold text-white">
                {position.code} — {position.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Locked Notice */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-800">
                  Indikator ini sudah dikontrol pada hari ini.
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Pemeriksaan terkunci untuk tanggal {formatIndonesianDate(record.date)}.
                </div>
              </div>
            </div>
            <div className="shrink-0 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl text-xs font-mono font-extrabold text-emerald-800">
              +{position.std_score || record.std_score || 0} Poin
            </div>
          </div>

          {/* Apa yang Harus Dikontrol Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E32128] flex items-center gap-1.5 font-mono">
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Standar yang Dikontrol:</span>
              </span>
              {position.step && (
                <span className="text-[10px] font-extrabold font-mono bg-blue-100 text-[#123C6E] px-2 py-0.5 rounded">
                  {position.step}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {position.explanation || record.explanation}
            </p>
          </div>

          {/* Key Inspection Metadata Grid (Nama Operator, Jam, Shift) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                Nama Operator
              </span>
              <strong className="text-slate-900 font-bold text-sm block truncate mt-0.5">
                {record.operator_name}
              </strong>
              <span className="text-[11px] font-mono text-slate-500">
                NIP: {record.operator_nip}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                Jam Kontrol
              </span>
              <strong className="text-slate-900 font-bold text-sm font-mono block mt-0.5">
                {record.time} WIB
              </strong>
              <span className="text-[11px] text-slate-500 font-mono">
                {record.date}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                Shift Kerja
              </span>
              <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                {record.shift}
              </strong>
              <span className="text-[11px] text-emerald-600 font-semibold">
                ✓ Terverifikasi
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                Area & Line
              </span>
              <strong className="text-slate-900 font-bold text-sm block truncate mt-0.5">
                {area.name}
              </strong>
              <span className="text-[11px] text-slate-500 truncate block">
                {line ? line.name : 'Stasiun Utama'}
              </span>
            </div>
          </div>

          {/* Documentation Photos (Before & After Preview) */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              DOKUMENTASI FOTO (BEFORE & AFTER)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before Photo */}
              <div className="bg-slate-100 rounded-2xl p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Kondisi BEFORE
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Awal</span>
                </div>
                <div
                  onClick={() => setActivePhotoZoom(record.before_photo)}
                  className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-200 cursor-pointer group shadow-2xs"
                >
                  <img
                    src={record.before_photo}
                    alt="Before 5S Condition"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-6 h-6 drop-shadow-md" />
                  </div>
                </div>
              </div>

              {/* After Photo */}
              <div className="bg-slate-100 rounded-2xl p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Kondisi AFTER
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-semibold">Tindakan</span>
                </div>
                <div
                  onClick={() => setActivePhotoZoom(record.after_photo)}
                  className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-200 cursor-pointer group shadow-2xs"
                >
                  <img
                    src={record.after_photo}
                    alt="After 5S Condition"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-6 h-6 drop-shadow-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes if present */}
          {record.notes && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px] mb-1">
                Catatan Temuan / Tindakan Perbaikan:
              </span>
              <p className="text-slate-600 leading-relaxed italic">
                "{record.notes}"
              </p>
            </div>
          )}

          {/* Close Action */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Tutup Ringkasan
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Zoom */}
      {activePhotoZoom && (
        <div
          onClick={() => setActivePhotoZoom(null)}
          className="fixed inset-0 z-70 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={activePhotoZoom}
              alt="Zoomed 5S Audit documentation"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <p className="text-xs text-white/70 mt-3 font-mono">
              Klik di mana saja untuk menutup tampilan penuh
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
