'use client';

import { useState, useRef } from 'react';
import { Clock, Upload, File as FileIcon, X, Loader2, Sparkles } from 'lucide-react';

// Received properties from parent ExamGeneratorUI
interface ExamInfoFormProps {
    onProcessSuccess: (extractedData: any) => void;
}

export default function ExamInfoForm({ onProcessSuccess }: ExamInfoFormProps) {
    // State to hold the uploaded file
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false)

    // State for drag-and-drop visual feedback
    const [isDragging, setIsDragging] = useState(false);

    // Ref to programmatically click the hidden file input
    const fileInputRef = useRef<HTMLInputElement>(null);


    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [examType, setExamType] = useState('');
    const [duration, setDuration] = useState('45');


    // --- Drag and Drop Handlers ---
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Prevent browser from opening the file
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        // Check if files were dropped
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            validateAndSetFile(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            validateAndSetFile(file);
        }
    };

    // Helper to ensure it's a PDF or DOCX
    const validateAndSetFile = (file: File) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
            setUploadedFile(file);
        } else {
            alert("Vui lòng chỉ tải lên file .pdf hoặc .docx");
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent clicking the dropzone when clicking the X
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset input so same file can be re-selected if needed
        }
    };

    const handleExtractData = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!uploadedFile) { return; }

        const apiKey = localStorage.getItem('ai_apiKey') || '';
        const model = localStorage.getItem('ai_model') || 'gemini-2.5-flash';

        if (!apiKey) {
            alert("Vui lòng vào 'Cài đặt' để nhập API Key trước khi trích xuất.");
            return;
        }

        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);
            formData.append('apiKey', apiKey);
            formData.append('model', model);
            formData.append('subject', subject);
            formData.append('grade', grade);
            formData.append('examType', examType);
            formData.append('duration', duration);
            const response = await fetch('/api/extract', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error("API Call Failed");

            const result = await response.json();

            // 3. Pass the REAL data up to the parent!
            onProcessSuccess(result.data);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-8">
            
            {/* Header */}
            <div className="flex items-center mb-8">
                <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold mr-3">
                    1
                </div>
                <h2 className="text-xl font-bold text-teal-800">Thông tin chung & Upload PPCT</h2>
            </div>

            {/* Input Grid (Same as before) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">Môn học</label>
                    <select
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors appearance-none"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    >
                        <option>-- Chọn môn học --</option>
                        <option>Toán học</option>
                        <option>Vật lý</option>
                        <option>Hóa học</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">Khối lớp</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors appearance-none"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    >
                        <option>-- Chọn khối lớp --</option>
                        <option>Khối 10</option>
                        <option>Khối 11</option>
                        <option>Khối 12</option>
                    </select>

                </div>

                <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">Loại kiểm tra (Auto Filter)</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors appearance-none"
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                    >
                        <option>-- Chọn loại kiểm tra --</option>
                        <option>Giữa kỳ 1</option>
                        <option>Cuối kỳ 1</option>
                        <option>Giữa kỳ 2</option>
                        <option>Cuối kỳ 2</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">Thời gian (phút)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                        />
                    </div>
                </div>
            </div>
            {/* --- INTERACTIVE UPLOAD DROPZONE --- */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative
          ${isDragging
                        ? 'border-teal-500 bg-teal-50' // Highlight when dragging over
                        : 'border-teal-200/70 bg-[#f8fdfb] hover:bg-teal-50/50' // Default state
                    }
        `}
            >
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                />

                {uploadedFile ? (
                    // UI when a file IS selected
                    <div className="flex flex-col items-center w-full max-w-sm">
                        <div className="bg-white border border-teal-100 p-4 rounded-xl flex items-center justify-between w-full shadow-sm mb-2">
                            <div className="flex items-center overflow-hidden">
                                <FileIcon className="w-6 h-6 text-teal-600 flex-shrink-0 mr-3" />
                                <span className="text-sm font-medium text-slate-700 truncate">
                                    {uploadedFile.name}
                                </span>
                            </div>
                            <button
                                onClick={removeFile}
                                className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors ml-2 flex-shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {!isProcessing && <p className="text-xs text-teal-600 font-medium mb-2">Sẵn sàng trích xuất</p>}

                        <button
                            onClick={handleExtractData}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-colors flex items-center"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {isProcessing ? 'Đang trích xuất...' : 'Tiến hành trích xuất'}
                        </button>

                        {isProcessing && (
                            <div className="mt-6 flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-2">
                                <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-3" />
                                <p className="text-sm text-teal-800 font-medium">AI đang phân tích tài liệu...</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // UI when NO file is selected
                    <div className="flex flex-col items-center group">
                        <div className={`flex items-center font-medium text-lg mb-2 transition-colors
              ${isDragging ? 'text-teal-700' : 'text-teal-600 group-hover:text-teal-700'}
            `}>
                            <Upload className={`w-5 h-5 mr-2 ${isDragging ? 'animate-bounce' : ''}`} />
                            {isDragging ? "Thả file vào đây..." : "Upload File PPCT (.pdf, .docx)"}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 text-center">
                            <span className="mr-1">📌</span>
                            <span>Kéo thả hoặc nhấn vào để chọn file.<br />Hỗ trợ <strong>.pdf</strong> và <strong>.docx</strong>. Công thức toán MathType sẽ được tự động trích xuất.</span>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}