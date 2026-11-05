import { create } from "zustand";
type CareStore = { viewingPatientId: string | null; setViewingPatientId: (id: string | null) => void };
export const useCareStore = create<CareStore>((set) => ({ viewingPatientId: null, setViewingPatientId: (id) => set({ viewingPatientId: id }) }));