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


# Step 5: Deploy:

Go to Vercel.com and log in.

Click "Add New" -> "Project" and import your GitHub repository.

In the Environment Variables section, add your GEMINI_API_KEY (or OpenAI key).

Click Deploy. Vercel will automatically build the Next.js app and provide you with a .vercel.app domain just like the one you shared.

# Folder Structure:
- cv-exam-generator/
  - app/
    - api/
      - extract/route.ts (API route for text extraction and processing)
    - components/
      - stepper.tsx (Component for displaying the step-by-step progress)
      - exam_info_form.tsx (Component for file upload and exam info input)
      - exam_select_topic.tsx (Component for selecting topics from extracted data)
    - page.tsx (Main page that integrates components and manages state)
  - public/ (Static assets like images or icons)
  - styles/ (Global CSS or Tailwind configuration if needed)
  - package.json (Project dependencies and scripts)
  - README.md (Project documentation)