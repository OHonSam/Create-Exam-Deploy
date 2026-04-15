import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
    currentPageStep: number;
    maxUnlockedStep?: number;
    onStepClick?: (stepId: number) => void;
}

export default function Stepper({
    currentPageStep,
    maxUnlockedStep = 1,
    onStepClick
}: StepperProps) {
    const steps = [
        { id: 1, label: 'Thông tin' },
        { id: 2, label: 'Ma trận' },
        { id: 3, label: 'Bảng đặc tả' },
        { id: 4, label: 'Đề thi' },
    ];

    return (
        // Adjusted to be rounded-full to exactly match the pill-shape in the design
        <div className="bg-white rounded-full shadow-sm py-4 px-10 flex items-center justify-center w-full">
            {steps.map((step, index) => {
                const isCompleted = step.id < currentPageStep;
                const isCurrent = step.id === currentPageStep;
                const isUnlocked = step.id <= maxUnlockedStep;

                return (
                    <React.Fragment key={step.id}>
                        {/* Step Item */}
                        <div
                            className={`flex items-center transition-all ${isUnlocked ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'}`}
                            onClick={() => isUnlocked && onStepClick?.(step.id)}
                        >
                            <div className="relative flex items-center justify-center">
                                {isCompleted ? (
                                    // Completed UI: White background, green ring, green checkmark icon
                                    <div className="w-8 h-8 rounded-full border-2 border-teal-500 bg-white flex items-center justify-center text-teal-600">
                                        <Check className="w-5 h-5" strokeWidth={3} />
                                    </div>
                                ) : isCurrent ? (
                                    // Current UI: Filled teal background, white text, faint teal glowing ring
                                    <div className="w-8 h-8 rounded-full bg-[#147a63] text-white flex items-center justify-center font-bold ring-[6px] ring-[#147a63]/10">
                                        {step.id}
                                    </div>
                                ) : (
                                    // Future/Locked UI: Gray outline, empty white background, gray text
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-white text-gray-300 flex items-center justify-center font-bold">
                                        {step.id}
                                    </div>
                                )}
                            </div>

                            <span className={`ml-3 font-bold whitespace-nowrap text-sm mt-0.5 ${isCompleted || isCurrent ? 'text-[#147a63]' : 'text-gray-300'}`}>
                                {step.label}
                            </span>
                        </div>

                        {/* Connecting Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 mx-4 max-w-[80px] lg:max-w-[120px]">
                                <div className={`h-1 rounded-full transition-colors duration-300 ${step.id < currentPageStep
                                    ? 'bg-[#29bf9b]' // Brighter green line for completed segment
                                    : 'bg-gray-100'  // Gray line for upcoming segment
                                    }`}></div>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}