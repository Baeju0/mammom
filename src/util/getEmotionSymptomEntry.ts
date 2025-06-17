import {EmotionColor} from "../store/store";
import {Symptom} from "../store/store";
import {DiaryEntry} from "../types/diary.ts";

export function getEmotionSymptomEntry(
    entry: DiaryEntry,
    emotionColors: EmotionColor[],
    symptoms: Symptom[],
) {
    const emotionRecord = emotionColors.find((color) => color.id === entry.emotion_color_id!);
    const emotion = entry.custom_emotion_color
        ? { name : "기타", hex_code : entry.custom_emotion_color}
        : { name: emotionRecord?.name ?? "", hex_code: emotionRecord?.hex_code ?? "#000000"};

    const symptomRecord = symptoms.find((symptom) => symptom.id === entry.symptom_id!);
    const symptom = entry.custom_symptom ? entry.custom_symptom : symptomRecord?.emoji ?? "🤔";

    return {emotion, symptom};
}