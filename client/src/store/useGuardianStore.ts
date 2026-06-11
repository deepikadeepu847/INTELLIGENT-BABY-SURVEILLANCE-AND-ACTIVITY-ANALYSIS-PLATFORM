import { create } from 'zustand';

interface Alert {
  id: string;
  type: string;
  severity: string;
  confidence: number;
  timestamp: string;
}

interface GuardianState {
  isMonitoring: boolean;
  activeRoomId: string | null;
  alerts: Alert[];
  user: any | null;
  heartRate: number;
  fanActive: boolean;
  fanMode: 'auto' | 'manual';
  
  setMonitoring: (status: boolean) => void;
  setRoom: (roomId: string) => void;
  addAlert: (alert: Alert) => void;
  clearAlerts: () => void;
  setHeartRate: (rate: number) => void;
  setFanActive: (status: boolean) => void;
  setFanMode: (mode: 'auto' | 'manual') => void;
}

export const useGuardianStore = create<GuardianState>((set) => ({
  isMonitoring: false,
  activeRoomId: 'demo-room-123',
  alerts: [],
  user: { name: 'John Doe', email: 'john@example.com', role: 'PARENT' },
  heartRate: 0,
  fanActive: false,
  fanMode: 'auto',

  setMonitoring: (status) => set({ isMonitoring: status }),
  setRoom: (roomId) => set({ activeRoomId: roomId }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 50) })),
  clearAlerts: () => set({ alerts: [] }),
  setHeartRate: (rate) => set({ heartRate: rate }),
  setFanActive: (status) => set({ fanActive: status }),
  setFanMode: (mode) => set({ fanMode: mode }),
}));

