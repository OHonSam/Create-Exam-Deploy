'use client';

import { useState } from 'react';
import { Moon, Settings, RotateCcw, X, Key, Bot, Save } from 'lucide-react';

export default function Header() {
    // States
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [provider, setProvider] = useState('google');
    const [apiKey, setApiKey] = useState('');

    return (
        <>
            <header className="w-full bg-[#e8f7f2] border-b border-teal-100/60 px-6 py-3 flex items-center justify-between shadow-sm mb-8 relative z-10">

                {/* --- LEFT: LOGO & TITLE --- */}
                <div className="flex items-center gap-3">
                    {/* AI Circle Badge */}
                    <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold shadow-sm">
                        AI
                    </div>

                    {/* Title Text */}
                    <div className="flex flex-col">
                        <h1 className="text-teal-900 font-bold text-base uppercase tracking-wide leading-tight">
                            TẠO ĐỀ THI THEO YÊU CẦU
                        </h1>
                        <p className="text-teal-700/80 text-[11px] font-medium">
                            Phát triển bởi O(Handsome)
                        </p>
                    </div>
                </div>

                {/* --- RIGHT: ACTION BUTTONS --- */}
                <div className="flex items-center gap-3">

                    {/* Dark Mode Toggle */}
                    <button className="p-2 border border-teal-700/20 rounded-xl text-teal-800 bg-[#e8f7f2] hover:bg-teal-50 transition-colors shadow-sm">
                        <Moon className="w-4 h-4" />
                    </button>

                    {/* Settings Button (Cài đặt) */}
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-teal-700/20 rounded-xl text-teal-800 bg-[#d8f0e6] hover:bg-[#cbe8dc] transition-colors shadow-sm font-medium text-sm"
                    >
                        <Settings className="w-4 h-4" />
                        Cài đặt
                    </button>

                    {/* Reset/New Button (Tạo mới) */}
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-slate-700 bg-white hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm">
                        <RotateCcw className="w-4 h-4" />
                        Tạo mới
                    </button>

                </div>
            </header>

            {/* --- SETTINGS SHEET (SLIDE-OVER) --- */}

            {/* 1. Dark Overlay Background */}
            {/* Only renders when the menu is open to block clicks to the background */}
            {isSettingsOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsSettingsOpen(false)}
                ></div>
            )}

            {/* 2. The Sliding Panel */}
            {/* It remains in the DOM but translates completely off-screen (translate-x-full) when closed */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Sheet Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-teal-600" />
                        Cấu hình Hệ thống AI
                    </h2>
                    <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sheet Content (Forms) */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6 bg-white">

                    {/* Provider & Model Selection */}
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <Bot className="w-4 h-4 mr-2 text-teal-600" />
                                Nhà cung cấp & Model
                            </label>
                            <select
                                value={provider}
                                onChange={(e) => setProvider(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                            >
                                <option value="google">Google Gemini (Khuyên dùng)</option>
                                <option value="openai">OpenAI (ChatGPT)</option>
                            </select>
                        </div>

                        {/* Model Dropdown based on Provider */}
                        <div>
                            <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors">
                                {provider === 'google' ? (
                                    <>
                                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Nhanh, Rẻ)</option>
                                        <option value="gemini-2.5-pro">Gemini 2.5 Pro (Thông minh nhất)</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                                        <option value="gpt-4o">GPT-4o</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="h-px w-full bg-gray-100"></div>

                    {/* API Key Input */}
                    <div>
                        <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                            <Key className="w-4 h-4 mr-2 text-orange-500" />
                            API Key
                        </label>
                        <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                            Khóa API của bạn được lưu trữ an toàn ngay trên trình duyệt (Local Storage) và không bao giờ được gửi đến máy chủ của chúng tôi.
                        </p>
                        <input
                            type="password"
                            placeholder={provider === 'google' ? "Nhập Google AI Studio Key..." : "Nhập OpenAI API Key..."}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                        />

                        {/* Helper link to get API key */}
                        <a
                            href={provider === 'google' ? "https://aistudio.google.com/app/apikey" : "https://platform.openai.com/api-keys"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            &rarr; Nhấn vào đây để lấy {provider === 'google' ? 'Gemini API Key' : 'OpenAI API Key'} miễn phí
                        </a>
                    </div>

                </div>

                {/* Sheet Footer (Save Button) */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={() => {
                            // Later: Add logic here to save to localStorage
                            setIsSettingsOpen(false);
                        }}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-medium shadow-sm transition-colors flex items-center justify-center"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Lưu cấu hình
                    </button>
                </div>
            </div>
        </>
    );
}