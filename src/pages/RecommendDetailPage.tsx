import {useNavigate, useParams} from "react-router-dom";
import Card from "../components/Card.tsx";
import {useEffect, useState} from "react";
import {ActivityDetailPage, fetchActivityDetail} from "../util/recommendUtils.ts";

export default function RecommendDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityDetailPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("유효하지 않은 활동입니다.");
            setLoading(false);
            return;
        }

        const activityId = Number(id);
        fetchActivityDetail(activityId)
            .then((data) => {
            setActivity(data);
            })
            .catch ((error) => {
            console.log("추천 활동 상세 조회 실패: ", error);
            setError("추천 활동 상세 조회 실패");
        })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>로딩 중...</div>
    if (error) return <div className="text-red-500">{error}</div>
    if (!activity) return <div>추천 활동 상세 조회 실패</div>

    return (
        <Card className="max-w-md mx-auto mt-5" backable={true} onBack={() => navigate(-1)}>

            <div className="space-y-6">
                <h2 className="activity-detail-title">{activity.activity_text}</h2>

                <div className="activity-detail-card">
                    <p className="activity-detail-sub-title">🫧 이 감정에 추천하는 이유</p>
                    <p className="activity-detail-text">- {activity.reason}</p>
                </div>

                <div className="activity-detail-card">
                    <p className="activity-detail-sub-title">⭐️ 어떻게 하면 좋을까요?</p>
                    <p className="activity-detail-text">- {activity.how}</p>
                </div>

                <div className="activity-detail-card">
                    <span className="activity-detail-sub-title">🕰️ 추천 시간대</span>
                    <p className="activity-detail-text">- {activity.recommended_time}</p>
                </div>

                <div className="activity-detail-card">
                    <p className="activity-detail-sub-title">💡 팁!</p>
                    <p className="activity-detail-text">- {activity.tip}</p>
                </div>
            </div>
        </Card>
    );
}