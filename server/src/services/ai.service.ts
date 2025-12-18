import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const evaluateReport = async (data: any): Promise<{ summary: string, score: number }> => {
    // Fallback if no key is present
    if (!genAI) {
        console.warn('GEMINI_API_KEY not found. Using heuristic evaluation.');
        return heuristicAnalysis(data);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `
            You are a rigorous food safety auditor AI. Analyze the following hotel food safety inspection data and provide a safety score (0-100) and a concise professional summary.
            
            Context: 100 is perfect, <80 is concerning, <60 is critical failure.
            If critical issues (pests, mold, expired food, wrong temperatures) are found, the score must be low.
            
            The Inspection Data is: 
            ${JSON.stringify(data)}

            Return ONLY raw JSON in this format (no markdown code blocks):
            {
                "score": number, 
                "summary": "concise summary string"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from potential markdown wrapping
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;

        const parsed = JSON.parse(jsonStr);

        return {
            score: typeof parsed.score === 'number' ? parsed.score : 0,
            summary: parsed.summary || 'AI Analysis completed.'
        };

    } catch (error) {
        console.error('Gemini AI Generation Error:', error);
        return heuristicAnalysis(data);
    }
};

const heuristicAnalysis = (data: any) => {
    // Current Simluated Logic
    const text = JSON.stringify(data).toLowerCase();

    const badKeywords = ['dirty', 'expired', 'pest', 'mold', 'cold', 'violation', 'fail', 'poor', 'bad'];
    const goodKeywords = ['clean', 'fresh', 'proper', 'sanitized', 'pass', 'good', 'excellent', 'compliant'];

    let score = 100;
    const issues: string[] = [];

    badKeywords.forEach(word => {
        if (text.includes(word)) {
            score -= 10;
            issues.push(`Found issue related to "${word}"`);
        }
    });

    goodKeywords.forEach(word => {
        if (text.includes(word)) {
            score += 5;
        }
    });

    score = Math.min(100, Math.max(0, score));

    let evaluation = 'Good';
    if (score < 80) evaluation = 'Average';
    if (score < 60) evaluation = 'Poor';

    const summary = `AI Evaluation (Simulated): ${evaluation}. Score: ${score}/100. ${issues.length > 0 ? 'Issues detected: ' + issues.join(', ') : 'No obvious issues detected in text.'}`;

    return { summary, score };
};
