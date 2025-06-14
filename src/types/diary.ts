export interface DiaryEntryInsert {
    title: string;
    content: string;
    entry_date: string;
    emotion_color_id?: number;
    symptom_id?: number;
    custom_emotion_color?: string;
    custom_symptom?: string;
    profile_id: string;
}

export interface DiaryEntry {
    id: number;
    title: string;
    content: string;
    entry_date: string;
    emotion_color_id?: number;
    symptom_id?: number;
    custom_emotion_color?: string;
    custom_symptom?: string;
    profile_id: string;
    created_at?: string;
    updated_at?: string;
}

