import { Area, Line, Position, MonitoringRecord, User } from '../types';

const DB_NAME = '5s_monitoring_db';
const DB_VERSION = 2; // Incremented for 5S indicators upgrade

// Image asset references generated for the application
export const SAMPLE_BEFORE_IMG = '/src/assets/images/sample_before_5s_1791129491907.jpg';
export const SAMPLE_AFTER_IMG = '/src/assets/images/sample_after_5s_1791129509864.jpg';
export const PLANT_BG_IMG = '/src/assets/images/factory_plant_floor_1791129476838.jpg';

// Initial preloaded users - PT Heinz ABC Indonesia
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    employee_id: '10293',
    name: 'Rista',
    email: 'RistaSihotang43@gmail.com',
    password: 'password123',
    role: 'operator',
    department: 'Filling & Packaging Line · PT Heinz ABC Indonesia',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rista&backgroundColor=b6e3f4',
  },
  {
    id: 'usr-2',
    employee_id: '10294',
    name: 'Budi Santoso',
    email: 'budi.santoso@kraftheinz.com',
    password: 'password123',
    role: 'operator',
    department: 'Depallitizer Plant · PT Heinz ABC Indonesia',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&backgroundColor=c0aede',
  },
  {
    id: 'usr-3',
    employee_id: '99001',
    name: 'Hendra Wijaya',
    email: 'hendra.supervisor@kraftheinz.com',
    password: 'adminpassword',
    role: 'supervisor',
    department: 'Quality Control & 5S Lead · PT Heinz ABC Indonesia',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra&backgroundColor=d1d4f9',
  },
];

// Initial Areas
export const INITIAL_AREAS: Area[] = [
  {
    id: 'depallitizer',
    name: 'DEPALLITIZER',
    code: 'DEP',
    description: 'Area pembongkaran palet bahan baku botol/kaleng dan infeed conveyor utama',
    has_lines: false,
    order: 1,
  },
  {
    id: 'filling',
    name: 'FILLING',
    code: 'FIL',
    description: 'Area pengisian cairan produksi (kecap, saus sambal, sirup) dan capping otomatis',
    has_lines: true,
    order: 2,
  },
  {
    id: 'assembling',
    name: 'ASSEMBLING',
    code: 'ASM',
    description: 'Area perakitan akhir, packaging sekunder, boxing karton, dan pelabelan batch',
    has_lines: true,
    order: 3,
  },
];

// Lines for Filling and Assembling (A through G)
export const INITIAL_LINES: Line[] = [
  // Filling Lines
  { id: 'fil-line-a', area_id: 'filling', name: 'LINE A', order: 1, active: true },
  { id: 'fil-line-b', area_id: 'filling', name: 'LINE B', order: 2, active: true },
  { id: 'fil-line-c', area_id: 'filling', name: 'LINE C', order: 3, active: true },
  { id: 'fil-line-d', area_id: 'filling', name: 'LINE D', order: 4, active: true },
  { id: 'fil-line-e', area_id: 'filling', name: 'LINE E', order: 5, active: true },
  { id: 'fil-line-f', area_id: 'filling', name: 'LINE F', order: 6, active: true },
  { id: 'fil-line-g', area_id: 'filling', name: 'LINE G', order: 7, active: true },
  // Assembling Lines
  { id: 'asm-line-a', area_id: 'assembling', name: 'LINE A', order: 1, active: true },
  { id: 'asm-line-b', area_id: 'assembling', name: 'LINE B', order: 2, active: true },
  { id: 'asm-line-c', area_id: 'assembling', name: 'LINE C', order: 3, active: true },
  { id: 'asm-line-d', area_id: 'assembling', name: 'LINE D', order: 4, active: true },
  { id: 'asm-line-e', area_id: 'assembling', name: 'LINE E', order: 5, active: true },
  { id: 'asm-line-f', area_id: 'assembling', name: 'LINE F', order: 6, active: true },
  { id: 'asm-line-g', area_id: 'assembling', name: 'LINE G', order: 7, active: true },
];

