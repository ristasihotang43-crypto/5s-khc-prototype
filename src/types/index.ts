export type UserRole = 'operator' | 'supervisor';
export type ShiftType = 'SHIFT 1' | 'SHIFT 2' | 'SHIFT 3';
export type FiveSStep = 'SORT' | 'SET IN ORDER' | 'SHINE' | 'STANDARDIZE' | 'SUSTAIN' | 'SAFETY';

export interface User {
  id: string;
  employee_id: string; // NIP / NIK
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  avatar_url?: string;
}

export interface Area {
  id: string;
  name: string;
  code: string;
  description: string;
  has_lines: boolean;
  order: number;
}

export interface Line {
  id: string;
  area_id: string;
  name: string;
  order: number;
  active: boolean;
}

export interface Position {
  id: string;
  area_id: string;
  line_id?: string; // Optional for areas without lines like Depallitizer
  code: string; // e.g. "Indikator 01"
  name: string; // e.g. "1S - SORT (Ringkas) · Pemilahan Material & Alat"
  step: FiveSStep | string; // "SORT" | "SET IN ORDER" | "SHINE" | "STANDARDIZE" | "SUSTAIN" | "SAFETY"
  explanation: string; // Penjelasan apa yang harus dikontrol sesuai standar audit 5S
  control_items?: string[]; // Poin-poin spesifik pemeriksaan kontrol
  std_score?: number; // Nilai / bobot standar (e.g. 20, 15, 10)
  order: number;
  active: boolean;
  description?: string;
}

// Alias Indicator to Position for semantic clarity across the app
export type Indicator = Position;

export interface MonitoringRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  shift: ShiftType;
  area_id: string;
  area_name: string;
  line_id?: string;
  line_name?: string;
  position_id: string;
  position_code: string; // "Indikator 01"
  position_name: string;
  step?: FiveSStep | string;
  explanation?: string;
  control_items?: string[];
  std_score?: number;
  score?: number;
  user_id: string;
  operator_name: string;
  operator_nip: string;
  before_photo: string; // data URL or path
  after_photo: string;  // data URL or path
  notes?: string;
  created_at: string;
}

export interface MonitoringStats {
  total_positions: number;
  completed_positions: number;
  remaining_positions: number;
  completion_percentage: number;
  total_points: number;
  earned_points: number;
  points_percentage: number;
  area_stats: {
    area_id: string;
    area_name: string;
    total: number;
    completed: number;
    percentage: number;
    total_points: number;
    earned_points: number;
    points_percentage: number;
  }[];
}

export interface HistoryFilter {
  date_from: string;
  date_to: string;
  area_id: string;
  line_id: string;
  shift: string;
  operator_query: string;
}
