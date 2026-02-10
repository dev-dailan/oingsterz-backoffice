"use client";

import { useState } from "react";
import { Question } from "@/types/question";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { X, Plus } from "lucide-react"; // 아이콘 라이브러리 (기본 설치됨)

interface AddQuestionDialogProps {
    onAdd: (newQuestion: Question) => void;
}

export function AddQuestionDialog({ onAdd }: AddQuestionDialogProps) {
    const [open, setOpen] = useState(false);

    // 1. 상태 관리: 선택된 카테고리와 선택 가능한 카테고리 분리
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [availableCategories, setAvailableCategories] = useState(["LOVE", "SOCIAL", "CAREER", "DREAM", "LIFE"]);

    // 2. 카테고리 선택 (아래 -> 위)
    const handleSelect = (cat: string) => {
        setSelectedCategories([...selectedCategories, cat]);
        setAvailableCategories(prev => prev.filter(c => c !== cat));
    };

    // 3. 카테고리 해제 (위 -> 아래)
    const handleDeselect = (cat: string) => {
        // 1. 선택 가능한 리스트에 다시 추가
        setAvailableCategories(prev => [...prev, cat]);
        // 2. 선택된 리스트에서 제거
        setSelectedCategories(prev => prev.filter(c => c !== cat));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newQuestion: Question = {
            id: Date.now(),
            question: formData.get("question") as string,
            level: formData.get("level") as string,
            categories: selectedCategories, // 선택된 배열 그대로 사용
            author: "관리자",
            createdAt: new Date().toISOString().split("T")[0],
        };

        onAdd(newQuestion);

        // 초기화
        setSelectedCategories([]);
        setAvailableCategories(["LOVE", "SOCIAL", "CAREER", "DREAM", "LIFE"]);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>새 질문 등록</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>새 질문 등록</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="question">질문 내용</Label>
                        <Input id="question" name="question" placeholder="질문을 입력하세요" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="level">난이도</Label>
                        <Select name="level" defaultValue="EASY">
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

                    {/* 카테고리 선택 영역 */}
                    <div className="grid gap-3">
                        <Label>카테고리 설정</Label>

                        {/* 선택된 카테고리 (Input 대용) */}
                        <div className="min-h-[42px] p-2 border rounded-md flex flex-wrap gap-2 bg-muted/20">
                            {selectedCategories.length === 0 && (
                                <span className="text-sm text-muted-foreground pt-1 pl-1">카테고리를 아래에서 선택하세요.</span>
                            )}
                            {selectedCategories.map(cat => (
                                <Badge
                                    key={cat}
                                    className="flex items-center gap-1 bg-primary text-primary-foreground"
                                >
                                    {cat}
                                    <button
                                        type="button" // form 제출 방지
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation(); // 이벤트 전파 방지
                                            handleDeselect(cat);
                                        }}
                                        className="ml-1 hover:text-red-300 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>

                        {/* 선택 가능한 카테고리 칩 */}
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
                        <Button type="submit" disabled={selectedCategories.length === 0}>
                            등록하기
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}