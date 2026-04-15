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

        VÍ DỤ:
        VÍ DỤ:
        Bài học đã chọn: [
          {
            "id": "c4",
            "chapterName": "Chương 4: Hydrocarbon",
            "totalPeriods": 9,
            "lessons": [
              { "id": "l12", "lessonName": "Bài 12: Alkane", "periods": 4, "week": "Tuần 1,2" },
              { "id": "l13", "lessonName": "Bài 13: Hydrocarbon không no", "periods": 4, "week": "Tuần 3,4" },
              { "id": "l14", "lessonName": "Bài 14: Arene (Hydrocarbon thơm)", "periods": 1, "week": "Tuần 5" }
            ]
          },
          {
            "id": "c5",
            "chapterName": "Chương 5: Dẫn xuất Halogen - Alcohol - Phenol",
            "totalPeriods": 9,
            "lessons": [
              { "id": "l15", "lessonName": "Bài 15: Dẫn xuất Halogen", "periods": 2, "week": "Tuần 6" },
              { "id": "l16", "lessonName": "Bài 16: Alcohol", "periods": 5, "week": "Tuần 7,8,9" },
              { "id": "l17", "lessonName": "Bài 17: Phenol", "periods": 2, "week": "Tuần 10" }
            ]
          }
        ]

        Cấu trúc câu hỏi: [{"id": "I", "label": "Dạng I (4 lựa chọn)", "values": [8, 4, 0, 1]}, {"id": "II", "label": "Dạng II (Đúng - Sai)", "values": [1, 1, 0, 0]}, {"id": "III", "label": "Dạng III (Trả lời ngắn)", "values": [1, 1, 2, 0]}, {"id": "IV", "label": "Dạng IV (Tự luận)", "values": [0, 0, 0, 0]}]

        HTML đầu ra:
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
            <h2>MA TRẬN ĐỀ KIỂM TRA MÔN HÓA HỌC</h2>
            <table>
                <thead>
                    <tr>
                        <th rowspan="3">TT</th>
                        <th rowspan="3">Chương/Chủ đề</th>
                        <th rowspan="3">Nội dung / Đơn vị kiến thức</th>
                        <th colspan="12">Mức độ đánh giá</th>
                        <th rowspan="3">Tổng số câu</th>
                        <th rowspan="3">Tỉ lệ %</th>
                    </tr>
                    <tr>
                        <th colspan="3">Nhận biết</th>
                        <th colspan="3">Thông hiểu</th>
                        <th colspan="3">Vận dụng</th>
                        <th colspan="3">Vận dụng cao</th>
                    </tr>
                    <tr>
                        <th>I</th>
                        <th>II</th>
                        <th>III</th>
                        <th>I</th>
                        <th>II</th>
                        <th>III</th>
                        <th>I</th>
                        <th>II</th>
                        <th>III</th>
                        <th>I</th>
                        <th>II</th>
                        <th>III</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowspan="3">1</td>
                        <td rowspan="3" class="bold">Chương 4: Hydrocarbon</td>
                        <td class="left-align">Bài 12: Alkane</td>
                        <td>2</td>
                        <td>0</td>
                        <td>1</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>4</td>
                        <td rowspan="3">52%</td>
                    </tr>
                    <tr>
                        <td class="left-align">Bài 13: Hydrocarbon không no</td>
                        <td>1</td>
                        <td>1</td>
                        <td>0</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>4</td>
                    </tr>
                    <tr>
                        <td class="left-align">Bài 14: Arene (Hydrocarbon thơm)</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>1</td>
                    </tr>

                    <tr>
                        <td rowspan="3">2</td>
                        <td rowspan="3" class="bold">Chương 5: Dẫn xuất Halogen - Alcohol - Phenol</td>
                        <td class="left-align">Bài 15: Dẫn xuất Halogen</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>2</td>
                        <td rowspan="3">48%</td>
                    </tr>
                    <tr>
                        <td class="left-align">Bài 16: Alcohol</td>
                        <td>2</td>
                        <td>0</td>
                        <td>0</td>
                        <td>1</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td class="left-align">Bài 17: Phenol</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>2</td>
                    </tr>

                    <tr class="bold">
                        <td colspan="3">Tổng số câu</td>
                        <td>8</td>
                        <td>1</td>
                        <td>1</td>
                        <td>4</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>2</td>
                        <td>1</td>
                        <td>0</td>
                        <td>0</td>
                        <td>18</td>
                        <td>100%</td>
                    </tr>
                    <tr class="bold">
                        <td colspan="3">Tỉ lệ điểm</td>
                        <td colspan="3">40%</td>
                        <td colspan="3">30%</td>
                        <td colspan="3">20%</td>
                        <td colspan="3">10%</td>
                        <td></td>
                        <td>100%</td>
                    </tr>
                </tbody>
            </table>
            <div class="footer-note">
                * Chú thích: Dạng I: Trắc nghiệm 4 lựa chọn; Dạng II: Trắc nghiệm Đúng/Sai; Dạng III: Trắc nghiệm Trả lời ngắn.<br>
                * Tỉ lệ % được phân bổ dựa trên số tiết (Periods) của từng bài học và chương đã chọn.
            </div>
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