// 5S Indicator Templates with full explanations of what must be controlled
const FILLING_INDICATOR_TEMPLATES = [
  {
    code: 'Indikator 01',
    name: '1S - SORT (Ringkas) · Pemilahan Botol Reject & Material Asing',
    step: 'SORT',
    std_score: 20,
    explanation: 'Pisahkan & singkirkan benda yang tidak diperlukan dari area filling. Pastikan tidak ada botol pecah/cacat, tutup botol tercecer di lantai mesin, sisa plastik shrink, atau material kadaluarsa di sekitar jalur produksi.',
    control_items: [
      'Tidak ada botol pecah/cacat dan tutup botol tercecer di lantai dan bodi mesin',
      'Wadah penampungan botol reject (afval) tidak melebihi kapasitas/meluap',
      'Peralatan atau material non-produksi diberi label Red Tag atau disingkirkan',
    ],
  },
  {
    code: 'Indikator 02',
    name: '2S - SET IN ORDER (Rapi) · Penataan Tools & Demarkasi Line',
    step: 'SET IN ORDER',
    std_score: 20,
    explanation: 'Tata letak kunci setelan nozzle, pelumas food-grade, dan suku cadang cadangan harus rapi pada shadow board. Pastikan batas demarkasi kuning/putih ditaati dan jalur akses operator bebas rintangan.',
    control_items: [
      'Garis demarkasi lantai area filling (kuning) terlihat jelas dan tidak tertutup palet',
      'Kunci pengganti nozzle dan toolkit tersimpan pada shadow board bertanda khusus',
      'Jalur akses evakuasi dan inspeksi mesin bebas hambatan barang/selang',
    ],
  },
  {
    code: 'Indikator 03',
    name: '3S - SHINE (Resik) · Kebersihan Nozzle Filling & Bodi Mesin',
    step: 'SHINE',
    std_score: 20,
    explanation: 'Bersihkan seluruh nozzle pengisian cairan, ban conveyor belt, sensor botol, drip tray penampung saus/kecap, dan lantai dari ceceran produk, minyak, oli, dan air. Lakukan inspeksi visual kebocoran pipa produk.',
    control_items: [
      'Nozzle filling dan drip pan bersih dari kerak saus/kecap yang mengering',
      'Permukaan conveyor stainless steel dan sensor bebas dari residu lengket',
      'Lantai bawah mesin kering, tidak licin, dan tidak ada genangan tumpahan produk',
    ],
  },
  {
    code: 'Indikator 04',
    name: '4S - STANDARDIZE (Rawat) · Visual SOP & Parameter Suhu/Tekanan',
    step: 'STANDARDIZE',
    std_score: 15,
    explanation: 'Pertahankan standar 3S dengan visual management: papan indikator status line (Run/Stop/Clean), petunjuk Instruksi Kerja (IK) sanitasi, label batas aman jarum manometer tekanan udara & suhu filling, dan label identitas tangki.',
    control_items: [
      'Papan visual status line dan parameter suhu/tekanan jarum gauge di zona hijau',
      'Instruksi Kerja (IK) pembersihan & penggantian kemasan terpajang bersih dan terbaca',
      'Pipa jalur produk memiliki penanda warna arah aliran (flow direction) jelas',
    ],
  },
  {
    code: 'Indikator 05',
    name: '5S - SUSTAIN (Rajin) · Disiplin Form 5S & Serah Terima Shift',
    step: 'SUSTAIN',
    std_score: 10,
    explanation: 'Disiplin operator dalam melaksanakan kontrol 5S secara rutin pada awal dan akhir shift. Pengisian form monitoring, pemenuhan serah terima catatan kondisi mesin antar shift, serta partisipasi aktif dalam pelaporan Kaizen.',
    control_items: [
      'Form kontrol 5S terisi tepat waktu dan lengkap sebelum pergantian shift',
      'Catatan serah terima kondisi operasional mesin disampaikan ke shift berikutnya',
      'Partisipasi rutin dalam 5-minute cleaning rutin sebelum mesin beroperasi',
    ],
  },
  {
    code: 'Indikator 06',
    name: 'SAFETY / K3 · Emergency Stop & Alat Pelindung Diri (APD)',
    step: 'SAFETY',
    std_score: 15,
    explanation: 'Kepatuhan penuh penggunaan APD standar pabrik makanan (hairnet, masker, safety shoes, sarung tangan nitril food-grade). Pastikan tombol darurat (Emergency Stop) bebas halangan dan cover akrilik pengaman mesin tertutup rapat.',
    control_items: [
      'Semua operator memakai APD higienis lengkap (hairnet, masker, safety shoes)',
      'Tombol Emergency Stop dapat dijangkau seketika dan tidak terhalang barang',
      'Pintu akrilik pelindung mesin (safety door interlocking) berfungsi normal',
    ],
  },
];

