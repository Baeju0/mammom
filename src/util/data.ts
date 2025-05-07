// 테스트용 데이터임

// 1. 최근 감정 추이 차트를 위한 데이터
export interface EmotionData {
    date: string;
    emotion: string;
    count: number;
}

export const emotionData: EmotionData[] = [
    { date: "2025-05-01", emotion: "기쁨", count: 5},
    { date: "2025-05-02", emotion: "기쁨", count: 5},
    { date: "2025-05-03", emotion: "슬픔", count: 2},
    { date: "2025-05-04", emotion: "평온", count: 3},
    { date: "2025-05-05", emotion: "슬픔", count: 2},
]

// 2. 자주 겪는 신체 증상 Top3
export interface SymptomTop3Data {
    symptom: string;
    count: number;
}

export const symptomTop3Data: SymptomTop3Data[] = [
    { symptom: "피로", count: 10},
    { symptom: "두통", count: 7},
    { symptom: "복통", count: 5},
]

// 3. 감정과 증상 연관성
export interface EmotionSymptomRelationData {
    symptom: string;
    emotion: string;
    count: number;
}

export const emotionSymptomRelationData: EmotionSymptomRelationData[] = [
    { symptom: "피로", emotion: "평온", count: 5},
    { symptom: "두통", emotion: "슬픔", count: 10},
    { symptom: "복통", emotion: "화남", count: 7},
]

// 4. 날씨와 감정의 관계
export interface WeatherEmotionData {
    date: string;
    emotion: string;
    weather: string;
    count: number;
}

export const weatherEmotionRelationData: WeatherEmotionData[] = [
    { date: "2025-05-01", emotion: "기쁨", weather: "맑음", count: 4},
    { date: "2025-05-02", emotion: "슬픔", weather: "흐림", count: 2},
    { date: "2025-05-03", emotion: "우울", weather: "비", count: 3},
]