import {create} from "zustand";
import {User} from "@supabase/supabase-js";
import {supabase} from "../util/supabaseClient";

interface EmotionColor {
    id: number;
    name: string;
    hex_code: string;
}

interface Symptom {
    id: number;
    name: string;
    emoji: string;
}

interface AppState {
    // 유저 상태
    user: User | null;
    setUser: (user: User | null) => void;
    nickname: string;
    setNickname: (nickname: string) => void;
    locationAgreed: boolean;
    setLocationAgreed: (locationAgreed: boolean) => void;

    // 선택 상태 (감정, 증상)
    selectedColor: string;
    selectedSymptom: string;
    setSelectedColor: (color: string) => void;
    setSelectedSymptom: (symptom: string) => void;

    // 기본 데이터
    emotionColors: EmotionColor[];
    symptoms: Symptom[];
    baseDataLoading: boolean;
    setBaseDataLoading: (loading: boolean) => void;
    fetchBaseData: () => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
    user: null,
    nickname: "",
    locationAgreed: false,
    selectedColor: "",
    selectedSymptom: "",

    setUser: (user) => set({user}),
    setNickname: (nickname) => set({nickname}),
    setLocationAgreed: (locationAgreed) => set({locationAgreed}),
    setSelectedColor: (color) => set({selectedColor: color}),
    setSelectedSymptom: (selectedSymptom) => set({selectedSymptom}),
    setBaseDataLoading: (baseDataLoading) => set({baseDataLoading}),

    emotionColors: [],
    symptoms: [],
    baseDataLoading: false,
    fetchBaseData: async () => {
        set({baseDataLoading: true});

        const { data: emotionData, error: emotionError } = await supabase
            .from("emotion_color")
            .select("id, name, hex_code")
            .eq('is_default', true);
        if (emotionError) console.log(emotionError);

        const { data: symptomData, error: symptomError } = await supabase
            .from("symptom")
            .select("id, name, emoji")
            .eq("is_default", true);
        if (symptomError) console.log(symptomError);

        set({
            emotionColors: emotionData || [],
            symptoms: symptomData || [],
            baseDataLoading: false,
        });
    }
}))