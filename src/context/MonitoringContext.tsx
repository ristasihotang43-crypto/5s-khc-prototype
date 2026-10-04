import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Area, Line, Position, MonitoringRecord, ShiftType, MonitoringStats } from '../types';
import { StorageService } from '../services/storage';

interface MonitoringContextType {
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  selectedShift: ShiftType;
  setSelectedShift: (shift: ShiftType) => void;
  areas: Area[];
  lines: Line[];
  positions: Position[];
  records: MonitoringRecord[];
  isLoadingRecords: boolean;
  submitMonitoring: (
    data: Omit<MonitoringRecord, 'id' | 'created_at'>
  ) => Promise<MonitoringRecord>;
  getMonitoringForPosition: (
    date: string,
    areaId: string,
    lineId: string | undefined,
    positionId: string
  ) => MonitoringRecord | undefined;
  getLineStats: (
    date: string,
    areaId: string,
    lineId: string
  ) => {
    total: number;
    completed: number;
    percentage: number;
    total_points: number;
    earned_points: number;
    points_percentage: number;
  };
  getAreaStats: (
    date: string,
    areaId: string
  ) => {
    total: number;
    completed: number;
    percentage: number;
    total_points: number;
    earned_points: number;
    points_percentage: number;
  };
  getOverallStats: (date: string) => MonitoringStats;
  // Master data controls (Admin / Supervisor)
  addPosition: (pos: Omit<Position, 'id'>) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  deletePosition: (id: string) => void;
  addLine: (line: Omit<Line, 'id'>) => void;
  updateLine: (id: string, updates: Partial<Line>) => void;
  resetAllData: () => Promise<void>;
  jumpToDate: (offsetDays: number) => void;
}

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

// Helper to format Date to YYYY-MM-DD
export function formatDateISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Indonesian month formatting e.g. "04 OKTOBER 2026"
export function formatIndonesianDate(isoDate: string): string {
  const months = [
    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
  ];
  try {
    const [y, m, d] = isoDate.split('-');
    const mIdx = parseInt(m, 10) - 1;
    return `${d} ${months[mIdx] || m} ${y}`;
  } catch {
    return isoDate;
  }
}

