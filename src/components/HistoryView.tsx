import React, { useState, useMemo } from 'react';
import { useMonitoring, formatIndonesianDate } from '../context/MonitoringContext';
import { MonitoringRecord } from '../types';
import {
  Calendar,
  Filter,
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Layers,
  User,
  X,
  Maximize2,
  FileSpreadsheet,
  ClipboardList,
  Award,
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { records, areas, lines } = useMonitoring();

  // Filters
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterLine, setFilterLine] = useState<string>('all');
  const [filterShift, setFilterShift] = useState<string>('all');
  const [searchOperator, setSearchOperator] = useState<string>('');

  // Selected Record for Modal inspection
  const [selectedRecord, setSelectedRecord] = useState<MonitoringRecord | null>(null);
  const [zoomPhoto, setZoomPhoto] = useState<string | null>(null);

  // Available lines based on selected area
  const availableLines = useMemo(() => {
    if (filterArea === 'all') return lines;
    return lines.filter((l) => l.area_id === filterArea);
  }, [filterArea, lines]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      if (filterDate && rec.date !== filterDate) return false;
      if (filterArea !== 'all' && rec.area_id !== filterArea) return false;
      if (filterLine !== 'all' && rec.line_id !== filterLine) return false;
      if (filterShift !== 'all' && rec.shift !== filterShift) return false;
      if (searchOperator.trim()) {
        const query = searchOperator.toLowerCase();
        const matchName = rec.operator_name.toLowerCase().includes(query);
        const matchNip = rec.operator_nip.toLowerCase().includes(query);
        const matchPos = rec.position_name.toLowerCase().includes(query);
        const matchCode = rec.position_code.toLowerCase().includes(query);
        if (!matchName && !matchNip && !matchPos && !matchCode) return false;
      }
      return true;
    });
  }, [records, filterDate, filterArea, filterLine, filterShift, searchOperator]);

  // Total points for current filtered view
  const totalEarnedPoints = useMemo(() => {
    return filteredRecords.reduce((acc, r) => acc + (r.std_score || 0), 0);
  }, [filteredRecords]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert('Tidak ada data yang sesuai filter untuk diekspor.');
      return;
    }

    const headers = [
      'ID Monitoring',
      'Tanggal',
      'Jam',
      'Shift',
      'Area',
      'Line',
      'Kode Indikator',
      'Nama Indikator',
      'Pilar 5S',
      'Poin Diperoleh',
      'Standar Kontrol',
      'Nama Operator',
      'NIP Operator',
      'Catatan',
      'Waktu Dibuat',
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${r.date}"`,
      `"${r.time}"`,
      `"${r.shift}"`,
      `"${r.area_name}"`,
      `"${r.line_name || '-'}"`,
      `"${r.position_code}"`,
      `"${r.position_name}"`,
      `"${r.step || '-'}"`,
      `"${r.std_score || 0}"`,
      `"${(r.explanation || '').replace(/"/g, '""')}"`,
      `"${r.operator_name}"`,
      `"${r.operator_nip}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${r.created_at}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `5S_Monitoring_PT_Heinz_ABC_Indonesia_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setFilterDate('');
    setFilterArea('all');
    setFilterLine('all');
    setFilterShift('all');
    setSearchOperator('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-type-h1 text-slate-900">
            RIWAYAT / HISTORY MONITORING 5S
          </h1>
          <p className="text-type-caption text-slate-500 mt-1">
            Log audit inspeksi harian dan bukti visual Before & After PT Heinz ABC Indonesia
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="self-start sm:self-auto min-h-[44px] px-4 py-2 bg-[#123C6E] hover:bg-[#0e2f57] text-white rounded-xl text-type-body-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#FFB800]" />
          <span>Export Laporan (.CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar (Tanggal, Area, Line, Shift, Operator) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#123C6E]" />
            <span>Filter Data Audit 5S</span>
          </div>
          {(filterDate ||
            filterArea !== 'all' ||
            filterLine !== 'all' ||
            filterShift !== 'all' ||
            searchOperator) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#E32128] hover:underline font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Tanggal */}
          <div>
            <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
              Tanggal
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#123C6E] font-mono"
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
              Area
            </label>
            <select
              value={filterArea}
              onChange={(e) => {
                setFilterArea(e.target.value);
                setFilterLine('all');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#123C6E] font-mono"
            >
              <option value="all">Semua Area</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Line */}
          <div>
            <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
              Line
            </label>
            <select
              value={filterLine}
              disabled={filterArea === 'depallitizer'}
              onChange={(e) => setFilterLine(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#123C6E] font-mono disabled:opacity-50"
            >
              <option value="all">Semua Line</option>
              {availableLines.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shift */}
          <div>
            <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
              Shift
            </label>
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#123C6E] font-mono"
            >
              <option value="all">Semua Shift</option>
              <option value="SHIFT 1">Shift 1</option>
              <option value="SHIFT 2">Shift 2</option>
              <option value="SHIFT 3">Shift 3</option>
            </select>
          </div>

          {/* Operator Search */}
          <div>
            <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
              Operator / Indikator
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama, NIP..."
                value={searchOperator}
                onChange={(e) => setSearchOperator(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-7 pr-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#123C6E]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Record Counter & Total Points Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          Menampilkan <strong>{filteredRecords.length}</strong> record hasil audit indikator 5S
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#FFB800]" />
          <span className="text-slate-500">Total Akumulasi Poin:</span>
          <span className="font-extrabold text-sm text-[#123C6E] bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
            <span className="text-[#E32128]">+{totalEarnedPoints}</span> Poin
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#123C6E] text-white uppercase font-mono tracking-wider border-b border-[#0e2e54] text-type-caption">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Tanggal</th>
                <th className="py-3.5 px-3 font-semibold">Jam</th>
                <th className="py-3.5 px-3 font-semibold">Shift</th>
                <th className="py-3.5 px-4 font-semibold">Area</th>
                <th className="py-3.5 px-3 font-semibold">Line</th>
                <th className="py-3.5 px-4 font-semibold">Indikator 5S & Kontrol</th>
                <th className="py-3.5 px-3 font-semibold text-center">Poin</th>
                <th className="py-3.5 px-4 font-semibold">Operator</th>
                <th className="py-3.5 px-3 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800 whitespace-nowrap">
                    {r.date}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                    {r.time}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[#123C6E] whitespace-nowrap">
                    {r.shift}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {r.area_name}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                    {r.line_name || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold max-w-[220px]">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono text-slate-500 font-bold bg-slate-100 px-1.5 py-0.2 rounded">
                        {r.position_code}
                      </span>
                      {r.step && (
                        <span className="font-mono text-[10px] text-[#E32128] font-extrabold">
                          {r.step}
                        </span>
                      )}
                    </div>
                    <div className="truncate text-slate-800">{r.position_name}</div>
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap font-mono font-bold text-[#123C6E]">
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                      +{r.std_score || 0}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 truncate max-w-[140px]">
                    <div className="font-medium">{r.operator_name}</div>
                    <div className="text-[10px] font-mono text-slate-400">NIP {r.operator_nip}</div>
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ SUDAH DIKONTROL
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedRecord(r)}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#123C6E] rounded-lg font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka Foto</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View */}
      <div className="lg:hidden space-y-3">
        {filteredRecords.map((r) => (
          <div
            key={r.id}
            onClick={() => setSelectedRecord(r)}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-[#123C6E] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono font-bold text-[#123C6E]">
                {r.area_name} {r.line_name ? `· ${r.line_name}` : ''}
              </span>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 font-mono font-bold text-[11px] px-2 py-0.5 rounded border border-amber-300">
                  +{r.std_score || 0} Poin
                </span>
                <span className="font-mono text-slate-500">
                  {r.date} · {r.time}
                </span>
              </div>
            </div>

            <div className="font-bold text-slate-900 text-sm mb-1">
              <span className="text-[#E32128] font-mono mr-1.5">{r.position_code}:</span>
              {r.position_name}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 mt-2 font-mono">
              <div>
                <span>{r.operator_name}</span> ({r.operator_nip}) · <strong>{r.shift}</strong>
              </div>
              <div className="text-[#123C6E] font-sans font-semibold flex items-center gap-1">
                <span>Foto 5S</span>
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-6">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <div className="font-bold text-slate-700 text-sm">Tidak Ditemukan Riwayat Monitoring</div>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tidak ada data 5S yang cocok dengan kriteria filter yang Anda pilih. Silakan atur kembali tanggal atau area.
          </p>
        </div>
      )}

      {/* Detail Record Modal with Apa Yang Harus Dikontrol and Point Value */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 flex flex-col">
            <div className="sticky top-0 bg-[#123C6E] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-white/10 rounded-t-3xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFB800]/20 text-[#FFB800] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-[#FFB800] uppercase tracking-wider font-bold">
                    HASIL AUDIT INDIKATOR 5S (PT HEINZ ABC INDONESIA)
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {selectedRecord.position_code} — {selectedRecord.position_name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {/* Point Value Callout */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Poin Diperoleh untuk Indikator ini:</span>
                </div>
                <span className="text-sm font-extrabold font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl">
                  +{selectedRecord.std_score || 0} Poin Penuh
                </span>
              </div>

              {/* Standar Apa yang Harus Dikontrol */}
              {selectedRecord.explanation && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="text-xs font-bold text-[#E32128] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                    <ClipboardList className="w-4 h-4" />
                    <span>Standar yang Dikontrol:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {selectedRecord.explanation}
                  </p>
                </div>
              )}

              {/* Record Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                    Tanggal & Jam
                  </span>
                  <strong className="text-slate-900 block mt-0.5">
                    {selectedRecord.date}
                  </strong>
                  <span className="text-slate-500">{selectedRecord.time} WIB</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                    Shift Kerja
                  </span>
                  <strong className="text-[#123C6E] block mt-0.5 font-bold">
                    {selectedRecord.shift}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                    Area / Line
                  </span>
                  <strong className="text-slate-900 block mt-0.5 truncate">
                    {selectedRecord.area_name}
                  </strong>
                  <span className="text-slate-500">{selectedRecord.line_name || 'Stasiun Utama'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                    Operator
                  </span>
                  <strong className="text-slate-900 block mt-0.5 truncate">
                    {selectedRecord.operator_name}
                  </strong>
                  <span className="text-slate-500">NIP {selectedRecord.operator_nip}</span>
                </div>
              </div>

              {/* Photos Comparison */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  DOKUMENTASI FOTO VERIFIKASI 5S
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="bg-slate-100 rounded-2xl p-3 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        Kondisi BEFORE (Awal)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Sebelum 5S</span>
                    </div>
                    <div
                      onClick={() => setZoomPhoto(selectedRecord.before_photo)}
                      className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-200 cursor-pointer group shadow-2xs"
                    >
                      <img
                        src={selectedRecord.before_photo}
                        alt="Before condition"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-6 h-6 drop-shadow-md" />
                      </div>
                    </div>
                  </div>

                  {/* After */}
                  <div className="bg-slate-100 rounded-2xl p-3 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Kondisi AFTER (Selesai)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                        Setelah 5S
                      </span>
                    </div>
                    <div
                      onClick={() => setZoomPhoto(selectedRecord.after_photo)}
                      className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-200 cursor-pointer group shadow-2xs"
                    >
                      <img
                        src={selectedRecord.after_photo}
                        alt="After condition"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-6 h-6 drop-shadow-md" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedRecord.notes && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
                  <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px] mb-1 font-mono">
                    Catatan Temuan / Tindakan Perbaikan:
                  </span>
                  <p className="text-slate-600 leading-relaxed italic">
                    "{selectedRecord.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Zoom */}
      {zoomPhoto && (
        <div
          onClick={() => setZoomPhoto(null)}
          className="fixed inset-0 z-70 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={zoomPhoto}
              alt="Zoomed 5S Photo"
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
