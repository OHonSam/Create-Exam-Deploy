import React from 'react';
import { Zap, Rocket, FileUp, ArrowRight, Hourglass } from 'lucide-react';

export default function ShortcutCards() {
    return (
        <>
            {/* --- BLUE SHORTCUT CARD (Ma trận) --- */}
            <div className="bg-[#eff6ff] border border-blue-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                <div>
                    <h3 className="flex items-center text-blue-700 font-bold text-lg mb-1">
                        <Zap className="w-5 h-5 mr-2 text-orange-500 fill-orange-500" />
                        Lối tắt: Bạn đã có file Ma trận?
                    </h3>
                    <p className="text-blue-600/80 text-sm">
                        Tải lên file Ma trận (HTML, Word, PDF) để bỏ qua các bước cấu hình và sinh ngay Bảng đặc tả.
                    </p>
                </div>
                <button className="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 px-6 py-2.5 rounded-lg font-medium flex items-center shadow-sm transition-colors">
                    <FileUp className="w-4 h-4 mr-2" />
                    Upload Ma trận & Đi tiếp
                </button>
            </div>

            {/* --- GREEN SHORTCUT CARD (Ma trận + Đặc tả) --- */}
            <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm">
                <h3 className="flex items-center text-teal-800 font-bold text-lg mb-1">
                    <Rocket className="w-5 h-5 mr-2 text-pink-500 fill-pink-500" />
                    Lối tắt: Bạn đã có file Ma trận + Đặc tả?
                </h3>
                <p className="text-teal-600/80 text-sm mb-6">
                    Tải lên cả 2 file để nhảy thẳng sang bước tạo đề thi!
                </p>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Upload Box 1 */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm mr-4">
                            <FileUp className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-700 text-sm">Chọn file Ma trận</p>
                            <p className="text-xs text-gray-400 mt-0.5">HTML, Word, PDF</p>
                        </div>
                    </div>

                    {/* Upload Box 2 */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm mr-4">
                            <FileUp className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-700 text-sm">Chọn file Đặc tả</p>
                            <p className="text-xs text-gray-400 mt-0.5">HTML, Word, PDF</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-orange-500 text-sm font-medium">
                        <Hourglass className="w-4 h-4 mr-2" />
                        Còn thiếu: Ma trận + Đặc tả
                    </div>
                    <button className="bg-[#71bba7] hover:bg-[#5fa390] text-white px-6 py-2.5 rounded-lg font-medium flex items-center shadow-sm transition-colors">
                        Xử lý & Tạo đề thi
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </>
    );
}