export const MonitoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateISO(new Date()));
  const [selectedShift, setSelectedShift] = useState<ShiftType>('SHIFT 1');

  const [areas, setAreas] = useState<Area[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [records, setRecords] = useState<MonitoringRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(true);

  // Load master data and records
  useEffect(() => {
    const loadedAreas = StorageService.getAreas();
    const loadedLines = StorageService.getLines();
    const loadedPositions = StorageService.getPositions();

    setAreas(loadedAreas);
    setLines(loadedLines);
    setPositions(loadedPositions);

    const loadRecords = async () => {
      setIsLoadingRecords(true);
      try {
        const loaded = await StorageService.getAllRecords(selectedDate);
        setRecords(loaded);
      } catch (err) {
        console.error('Error loading monitoring records', err);
      } finally {
        setIsLoadingRecords(false);
      }
    };

    loadRecords();
  }, [selectedDate]);

  // Lookup existing record for a specific position on a specific date
  const getMonitoringForPosition = useCallback(
    (date: string, areaId: string, lineId: string | undefined, positionId: string) => {
      return records.find((r) => {
        const matchDate = r.date === date;
        const matchArea = r.area_id === areaId;
        const matchLine = lineId ? r.line_id === lineId : !r.line_id;
        const matchPos = r.position_id === positionId;
        return matchDate && matchArea && matchLine && matchPos;
      });
    },
    [records]
  );

  // Submit new monitoring record
  const submitMonitoring = async (
    data: Omit<MonitoringRecord, 'id' | 'created_at'>
  ): Promise<MonitoringRecord> => {
    const newRecord: MonitoringRecord = {
      ...data,
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
    };

    await StorageService.saveRecord(newRecord);
    setRecords((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  // Line stats calculation
  const getLineStats = useCallback(
    (date: string, areaId: string, lineId: string) => {
      const activePositions = positions.filter(
        (p) => p.area_id === areaId && p.line_id === lineId && p.active
      );
      const total = activePositions.length;
      const total_points = activePositions.reduce((acc, p) => acc + (p.std_score || 0), 0);

      if (total === 0) {
        return {
          total: 0,
          completed: 0,
          percentage: 0,
          total_points: 0,
          earned_points: 0,
          points_percentage: 0,
        };
      }

      const completedPositions = activePositions.filter((pos) =>
        records.some(
          (r) =>
            r.date === date &&
            r.area_id === areaId &&
            r.line_id === lineId &&
            r.position_id === pos.id
        )
      );
      const completed = completedPositions.length;
      const earned_points = completedPositions.reduce((acc, p) => acc + (p.std_score || 0), 0);

      const percentage = Math.round((completed / total) * 100);
      const points_percentage =
        total_points > 0 ? Math.round((earned_points / total_points) * 100) : 0;

      return { total, completed, percentage, total_points, earned_points, points_percentage };
    },
    [positions, records]
  );

  // Area stats calculation
  const getAreaStats = useCallback(
    (date: string, areaId: string) => {
      const activePositions = positions.filter((p) => p.area_id === areaId && p.active);
      const total = activePositions.length;
      const total_points = activePositions.reduce((acc, p) => acc + (p.std_score || 0), 0);

      if (total === 0) {
        return {
          total: 0,
          completed: 0,
          percentage: 0,
          total_points: 0,
          earned_points: 0,
          points_percentage: 0,
        };
      }

      const completedPositions = activePositions.filter((pos) =>
        records.some(
          (r) =>
            r.date === date &&
            r.area_id === areaId &&
            (pos.line_id ? r.line_id === pos.line_id : true) &&
            r.position_id === pos.id
        )
      );
      const completed = completedPositions.length;
      const earned_points = completedPositions.reduce((acc, p) => acc + (p.std_score || 0), 0);

      const percentage = Math.round((completed / total) * 100);
      const points_percentage =
        total_points > 0 ? Math.round((earned_points / total_points) * 100) : 0;

      return { total, completed, percentage, total_points, earned_points, points_percentage };
    },
    [positions, records]
  );

  // Overall plant stats
  const getOverallStats = useCallback(
    (date: string): MonitoringStats => {
      const activePositions = positions.filter((p) => p.active);
      const total_positions = activePositions.length;
      const total_points = activePositions.reduce((acc, p) => acc + (p.std_score || 0), 0);

      const completedPositions = activePositions.filter((pos) =>
        records.some(
          (r) =>
            r.date === date &&
            r.area_id === pos.area_id &&
            (pos.line_id ? r.line_id === pos.line_id : true) &&
            r.position_id === pos.id
        )
      );
      const completed_positions = completedPositions.length;
      const earned_points = completedPositions.reduce((acc, p) => acc + (p.std_score || 0), 0);

      const remaining_positions = Math.max(0, total_positions - completed_positions);
      const completion_percentage =
        total_positions > 0 ? Math.round((completed_positions / total_positions) * 100) : 0;
      const points_percentage =
        total_points > 0 ? Math.round((earned_points / total_points) * 100) : 0;

      const area_stats = areas.map((area) => {
        const stats = getAreaStats(date, area.id);
        return {
          area_id: area.id,
          area_name: area.name,
          total: stats.total,
          completed: stats.completed,
          percentage: stats.percentage,
          total_points: stats.total_points,
          earned_points: stats.earned_points,
          points_percentage: stats.points_percentage,
        };
      });

      return {
        total_positions,
        completed_positions,
        remaining_positions,
        completion_percentage,
        total_points,
        earned_points,
        points_percentage,
        area_stats,
      };
    },
    [positions, records, areas, getAreaStats]
  );

  // Admin Master Data functions
  const addPosition = (posData: Omit<Position, 'id'>) => {
    const newPos: Position = {
      ...posData,
      id: `pos-custom-${Date.now()}`,
    };
    const updated = [...positions, newPos];
    setPositions(updated);
    StorageService.savePositions(updated);
  };

  const updatePosition = (id: string, updates: Partial<Position>) => {
    const updated = positions.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setPositions(updated);
    StorageService.savePositions(updated);
  };

  const deletePosition = (id: string) => {
    const updated = positions.filter((p) => p.id !== id);
    setPositions(updated);
    StorageService.savePositions(updated);
  };

  const addLine = (lineData: Omit<Line, 'id'>) => {
    const newLine: Line = {
      ...lineData,
      id: `line-custom-${Date.now()}`,
    };
    const updated = [...lines, newLine];
    setLines(updated);
    StorageService.saveLines(updated);
  };

  const updateLine = (id: string, updates: Partial<Line>) => {
    const updated = lines.map((l) => (l.id === id ? { ...l, ...updates } : l));
    setLines(updated);
    StorageService.saveLines(updated);
  };

  const resetAllData = async () => {
    setIsLoadingRecords(true);
    const fresh = await StorageService.resetAllToSeed(selectedDate);
    setRecords(fresh);
    setAreas(StorageService.getAreas());
    setLines(StorageService.getLines());
    setPositions(StorageService.getPositions());
    setIsLoadingRecords(false);
  };

  const jumpToDate = (offsetDays: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offsetDays);
    setSelectedDate(formatDateISO(current));
  };

  return (
    <MonitoringContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedShift,
        setSelectedShift,
        areas,
        lines,
        positions,
        records,
        isLoadingRecords,
        submitMonitoring,
        getMonitoringForPosition,
        getLineStats,
        getAreaStats,
        getOverallStats,
        addPosition,
        updatePosition,
        deletePosition,
        addLine,
        updateLine,
        resetAllData,
        jumpToDate,
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoring = () => {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
};
