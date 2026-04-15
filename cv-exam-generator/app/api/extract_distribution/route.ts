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
        Hãy sử dụng ngữ cảnh này để nhận diện tên chương và bài học cần được chọn hợp lý, chính xác hơn.

        QUY TẮC XỬ LÝ (QUAN TRỌNG):
        1. Trích xuất toàn bộ: Trích xuất TOÀN BỘ các chương và bài học có trong tài liệu PPCT mà không bỏ sót. Nhóm chính gán thành \`chapterName\`.
        2. Khắc phục lỗi ngắt dòng: Ghép các dòng text bị đứt gãy thành một \`lessonName\` trôi chảy, logic.
        3. ID duy nhất: Khởi tạo \`id\` tự động (Chương bắt đầu bằng "c", Bài học bắt đầu bằng "l").
        4. Đánh giá độ phù hợp (selected): Dựa vào THÔNG TIN NGỮ CẢNH, hãy suy luận những bài học nào nằm trong phạm vi ôn thi hợp lý và thiết lập trường \`selected: true\`. Các bài học nằm ngoài phạm vi ngữ cảnh (ví dụ: bài học của học kỳ 2 nhưng kỳ thi là Giữa kỳ 1) thì thiết lập \`selected: false\` nhưng không được bỏ sót bài học ngoài phạm vi.
        5. Phân bổ tiết & tuần: Lấy chính xác số tiết (\`periods\`) và chuỗi thời gian tuần học (\`week\`).
        6. Định dạng đầu ra: TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON. Xin đừng trả về markdown blocks, không giải thích.

        CẤU TRÚC JSON BẮT BUỘC:
        [
          {
            "id": "c1",
            "subject": "Tên môn học",
            "chapterName": "Tên chương / Chủ đề 1",
            "totalPeriods": 4,
            "lessons": [
              {
                "id": "l1",
                "lessonName": "Tên bài học hoặc nội dung chi tiết 1",
                "periods": 2,
                "week": "Tuần 1",
                "selected": true
              },
              {
                "id": "l2",
                "lessonName": "Tên bài học hoặc nội dung ngoài phạm vi thi",
                "periods": 2,
                "week": "Tuần 15",
                "selected": false
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