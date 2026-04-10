'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Header from './components/header'
import ExamInfoForm from './components/exam_info_form';
import Stepper from './components/stepper';
import ExamStructureMatrix from './components/exam_structure_matrix';
import ShortcutCards from './components/shortcut_card';
import TopicSelection from './components/exam_select_topic';


export default function ExamGeneratorUI() {
  // We will use this state later to track which files have been uploaded
  const [extractedFormData, setExtractedFormData] = useState<any[] | null>(null);

  return (


    // Main background matching the soft mint theme
    <div className="min-h-screen bg-[#f2fbf8] py-4 px-4 font-sans text-slate-800">
      <Header />

      <div className="max-w-5xl mx-auto space-y-6">

        <Stepper />
        <ShortcutCards />

        {/* --- DIVIDER --- */}
        <div className="flex items-center justify-center my-8">
          <div className="h-px bg-teal-100 flex-1 max-w-[100px]"></div>
          <span className="bg-white px-4 py-1 rounded-full text-xs font-bold text-teal-700 border border-teal-100 shadow-sm mx-4">
            HOẶC BẮT ĐẦU TỪ ĐẦU
          </span>
          <div className="h-px bg-teal-100 flex-1 max-w-[100px]"></div>
        </div>

        {/* Section 1: Always visible */}
        <ExamInfoForm
          onProcessSuccess={(data) => setExtractedFormData(data)}
        />

        {/* Section 2: Only renders when extractedFormData is available */}
        {extractedFormData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <TopicSelection data={extractedFormData} />
          </div>
        )}

        {/* Section 3: */}
        <ExamStructureMatrix />

        {/* --- SUBMIT BUTTON --- */}
        {/* Placed outside the white card, aligned to the right just like the design */}
        <div className="flex justify-end mt-6">
          <button className="bg-[#85c2b5] hover:bg-[#72b0a3] text-white px-6 py-3 rounded-xl font-medium flex items-center shadow-sm transition-colors">
            <ArrowRight className="w-5 h-5 mr-2" />
            Tạo Ma trận đề thi
          </button>
        </div>
      </div>
    </div>
  );
}