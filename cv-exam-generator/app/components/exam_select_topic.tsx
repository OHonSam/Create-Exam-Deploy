'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square, Filter } from 'lucide-react';

// This is the structure Gemini will return
const mockGeminiData = [
  {
    id: 'c1',
    chapterName: 'Chương 1. Ester - Lipid',
    totalPeriods: 4,
    lessons: [
      { id: 'l1', lessonName: 'Bài 1. Ester-Lipid', periods: 2, week: 'Tuần 1-1' },
      { id: 'l2', lessonName: 'Bài 2. Xà phòng và chất giặt rửa', periods: 1, week: 'Tuần 2-2' },
      { id: 'l3', lessonName: 'Bài 3. Ôn tập chương 1', periods: 1, week: 'Tuần 2-2' },
    ]
  },
  {
    id: 'c2',
    chapterName: 'Chương 2. Carbohydrate',
    totalPeriods: 6,
    lessons: [
      { id: 'l4', lessonName: 'Bài 4. Giới thiệu về carbohydrate. Glucose và fructose', periods: 2, week: 'Tuần 3-3' },
      { id: 'l5', lessonName: 'Bài 5. Saccharose và maltose', periods: 1, week: 'Tuần 4-4' },
      { id: 'l6', lessonName: 'Bài 6. Tinh bột và cellulose', periods: 2, week: 'Tuần 4-5' },
      { id: 'l7', lessonName: 'Bài 7. Ôn tập chương 2', periods: 1, week: 'Tuần 5-5' },
    ]
  }
];

interface Lesson {
  id: string;
  lessonName: string;
  periods: number;
  week: string;
}

interface Chapter {
  id: string;
  chapterName: string;
  totalPeriods: number;
  lessons: Lesson[];
}

interface TopicSelectionProps {
  data: Chapter[];
}

export default function TopicSelection({ data }: TopicSelectionProps) {
  // State to track which chapters are expanded/collapsed
  const [expandedChapters, setExpandedChapters] = useState<string[]>(['c1', 'c2']);

  // State to track which lessons are checked
  const [selectedLessons, setSelectedLessons] = useState<string[]>(['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7']);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId]
    );
  };

  const toggleLesson = (lessonId: string) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold mr-3">
            2
          </div>
          <h2 className="text-xl font-bold text-teal-800">Chọn chủ đề trọng tâm</h2>
        </div>
        <button className="flex items-center text-sm font-medium text-slate-700 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4 mr-2 text-teal-600" />
          Lọc theo kỳ
        </button>
      </div>

      {/* Topics List */}
      <div className="border border-teal-100 rounded-xl overflow-hidden bg-[#fbfdfc]">
        {data.map((chapter, index) => {
          const isExpanded = expandedChapters.includes(chapter.id);

          return (
            <div key={chapter.id} className={`${index !== 0 ? 'border-t border-teal-50' : ''}`}>

              {/* Chapter Header row */}
              <div className="flex items-center p-4 hover:bg-teal-50/50 transition-colors">
                <button onClick={() => toggleChapter(chapter.id)} className="mr-2 text-gray-400 hover:text-teal-600">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>

                {/* Checkbox for Chapter (Mocked as always checked for this UI) */}
                <CheckSquare className="w-5 h-5 text-blue-600 mr-3 rounded" />

                <span className="font-semibold text-teal-900 flex-1">{chapter.chapterName}</span>
                <span className="text-xs font-medium bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full">
                  {chapter.totalPeriods} tiết
                </span>
              </div>

              {/* Lessons rows (Expanded state) */}
              {isExpanded && (
                <div className="pb-3">
                  {chapter.lessons.map(lesson => {
                    const isSelected = selectedLessons.includes(lesson.id);
                    return (
                      <div key={lesson.id} className="flex items-center py-2.5 pl-14 pr-4 hover:bg-teal-50/30 transition-colors group cursor-pointer" onClick={() => toggleLesson(lesson.id)}>

                        {/* Lesson Checkbox */}
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600 mr-3" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-300 mr-3 group-hover:border-blue-400" />
                        )}

                        <span className={`text-sm flex-1 ${isSelected ? 'text-teal-800' : 'text-slate-500'}`}>
                          {lesson.lessonName}
                        </span>

                        {/* Badges */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded">
                            {lesson.periods} tiết
                          </span>
                          <span className="text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded">
                            {lesson.week}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}