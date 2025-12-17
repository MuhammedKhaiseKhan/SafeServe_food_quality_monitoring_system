export const evaluateReport = (data: any): { summary: string, score: number } => {
    // Simple heuristic analysis based on typical food safety keywords
    // In a real app, this would call OpenAI/Gemini

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
            score += 5; // Bonus for explicit good mentions, capped at 100 later
        }
    });

    score = Math.min(100, Math.max(0, score));

    let evaluation = 'Good';
    if (score < 80) evaluation = 'Average';
    if (score < 60) evaluation = 'Poor';

    const summary = `AI Evaluation: ${evaluation}. Score: ${score}/100. ${issues.length > 0 ? 'Issues detected: ' + issues.join(', ') : 'No obvious issues detected in text.'}`;

    return { summary, score };
};
