// app/api/generate-matrix/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
    try {
        const { apiKey, model, lessonsData, matrixData } = await request.json();

        if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 401 });

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `Bạn là một hệ thống AI chuyên môn giáo dục. Nhiệm vụ của bạn là dựa vào Thông tin Chủ đề (Lessons) và Ma trận số lượng câu hỏi (Matrix) để sinh ra một bảng HTML Ma trận đề thi duy nhất.

        DỮ LIỆU ĐẦU VÀO:
        1. Bài học đã chọn: ${JSON.stringify(lessonsData)}
        2. Cấu trúc câu hỏi: ${JSON.stringify(matrixData)}

        YÊU CẦU ĐẦU RA:
        - MÃ HTML thuần (KHÔNG wrapper markdown như \`\`\`html)
        - Giữ nguyên CSS, cấu trúc <table>, <head>, <body> giống hệt như template bên dưới.
        - Tự động điền số lượng câu hỏi (TNKQ, Đúng-Sai, Trả lời ngắn) dựa vào "Cấu trúc câu hỏi" phân bổ theo từng "Bài học". Hãy chia đều hoặc hợp lý tỷ lệ điểm và Tỉ lệ % vào từng chương.

        TEMPLATE HTML MẪU (Hãy tuân thủ CSS và style này):
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: "Times New Roman", serif; font-size: 13pt; line-height: 1.3; margin: 20px; }
                h2 { text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
                th, td { border: 1px solid black; padding: 4px 6px; text-align: center; vertical-align: middle; }
                th { font-weight: bold; background-color: #f2f2f2; }
                .left-align { text-align: left; padding-left: 8px; }
                .bold { font-weight: bold; }
                .footer-note { margin-top: 10px; font-style: italic; }
            </style>
        </head>
        <body>
            <h2>MA TRẬN ĐỀ KIỂM TRA MÔN HỌC</h2>
            <table>...</table>
            <div class="footer-note">...</div>
        </body>
        </html>
        `;

        const response = await ai.models.generateContent({
            model: model || 'gemini-2.5-flash',
            contents: prompt,
        });

        let html = response.text || '';
        // Strip markdown formatting if AI mistakenly returns it
        if (html.startsWith('```html')) html = html.replace(/```html\n?/, '').replace(/```$/, '');

        return NextResponse.json({ html }, { status: 200 });

    } catch (error) {
        console.error("Matrix generation error:", error);
        return NextResponse.json({ error: "Thất bại khi sinh ma trận" }, { status: 500 });
    }
}