import {Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

// 감정 색상 Top5, 예시 데이터
const emotionTop5 = [
    { emotion: "노랑", count: 10, color: "#FFE066" },
    { emotion: "초록", count: 7, color: "#B2F2BB" },
    { emotion: "파랑", count: 5, color: "#74C0FC" },
    { emotion: "빨강", count: 3, color: "#FF6B6B" },
    { emotion: "회색", count: 2, color: "#CED4DA" },
];

export default function DataChart() {
    return (
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={emotionTop5} margin={{right: 30, bottom: 8}}>
                    <XAxis dataKey="emotion" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count">
                        {emotionTop5.map((emotion) => (
                            <Cell key={emotion.emotion} fill={emotion.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
    );
}