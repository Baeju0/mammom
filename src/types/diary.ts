export interface DiaryEntryInsert {
    title: string;
    content: string;
    entry_date: string;
    emotion_color_id?: number | null;
    symptom_id?: number | null;
    custom_emotion_color?: string | null;
    custom_symptom?: string | null;
    profile_id: string;
}

export interface DiaryEntry {
    id: number;
    title: string;
    content: string;
    entry_date: string;
    emotion_color_id?: number | null;
    symptom_id?: number | null;
    custom_emotion_color?: string | null;
    custom_symptom?: string | null;
    profile_id: string;
    created_at?: string;
    updated_at?: string;
}

