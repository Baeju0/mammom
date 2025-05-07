import Card from "../components/Card.tsx";
import {emotionData} from "../util/data.ts";
import {symptomTop3Data} from "../util/data.ts";
import {emotionSymptomRelationData} from "../util/data.ts";
import {weatherEmotionRelationData} from "../util/data.ts";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

// count는 차트를 위한 임시 값
// 값의 계산은 쿼리로 할 예정
export default function DataPage() {
    return (
        <div className="data-div">
            <Card title="최근 감정 추이" className="detail-data-card">
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={emotionData} margin={{right: 30, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date"/>
                        <YAxis domain={[2, 6]}/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="count" stroke="#FFD18D"/>
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card title="자주 겪는 신체 증상 Top3" className="detail-data-card">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={symptomTop3Data} margin={{right: 30, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="symptom"/>
                        <YAxis/>
                        <Tooltip/>
                        <Bar dataKey="count">
                            <Cell fill="#FFD18D" />
                            <Cell fill="#FFE6C4" />
                            <Cell fill="#FBCCD2" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card title="감정과 증상 연관성" className="detail-data-card">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={emotionSymptomRelationData} margin={{right: 30, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="symptom"/>
                        <YAxis/>
                        <Tooltip/>
                        <Bar dataKey="count">
                            <Cell fill="#FFE6C4" />
                            <Cell fill="#FFD18D" />
                            <Cell fill="#FBCCD2" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card title="날씨와 감정의 관계" className="detail-data-card">
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weatherEmotionRelationData} margin={{right: 30, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="weather"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="count" stroke="#FBCCD2"/>
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    )
}