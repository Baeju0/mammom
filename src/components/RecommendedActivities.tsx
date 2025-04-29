import {Link} from "react-router-dom";

interface Activity {
    title: string;
    id: string;
}

export default function RecommendedActivities() {
    // 예시 데이터
    const activity: Activity[] = [
        { title: "🍵 따뜻한 차 마시기", id: "tea"},
        { title: "🚶 산책하기", id: "walk"},
    ]

    return (
        <section className="flex flex-1 flex-col items-center h-full gap-4">
            {activity.map((activity) => (
            <Link
                key={activity.id}
                to={`/activities-detail/${activity.id}`}
                className="activity-recommend"
                style={{ letterSpacing: "0.02em" }}
            >
                {activity.title}
            </Link>
            ))}
        </section>
    );
}