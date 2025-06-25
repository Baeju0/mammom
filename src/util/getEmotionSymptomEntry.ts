import {EmotionColor} from "../store/store";
import {Symptom} from "../store/store";
import {DiaryEntry} from "../types/diary.ts";

export interface EmotionSymptomEntry {
    emotion: { name: string, hex_code: string }
    symptom: { name: string, emoji: string }
}

export function getEmotionSymptomEntry(
    entry: DiaryEntry,
    emotionColors: EmotionColor[],
    symptoms: Symptom[],
): EmotionSymptomEntry {
    // 감정 색상이 기본값인지 커스텀인지 찾기
    const emotionRecord = emotionColors.find((color) => color.id === entry.emotion_color_id!);
    const emotion = entry.custom_emotion_color && entry.custom_emotion_color.trim() !== ""
                    ? {name: "기타", hex_code: entry.custom_emotion_color}
                    : emotionRecord
                    ? {name: emotionRecord.name || "", hex_code: emotionRecord.hex_code}
                    : {name: "알 수 없음", hex_code: "#000000"};

    // 신체 증상이 기본값인지 커스텀인지 찾기
    const symptomRecord = symptoms.find((symptom) => symptom.id === entry.symptom_id!);
    const symptom = entry.custom_symptom && entry.custom_symptom.trim() !== ""
                    ? {name: entry.custom_symptom, emoji: "🤔"}
                    : symptomRecord
                    ? {name: symptomRecord.name, emoji: symptomRecord.emoji}
                    : {name: "알 수 없음", emoji: "🫥"}

    return {emotion, symptom};
}