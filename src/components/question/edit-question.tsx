"use client";

import { useState, useEffect } from "react";
import { Question } from "@/types/question"; // 경로와 이름이 정확한지 확인하세요!
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

const ALL_CATEGORIES = ["LOVE", "SOCIAL", "CAREER", "DREAM", "LIFE"];

interface EditQuestionDialogProps {
    question: Question | null; // null일 수 있음을 명시
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: (updatedQuestion: Question) => void;
}

export function EditQuestionDialog({ question, open, onOpenChange, onUpdate }: EditQuestionDialogProps) {
    // 이제 question이 확실히 존재한다고 가정하고 초기값을 직접 넣습니다.
    // (부모에서 question이 있을 때만 이 컴포넌트를 그리게 할 것이기 때문)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(question?.categories || []);
    const [availableCategories, setAvailableCategories] = useState<string[]>(
        ALL_CATEGORIES.filter(cat => !question?.categories?.includes(cat))
    );

    const handleSelect = (cat: string) => {
        setSelectedCategories(prev => [...prev, cat]);
        setAvailableCategories(prev => prev.filter(c => c !== cat));
    };

    const handleDeselect = (cat: string) => {
        setAvailableCategories(prev => [...prev, cat]);
        setSelectedCategories(prev => prev.filter(c => c !== cat));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!question) return; // Guard clause: 데이터가 없으면 진행 안 함

        const formData = new FormData(e.currentTarget);

        onUpdate({
            ...question,
            question: formData.get("question") as string,
            level: formData.get("level") as string,
            categories: selectedCategories,
        });

        onOpenChange(false);
    };

    // question이 없으면 렌더링하지 않음
    if (!question) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>질문 수정</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="question">질문 내용</Label>
                        <Input
                            id="question"
                            name="question"
                            defaultValue={question.question}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="level">난이도</Label>
                        <Select name="level" defaultValue={question.level}>
                            <SelectTrigger>
                                <SelectValue placeholder="난이도 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EASY">EASY</SelectItem>
                                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                                <SelectItem value="HARD">HARD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-3">
                        <Label>카테고리 설정</Label>
                        <div className="min-h-[42px] p-2 border rounded-md flex flex-wrap gap-2 bg-muted/20">
                            {selectedCategories.map(cat => (
                                <Badge key={cat} className="flex items-center gap-1 bg-primary text-primary-foreground">
                                    {cat}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeselect(cat);
                                        }}
                                        className="ml-1 hover:text-red-300 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {availableCategories.map(cat => (
                                <Badge
                                    key={cat}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-muted"
                                    onClick={() => handleSelect(cat)}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> {cat}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">수정 완료</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}