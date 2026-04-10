Goal: Create a Next.js application that allows users to upload their custom in PDF format, extracts the text, and generates a technical/high school exam based on the content using a Large Language Model (LLM) like Google Gemini via API key.


# Step 1: Set Up Your Environment
1. **Install VS Code**: Download and install Visual Studio Code from [code.visualstudio.com](https://code.visualstudio.com/). 
1. **Create a Vercel Account**: Sign up at [Vercel](https://vercel.com/).
2. **Install Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/). Choose the LTS version for stability then choose Windows Installer.


# Step 2: Initialize the Project
Start by creating a new Next.js application. Open your terminal and run:

```bash
npx create-next-app@latest cv-exam-generator
cd cv-exam-generator
npm install pdf-parse @google/genai form-data
npm install lucide-react
```


# Step 3: Build the Frontend User Interface
cv-exam-generator\app\components: contains UI components.
cv-exam-generator\app\page.tsx: the main page.


# Step 4: Implement Document Processing
When dealing with resumes, formatting can be highly irregular. Applying layout-preserving techniques—similar to the document processing workflows used in VerbaDoc—will ensure accurate extraction of technical skills, timelines, and project descriptions from complex, multi-column PDFs.

Create an API route in Next.js (app/api/generate/route.ts) to handle the file upload and text extraction:

TypeScript
import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('cv') as File;
  
  if (!file) {
    return NextResponse.json({ error: "No CV uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Extract text from the PDF
  const data = await pdf(buffer);
  const cvText = data.text;

  // Next step: Send cvText to LLM
  // ...
}
Step 5: Integrate the LLM and Prompt Engineering
This is the core logic of the app. You need to craft a precise prompt that instructs the LLM to act as a technical examiner.

For example, if generating questions for a Viettel DSAI assessment, the prompt can be strictly constrained to evaluate practical problem-solving rather than just factual recall:

TypeScript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ... inside your POST handler after extracting cvText ...

const prompt = `
You are an expert technical interviewer. Review the following CV text:
"${cvText}"

Generate a 5-question technical exam based strictly on the skills and projects listed in this CV. 
If the candidate lists advanced topics like Graph Neural Networks or MLOps pipelines, drill down into architectural decisions and edge cases. 
Format the output as a JSON array containing objects with "question" and "expected_answer" keys.
`;

const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        responseMimeType: "application/json",
    }
});

const examData = JSON.parse(response.text());
return NextResponse.json({ exam: examData });
Step 5: Test and Deploy to Vercel
Test Locally: Run npm run dev and test uploading a sample CV to ensure the extraction and generation pipeline works smoothly.

Push to GitHub: Initialize a git repository, commit your code, and push it to a new GitHub repository.

Deploy:

Go to Vercel.com and log in.

Click "Add New" -> "Project" and import your GitHub repository.

In the Environment Variables section, add your GEMINI_API_KEY (or OpenAI key).

Click Deploy. Vercel will automatically build the Next.js app and provide you with a .vercel.app domain just like the one you shared.