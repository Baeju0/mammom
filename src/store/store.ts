import {create} from "zustand";
import {User} from "@supabase/supabase-js";

interface AppState {
    user: User | null;
    setUser: (user: User | null) => void;
    nickname: string;
    setNickname: (nickname: string) => void;
    locationAgreed: boolean;
    setLocationAgreed: (locationAgreed: boolean) => void;

    selectedColor: string;
    selectedSymptom: string;
    setSelectedColor: (color: string) => void;
    setSelectedSymptom: (symptom: string) => void;
}

export const useStore = create<AppState>((set) => ({
    user: null,
    nickname: "",
    locationAgreed: false,
    selectedColor: "",
    selectedSymptom: "",

    setUser: (user) => set(() => ({user})),
    setNickname: (nickname) => set(() => ({nickname})),
    setLocationAgreed: (locationAgreed) => set(() => ({locationAgreed})),
    setSelectedColor: (color) => set(({selectedColor: color})),
    setSelectedSymptom: (selectedSymptom) => set(({selectedSymptom}))
}))