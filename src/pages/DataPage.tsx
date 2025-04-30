import Card from "../components/Card.tsx";

export default function DataPage() {
    return (
        <div className="data-div">
            <Card title="최근 감정 추이 (라인 차트)" className="data-card">차트</Card>
            <Card title="자주 겪는 신체 증상 Top3 (바 차트)" className="data-card">차트</Card>
            <Card title="감정과 증상 연관성 (그룹형 막대 차트)" className="data-card">차트</Card>
            <Card title="날씨와 감정의 관계 (라인 차트)" className="data-card">차트</Card>
        </div>
    )
}