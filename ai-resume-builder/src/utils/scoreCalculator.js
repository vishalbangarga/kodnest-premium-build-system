export function calculateATSScore(resumeData) {
    let score = 0;
    const suggestions = [];
    const actionVerbs = ["built", "led", "designed", "improved", "created", "developed", "managed", "architected", "optimized", "spearheaded", "directed", "executed", "launched", "resolved", "reduced", "increased"];

    // +10 Name provided
    if (resumeData.personal.fullName && resumeData.personal.fullName.trim()) {
        score += 10;
    } else {
        suggestions.push("Add your full name (+10 points)");
    }

    // +10 Email provided
    if (resumeData.personal.email && resumeData.personal.email.trim()) {
        score += 10;
    } else {
        suggestions.push("Add your email address (+10 points)");
    }

    // +5 Phone provided
    if (resumeData.personal.phone && resumeData.personal.phone.trim()) {
        score += 5;
    } else {
        suggestions.push("Add your phone number (+5 points)");
    }

    // +5 LinkedIn provided
    if (resumeData.links.linkedin && resumeData.links.linkedin.trim()) {
        score += 5;
    } else {
        suggestions.push("Add your LinkedIn profile link (+5 points)");
    }

    // +5 GitHub provided
    if (resumeData.links.github && resumeData.links.github.trim()) {
        score += 5;
    } else {
        suggestions.push("Add your GitHub profile link (+5 points)");
    }

    // +10 Summary > 50 chars
    const summaryText = resumeData.summary || "";
    if (summaryText.length > 50) {
        score += 10;

        // +10 Summary contains action verbs (only check if summary exists)
        const lowerSummary = summaryText.toLowerCase();
        if (actionVerbs.some(verb => lowerSummary.includes(verb))) {
            score += 10;
        } else {
            suggestions.push("Use strong action verbs in summary (e.g. built, led) (+10 points)");
        }
    } else {
        suggestions.push("Expand professional summary to >50 characters (+10 points)");
        suggestions.push("Use strong action verbs in summary (+10 points)");
    }

    // +15 At least 1 experience entry with bullets
    const validExp = resumeData.experience && resumeData.experience.filter(e => e.role && e.role.trim() && e.details && e.details.trim());
    if (validExp && validExp.length >= 1) {
        score += 15;
    } else {
        suggestions.push("Add at least 1 work experience with detail bullets (+15 points)");
    }

    // +10 At least 1 education entry
    const validEdu = resumeData.education && resumeData.education.filter(e => e.text && e.text.trim());
    if (validEdu && validEdu.length >= 1) {
        score += 10;
    } else {
        suggestions.push("Add at least 1 education entry (+10 points)");
    }

    // +10 At least 5 skills added
    const totalSkills = (resumeData.skills?.technical?.length || 0) +
        (resumeData.skills?.soft?.length || 0) +
        (resumeData.skills?.tools?.length || 0);

    if (totalSkills >= 5) {
        score += 10;
    } else {
        suggestions.push("List at least 5 skills (+10 points)");
    }

    // +10 At least 1 project added
    const validProj = resumeData.projects && resumeData.projects.filter(p => (p.name && p.name.trim()) || (p.details && p.details.trim()));
    if (validProj && validProj.length >= 1) {
        score += 10;
    } else {
        suggestions.push("Add at least 1 project (+10 points)");
    }

    return {
        score: Math.min(100, score),
        suggestions: suggestions
    };
}
