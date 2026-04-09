import React from 'react';

export default function Stepper() {
    const steps = [
        { id: 1, label: 'Thông tin', active: true },
        { id: 2, label: 'Ma trận', active: false },
        { id: 3, label: 'Bảng đặc tả', active: false },
        { id: 4, label: 'Đề thi', active: false },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm py-4 px-8 flex items-center justify-between">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold 
            ${step.active ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {step.id}
                    </div>
                    <span className={`ml-3 font-medium ${step.active ? 'text-teal-700' : 'text-gray-400'}`}>
                        {step.label}
                    </span>
                    {index < steps.length - 1 && (
                        <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                    )}
                </div>
            ))}
        </div>
    );
}