export interface Question {
    id: number;
    categories: string[];
    level: string;
    question: string; // 상세 조회 시 필요할 수 있음
    author: string;
    createdAt: string;
}

// 로컬 테스트용 Mock Data
export const questions: Question[] = [
    { id: 1, categories: ["LOVE"], level: "EASY", question: "사랑이 뭐라고 생각하나요?", author: "관리자", createdAt: "2026-02-10" },
    { id: 2, categories: ["SOCIAL", "CAREER"], level: "MEDIUM", question: "사회생활 잘하는 꿀팁이 있다면?", author: "관리자", createdAt: "2026-02-10" },
    { id: 3, categories: ["CAREER", "DREAM"], level: "HARD", question: "성공이란 무엇이라고 생각하나요?", author: "관리자", createdAt: "2026-02-10" },
];