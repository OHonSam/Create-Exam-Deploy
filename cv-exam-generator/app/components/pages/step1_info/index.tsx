// app/components/pages/step1_info/index.tsx
'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import ShortcutCards from './shortcut_card';
import ExamInfoForm from './exam_select_info';
import TopicSelection from './exam_select_topic';
import ExamStructureMatrix from './exam_select_matrix';

interface Step1Props {
    extractedFormData: any[] | null;
    setExtractedFormData: (data: any[] | null) => void;
    onMatrixGenerated: (html: string) => void;
}

export default function Step1Info({
    extractedFormData,
    setExtractedFormData,
    onMatrixGenerated
}: Step1Props) {
    // Local State specific to Step 1
    const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
    const [matrixConfig, setMatrixConfig] = useState<any>(null);
    const [isGeneratingMatrix, setIsGeneratingMatrix] = useState(false);

    // The Generate API Call
    const handleGenerateMatrixSubmit = async () => {
        const apiKey = localStorage.getItem('ai_apiKey');
        const model = localStorage.getItem('ai_model');

        if (!extractedFormData || selectedLessonIds.length === 0) {
            alert("Vui lòng upload PPCT và chọn ít nhất 1 bài học.");
            return;
        }

        setIsGeneratingMatrix(true);

        try {
            // Filter out only the selected lessons to send to LLM
            const lessonsData = extractedFormData.map(chapter => ({
                ...chapter,
                lessons: chapter.lessons.filter((l: any) => selectedLessonIds.includes(l.id))
            })).filter(chapter => chapter.lessons.length > 0);

            const response = await fetch('/api/generate_matrix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    model,
                    lessonsData,
                    matrixData: matrixConfig
                })
            });

            if (!response.ok) throw new Error("API failed");

            const result = await response.json();

            // Pass the resulting HTML back to the parent router (page.tsx)
            // which will handle unlocking and navigating to Step 2
            onMatrixGenerated(result.html);

        } catch (err) {
            console.error(err);
            alert("Đã có lỗi xảy ra khi tạo ma trận!");
        } finally {
            setIsGeneratingMatrix(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out space-y-6">

            {/* Shortcuts */}
            <ShortcutCards />

            {/* Divider */}
            <div className="flex items-center justify-center my-8">
                <div className="h-px bg-teal-100 flex-1 max-w-[100px]"></div>
                <span className="bg-white px-4 py-1 rounded-full text-xs font-bold text-teal-700 border border-teal-100 shadow-sm mx-4">
                    HOẶC BẮT ĐẦU TỪ ĐẦU
                </span>
                <div className="h-px bg-teal-100 flex-1 max-w-[100px]"></div>
            </div>

            {/* Component 1: File Upload & General Info */}
            <ExamInfoForm onProcessSuccess={(data) => setExtractedFormData(data)} />

            {/* Component 2: Topic Selection (Only visible after upload) */}
            {extractedFormData && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                    <TopicSelection
                        data={extractedFormData}
                        onSelectionChange={setSelectedLessonIds}
                    />
                </div>
            )}

            {/* Component 3: Matrix Configuration */}
            <ExamStructureMatrix onChange={setMatrixConfig} />

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleGenerateMatrixSubmit}
                    disabled={isGeneratingMatrix}
                    className="bg-[#85c2b5] hover:bg-[#72b0a3] disabled:bg-slate-300 disabled:text-slate-500 text-white px-6 py-3 rounded-xl font-medium flex items-center shadow-sm transition-colors"
                >
                    {isGeneratingMatrix ? (
                        <>Đang sinh Ma trận... <Loader2 className="w-5 h-5 ml-2 animate-spin" /></>
                    ) : (
                        <>Tạo Ma trận đề thi <ArrowRight className="w-5 h-5 ml-2" /></>
                    )}
                </button>
            </div>

        </div>
    );
}