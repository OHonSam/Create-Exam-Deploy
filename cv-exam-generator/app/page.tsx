// app/page.tsx
'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import Header from './components/header'
import ExamInfoForm from './components/exam_info_form';
import Stepper from './components/stepper';
import ShortcutCards from './components/shortcut_card';
import TopicSelection from './components/exam_select_topic';
import ExamStructureMatrix from './components/exam_structure_matrix';
import ExamMatrixPageStep from './components/exam_display_matrix_page_step';
// import ExamSpecificationPageStep from './components/exam_specification_page_step';
// import ExamFinalPageStep from './components/exam_final_page_step';

export default function ExamGeneratorUI() {
  // Application State
  const [currentPageStep, setCurrentPageStep] = useState<number>(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(1);

  // Track Step 1 data
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [matrixConfig, setMatrixConfig] = useState<any>(null);
  const [extractedFormData, setExtractedFormData] = useState<any[] | null>(null);

  // Track Step 2 Generation state
  const [isGeneratingMatrix, setIsGeneratingMatrix] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');

  // Handlers for navigating between steps
  const handleNextPageStep = () => {
    setCurrentPageStep((prev) => {
      const nextStep = Math.min(prev + 1, 4);
      // Unlock the new step if it's the furthest they've reached
      setMaxUnlockedStep((max) => Math.max(max, nextStep));
      return nextStep;
    });
  };

  const handlePrevPageStep = () => {
    setCurrentPageStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepId: number) => {
    setCurrentPageStep(stepId);
  };

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
        body: JSON.stringify({ apiKey, model, lessonsData, matrixData: matrixConfig })
      });

      if (!response.ok) throw new Error("API failed");
      const result = await response.json();

      setGeneratedHtml(result.html);

      // Navigate to step 2 after success
      const nextStep = 2;
      setCurrentPageStep(nextStep);
      setMaxUnlockedStep((max) => Math.max(max, nextStep));

    } catch (err) {
      console.error(err);
      alert("Đã có lỗi xảy ra khi tạo ma trận!");
    } finally {
      setIsGeneratingMatrix(false);
    }
  };

  return (
    // Main background matching the soft mint theme
    <div className="min-h-screen bg-[#f2fbf8] py-4 px-4 font-sans text-slate-800">
      <Header />

      {/* Increased container width to accommodate side-by-side layouts in later steps */}
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Pass currentStep to Stepper so it can highlight the correct progress bead */}
        <Stepper
          currentPageStep={currentPageStep}
          maxUnlockedStep={maxUnlockedStep}
          onStepClick={(stepId) => handleStepClick(stepId)}
        />

        {/* ========================================================== */}
        {/* STEP 1: THÔNG TIN (General Info & Config) */}
        {/* ========================================================== */}
        {currentPageStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out space-y-6">
            <ShortcutCards />

            <div className="flex items-center justify-center my-8">
              <div className="h-px bg-teal-100 flex-1 max-w-[100px]"></div>
              <span className="bg-white px-4 py-1 rounded-full text-xs font-bold text-teal-700 border border-teal-100 shadow-sm mx-4">
                HOẶC BẮT ĐẦU TỪ ĐẦU
              </span>
              <div className="h-px bg-teal-100 flex-1 max-w-[100px]"></div>
            </div>

            <ExamInfoForm onProcessSuccess={(data) => setExtractedFormData(data)} />

            {extractedFormData && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                <TopicSelection
                  data={extractedFormData}
                  onSelectionChange={setSelectedLessonIds}
                />
              </div>
            )}

            <ExamStructureMatrix />

            <div className="flex justify-end mt-6">
              <button
                onClick={handleGenerateMatrixSubmit}
                className="bg-[#85c2b5] hover:bg-[#72b0a3] text-white px-6 py-3 rounded-xl font-medium flex items-center shadow-sm transition-colors"
              >
                {isGeneratingMatrix ? (
                  <>Đang sinh Ma trận... <Loader2 className="w-5 h-5 ml-2 animate-spin" /></>
                ) : (
                  <>Tạo Ma trận đề thi <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* STEP 2: MA TRẬN (Matrix Preview & Source Code) */}
        {/* ========================================================== */}
        {currentPageStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
            <ExamMatrixPageStep
              htmlData={generatedHtml}
              onNext={() => {
                const next = 3;
                setCurrentPageStep(next);
                setMaxUnlockedStep((max) => Math.max(max, next));
              }}
            />
          </div>
        )}

        {/* ========================================================== */}
        {/* STEP 3: BẢNG ĐẶC TẢ (Specification Table) */}
        {/* ========================================================== */}
        {currentPageStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
            {/* Replace this placeholder with <ExamSpecificationStep /> */}
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-teal-100">
              <h2 className="text-2xl font-bold text-teal-800 mb-4">Giao diện Bảng đặc tả</h2>

              <div className="flex justify-center gap-4 mt-8">
                <button onClick={handlePrevPageStep} className="px-6 py-2.5 rounded-xl font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
                </button>
                <button onClick={handleNextPageStep} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-colors flex items-center">
                  Tiếp theo: Sinh đề thi <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* STEP 4: ĐỀ THI (Final Generated Exam) */}
        {/* ========================================================== */}
        {currentPageStep === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
            {/* Replace this placeholder with <ExamFinalStep /> */}
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-teal-100">
              <h2 className="text-2xl font-bold text-teal-800 mb-4">Giao diện Đề thi hoàn chỉnh</h2>

              <div className="flex justify-center gap-4 mt-8">
                <button onClick={handlePrevPageStep} className="px-6 py-2.5 rounded-xl font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Chỉnh sửa Đặc tả
                </button>
                <button onClick={() => alert('Xuất file thành công!')} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-colors mt-0">
                  Xuất File Word
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}