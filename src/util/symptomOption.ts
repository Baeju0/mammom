export interface SymptomOption {
    value: string;
    label: string;
    icon: React.ReactNode;
}

export const SYMPTOMS: SymptomOption[] = [
    { value: "두통", label: "두통", icon: "🤕" },
    { value: "복통", label: "복통", icon: "😫" },
    { value: "피로", label: "피로", icon: "😴" },
    { value: "근육통", label: "근육통", icon: "💪" },
    { value: "메스꺼움", label: "메스꺼움", icon: "🤢" },
    { value: "어지러움", label: "어지러움", icon: "😵‍💫" },
    { value: "불면", label: "불면", icon: "🥱" },
    { value: "식욕저하", label: "식욕저하", icon: "😑" },
    { value: "구토", label: "구토", icon: "🤮" },
    { value: "설사", label: "설사", icon: "😨" },
    { value: "없음", label: "없음", icon: "❌" },
    { value: "기타", label: "기타", icon: "🤔" },
];