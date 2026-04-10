import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';


export async function POST(request: Request) {
    try {
        // 1. Receive the file from the frontend
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const apiKey = formData.get('apiKey') as string;
        const model = formData.get('model') as string || 'gemini-2.5-flash'; // Fallback to flash

        const subject = formData.get('subject') as string;
        const grade = formData.get('grade') as string;
        const examType = formData.get('examType') as string;
        const duration = formData.get('duration') as string;

        if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        if (!apiKey) return NextResponse.json({ error: "Missing API Key. Vui lòng cài đặt API Key." }, { status: 401 });

        const ai = new GoogleGenAI({ apiKey });

        // 2. Extract text from the PDF
        // (Note: You will need a library like 'pdf-parse' here to convert the File into a text string)
        const pdfText = "extracted text goes here...";

        // 3. Send to Gemini using the srompt we engineered earlier
        const prompt = `Bạn là một hệ thống AI chuyên nghiệp xử lý dữ liệu giáo dục. Nhiệm vụ của bạn là phân tích đoạn text được trích xuất từ tài liệu Phân phối chương trình (PPCT) và chuyển đổi thành một mảng JSON tuân thủ nghiêm ngặt cấu trúc quy định.

THÔNG TIN NGỮ CẢNH:
- Môn học: ${subject}
- Khối lớp: ${grade}
- Loại kỳ thi: ${examType}
- Thời lượng: ${duration} phút
Hãy sử dụng ngữ cảnh này để nhận diện tên chương và bài học hợp lý, chính xác hơn.

QUY TẮC XỬ LÝ (QUAN TRỌNG):
1. Tính khái quát: Tài liệu có thể thuộc bất kỳ môn học nào. Nhóm chính có thể gọi là "Chương", "Chủ đề", "Phần", hoặc "Cụm chuyên đề". Hãy gán chúng thành \`chapterName\`.
2. Khắc phục lỗi ngắt dòng: Các tên bài học, mục hoặc dòng text thường bị đứt gãy khi trích xuất từ PDF. Hãy đọc hiểu ngữ cảnh và ghép chúng lại thành một \`lessonName\` trôi chảy, logic.
3. ID duy nhất: Khởi tạo \`id\` tự động và duy nhất cho từng đối tượng (Chương bắt đầu bằng "c" như "c1", "c2"... Bài học bắt đầu bằng "l" như "l1", "l2"...).
4. Phân bổ tiết & tuần: Lấy chính xác số tiết (\`periods\`) của từng bài học và tính tổng số tiết (\`totalPeriods\`) của chương. Trích xuất chuỗi thời gian tuần học (\`week\`, ví dụ: "Tuần 1", "Tuần 2-3").
5. Định dạng đầu ra: TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON. Không markdown, không giải thích.

CẤU TRÚC JSON BẮT BUỘC:
[
  {
    "id": "c1",
    "chapterName": "Tên chương / Chủ đề 1",
    "totalPeriods": 4,
    "lessons": [
      {
        "id": "l1",
        "lessonName": "Tên bài học hoặc nội dung chi tiết 1",
        "periods": 2,
        "week": "Tuần 1" 
      },
      {
        "id": "l2",
        "lessonName": "Tên bài học hoặc nội dung chi tiết 2",
        "periods": 2,
        "week": "Tuần 1-2" 
      }
    ]
  }
]

DỮ LIỆU PPCT ĐẦU VÀO:
"""
${pdfText}
"""
`;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json", // Forces Gemini to return valid JSON
            }
        });

        // 4. Parse the response and send it back to the frontend
        const extractedData = JSON.parse(response.text || '[]');

        return NextResponse.json({ data: extractedData }, { status: 200 });

    } catch (error) {
        console.error("Extraction error:", error);
        return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
    }
}