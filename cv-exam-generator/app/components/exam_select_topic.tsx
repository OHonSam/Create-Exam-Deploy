'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square, Filter } from 'lucide-react';

interface Lesson {
  id: string;
  lessonName: string;
  periods: number;
  week: string;
  selected?: boolean;
}

interface Chapter {
  id: string;
  chapterName: string;
  totalPeriods: number;
  lessons: Lesson[];
}

interface TopicSelectionProps {
  data: Chapter[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export default function TopicSelection({ data, onSelectionChange }: TopicSelectionProps) {
  // State to track which chapters are expanded/collapsed
  const [expandedChapters, setExpandedChapters] = useState<string[]>(
    data.map(c => c.id)
  );

  // State to track which lessons are checked
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);

  useEffect(() => {
    const defaultSelected: string[] = [];
    data.forEach(chapter => {
      chapter.lessons.forEach(lesson => {
        if (lesson.selected) {
          defaultSelected.push(lesson.id);
        }
      });
    });
    setSelectedLessons(defaultSelected);
    onSelectionChange?.(defaultSelected);
  }, [data]);

  const toggleChapterView = (chapterId: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId]
    );
  };

  const toggleLesson = (lessonId: string) => {
    setSelectedLessons(prev => {
      const newSelected = prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId];
      onSelectionChange?.(newSelected);
      return newSelected;
    });
  };

  const toggleChapterSelection = (chapter: Chapter) => {
    const lessonIds = chapter.lessons.map(l => l.id);
    const isAllSelected = lessonIds.every(id => selectedLessons.includes(id));

    if (isAllSelected) {
      // If all are selected, unselect them all
      setSelectedLessons(prev => prev.filter(id => !lessonIds.includes(id)));
    } else {
      // If none or some are selected, select them all
      setSelectedLessons(prev => {
        const newSelected = new Set([...prev, ...lessonIds]);
        const finalArr = Array.from(newSelected);
        onSelectionChange?.(finalArr); // <--- NOTIFY PARENT
        return finalArr;
      });
    }
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
          const isChapterSelected =
            chapter.lessons.length > 0 &&
            chapter.lessons.every(lesson => selectedLessons.includes(lesson.id));

          return (
            <div key={chapter.id} className={`${index !== 0 ? 'border-t border-teal-50' : ''}`}>

              {/* Chapter Header row */}
              <div className="flex items-center p-4 hover:bg-teal-50/50 transition-colors">

                <button onClick={() => toggleChapterView(chapter.id)} className="mr-2 text-gray-400 hover:text-teal-600">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>

                {/* Checkbox for Chapter (Mocked as always checked for this UI) */}
                <button
                  onClick={() => toggleChapterSelection(chapter)}
                  className="flex items-center cursor-pointer group"
                >
                  {isChapterSelected ? (
                    <CheckSquare className="w-5 h-5 text-blue-600 mr-3" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-300 mr-3 group-hover:border-blue-400" />
                  )}
                </button>

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