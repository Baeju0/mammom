export default interface DiaryEntryPayload {
    title: string;
    content: string;
    entry_date: string;
    emotion_color_id?: number;
    symptom_id?: number;
    custom_emotion_color?: string;
    custom_symptom?: string;
    profile_id: string;
}