import {create} from "zustand";
import {User} from "@supabase/supabase-js";

interface AppState {
    user: User | null;
    setUser: (user: User | null) => void;
    nickname: string;
    setNickname: (nickname: string) => void;

    selectedColor: string;
    selectedSymptom: string;
    setSelectedColor: (color: string) => void;
    setSelectedSymptom: (symptom: string) => void;
}

export const useStore = create<AppState>((set) => ({
    user: null,
    nickname: "",
    selectedColor: "",
    selectedSymptom: "",

    setUser: (user) => set(() => ({user})),
    setNickname: (nickname) => set(() => ({nickname})),
    setSelectedColor: (color) => set(({selectedColor: color})),
    setSelectedSymptom: (selectedSymptom) => set(({selectedSymptom}))
}))