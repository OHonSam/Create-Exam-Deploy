'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, Download, ArrowRight, Code } from 'lucide-react';

interface ExamMatrixPageStepProps {
  htmlData: string;
  onNext: () => void;
}

export default function ExamMatrixPageStep({ htmlData, onNext }: ExamMatrixPageStepProps) {
  // Store the HTML locally so the user can manually edit the code if they want to
  const [localHtml, setLocalHtml] = useState(htmlData || '');

  // Keep it synced if the user re-generates from Step 1
  useEffect(() => {
    setLocalHtml(htmlData);
  }, [htmlData]);

  // Function to download the HTML file natively
  const handleDownloadHtml = () => {
    if (!localHtml) return;
    const blob = new Blob([localHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Ma_tran_de_thi.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#147a63] text-white flex items-center justify-center font-bold mr-3 ring-[6px] ring-[#147a63]/10">
            2
          </div>
          <h2 className="text-xl font-bold text-teal-800">Ma trận đề thi</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center text-sm font-medium text-slate-700 border border-slate-300 rounded-xl px-4 py-2 hover:bg-slate-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Upload Ma trận
          </button>
          
          <button className="flex items-center text-sm font-medium text-slate-700 border border-slate-300 rounded-xl px-4 py-2 hover:bg-slate-50 transition-colors">
            <FileText className="w-4 h-4 mr-2" />
            Tải Word (.doc)
          </button>
          
          <button 
            onClick={handleDownloadHtml}
            className="flex items-center text-sm font-medium text-slate-700 border border-slate-300 rounded-xl px-4 py-2 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Tải HTML
          </button>
          
          <button 
            onClick={onNext}
            className="flex items-center text-sm font-medium text-white bg-[#147a63] hover:bg-teal-800 rounded-xl px-5 py-2.5 transition-colors shadow-sm"
          >
            Tiếp theo: Bảng đặc tả
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Side-by-Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[650px]">
        
        {/* Left Panel: Source Code */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-slate-200">
          <div className="bg-slate-50 border-b border-slate-200 p-3 px-5 flex items-center">
            <Code className="w-4 h-4 text-slate-500 mr-2" />
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Source Code (HTML/Markdown)</h3>
          </div>
          <textarea
            value={localHtml}
            onChange={(e) => setLocalHtml(e.target.value)}
            className="flex-1 w-full p-5 font-mono text-sm text-slate-700 bg-[#f8fafc] resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500/50"
            spellCheck="false"
            placeholder="<!-- Chờ AI sinh dữ liệu... -->"
          />
        </div>

        {/* Right Panel: Preview Render */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-teal-100">
          <div className="bg-teal-50/50 border-b border-teal-100 p-3 px-5 flex items-center">
            <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wider">Xem trước</h3>
          </div>
          <div className="flex-1 overflow-hidden bg-white">
            {/* iframe safely renders the full document including <head> <style> rules */}
            <iframe 
              title="Matrix Preview"
              srcDoc={localHtml || `<html><body style="font-family: sans-serif; color: #94a3b8; text-align: center; margin-top: 50px;">Chưa có dữ liệu HTML...</body></html>`} 
              className="w-full h-full border-none"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

      </div>
    </div>
  );
}