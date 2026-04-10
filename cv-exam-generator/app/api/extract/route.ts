// import { NextResponse } from 'next/server';
// import { GoogleGenAI } from '@google/genai';

// // Initialize Gemini (Make sure you have GEMINI_API_KEY in your .env.local file)
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function POST(request: Request) {
//   try {
//     // 1. Receive the file from the frontend
//     const formData = await request.formData();
//     const file = formData.get('file') as File;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // 2. Extract text from the PDF
//     // (Note: You will need a library like 'pdf-parse' here to convert the File into a text string)
//     const pdfText = "extracted text goes here..."; 

//     // 3. Send to Gemini using the prompt we engineered earlier
//     const prompt = `
//       Bạn là một chuyên gia phân tích dữ liệu giáo dục.
//       Đọc dữ liệu sau và trả về JSON chuẩn xác...
//       (Dán prompt của bạn vào đây)
      
//       Dữ liệu: ${pdfText}
//     `;

//     const response = await ai.models.generateContent({
//         model: 'gemini-2.5-flash',
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json", // Forces Gemini to return valid JSON
//         }
//     });

//     // 4. Parse the response and send it back to the frontend
//     const extractedData = JSON.parse(response.text() || '[]');
    
//     return NextResponse.json({ data: extractedData }, { status: 200 });

//   } catch (error) {
//     console.error("Extraction error:", error);
//     return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
//   }
// }