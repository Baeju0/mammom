import {supabase} from "./supabaseClient.ts";

export interface ActivityDetail {
    reason: string;
    how: string;
    recommended_time: string;
    tip: string;
}

export interface Activity {
    id: number;
    activity_text: string;
    recommended_activity_detail: ActivityDetail | null;
}

// 기본 추천 활동 랜덤 추출
function shuffleActivities<T>(array: T[], count: number): T[] {
    return [...array].sort(() => 0.5 - Math.random()).slice(0, count);
}

// 오늘 일기 작성 여부 확인
export async function hasWrittenToday(
    profileId: string,
    date = new Date().toISOString().split("T")[0]
): Promise<boolean> {
    const {count, error} = await supabase
        .from("diary_entry")
        .select("id", {head: true, count: "exact"})
        .eq("profile_id", profileId)
        .eq("entry_date", date);

    if(error) {
        console.error("일기 작성 여부 조회 실패: ",error);
        return false;
    }
    return (count ?? 0) > 0;
}

// 오늘의 감정/증상/날씨 그룹 ID 조회
export async function getTodayGroupIds(
    profileId: string,
    date = new Date().toISOString().split("T")[0]
): Promise<{
    emotionGroupId: number | null;
    symptomGroupId: number | null;
    weatherGroupId: number | null;
}> {

    // 1. diary_entry 테이블에서 오늘의 감정, 증상, 작성 날짜만 조회
    const {data: diary, error} = await supabase
        .from("diary_entry")
        .select("emotion_color_id, symptom_id, entry_date")
        .eq("profile_id", profileId)
        .eq("entry_date", date)
        .single();
    if(error || !diary) {
        console.log("오늘의 감정, 증상 그룹 ID 조회 실패: ",error);
        return {emotionGroupId: null, symptomGroupId: null, weatherGroupId: null};
    }

    // 2. emotion_color, symptom에서 group_id 조회
    const [emotionResult, symptomResult] = await Promise.all([
        supabase
            .from("emotion_color")
            .select("group_id")
            .eq("id", diary.emotion_color_id)
            .single(),
        supabase
            .from("symptom")
            .select("group_id")
            .eq("id", diary.symptom_id)
            .single(),
    ]);

    // 3. weather_data 테이블에서 date 기준으로 날씨의 group_id 조회
    const weatherResult = await supabase
        .from("weather_data")
        .select("group_id")
        .eq("date", diary.entry_date)
        .single();

    return {
        emotionGroupId: emotionResult.error || !emotionResult.data ? null : emotionResult.data.group_id,
        symptomGroupId: symptomResult.error || !symptomResult.data ? null : symptomResult.data.group_id,
        weatherGroupId: weatherResult.error || !weatherResult.data ? null : weatherResult.data.group_id
    };
}

// 로그인 후 일기 저장 시 조합되어 있는 추천 활동 표시
export async function fetchCombinedRecommended(
    emotionGroupId: number | null,
    symptomGroupId: number | null,
    weatherGroupId: number | null,
): Promise<Activity[]> {
    if (weatherGroupId === null) return [];

    let query = supabase
        .from("recommended_activity")
        .select(`
            id,
            activity_text,
            recommended_activity_detail(
              reason,
              how,
              recommended_time,
              tip
            )`
        )
        .eq("weather_group_id", weatherGroupId);

    query = emotionGroupId !== null ? query.eq("emotion_group_id", emotionGroupId) : query.is("emotion_group_id", null);
    query = symptomGroupId !== null ? query.eq("symptom_group_id", symptomGroupId) : query.is("symptom_group_id", null);

    const {data, error} = await query;
    if (error || !data || data.length === 0) {
        console.error("추천 활동 조회 실패: ", error);
        return [];
    }

    // 조합 되어있는 추천 활동 그대로 리턴
    return data
        .map(item => {
        const detailArray = item.recommended_activity_detail;
        const detail = Array.isArray(detailArray) && detailArray.length > 0 ? detailArray[0] : null;
        return {
            id: item.id,
            activity_text: item.activity_text,
            recommended_activity_detail: detail,
        };
    });
}

// 로그인 전이나 일기 미작성 시 기본 추천 하루 1개 랜덤, localStorage에 저장
export async function fetchDefaultRecommended(): Promise<Activity[]> {
    const today = new Date().toISOString().split("T")[0];
    const key = 'dailyRecommended';

    // 캐시 확인하기
    try {
        const json = localStorage.getItem(key);
        if (json) {
            const parsed = JSON.parse(json) as {date: string; activities: Activity[]};
            if (parsed.date === today && Array.isArray(parsed.activities)) {
                return parsed.activities;
            }
        }
    } catch (e) {
        console.log(e);
    }

    // 기본 추천 활동 10개 조회
    const {data, error} = await supabase
        .from("recommended_activity")
        .select(`
            id,
            activity_text,
            recommended_activity_detail(
              reason,
              how,
              recommended_time,
              tip
            )`
        )
        .eq("is_default", true);

    if (error || !data) {
        console.error("기본 추천 활동 조회 실패: ", error);
        return [];
    }

    // 기본 추천 활동에서 무작위 1개 랜덤
    const randomRecommended = shuffleActivities(data.map(item => ({
        id: item.id,
        activity_text: item.activity_text,
        recommended_activity_detail: item.recommended_activity_detail[0],
    })), 1);

    try {
        localStorage.setItem(key, JSON.stringify({date: today, activities: randomRecommended}));
    } catch (e) {
        console.log(e);
    }
    return randomRecommended;
}