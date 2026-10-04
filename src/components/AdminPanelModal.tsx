import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMonitoring } from '../context/MonitoringContext';
import { Area, Line, Position, FiveSStep } from '../types';
import {
  X,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Layers,
  AlertTriangle,
  Sliders,
  Shield,
  ClipboardList,
} from 'lucide-react';

interface AdminPanelModalProps {
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ onClose }) => {
  const { currentUser } = useAuth();
  const {
    areas,
    lines,
    positions,
    addPosition,
    updatePosition,
    deletePosition,
    addLine,
    updateLine,
    resetAllData,
  } = useMonitoring();

  const [activeTab, setActiveTab] = useState<'positions' | 'lines' | 'reset'>('positions');

  // Filter for position management
  const [selectedAreaId, setSelectedAreaId] = useState<string>('filling');
  const [selectedLineId, setSelectedLineId] = useState<string>('fil-line-a');

  // New Indicator Form
  const [newPosCode, setNewPosCode] = useState<string>('Indikator 07');
  const [newPosName, setNewPosName] = useState<string>('');
  const [newPosStep, setNewPosStep] = useState<FiveSStep>('SORT');
  const [newPosExplanation, setNewPosExplanation] = useState<string>('');
  const [newPosScore, setNewPosScore] = useState<number>(20);
  const [showAddPosForm, setShowAddPosForm] = useState<boolean>(false);

  // New Line Form
  const [newLineAreaId, setNewLineAreaId] = useState<string>('filling');
  const [newLineName, setNewLineName] = useState<string>('LINE H');
  const [showAddLineForm, setShowAddLineForm] = useState<boolean>(false);

  // Edit Position in-place
  const [editingPosId, setEditingPosId] = useState<string | null>(null);
  const [editPosName, setEditPosName] = useState<string>('');
  const [editPosExplanation, setEditPosExplanation] = useState<string>('');
  const [editPosStep, setEditPosStep] = useState<string>('SORT');

  const currentArea = areas.find((a) => a.id === selectedAreaId) || areas[0];
  const areaLines = lines.filter((l) => l.area_id === selectedAreaId);

  // Filter positions
  const filteredPositions = currentArea.has_lines
    ? positions.filter((p) => p.area_id === selectedAreaId && p.line_id === selectedLineId)
    : positions.filter((p) => p.area_id === selectedAreaId);

  const handleCreatePosition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosName.trim()) return;

    addPosition({
      area_id: selectedAreaId,
      line_id: currentArea.has_lines ? selectedLineId : undefined,
      code: newPosCode.trim() || `Indikator ${String(filteredPositions.length + 1).padStart(2, '0')}`,
      name: newPosName.trim(),
      step: newPosStep,
      explanation: newPosExplanation.trim() || 'Periksa kesesuaian standar 5S pada area kerja dan mesin.',
      std_score: newPosScore || 15,
      order: filteredPositions.length + 1,
      active: true,
    });

    setNewPosName('');
    setNewPosExplanation('');
    setShowAddPosForm(false);
  };

  const handleCreateLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLineName.trim()) return;

    const existingInArea = lines.filter((l) => l.area_id === newLineAreaId);
    addLine({
      area_id: newLineAreaId,
      name: newLineName.trim().toUpperCase(),
      order: existingInArea.length + 1,
      active: true,
    });

    setNewLineName('');
    setShowAddLineForm(false);
  };

  const handleStartEdit = (pos: Position) => {
    setEditingPosId(pos.id);
    setEditPosName(pos.name);
    setEditPosExplanation(pos.explanation || '');
    setEditPosStep(pos.step || 'SORT');
  };

  const handleSaveEdit = (posId: string) => {
    if (!editPosName.trim()) return;
    updatePosition(posId, {
      name: editPosName.trim(),
      explanation: editPosExplanation.trim(),
      step: editPosStep,
    });
    setEditingPosId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 flex flex-col">
        {/* Header */}
        <div className="bg-[#123C6E] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-white/10 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-[#FFB800]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <div className="text-type-caption font-mono text-[#FFB800] font-bold uppercase tracking-wider">
                PANEL SUPERVISOR & ADMINISTRATOR · PT HEINZ ABC INDONESIA
              </div>
              <h2 className="text-type-h3 font-bold text-white">
                Pengelolaan Master Data Indikator 5S
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer ${
              activeTab === 'positions'
                ? 'bg-white text-[#123C6E] border-t-2 border-x border-[#123C6E] border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kelola Indikator 5S
          </button>
          <button
            onClick={() => setActiveTab('lines')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer ${
              activeTab === 'lines'
                ? 'bg-white text-[#123C6E] border-t-2 border-x border-[#123C6E] border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kelola Line Produksi
          </button>
          <button
            onClick={() => setActiveTab('reset')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer ${
              activeTab === 'reset'
                ? 'bg-white text-red-600 border-t-2 border-x border-red-600 border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reset Master Data
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* TAB 1: KELOLA INDIKATOR 5S */}
          {activeTab === 'positions' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 font-bold uppercase">Area:</span>
                  <select
                    value={selectedAreaId}
                    onChange={(e) => {
                      setSelectedAreaId(e.target.value);
                      if (e.target.value === 'depallitizer') {
                        setSelectedLineId('');
                      } else {
                        const targetAreaLines = lines.filter((l) => l.area_id === e.target.value);
                        setSelectedLineId(targetAreaLines[0]?.id || '');
                      }
                    }}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
                  >
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                {currentArea.has_lines && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 font-bold uppercase">Line:</span>
                    <select
                      value={selectedLineId}
                      onChange={(e) => setSelectedLineId(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 font-mono"
                    >
                      {areaLines.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowAddPosForm(!showAddPosForm)}
                  className="px-3 py-1.5 bg-[#123C6E] hover:bg-[#0d2a4d] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors ml-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Indikator Baru</span>
                </button>
              </div>

              {/* Add Indicator Form */}
              {showAddPosForm && (
                <form
                  onSubmit={handleCreatePosition}
                  className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3"
                >
                  <div className="font-bold text-xs text-[#123C6E] uppercase tracking-wider flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-[#E32128]" />
                    <span>Formulir Tambah Indikator 5S</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1">
                        Kode Indikator
                      </label>
                      <input
                        type="text"
                        value={newPosCode}
                        onChange={(e) => setNewPosCode(e.target.value)}
                        placeholder="Contoh: Indikator 07"
                        required
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1">
                        Pilar 5S
                      </label>
                      <select
                        value={newPosStep}
                        onChange={(e) => setNewPosStep(e.target.value as FiveSStep)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono font-bold"
                      >
                        <option value="SORT">SORT (Ringkas)</option>
                        <option value="SET IN ORDER">SET IN ORDER (Rapi)</option>
                        <option value="SHINE">SHINE (Resik)</option>
                        <option value="STANDARDIZE">STANDARDIZE (Rawat)</option>
                        <option value="SUSTAIN">SUSTAIN (Rajin)</option>
                        <option value="SAFETY">SAFETY (K3 & APD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1">
                        Bobot Standar (Skor)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={newPosScore}
                        onChange={(e) => setNewPosScore(parseInt(e.target.value, 10) || 15)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 mb-1">
                      Nama Indikator
                    </label>
                    <input
                      type="text"
                      value={newPosName}
                      onChange={(e) => setNewPosName(e.target.value)}
                      placeholder="Contoh: 1S - SORT · Pemilahan Alat & Pemisahan Reject"
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 mb-1">
                      Penjelasan Apa yang Harus Dikontrol
                    </label>
                    <textarea
                      rows={2}
                      value={newPosExplanation}
                      onChange={(e) => setNewPosExplanation(e.target.value)}
                      placeholder="Tuliskan petunjuk standar apa yang wajib diperiksa operator sebelum mengambil foto..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddPosForm(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#E32128] hover:bg-[#c9181f] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                    >
                      Simpan Indikator
                    </button>
                  </div>
                </form>
              )}

              {/* Indicator List */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-500">
                  Daftar Indikator ({filteredPositions.length} item):
                </div>

                {filteredPositions.map((pos) => {
                  const isEditing = editingPosId === pos.id;

                  return (
                    <div
                      key={pos.id}
                      className="p-3.5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editPosName}
                                onChange={(e) => setEditPosName(e.target.value)}
                                className="flex-1 bg-white border border-blue-400 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold"
                              />
                              <select
                                value={editPosStep}
                                onChange={(e) => setEditPosStep(e.target.value)}
                                className="bg-white border border-blue-400 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                              >
                                <option value="SORT">SORT</option>
                                <option value="SET IN ORDER">SET IN ORDER</option>
                                <option value="SHINE">SHINE</option>
                                <option value="STANDARDIZE">STANDARDIZE</option>
                                <option value="SUSTAIN">SUSTAIN</option>
                                <option value="SAFETY">SAFETY</option>
                              </select>
                            </div>
                            <textarea
                              rows={2}
                              value={editPosExplanation}
                              onChange={(e) => setEditPosExplanation(e.target.value)}
                              placeholder="Penjelasan apa yang harus dikontrol..."
                              className="w-full bg-white border border-blue-400 rounded-lg px-2.5 py-1 text-xs text-slate-700"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-mono font-bold text-[#123C6E] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                {pos.code}
                              </span>
                              {pos.step && (
                                <span className="text-[10px] font-mono font-bold text-[#E32128] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                  {pos.step}
                                </span>
                              )}
                              <span className="text-xs font-bold text-slate-900">{pos.name}</span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2">
                              {pos.explanation}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(pos.id)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                              title="Simpan Perubahan"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingPosId(null)}
                              className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
                              title="Batal"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(pos)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 cursor-pointer"
                              title="Edit Indikator"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus indikator "${pos.code} — ${pos.name}"?`)) {
                                  deletePosition(pos.id);
                                }
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer"
                              title="Hapus Indikator"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: KELOLA LINE PRODUKSI */}
          {activeTab === 'lines' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Daftar Line Produksi (Filling & Assembling)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Administrator dapat menambah atau menonaktifkan line produksi pabrik.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddLineForm(!showAddLineForm)}
                  className="px-3 py-1.5 bg-[#123C6E] hover:bg-[#0d2a4d] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Line Baru</span>
                </button>
              </div>

              {showAddLineForm && (
                <form
                  onSubmit={handleCreateLine}
                  className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1">
                        Pilih Area
                      </label>
                      <select
                        value={newLineAreaId}
                        onChange={(e) => setNewLineAreaId(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      >
                        <option value="filling">FILLING</option>
                        <option value="assembling">ASSEMBLING</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1">
                        Nama Line Baru
                      </label>
                      <input
                        type="text"
                        value={newLineName}
                        onChange={(e) => setNewLineName(e.target.value)}
                        placeholder="Contoh: LINE H"
                        required
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold uppercase text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddLineForm(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#123C6E] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Simpan Line
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lines.map((line) => {
                  const area = areas.find((a) => a.id === line.area_id);
                  const count = positions.filter((p) => p.line_id === line.id).length;

                  return (
                    <div
                      key={line.id}
                      className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-2xs"
                    >
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                          {area?.name}
                        </div>
                        <div className="text-base font-extrabold text-slate-900">
                          {line.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {count} Indikator 5S aktif
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateLine(line.id, { active: !line.active })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                            line.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {line.active ? 'Aktif' : 'Non-aktif'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: RESET MASTER DATA */}
          {activeTab === 'reset' && (
            <div className="p-5 bg-red-50 border border-red-200 rounded-2xl space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-red-900">
                    Reset Seluruh Master Data & Riwayat Audit
                  </h3>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">
                    Tindakan ini akan mengembalikan seluruh indikator 5S ke setelan pabrik default PT Heinz ABC Indonesia (6 Pilar 5S + Safety untuk Depallitizer, Filling, dan Assembling) serta memuat ulang data simulasi awal.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (
                      confirm(
                        'Peringatan: Seluruh data hasil audit dan kustomisasi indikator akan direset ke setelan standar PT Heinz ABC Indonesia. Lanjutkan?'
                      )
                    ) {
                      await resetAllData();
                      alert('Data berhasil direset ke standar pabrik 5S PT Heinz ABC Indonesia.');
                      onClose();
                    }
                  }}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Konfirmasi Reset Standar Pabrik PT Heinz ABC Indonesia</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