const ASSEMBLING_INDICATOR_TEMPLATES = [
  {
    code: 'Indikator 01',
    name: '1S - SORT (Ringkas) · Pemilahan Karton Rusak & Afval Packing',
    step: 'SORT',
    std_score: 20,
    explanation: 'Pilah dan singkirkan kardus kemasan reject, sobekan lakban/tape sisa, strapping band patah, dan material kemasan yang tidak terpakai dari area meja perakitan kardus dan conveyor karton.',
    control_items: [
      'Tidak ada tumpukan kardus rusak atau afval tercecer di lantai jalur assembling',
      'Tempat sampah daur ulang kardus diposisikan rapi dan tidak meluber',
      'Material kemasan non-aktif disingkirkan dari meja kerja perakitan',
    ],
  },
  {
    code: 'Indikator 02',
    name: '2S - SET IN ORDER (Rapi) · Penataan Meja Kerja & Shadow Board Tools',
    step: 'SET IN ORDER',
    std_score: 20,
    explanation: 'Susun rapi tape dispenser, cutter safety otomatis, stempel barcode lot, dan lem kardus pada posisi bertanda. Palet karton produk jadi berada tepat di dalam kotak demarkasi kuning di lantai.',
    control_items: [
      'Cutter safety dan dispenser lakban disimpan pada holder bertanda shadow board',
      'Palet finished goods (karton jadi) berada tepat di dalam garis kotak demarkasi',
      'Kabel roll dan selang pneumatic tidak melintang sembarangan di lantai kerja',
    ],
  },
  {
    code: 'Indikator 03',
    name: '3S - SHINE (Resik) · Kebersihan Mesin Sealer & Belt Conveyor',
    step: 'SHINE',
    std_score: 20,
    explanation: 'Bersihkan mesin case sealer (perekatan karton), roller gravitasi, dan print head coding inkjet dari debu karton, serat serat kertas, dan sisa lem adhesive. Lantai area packaging harus disapu bersih.',
    control_items: [
      'Roll penekan case sealer bersih dari sisa residu lakban dan lem mengering',
      'Print head mesin inkjet coding bersih dan menghasilkan cetakan tajam',
      'Lantai area perakitan dan packing sekunder bebas debu kertas dan kotoran',
    ],
  },
  {
    code: 'Indikator 04',
    name: '4S - STANDARDIZE (Rawat) · Visual Standar Labeling & Coding Lot',
    step: 'STANDARDIZE',
    std_score: 15,
    explanation: 'Standarisasi visual panduan pola susunan karton (palletizing pattern), contoh cetakan label exp date yang benar, batas maksimal tumpukan karton (tier height), serta lembar spesifikasi kemasan terpajang.',
    control_items: [
      'Panduan visual susunan tumpukan karton di atas palet terpajang jelas',
      'Sampel cetakan expired date & batch number terverifikasi sesuai standar QC',
      'Label identifikasi varian produk (kecap/saus) pada palet terpasang rapi',
    ],
  },
  {
    code: 'Indikator 05',
    name: '5S - SUSTAIN (Rajin) · Kepatuhan Checklist 5S & Ringkasan Shift',
    step: 'SUSTAIN',
    std_score: 10,
    explanation: 'Membiasakan budaya kerja disiplin dalam menjaga keteraturan area assembling. Memastikan form audit harian 5S ditandatangani dan serah terima target kuantitas karton tercapai dengan rapi.',
    control_items: [
      'Form monitoring 5S terisi tepat waktu dan lengkap sebelum pergantian shift',
      'Briefing 5S shift awal dan evaluasi 5S akhir shift dijalankan secara tertib',
      'Komitmen operator menjaga integritas kemasan produk PT Heinz ABC Indonesia',
    ],
  },
  {
    code: 'Indikator 06',
    name: 'SAFETY / K3 · Sensor Mesin & Rambu Bahaya Bergerak (Pinch Point)',
    step: 'SAFETY',
    std_score: 15,
    explanation: 'Pemeriksaan rambu titik jepit (pinch point warning) pada conveyor packaging, sensor optik pusher karton, pemakaian sarung tangan anti-sayat bagi operator packing, dan alat pemadam api (APAR) tidak tertutup tumpukan palet.',
    control_items: [
      'Operator memakai sarung tangan kerja anti-slip/anti-sayat dan sepatu safety',
      'Rambu peringatan titik jepit roller conveyor terpasang jelas dan terbaca',
      'Akses ke panel listrik dan APAR steril minimal 1 meter dari barang/karton',
    ],
  },
];

