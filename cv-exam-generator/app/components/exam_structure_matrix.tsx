import React from 'react';

export default function ExamStructureMatrix() {
    const cols = ['Biết', 'Hiểu', 'Vận dụng', 'VD cao'];
    const rows = [
        { label: 'Dạng I (4 lựa chọn)', values: [8, 4, 0, 0] },
        { label: 'Dạng II (Đúng/Sai)', values: [1, 1, 0, 0] },
        { label: 'Dạng III (Trả lời ngắn)', values: [1, 1, 2, 0] },
        { label: 'Tự luận', values: [0, 0, 0, 0] },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* Header */}
            <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold mr-3">
                    3
                </div>
                <h2 className="text-xl font-bold text-teal-800">Cấu trúc đề thi (Số lượng câu hỏi)</h2>
            </div>

            {/* Matrix Container */}
            <div className="bg-[#f4fbf8] border border-teal-100/50 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-col md:flex-row md:items-center gap-4">

                        {/* Row Label */}
                        <div className="md:w-1/4 font-medium text-teal-700/90 text-sm sm:text-base">
                            {row.label}
                        </div>

                        {/* Inputs Grid */}
                        <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {row.values.map((val, colIndex) => (
                                <div key={colIndex}>
                                    <label className="block text-[11px] sm:text-xs font-medium text-teal-500 mb-1.5">
                                        {cols[colIndex]}
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue={val}
                                        min="0"
                                        className="w-full border border-teal-100 rounded-xl px-3 py-2.5 text-center text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                                    />
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}