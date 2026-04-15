// app/page.tsx
'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Header from './components/layouts/header';
import Stepper from './components/layouts/stepper';

import Step1Info from './components/pages/step1_info/index';
import Step2Matrix from './components/pages/step2_matrix/index';
import Step3Specification from './components/pages/step3_specification/index';
import Step4Finalization from './components/pages/step4_finalization/index';

export default function ExamGeneratorUI() {
  // Global Navigation State
  const [currentPageStep, setCurrentPageStep] = useState<number>(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(1);

  // Global Data State (Shared across steps)
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [matrixConfig, setMatrixConfig] = useState<any>([
    { id: 'I', label: 'Dạng I (4 lựa chọn)', values: [8, 4, 0, 0] },
    { id: 'II', label: 'Dạng II (Đúng/Sai)', values: [1, 1, 0, 0] },
    { id: 'III', label: 'Dạng III (Trả lời ngắn)', values: [1, 1, 2, 0] },
    { id: 'TL', label: 'Tự luận', values: [0, 0, 0, 0] },
  ]);
  const [extractedFormData, setExtractedFormData] = useState<any[] | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');

  // Router helpers
  const goToNextStep = (stepNumber: number) => {
    setCurrentPageStep(stepNumber);
    setMaxUnlockedStep((max) => Math.max(max, stepNumber));
  };

  const handlePrevPageStep = () => {
    setCurrentPageStep((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPageStep = () => {
    goToNextStep(currentPageStep + 1);
  };

  return (
    <div className="min-h-screen bg-[#f2fbf8] py-4 px-4 font-sans text-slate-800">
      <Header />

      <div className="max-w-6xl mx-auto space-y-6">

        <Stepper
          currentPageStep={currentPageStep}
          maxUnlockedStep={maxUnlockedStep}
          onStepClick={(stepId) => setCurrentPageStep(stepId)}
        />

        {/* ========================================================== */}
        {/* STEP 1: THÔNG TIN (General Info & Config) */}
        {/* ========================================================== */}
        {currentPageStep === 1 && (
          <Step1Info
            extractedFormData={extractedFormData}
            setExtractedFormData={setExtractedFormData}
            onMatrixGenerated={(html: string) => {
              setGeneratedHtml(html);
              handleNextPageStep();
            }}
            selectedLessonIds={selectedLessonIds}
            setSelectedLessonIds={setSelectedLessonIds}
            matrixConfig={matrixConfig}
            setMatrixConfig={setMatrixConfig}
          />
        )}

        {/* ========================================================== */}
        {/* STEP 2: MA TRẬN (Matrix Preview & Source Code) */}
        {/* ========================================================== */}
        {currentPageStep === 2 && (
          <Step2Matrix
            htmlData={generatedHtml}
            onNext={() => handleNextPageStep()}
            onBack={() => handlePrevPageStep()}
          />
        )}

        {/* ========================================================== */}
        {/* STEP 3: BẢNG ĐẶC TẢ (Specification Table) */}
        {/* ========================================================== */}
        {currentPageStep === 3 && (
          <Step3Specification
            onNext={() => handleNextPageStep()}
            onBack={() => handlePrevPageStep()}
          />
        )}

        {/* ========================================================== */}
        {/* STEP 4: ĐỀ THI (Final Generated Exam) */}
        {/* ========================================================== */}
        {currentPageStep === 4 && (
          <Step4Finalization
            onNext={() => alert("Tải đề thi... (chức năng tải sẽ được triển khai sau)")}
            onBack={() => handlePrevPageStep()}
          />
        )}

      </div>
    </div>
  );
}