const DEPALLITIZER_INDICATORS: Position[] = [
  {
    id: 'pos-dep-01',
    area_id: 'depallitizer',
    code: 'Indikator 01',
    name: '1S - SORT (Ringkas) · Pemisahan Palet Rusak & Benda Asing',
    step: 'SORT',
    std_score: 20,
    explanation: 'Pisahkan & singkirkan palet kayu yang pecah/rusak, serpihan paku lepas, sisa plastik pembungkus (stretch hood), dan sampah kotoran dari area infeed conveyor dan unit de-palletizing.',
    control_items: [
      'Tidak ada palet patah atau papan lapuk di area antrian conveyor depallitizer',
      'Serpihan kayu, paku lepas, dan plastik strapping segera disingkirkan ke tempat sampah',
      'Area transfer botol steril dari kontaminasi benda asing',
    ],
    order: 1,
    active: true,
  },
  {
    id: 'pos-dep-02',
    area_id: 'depallitizer',
    code: 'Indikator 02',
    name: '2S - SET IN ORDER (Rapi) · Penataan Palet Kosong & Staging Area',
    step: 'SET IN ORDER',
    std_score: 20,
    explanation: 'Penyusunan tumpukan palet kosong di dalam kotak garis batas demarkasi kuning. Alat pemotong strapping (safety strap cutter) berada pada sarung khusus dan forklift staging zone tertata rapi.',
    control_items: [
      'Tumpukan palet kosong tersusun rapi tegak lurus di dalam batas garis kuning',
      'Strap cutter bertali tersimpan aman pada holder mesin',
      'Jalur lintasan forklift transfer palet tidak terhalang tumpukan material',
    ],
    order: 2,
    active: true,
  },
  {
    id: 'pos-dep-03',
    area_id: 'depallitizer',
    code: 'Indikator 03',
    name: '3S - SHINE (Resik) · Kebersihan Arm Robot & Roller Infeed',
    step: 'SHINE',
    std_score: 20,
    explanation: 'Bersihkan bodi arm robot pengangkat layer botol, cangkir hisap vakum (suction cup / gripper bar), roller rantai infeed, dan sensor photoelectric dari debu industri, serbuk kayu, dan ceceran minyak pelumas.',
    control_items: [
      'Suction cup / gripper arm bebas dari kotoran debu yang mengurangi daya cengkeram',
      'Rantai roller conveyor infeed bersih dan dilumasi dengan standar pelumasan tepat',
      'Lantai area depallitizer disapu dan dipel bebas dari noda oli licin',
    ],
    order: 3,
    active: true,
  },
  {
    id: 'pos-dep-04',
    area_id: 'depallitizer',
    code: 'Indikator 04',
    name: '4S - STANDARDIZE (Rawat) · Standar Visual Demarkasi & Limit Tinggi',
    step: 'STANDARDIZE',
    std_score: 15,
    explanation: 'Pertahankan visual control: garis batas maksimum tinggi tumpukan palet (maks 15 tumpuk), rambu area bahaya gerakan robot, display layar sentuh HMI bersih dan terbaca, label arah putaran roller.',
    control_items: [
      'Garis batas tinggi maksimal palet pada dinding/kolom terlihat jelas',
      'Display HMI operasional depallitizer bersih dari sidik jari kotor dan debu',
      'Rambu keselamatan visual "Awas Mesin Otomatis Berputar" terpasang tegak',
    ],
    order: 4,
    active: true,
  },
  {
    id: 'pos-dep-05',
    area_id: 'depallitizer',
    code: 'Indikator 05',
    name: '5S - SUSTAIN (Rajin) · Disiplin Kontrol Shift & Logsheet HMI',
    step: 'SUSTAIN',
    std_score: 10,
    explanation: 'Disiplin operator dalam melaksanakan inspeksi awal shift, pengisian checklist harian pemantauan 5S Depallitizer, pelaporan kerusakan palet pada supplier, serta pergantian shift secara bertanggung jawab.',
    control_items: [
      'Logsheet 5S Depallitizer terisi lengkap setiap awal dan akhir pergantian shift',
      'Catatan alarm mesin atau palet macet tercatat pada logbook operator',
      'Patroli 5S 10 menit sebelum serah terima shift dilaksanakan dengan tertib',
    ],
    order: 5,
    active: true,
  },
  {
    id: 'pos-dep-06',
    area_id: 'depallitizer',
    code: 'Indikator 06',
    name: 'SAFETY / K3 · Safety Guard & Light Curtain Interlock',
    step: 'SAFETY',
    std_score: 15,
    explanation: 'Pastikan pagar pengaman (safety cage perimeter) tertutup rapat. Tirai sensor cahaya keselamatan (light curtain interlock) aktif menghentikan mesin jika ada orang melintas, dan tombol Emergency Stop berfungsi sempurna.',
    control_items: [
      'Pagar pengaman keliling (safety fencing) terkunci rapat dan sensor pintu interlock aktif',
      'Sensor safety light curtain berfungsi normal dan tidak di-bypass',
      'Tombol Emergency Stop pada tiang akses mudah dijangkau dan siap digunakan',
    ],
    order: 6,
    active: true,
  },
];

