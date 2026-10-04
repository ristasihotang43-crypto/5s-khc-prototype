import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMonitoring, formatIndonesianDate } from '../context/MonitoringContext';
import { Area, Line, Position, ShiftType } from '../types';
import { CameraService } from '../services/camera';
import {
  SAMPLE_BEFORE_IMG,
  SAMPLE_AFTER_IMG,
} from '../services/storage';
import {
  X,
  Camera,
  Upload,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  SwitchCamera,
  Check,
  ClipboardCheck,
  Info,
} from 'lucide-react';

interface MonitoringFormModalProps {
  position: Position;
  area: Area;
  line?: Line;
  onClose: () => void;
  onSuccess: () => void;
}

export const MonitoringFormModal: React.FC<MonitoringFormModalProps> = ({
  position,
  area,
  line,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { selectedDate, selectedShift, submitMonitoring } = useMonitoring();

  // Current time defaults
  const now = new Date();
  const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  // Form states
  const [date, setDate] = useState<string>(selectedDate);
  const [time, setTime] = useState<string>(defaultTime);
  const [shift, setShift] = useState<ShiftType>(selectedShift);
  const [notes, setNotes] = useState<string>('');

  // Photos
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [isProcessingBefore, setIsProcessingBefore] = useState(false);
  const [isProcessingAfter, setIsProcessingAfter] = useState(false);

  // Live Camera states
  const [activeCameraTarget, setActiveCameraTarget] = useState<'before' | 'after' | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // File input refs
  const beforeFileInputRef = useRef<HTMLInputElement | null>(null);
  const afterFileInputRef = useRef<HTMLInputElement | null>(null);

  // Confirmation dialog state
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const shifts: ShiftType[] = ['SHIFT 1', 'SHIFT 2', 'SHIFT 3'];

  // Start live camera stream when modal target changes
  useEffect(() => {
    if (activeCameraTarget) {
      setCameraError(null);
      CameraService.startCameraStream(cameraFacing)
        .then((stream) => {
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch((err) => {
          console.warn('Camera stream failed or permission denied:', err);
          setCameraError(
            'Kamera perangkat tidak dapat diakses atau izin ditolak. Silakan gunakan opsi Upload Foto Galeri di bawah.'
          );
        });
    } else {
      CameraService.stopStream(cameraStream);
      setCameraStream(null);
    }

    return () => {
      CameraService.stopStream(cameraStream);
    };
  }, [activeCameraTarget, cameraFacing]);

  // Handle capture snapshot from video
  const handleCaptureVideo = () => {
    if (!videoRef.current || !activeCameraTarget) return;

    const watermark = `5S AUDIT · ${date} ${time} · ${shift} · ${position.code}`;
    const result = CameraService.captureVideoFrame(videoRef.current, watermark);

    if (activeCameraTarget === 'before') {
      setBeforePhoto(result.dataUrl);
    } else {
      setAfterPhoto(result.dataUrl);
    }

    // Close camera stream
    CameraService.stopStream(cameraStream);
    setCameraStream(null);
    setActiveCameraTarget(null);
  };

  // Handle File Upload from gallery
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'before') setIsProcessingBefore(true);
    else setIsProcessingAfter(true);

    try {
      const watermark = `5S AUDIT · ${date} ${time} · ${shift} · ${position.code}`;
      const processed = await CameraService.processImageFile(file, {
        watermarkText: watermark,
      });

      if (type === 'before') {
        setBeforePhoto(processed.dataUrl);
      } else {
        setAfterPhoto(processed.dataUrl);
      }
    } catch (err) {
      console.error('Failed to process image:', err);
      alert('Gagal memproses file foto. Pastikan format gambar berupa JPG atau PNG.');
    } finally {
      if (type === 'before') setIsProcessingBefore(false);
      else setIsProcessingAfter(false);
      // Reset input value to allow re-uploading the same file if needed
      e.target.value = '';
    }
  };

  // Validate form before opening confirmation dialog
  const handleValidateAndPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!date) {
      setValidationError('Tanggal monitoring wajib diisi.');
      return;
    }
    if (!time) {
      setValidationError('Jam kontrol wajib diisi.');
      return;
    }
    if (!shift) {
      setValidationError('Shift kerja wajib dipilih.');
      return;
    }
    if (!beforePhoto) {
      setValidationError('Foto BEFORE (kondisi sebelum perbaikan 5S) wajib diambil/diunggah.');
      return;
    }
    if (!afterPhoto) {
      setValidationError('Foto AFTER (kondisi setelah perbaikan 5S) wajib diambil/diunggah.');
      return;
    }

    // Validation passed, show confirmation prompt modal
    setShowConfirmModal(true);
  };

  // Final Submit execution
  const handleConfirmSubmit = async () => {
    if (!currentUser || !beforePhoto || !afterPhoto) return;

    setIsSubmitting(true);
    try {
      await submitMonitoring({
        date,
        time,
        shift,
        area_id: area.id,
        area_name: area.name,
        line_id: line?.id,
        line_name: line?.name,
        position_id: position.id,
        position_code: position.code,
        position_name: position.name,
        step: position.step,
        explanation: position.explanation,
        control_items: position.control_items,
        std_score: position.std_score,
        user_id: currentUser.id,
        operator_name: currentUser.name,
        operator_nip: currentUser.employee_id,
        before_photo: beforePhoto,
        after_photo: afterPhoto,
        notes: notes.trim() || undefined,
      });

      setShowConfirmModal(false);
      onSuccess();
    } catch (err) {
      console.error('Submission failed:', err);
      setValidationError('Terjadi kesalahan saat menyimpan data audit. Silakan coba kembali.');
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#123C6E] text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-blue-950">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
              <span>PT Heinz ABC Indonesia</span>
              <span>·</span>
              <span>Form Kontrol Indikator 5S</span>
            </div>
            <h2 className="text-type-h2 text-white font-bold tracking-tight mt-0.5">
              DOKUMENTASI KONTROL INDIKATOR 5S
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleValidateAndPrompt} className="p-5 sm:p-7 space-y-6 flex-1 overflow-y-auto">
          {/* INFORMASI MONITORING BANNER */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">
                Area
              </span>
              <strong className="text-slate-900 font-bold text-sm block">
                {area.name}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">
                Line
              </span>
              <strong className="text-slate-900 font-bold text-sm block">
                {line ? line.name : 'Stasiun Utama'}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">
                Indikator
              </span>
              <strong className="text-[#123C6E] font-bold text-sm block truncate font-mono">
                {position.code}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">
                Operator
              </span>
              <strong className="text-slate-900 font-bold text-sm block truncate">
                {currentUser?.name} ({currentUser?.employee_id})
              </strong>
            </div>
          </div>

          {/* DEDICATED PROMINENT SECTION: APA YANG HARUS DIKONTROL */}
          <div className="bg-gradient-to-r from-blue-50/70 via-slate-50 to-amber-50/40 border-2 border-[#123C6E]/30 rounded-2xl p-4.5 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#123C6E] text-white text-xs font-bold font-mono rounded-lg">
                  {position.code}
                </span>
                <span className="px-2.5 py-1 bg-amber-400 text-slate-900 text-xs font-extrabold rounded-lg font-mono">
                  {position.step}
                </span>
              </div>
              {position.std_score && (
                <span className="text-xs font-bold text-[#123C6E] bg-white border border-blue-200 px-3 py-1 rounded-lg">
                  Bobot Standar: {position.std_score} Poin
                </span>
              )}
            </div>

            <h3 className="text-type-h3 text-slate-900 font-bold mb-2">
              {position.name}
            </h3>

            {/* Explanation box */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#E32128] mb-1.5 flex items-center gap-1.5">
                <ClipboardCheck className="w-4 h-4" />
                <span>Hal yang Harus Dikontrol:</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {position.explanation}
              </p>

              {position.control_items && position.control_items.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Poin Spesifik Pemeriksaan:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {position.control_items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#E32128] font-bold leading-none mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Form Inputs: TANGGAL, JAM, SHIFT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tanggal */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#123C6E]" />
                <span>Tanggal</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#123C6E]"
              />
            </div>

            {/* Jam */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#123C6E]" />
                <span>Jam Kontrol</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#123C6E]"
              />
            </div>

            {/* Shift */}
            <div>
              <label className="block text-type-caption font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Shift Kerja
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {shifts.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShift(s)}
                    className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      shift === s
                        ? 'bg-[#E32128] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {s.replace('SHIFT ', 'S')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DOKUMENTASI BEFORE & AFTER (Dua Kolom Besar) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  Dokumentasi Visual 5S (Before & After)
                </h3>
                <p className="text-xs text-slate-500">
                  Wajib lampirkan foto kondisi awal (Before) dan kondisi setelah perbaikan/tindakan (After)
                </p>
              </div>

              {/* Simulation Quick Fill Button */}
              <button
                type="button"
                onClick={() => {
                  setBeforePhoto(SAMPLE_BEFORE_IMG);
                  setAfterPhoto(SAMPLE_AFTER_IMG);
                }}
                className="text-[11px] font-semibold text-[#123C6E] hover:text-[#E32128] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                title="Gunakan sampel foto simulasi untuk uji coba cepat"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pakai Contoh Foto</span>
              </button>
            </div>

            {/* Two Large Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* KOLOM BEFORE */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-4 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="text-type-h3 font-bold text-slate-800">
                      BEFORE
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Kondisi Sebelum 5S
                  </span>
                </div>

                {/* Preview Box */}
                <div className="w-full h-56 sm:h-64 bg-slate-200 rounded-2xl overflow-hidden relative border border-slate-300 flex items-center justify-center">
                  {beforePhoto ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={beforePhoto}
                        alt="Before 5S Condition"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBeforePhoto(null)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Hapus / Foto Ulang</span>
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                        BEFORE · TERVERIFIKASI
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      {isProcessingBefore ? (
                        <div className="space-y-2">
                          <div className="w-8 h-8 border-3 border-[#123C6E] border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-xs text-slate-600 font-medium">Memproses foto...</p>
                        </div>
                      ) : (
                        <>
                          <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2 opacity-70" />
                          <div className="text-xs font-bold text-slate-700">Foto Kondisi Awal Belum Ada</div>
                          <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                            Ambil foto mesin/area sebelum dibersihkan atau ditata
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons: Camera & Upload */}
                <div className="w-full grid grid-cols-2 gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setActiveCameraTarget('before')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#123C6E] hover:bg-[#0d2a4d] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Ambil Kamera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => beforeFileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-98"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Upload Galeri</span>
                  </button>

                  <input
                    ref={beforeFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'before')}
                    className="hidden"
                  />
                </div>
              </div>

              {/* KOLOM AFTER */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-4 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-type-h3 font-bold text-slate-800">
                      AFTER
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Kondisi Setelah 5S
                  </span>
                </div>

                {/* Preview Box */}
                <div className="w-full h-56 sm:h-64 bg-slate-200 rounded-2xl overflow-hidden relative border border-slate-300 flex items-center justify-center">
                  {afterPhoto ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={afterPhoto}
                        alt="After 5S Condition"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAfterPhoto(null)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Hapus / Foto Ulang</span>
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-emerald-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>AFTER · TERVERIFIKASI</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      {isProcessingAfter ? (
                        <div className="space-y-2">
                          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-xs text-slate-600 font-medium">Memproses foto...</p>
                        </div>
                      ) : (
                        <>
                          <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2 opacity-70" />
                          <div className="text-xs font-bold text-slate-700">Foto Kondisi Akhir Belum Ada</div>
                          <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                            Ambil foto setelah dilakukan tindakan pembersihan, penataan, dan perbaikan
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons: Camera & Upload */}
                <div className="w-full grid grid-cols-2 gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setActiveCameraTarget('after')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Ambil Kamera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => afterFileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-98"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Upload Galeri</span>
                  </button>

                  <input
                    ref={afterFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'after')}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Catatan / Tindakan Perbaikan 5S */}
          <div>
            <label className="block text-type-caption font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Catatan & Tindakan Perbaikan (Opsional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pembersihan ceceran saus pada nozzle dan perapian kunci pas ke shadow board..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#123C6E]"
            />
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 8: TOMBOL BESAR SUBMIT MONITORING */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-[#E32128] hover:bg-[#c9181f] text-white rounded-2xl text-base font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <CheckCircle className="w-5 h-5" />
              <span>SUBMIT MONITORING 5S</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2 font-mono">
              Setelah disubmit, indikator ini akan berstatus "Sudah Dikontrol" dan terkunci untuk hari ini.
            </p>
          </div>
        </form>
      </div>

      {/* LIVE CAMERA MODAL OVERLAY */}
      {activeCameraTarget && (
        <div className="fixed inset-0 z-60 bg-black flex flex-col">
          {/* Top Camera Controls */}
          <div className="p-4 flex items-center justify-between text-white bg-black/60 backdrop-blur-xs z-10">
            <div className="text-sm font-bold flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  activeCameraTarget === 'before' ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
              <span>
                Kamera {activeCameraTarget === 'before' ? 'BEFORE 5S' : 'AFTER 5S'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'))
                }
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                title="Ganti Kamera Depan/Belakang"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setActiveCameraTarget(null)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Camera Viewfinder */}
          <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
            {cameraError ? (
              <div className="p-6 text-center max-w-sm text-white space-y-4">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
                <p className="text-sm">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => setActiveCameraTarget(null)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold"
                >
                  Tutup Kamera
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Industrial Framing Guide Overlay */}
                <div className="absolute inset-8 border border-white/40 pointer-events-none rounded-2xl flex flex-col justify-between p-4">
                  <div className="flex justify-between text-[11px] font-mono text-white/80 bg-black/40 px-2 py-1 rounded backdrop-blur-xs self-start">
                    {position.code} · {position.name}
                  </div>
                  <div className="text-center text-xs font-mono text-white/80 bg-black/40 px-3 py-1 rounded backdrop-blur-xs self-center">
                    Arahkan kamera ke area yang diaudit
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Shutter Button */}
          {!cameraError && (
            <div className="p-6 bg-black/80 flex items-center justify-center">
              <button
                type="button"
                onClick={handleCaptureVideo}
                className="w-20 h-20 rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-full h-full rounded-full bg-[#E32128]" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL (Section 8: "Apakah Anda yakin ingin menyelesaikan monitoring indikator ini?") */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-70 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-blue-50 text-[#123C6E] rounded-2xl flex items-center justify-center mx-auto border border-blue-200">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-type-h3 text-slate-900 font-bold">
                Konfirmasi Penyelesaian Kontrol
              </h3>
              <p className="text-type-body-sm text-slate-600 mt-1">
                Apakah Anda yakin ingin menyelesaikan kontrol untuk{' '}
                <strong className="text-slate-900 font-bold">{position.code}</strong> (
                {position.name})?
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 text-left space-y-1 font-mono border border-slate-200">
              <div>• Tanggal: {formatIndonesianDate(date)}</div>
              <div>• Jam: {time} WIB · {shift}</div>
              <div>• Foto Before & After: Tersedia (2 Foto)</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="py-3 px-4 bg-[#E32128] hover:bg-[#c9181f] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>SUBMIT</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
