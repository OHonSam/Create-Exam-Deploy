'use client';

import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Step3SpecificationProps {
    onNext: () => void;
    onBack?: () => void;
}

export default function Step3Specification({ onNext, onBack }: Step3SpecificationProps) {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-teal-100">
                <h2 className="text-2xl font-bold text-teal-800 mb-4">Giao diện Bảng đặc tả</h2>

                <div className="flex justify-center gap-4 mt-8">
                    <button onClick={onBack} className="px-6 py-2.5 rounded-xl font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
                    </button>
                    <button onClick={onNext} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-colors flex items-center">
                        Tiếp theo: Sinh đề thi <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </div>
        </div>


    )
}