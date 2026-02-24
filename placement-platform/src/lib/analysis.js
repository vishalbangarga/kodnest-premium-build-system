function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function makeWordRegex(word) {
  return new RegExp(`\\b${escapeRegex(word)}\\b`, "i");
}

const SKILL_DETECTORS = [
  {
    category: "Core CS",
    skills: [
      { label: "DSA", patterns: [makeWordRegex("DSA")] },
      { label: "OOP", patterns: [makeWordRegex("OOP")] },
      { label: "DBMS", patterns: [makeWordRegex("DBMS")] },
      { label: "OS", patterns: [makeWordRegex("OS")] },
      { label: "Networks", patterns: [makeWordRegex("Networks")] }
    ]
  },
  {
    category: "Languages",
    skills: [
      { label: "Java", patterns: [makeWordRegex("Java")] },
      { label: "Python", patterns: [makeWordRegex("Python")] },
      { label: "JavaScript", patterns: [makeWordRegex("JavaScript")] },
      { label: "TypeScript", patterns: [makeWordRegex("TypeScript")] },
      { label: "C", patterns: [makeWordRegex("C")] },
      { label: "C++", patterns: [/\bC\+\+\b/i] },
      { label: "C#", patterns: [/\bC#\b/i] },
      { label: "Go", patterns: [makeWordRegex("Go")] }
    ]
  },
  {
    category: "Web",
    skills: [
      { label: "React", patterns: [makeWordRegex("React")] },
      { label: "Next.js", patterns: [/\bNext\.js\b/i, /\bNextjs\b/i] },
      { label: "Node.js", patterns: [/\bNode\.js\b/i, /\bNodejs\b/i] },
      { label: "Express", patterns: [makeWordRegex("Express")] },
      { label: "REST", patterns: [makeWordRegex("REST")] },
      { label: "GraphQL", patterns: [makeWordRegex("GraphQL")] }
    ]
  },
  {
    category: "Data",
    skills: [
      { label: "SQL", patterns: [makeWordRegex("SQL")] },
      { label: "MongoDB", patterns: [makeWordRegex("MongoDB")] },
      { label: "PostgreSQL", patterns: [makeWordRegex("PostgreSQL")] },
      { label: "MySQL", patterns: [makeWordRegex("MySQL")] },
      { label: "Redis", patterns: [makeWordRegex("Redis")] }
    ]
  },
  {
    category: "Cloud/DevOps",
    skills: [
      { label: "AWS", patterns: [makeWordRegex("AWS")] },
      { label: "Azure", patterns: [makeWordRegex("Azure")] },
      { label: "GCP", patterns: [makeWordRegex("GCP")] },
      { label: "Docker", patterns: [makeWordRegex("Docker")] },
      { label: "Kubernetes", patterns: [makeWordRegex("Kubernetes")] },
      { label: "CI/CD", patterns: [/\bCI\/CD\b/i, /\bCI-CD\b/i] },
      { label: "Linux", patterns: [makeWordRegex("Linux")] }
    ]
  },
  {
    category: "Testing",
    skills: [
      { label: "Selenium", patterns: [makeWordRegex("Selenium")] },
      { label: "Cypress", patterns: [makeWordRegex("Cypress")] },
      { label: "Playwright", patterns: [makeWordRegex("Playwright")] },
      { label: "JUnit", patterns: [makeWordRegex("JUnit")] },
      { label: "PyTest", patterns: [makeWordRegex("PyTest"), makeWordRegex("pytest")] }
    ]
  }
];

export function extractSkillsFromJD(jdText) {
  const text = String(jdText || "");

  const grouped = {};
  for (const detector of SKILL_DETECTORS) {
    const found = [];
    for (const skill of detector.skills) {
      if (skill.patterns.some((re) => re.test(text))) {
        found.push(skill.label);
      }
    }
    if (found.length > 0) {
      grouped[detector.category] = found;
    }
  }

  const hasAny = Object.keys(grouped).length > 0;
  if (!hasAny) {
    return { "General fresher stack": ["DSA", "OOP", "SQL", "Projects", "Communication"] };
  }

  return grouped;
}

function hasSkill(extractedSkills, label) {
  return Object.values(extractedSkills).some((skills) => skills.includes(label));
}

function categoriesPresent(extractedSkills) {
  return Object.keys(extractedSkills).filter(
    (cat) => extractedSkills[cat] && extractedSkills[cat].length > 0
  );
}

export function computeReadinessScore({ company, role, jdText, extractedSkills }) {
  let score = 35;

  const catCount = Math.min(6, categoriesPresent(extractedSkills).length);
  score += Math.min(30, catCount * 5);

  if (String(company || "").trim().length > 0) score += 10;
  if (String(role || "").trim().length > 0) score += 10;
  if (String(jdText || "").length > 800) score += 10;

  return Math.min(100, score);
}

export function buildRoundChecklist(extractedSkills) {
  const core = extractedSkills["Core CS"] || [];
  const langs = extractedSkills["Languages"] || [];
  const web = extractedSkills["Web"] || [];
  const data = extractedSkills["Data"] || [];
  const cloud = extractedSkills["Cloud/DevOps"] || [];
  const testing = extractedSkills["Testing"] || [];

  const round1 = [
    "Daily aptitude set (quant + logic) — 45 minutes",
    "Revise basics: time/space complexity + common patterns",
    "Communication warm-up: explain one concept aloud in 2 minutes",
    "Build a short self-intro (role-fit + project highlights)",
    "Revise resume bullets using STAR format"
  ];

  const round2 = [
    "Solve 2 DSA problems (1 easy, 1 medium) and write clean explanations",
    "Revise arrays/strings + hashing + two pointers",
    "Revise recursion + DP fundamentals (memoization vs tabulation)",
    "Review one core CS topic and write a 10-line summary"
  ];
  if (core.includes("DBMS") || data.includes("SQL")) round2.push("DBMS/SQL: keys, joins, indexing, normalization");
  if (core.includes("OS")) round2.push("OS: processes vs threads, scheduling, deadlocks");
  if (core.includes("Networks")) round2.push("Networks: HTTP/HTTPS, TCP/UDP, latency basics");
  if (core.includes("OOP")) round2.push("OOP: SOLID, inheritance vs composition, design basics");

  const round3 = [
    "Pick 2 projects and prepare deep-dive: tradeoffs, bottlenecks, learnings",
    "Prepare your stack story: why these tools, what you built with them",
    "Practice 3 debugging-style questions (edge cases + constraints)",
    "Write 5 crisp talking points for your strongest project"
  ];
  if (web.includes("React")) round3.push("React: hooks, rendering, state management options, performance basics");
  if (web.includes("Node.js") || web.includes("Express")) round3.push("Backend: REST design, auth basics, error handling");
  if (data.includes("MongoDB")) round3.push("MongoDB: document modeling + indexing tradeoffs");
  if (data.includes("PostgreSQL") || data.includes("MySQL")) round3.push("SQL DB: schema design + transactions basics");
  if (cloud.includes("Docker") || cloud.includes("Kubernetes")) round3.push("DevOps: container basics, images, deploy workflow");
  if (cloud.includes("AWS") || cloud.includes("Azure") || cloud.includes("GCP")) round3.push("Cloud: core services you used or would use (compute, storage, networking)");
  if (testing.length > 0) round3.push(`Testing: test pyramid + tools (${testing.slice(0, 2).join(", ")})`);

  const round4 = [
    "Prepare 8 HR questions with honest, structured answers",
    "Write your strengths + one weakness with an improvement plan",
    "Prepare conflict/teamwork story from a project or team experience",
    "Salary/notice period: decide clear, polite responses",
    "End-of-interview questions: 3 thoughtful questions for the interviewer"
  ];

  const clamp = (items) => items.slice(0, 8).slice(0, Math.max(5, Math.min(8, items.length)));

  return {
    "Round 1: Aptitude / Basics": clamp(round1),
    "Round 2: DSA + Core CS": clamp(round2),
    "Round 3: Tech interview (projects + stack)": clamp(round3),
    "Round 4: Managerial / HR": clamp(round4)
  };
}

export function buildSevenDayPlan(extractedSkills) {
  const web = extractedSkills["Web"] || [];
  const data = extractedSkills["Data"] || [];
  const cloud = extractedSkills["Cloud/DevOps"] || [];
  const testing = extractedSkills["Testing"] || [];
  const core = extractedSkills["Core CS"] || [];

  const plan = {
    "Day 1": ["Basics: complexity, arrays/strings, problem-solving approach", "Core CS quick revision: OOP + DBMS fundamentals"],
    "Day 2": ["Core CS: OS + Networks essentials", "Aptitude practice + communication drill"],
    "Day 3": ["DSA: hashing + two pointers + sliding window", "Solve 3 problems and write explanations"],
    "Day 4": ["DSA: recursion + trees/graphs basics", "Solve 2 medium problems (focus on constraints)"],
    "Day 5": ["Project deep-dive: architecture + tradeoffs", "Resume alignment: rewrite top 3 bullets for impact"],
    "Day 6": ["Mock interview: 10 technical questions + 5 HR questions", "Weak area review from previous days"],
    "Day 7": ["Revision: key notes + patterns", "Re-attempt 2 earlier mistakes + finalize interview checklist"]
  };

  if (web.includes("React")) {
    plan["Day 5"].push("Frontend: React hooks, state management, rendering model revision");
  }
  if (web.includes("Next.js")) {
    plan["Day 5"].push("Next.js: routing + SSR/SSG basics and tradeoffs");
  }
  if (web.includes("Node.js") || web.includes("Express") || web.includes("REST")) {
    plan["Day 5"].push("Backend: REST conventions, auth basics, pagination + error handling");
  }
  if (data.includes("SQL")) {
    plan["Day 2"].push("SQL: joins, indexing, query patterns revision");
  }
  if (data.includes("MongoDB")) {
    plan["Day 2"].push("MongoDB: modeling + indexing basics revision");
  }
  if (cloud.includes("Docker") || cloud.includes("Kubernetes") || cloud.includes("CI/CD") || cloud.includes("Linux")) {
    plan["Day 6"].push("DevOps: basic deployment flow + debugging logs (Linux + Docker)");
  }
  if (testing.length > 0) {
    plan["Day 6"].push(`Testing: write a small test plan using ${testing[0]}`);
  }
  if (core.length === 0) {
    plan["Day 1"][1] = "Core CS quick revision: OOP + DBMS + OS fundamentals";
  }

  return plan;
}

export function buildInterviewQuestions(extractedSkills) {
  const questions = [];

  const pushUnique = (q) => {
    if (questions.length >= 10) return;
    if (!questions.includes(q)) questions.push(q);
  };

  if (hasSkill(extractedSkills, "SQL")) pushUnique("Explain indexing in SQL and when it helps (and when it doesn’t).");
  if (hasSkill(extractedSkills, "PostgreSQL") || hasSkill(extractedSkills, "MySQL")) pushUnique("What is a transaction and what does ACID mean in practice?");
  if (hasSkill(extractedSkills, "MongoDB")) pushUnique("How do you choose between embedding and referencing in MongoDB schema design?");
  if (hasSkill(extractedSkills, "Redis")) pushUnique("Where would you use Redis in an application and what are common pitfalls?");
  if (hasSkill(extractedSkills, "React")) pushUnique("Explain React rendering and common causes of unnecessary re-renders.");
  if (hasSkill(extractedSkills, "React")) pushUnique("What state management options have you used (Context, Redux, Zustand), and why?");
  if (hasSkill(extractedSkills, "Next.js")) pushUnique("SSR vs SSG in Next.js: when would you choose each and why?");
  if (hasSkill(extractedSkills, "Node.js") || hasSkill(extractedSkills, "Express")) pushUnique("How do you design robust REST APIs (validation, errors, pagination)?");
  if (hasSkill(extractedSkills, "GraphQL")) pushUnique("GraphQL: how do you avoid over-fetching and handle N+1 issues?");
  if (hasSkill(extractedSkills, "Docker")) pushUnique("What’s inside a Docker image, and how is it different from a container?");
  if (hasSkill(extractedSkills, "Kubernetes")) pushUnique("What problem does Kubernetes solve, and what’s a Deployment vs a Service?");
  if (hasSkill(extractedSkills, "CI/CD")) pushUnique("Describe a simple CI/CD pipeline you would set up for a web app.");
  if (hasSkill(extractedSkills, "AWS") || hasSkill(extractedSkills, "Azure") || hasSkill(extractedSkills, "GCP")) pushUnique("Pick one cloud service you know and explain how you would use it in a project.");
  if (hasSkill(extractedSkills, "Linux")) pushUnique("How would you troubleshoot a service that’s running but not responding on Linux?");
  if (hasSkill(extractedSkills, "Playwright") || hasSkill(extractedSkills, "Cypress") || hasSkill(extractedSkills, "Selenium")) pushUnique("Explain the test pyramid and where E2E tests fit (and why too many are costly).");
  if (hasSkill(extractedSkills, "JUnit") || hasSkill(extractedSkills, "PyTest")) pushUnique("How do you structure unit tests to be reliable and maintainable?");

  if (hasSkill(extractedSkills, "DSA")) pushUnique("How would you optimize search in sorted data, and what’s the time complexity?");
  if (hasSkill(extractedSkills, "DSA")) pushUnique("Explain a problem you solved using dynamic programming and how you derived the state.");
  if (hasSkill(extractedSkills, "OOP")) pushUnique("Explain SOLID principles with a practical example from your code.");
  if (hasSkill(extractedSkills, "DBMS")) pushUnique("Explain normalization and when denormalization is acceptable.");
  if (hasSkill(extractedSkills, "OS")) pushUnique("Processes vs threads: what’s the difference and where does it matter?");
  if (hasSkill(extractedSkills, "Networks")) pushUnique("What happens when you type a URL in the browser (high-level flow)?");

  while (questions.length < 10) {
    pushUnique("Tell me about a project you built: architecture, tradeoffs, and biggest learning.");
    pushUnique("How do you approach debugging when you don’t know the cause?");
    pushUnique("What is your strategy to handle edge cases and constraints in coding problems?");
    pushUnique("Explain one concept you learned recently and how you applied it.");
  }

  return questions.slice(0, 10);
}

export function analyzeJD({ company, role, jdText }) {
  const extractedSkills = extractSkillsFromJD(jdText);
  const checklist = buildRoundChecklist(extractedSkills);
  const plan = buildSevenDayPlan(extractedSkills);
  const questions = buildInterviewQuestions(extractedSkills);
  const readinessScore = computeReadinessScore({
    company,
    role,
    jdText,
    extractedSkills
  });

  return {
    extractedSkills,
    checklist,
    plan,
    questions,
    readinessScore
  };
}

