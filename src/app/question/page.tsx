"use client";

import { useState } from "react";
import { questions as initialQuestions, Question } from "@/types/question";
import { AddQuestionDialog } from "@/components/question/add-question";
import { EditQuestionDialog } from "@/components/question/edit-question";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // 삭제 아이콘

export default function QuestionListPage() {
    const [data, setData] = useState<Question[]>(initialQuestions);

    // 현재 수정을 위해 선택된 질문 상태
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleRowClick = (question: Question) => {
        setEditingQuestion(question);
        setIsEditOpen(true);
    };

    const handleUpdate = (updatedQuestion: Question) => {
        setData(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
        setIsEditOpen(false);
    };

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // ⭐ 중요: Row 클릭 이벤트가 발생하는 것을 막음 (Event Bubbling 방지)
        if (confirm("정말 삭제하시겠습니까?")) {
            setData(prev => prev.filter(q => q.id !== id));
        }
    };

    return (
        <div className="p-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">질문 관리</h1>
                <AddQuestionDialog onAdd={(newQ) => setData([newQ, ...data])} />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>카테고리</TableHead>
                            <TableHead>난이도</TableHead>
                            <TableHead className="w-[400px]">질문</TableHead>
                            <TableHead>작성자</TableHead>
                            <TableHead>작성일</TableHead>
                            <TableHead className="text-right">삭제</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((q) => (
                            <TableRow
                                key={q.id}
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleRowClick(q)} // Row 전체 클릭 이벤트
                            >
                                <TableCell className="font-medium">{q.id}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        {q.categories.map(cat => <Badge key={cat} variant="secondary">{cat}</Badge>)}
                                    </div>
                                </TableCell>
                                <TableCell>{q.level}</TableCell>
                                <TableCell className="truncate max-w-[400px]">
                                    {q.question}
                                </TableCell>
                                <TableCell>{q.author}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    {q.createdAt}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={(e) => handleDelete(e, q.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* ⭐ 수정 모달 (테이블 밖에 하나만 배치) */}
            {editingQuestion && (
                <EditQuestionDialog
                    key={editingQuestion.id} // ⭐ 이 ID가 바뀔 때마다 컴포넌트가 완전히 새로고침됨
                    question={editingQuestion}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
}