// Helper to generate 5S indicators for lines
function generateIndicatorsForLine(
  area_id: string,
  line_id: string,
  templates: typeof FILLING_INDICATOR_TEMPLATES
): Position[] {
  return templates.map((item, idx) => ({
    id: `pos-${line_id}-${idx + 1}`,
    area_id,
    line_id,
    code: item.code,
    name: item.name,
    step: item.step,
    explanation: item.explanation,
    control_items: item.control_items,
    std_score: item.std_score,
    order: idx + 1,
    active: true,
  }));
}

// All Initial Positions (now standard 5S Indicators across all lines)
export const INITIAL_POSITIONS: Position[] = [
  // Depallitizer (6 standard 5S + Safety indicators)
  ...DEPALLITIZER_INDICATORS,

  // Filling Lines A through G (6 standard 5S + Safety indicators each)
  ...generateIndicatorsForLine('filling', 'fil-line-a', FILLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('filling', 'fil-line-b', FILLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('filling', 'fil-line-c', FILLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('filling', 'fil-line-d', FILLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('filling', 'fil-line-e', FILLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('filling', 'fil-line-f', FILLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('filling', 'fil-line-g', FILLING_INDICATOR_TEMPLATES),

  // Assembling Lines A through G (6 standard 5S + Safety indicators each)
  ...generateIndicatorsForLine('assembling', 'asm-line-a', ASSEMBLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('assembling', 'asm-line-b', ASSEMBLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('assembling', 'asm-line-c', ASSEMBLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('assembling', 'asm-line-d', ASSEMBLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('assembling', 'asm-line-e', ASSEMBLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('assembling', 'asm-line-f', ASSEMBLING_INDICATOR_TEMPLATES),
  ...generateIndicatorsForLine('assembling', 'asm-line-g', ASSEMBLING_INDICATOR_TEMPLATES),
];

// Helper to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('records')) {
        const store = db.createObjectStore('records', { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('date_area_line_pos', ['date', 'area_id', 'line_id', 'position_id'], { unique: false });
      }
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Initial seed monitoring records
export function getInitialSeedRecords(currentDate: string): MonitoringRecord[] {
  const records: MonitoringRecord[] = [];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Seed yesterday records
  records.push({
    id: `rec-seed-yest-1`,
    date: yesterdayStr,
    time: '07:45',
    shift: 'SHIFT 1',
    area_id: 'depallitizer',
    area_name: 'DEPALLITIZER',
    position_id: 'pos-dep-01',
    position_code: 'Indikator 01',
    position_name: '1S - SORT (Ringkas) · Pemisahan Palet Rusak & Benda Asing',
    step: 'SORT',
    explanation: 'Pisahkan & singkirkan palet kayu yang pecah/rusak dari area infeed conveyor.',
    std_score: 20,
    user_id: 'usr-1',
    operator_name: 'Rista',
    operator_nip: '10293',
    before_photo: SAMPLE_BEFORE_IMG,
    after_photo: SAMPLE_AFTER_IMG,
    notes: 'Pembersihan serpihan palet patah dan penataan conveyor infeed.',
    created_at: `${yesterdayStr}T07:45:00.000Z`,
  });

  records.push({
    id: `rec-seed-yest-2`,
    date: yesterdayStr,
    time: '08:15',
    shift: 'SHIFT 1',
    area_id: 'filling',
    area_name: 'FILLING',
    line_id: 'fil-line-a',
    line_name: 'LINE A',
    position_id: 'pos-fil-line-a-1',
    position_code: 'Indikator 01',
    position_name: '1S - SORT (Ringkas) · Pemilahan Botol Reject & Material Asing',
    step: 'SORT',
    explanation: 'Pisahkan & singkirkan benda yang tidak diperlukan dari area filling.',
    std_score: 20,
    user_id: 'usr-1',
    operator_name: 'Rista',
    operator_nip: '10293',
    before_photo: SAMPLE_BEFORE_IMG,
    after_photo: SAMPLE_AFTER_IMG,
    notes: 'Pembersihan botol reject dan penataan sensor guide.',
    created_at: `${yesterdayStr}T08:15:00.000Z`,
  });

  // Depallitizer 4 of 6 completed for today
  const depPositions = INITIAL_POSITIONS.filter(p => p.area_id === 'depallitizer');
  for (let i = 0; i < Math.min(4, depPositions.length); i++) {
    const pos = depPositions[i];
    records.push({
      id: `rec-seed-today-dep-${i + 1}`,
      date: currentDate,
      time: `07:${30 + i * 8}`,
      shift: 'SHIFT 1',
      area_id: 'depallitizer',
      area_name: 'DEPALLITIZER',
      position_id: pos.id,
      position_code: pos.code,
      position_name: pos.name,
      step: pos.step,
      explanation: pos.explanation,
      std_score: pos.std_score,
      user_id: 'usr-2',
      operator_name: 'Budi Santoso',
      operator_nip: '10294',
      before_photo: SAMPLE_BEFORE_IMG,
      after_photo: SAMPLE_AFTER_IMG,
      notes: `Inspeksi rutin 5S ${pos.code}: standar kontrol terpenuhi baik.`,
      created_at: `${currentDate}T07:${30 + i * 8}:00.000Z`,
    });
  }

  // Filling Line A: 4 of 6 completed
  const fillLineAPos = INITIAL_POSITIONS.filter(p => p.line_id === 'fil-line-a');
  for (let i = 0; i < Math.min(4, fillLineAPos.length); i++) {
    const pos = fillLineAPos[i];
    records.push({
      id: `rec-seed-today-fil-a-${i + 1}`,
      date: currentDate,
      time: `08:${10 + i * 6}`,
      shift: 'SHIFT 1',
      area_id: 'filling',
      area_name: 'FILLING',
      line_id: 'fil-line-a',
      line_name: 'LINE A',
      position_id: pos.id,
      position_code: pos.code,
      position_name: pos.name,
      step: pos.step,
      explanation: pos.explanation,
      std_score: pos.std_score,
      user_id: 'usr-1',
      operator_name: 'Rista',
      operator_nip: '10293',
      before_photo: SAMPLE_BEFORE_IMG,
      after_photo: SAMPLE_AFTER_IMG,
      notes: `Verifikasi 5S ${pos.step}: pembersihan dan kontrol area sesuai standar.`,
      created_at: `${currentDate}T08:${10 + i * 6}:00.000Z`,
    });
  }

  // Filling Line B: 3 of 6 completed
  const fillLineBPos = INITIAL_POSITIONS.filter(p => p.line_id === 'fil-line-b');
  for (let i = 0; i < Math.min(3, fillLineBPos.length); i++) {
    const pos = fillLineBPos[i];
    records.push({
      id: `rec-seed-today-fil-b-${i + 1}`,
      date: currentDate,
      time: `08:${40 + i * 5}`,
      shift: 'SHIFT 1',
      area_id: 'filling',
      area_name: 'FILLING',
      line_id: 'fil-line-b',
      line_name: 'LINE B',
      position_id: pos.id,
      position_code: pos.code,
      position_name: pos.name,
      step: pos.step,
      explanation: pos.explanation,
      std_score: pos.std_score,
      user_id: 'usr-1',
      operator_name: 'Rista',
      operator_nip: '10293',
      before_photo: SAMPLE_BEFORE_IMG,
      after_photo: SAMPLE_AFTER_IMG,
      notes: 'Pembersihan nozel dan sanitasi panel.',
      created_at: `${currentDate}T08:${40 + i * 5}:00.000Z`,
    });
  }

  // Assembling Line A: 4 of 6 completed
  const asmLineAPos = INITIAL_POSITIONS.filter(p => p.line_id === 'asm-line-a');
  for (let i = 0; i < Math.min(4, asmLineAPos.length); i++) {
    const pos = asmLineAPos[i];
    records.push({
      id: `rec-seed-today-asm-a-${i + 1}`,
      date: currentDate,
      time: `09:${10 + i * 5}`,
      shift: 'SHIFT 1',
      area_id: 'assembling',
      area_name: 'ASSEMBLING',
      line_id: 'asm-line-a',
      line_name: 'LINE A',
      position_id: pos.id,
      position_code: pos.code,
      position_name: pos.name,
      step: pos.step,
      explanation: pos.explanation,
      std_score: pos.std_score,
      user_id: 'usr-1',
      operator_name: 'Rista',
      operator_nip: '10293',
      before_photo: SAMPLE_BEFORE_IMG,
      after_photo: SAMPLE_AFTER_IMG,
      notes: 'Tooling shadow board lengkap & tertata.',
      created_at: `${currentDate}T09:${10 + i * 5}:00.000Z`,
    });
  }

  // Assembling Line C: 3 of 6 completed
  const asmLineCPos = INITIAL_POSITIONS.filter(p => p.line_id === 'asm-line-c');
  for (let i = 0; i < Math.min(3, asmLineCPos.length); i++) {
    const pos = asmLineCPos[i];
    records.push({
      id: `rec-seed-today-asm-c-${i + 1}`,
      date: currentDate,
      time: `09:${35 + i * 5}`,
      shift: 'SHIFT 1',
      area_id: 'assembling',
      area_name: 'ASSEMBLING',
      line_id: 'asm-line-c',
      line_name: 'LINE C',
      position_id: pos.id,
      position_code: pos.code,
      position_name: pos.name,
      step: pos.step,
      explanation: pos.explanation,
      std_score: pos.std_score,
      user_id: 'usr-2',
      operator_name: 'Budi Santoso',
      operator_nip: '10294',
      before_photo: SAMPLE_BEFORE_IMG,
      after_photo: SAMPLE_AFTER_IMG,
      notes: 'Area kerja disapu dan pelabelan diperbarui.',
      created_at: `${currentDate}T09:${35 + i * 5}:00.000Z`,
    });
  }

  return records;
}

// Storage Manager
export class StorageService {
  private static STORAGE_PREFIX = '5s_storage_v2_';

  static getAreas(): Area[] {
    try {
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}areas`);
      return data ? JSON.parse(data) : INITIAL_AREAS;
    } catch {
      return INITIAL_AREAS;
    }
  }

  static saveAreas(areas: Area[]): void {
    localStorage.setItem(`${this.STORAGE_PREFIX}areas`, JSON.stringify(areas));
  }

  static getLines(): Line[] {
    try {
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}lines`);
      return data ? JSON.parse(data) : INITIAL_LINES;
    } catch {
      return INITIAL_LINES;
    }
  }

  static saveLines(lines: Line[]): void {
    localStorage.setItem(`${this.STORAGE_PREFIX}lines`, JSON.stringify(lines));
  }

  static getPositions(): Position[] {
    try {
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}positions`);
      if (data) {
        const parsed = JSON.parse(data) as Position[];
        // Auto-upgrade if data has old format (missing explanation or has old "Posisi 01" codes)
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].explanation) {
          return parsed;
        }
      }
      // Initialize with pristine 5S Indicators
      this.savePositions(INITIAL_POSITIONS);
      return INITIAL_POSITIONS;
    } catch {
      return INITIAL_POSITIONS;
    }
  }

  static savePositions(positions: Position[]): void {
    localStorage.setItem(`${this.STORAGE_PREFIX}positions`, JSON.stringify(positions));
  }

  static getUsers(): User[] {
    try {
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}users`);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(`${this.STORAGE_PREFIX}users`, JSON.stringify(users));
  }

  // Monitoring Records Storage via IndexedDB (with LocalStorage fallback)
  static async getAllRecords(todayDateString: string): Promise<MonitoringRecord[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('records', 'readonly');
        const store = tx.objectStore('records');
        const req = store.getAll();
        req.onsuccess = () => {
          let results = req.result as MonitoringRecord[];
          if (!results || results.length === 0) {
            // First time initialization: seed records!
            const seed = getInitialSeedRecords(todayDateString);
            StorageService.bulkSaveRecords(seed).then(() => resolve(seed));
          } else {
            resolve(results);
          }
        };
        req.onerror = () => {
          resolve(this.getFallbackRecords(todayDateString));
        };
      });
    } catch {
      return this.getFallbackRecords(todayDateString);
    }
  }

  static async saveRecord(record: MonitoringRecord): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('records', 'readwrite');
        const store = tx.objectStore('records');
        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      const existing = this.getFallbackRecords(record.date);
      const updated = [record, ...existing.filter(r => r.id !== record.id)];
      localStorage.setItem(`${this.STORAGE_PREFIX}records_fallback`, JSON.stringify(updated));
    }
  }

  static async bulkSaveRecords(records: MonitoringRecord[]): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('records', 'readwrite');
        const store = tx.objectStore('records');
        records.forEach(r => store.put(r));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      localStorage.setItem(`${this.STORAGE_PREFIX}records_fallback`, JSON.stringify(records));
    }
  }

  static async resetAllToSeed(todayDateString: string): Promise<MonitoringRecord[]> {
    try {
      const db = await openDB();
      await new Promise<void>((resolve) => {
        const tx = db.transaction('records', 'readwrite');
        tx.objectStore('records').clear();
        tx.oncomplete = () => resolve();
      });
    } catch {
      localStorage.removeItem(`${this.STORAGE_PREFIX}records_fallback`);
    }

    // Reset lines & positions too
    localStorage.removeItem(`${this.STORAGE_PREFIX}areas`);
    localStorage.removeItem(`${this.STORAGE_PREFIX}lines`);
    localStorage.removeItem(`${this.STORAGE_PREFIX}positions`);

    const fresh = getInitialSeedRecords(todayDateString);
    await this.bulkSaveRecords(fresh);
    return fresh;
  }

  private static getFallbackRecords(todayDateString: string): MonitoringRecord[] {
    try {
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}records_fallback`);
      if (data) return JSON.parse(data);
      const seed = getInitialSeedRecords(todayDateString);
      localStorage.setItem(`${this.STORAGE_PREFIX}records_fallback`, JSON.stringify(seed));
      return seed;
    } catch {
      return getInitialSeedRecords(todayDateString);
    }
  }
}
