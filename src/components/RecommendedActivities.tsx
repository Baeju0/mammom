import {Link} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {User} from "@supabase/supabase-js";
import {
    Activity,
    fetchCombinedRecommended,
    fetchDefaultRecommended,
    getTodayGroupIds,
    hasWrittenToday
} from "../util/recommendUtils.ts";
import {supabase} from "../util/supabaseClient.ts";

export default function RecommendedActivities() {
    const [user, setUser] = useState<User|null>(null);
    const [hasDiary, setHasDiary] = useState<boolean|null>(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    // 컴포넌트 실행 시 유저 조회, 유저 로그인 상태 변화 구독
    useEffect(() => {
        supabase.auth.getUser().then(({data}) => {
            setUser(data.user ?? null);
        });
        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // 유저 변경 시마다 오늘 일기 작성 여부 체크
    useEffect(() => {
        if (user === null) {
            setHasDiary(false);
            return;
        }
        hasWrittenToday(user.id).then(setHasDiary);
    }, [user]);

    // 유저나 오늘 작성 일기가 없을 시 기본 추천, 반대로 있을 시 조합 추천 갱신
    const loadRecommend = useCallback(async () => {
        setLoading(true);
        let list: Activity[];

        if (!user || hasDiary === false) {
            list = await fetchDefaultRecommended();
        } else {
            const { emotionGroupId, symptomGroupId, weatherGroupId } = await getTodayGroupIds(user.id);
            list = await fetchCombinedRecommended(emotionGroupId, symptomGroupId, weatherGroupId);
            if (list.length === 0) {
                list = await fetchDefaultRecommended();
            }
        }

        setActivities(list);
        setLoading(false);
    }, [user, hasDiary]);

    useEffect(() => {
        if (hasDiary === null) return;
        loadRecommend();
    }, [hasDiary, loadRecommend]);

    if (loading) return <div>Loading...</div>

    return (
        <section className="flex flex-1 flex-col items-center h-full gap-4">
            {activities.map((activity) => (
            <Link
                key={activity.id}
                to={`/activities-detail/${activity.id}`}
                className="activity-recommend"
                style={{ letterSpacing: "0.02em" }}
            >
                {activity.activity_text}
            </Link>
            ))}
        </section>
    );
}
