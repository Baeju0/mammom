import {create} from "zustand";

interface AppState {
    selectedColor: string;
    selectedSymptom: string;
    setSelectedColor: (color: string) => void;
    setSelectedSymptom: (symptom: string) => void;
}

export const useStore = create<AppState>((set) => ({
    selectedColor: "",
    selectedSymptom: "",
    setSelectedColor: (color) => set(({selectedColor: color})),
    setSelectedSymptom: (selectedSymptom) => set(({selectedSymptom}))
}))