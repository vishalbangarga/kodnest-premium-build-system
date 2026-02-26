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

export function buildCompanyIntel(company, extractedSkills) {
  const name = String(company || "").trim();
  if (!name) return null;

  const lower = name.toLowerCase();

  let industry = "Technology Services";
  if (/\b(bank|finance|fintech)\b/i.test(lower)) {
    industry = "Financial Services";
  } else if (/\b(ecommerce|retail)\b/i.test(lower)) {
    industry = "E‑commerce / Retail";
  } else if (/\b(health|medic|pharma|hospital)\b/i.test(lower)) {
    industry = "Healthcare / Life Sciences";
  } else if (/\b(consulting)\b/i.test(lower)) {
    industry = "Consulting / Technology Services";
  }

  const enterpriseNames = [
    "amazon",
    "google",
    "microsoft",
    "meta",
    "facebook",
    "apple",
    "netflix",
    "adobe",
    "ibm",
    "oracle",
    "infosys",
    "tcs",
    "tata consultancy services",
    "wipro",
    "accenture",
    "capgemini",
    "cognizant",
    "hcl",
    "deloitte"
  ];

  let sizeKey = "startup";
  let sizeLabel = "Startup (<200)";

  if (enterpriseNames.some((known) => lower.includes(known))) {
    sizeKey = "enterprise";
    sizeLabel = "Enterprise (2000+)";
  }

  const web = extractedSkills["Web"] || [];
  const data = extractedSkills["Data"] || [];
  const cloud = extractedSkills["Cloud/DevOps"] || [];

  const typicalFocus = [];

  if (sizeKey === "enterprise") {
    typicalFocus.push(
      "Structured DSA + core CS fundamentals with consistent bar across batches."
    );
    typicalFocus.push(
      "Multiple evaluation rounds: online assessments followed by focused technical and HR conversations."
    );
    if (web.length > 0 || data.length > 0 || cloud.length > 0) {
      typicalFocus.push(
        "Depth in the primary tech stack (web/services/data) in at least one technical round."
      );
    } else {
      typicalFocus.push(
        "Breadth-first screening of CS fundamentals, followed by role-specific deep dives."
      );
    }
  } else {
    typicalFocus.push(
      "Practical problem solving and ability to ship features end‑to‑end."
    );
    if (web.includes("React") || web.includes("Node.js") || web.includes("Express")) {
      typicalFocus.push(
        "Hands‑on skills with the actual stack (e.g. React/Node) and comfort navigating existing code."
      );
    }
    if (cloud.length > 0) {
      typicalFocus.push(
        "Comfort with basic deployment, debugging logs, and owning changes in production‑like environments."
      );
    }
    typicalFocus.push(
      "Communication, initiative, and culture fit often weighed as highly as pure DSA performance."
    );
  }

  return {
    name,
    industry,
    sizeKey,
    sizeLabel,
    typicalFocus
  };
}

export function buildRoundMapping(companyIntel, extractedSkills) {
  if (!companyIntel) return [];

  const size = companyIntel.sizeKey || "startup";
  const web = extractedSkills["Web"] || [];
  const core = extractedSkills["Core CS"] || [];
  const hasDSA = core.includes("DSA") || hasSkill(extractedSkills, "DSA");

  const rounds = [];

  if (size === "enterprise") {
    if (hasDSA) {
      rounds.push({
        title: "Online Test (DSA + Aptitude)",
        focus: "Timed coding questions and aptitude to filter for fundamentals and speed.",
        why: "Ensures you can handle pressure, constraints, and standard campus‑style assessments."
      });
      rounds.push({
        title: "Technical Round (DSA + Core CS)",
        focus: "Whiteboard or online coding plus OS/DBMS/Networks/OOP discussion.",
        why: "Validates that your CS foundation is strong enough for large‑scale systems."
      });
    } else {
      rounds.push({
        title: "Online Assessment (Coding + Basics)",
        focus: "General coding, reasoning, and basic CS concepts.",
        why: "Screens for broad capability before investing in longer interviews."
      });
    }

    rounds.push({
      title: "Technical + Project Discussion",
      focus: "Deep dive into 1–2 projects and technology choices.",
      why: "Checks how you reason about trade‑offs, debugging, and long‑term maintainability."
    });

    rounds.push({
      title: "Managerial / HR",
      focus: "Behavioral questions, expectations, and team fit.",
      why: "Aligns your motivations, communication style, and growth plans with the organization."
    });
  } else {
    const hasFrontend =
      web.includes("React") ||
      web.includes("Next.js") ||
      hasSkill(extractedSkills, "React");
    const hasBackend =
      web.includes("Node.js") ||
      web.includes("Express") ||
      hasSkill(extractedSkills, "Node.js") ||
      hasSkill(extractedSkills, "Express");

    if (hasFrontend || hasBackend) {
      rounds.push({
        title: "Practical coding round",
        focus: "Implement a feature or small service close to the real codebase.",
        why: "Shows how quickly you can understand requirements and deliver working code."
      });
      rounds.push({
        title: "System / Architecture discussion",
        focus: "Talk through design choices, trade‑offs, and how you’d evolve the system.",
        why: "Checks your ability to reason about scale, reliability, and future changes."
      });
      rounds.push({
        title: "Culture & collaboration",
        focus: "Team fit, ownership mindset, expectations on pace and communication.",
        why: "Startups rely heavily on trust, autonomy, and clear communication in small teams."
      });
    } else {
      rounds.push({
        title: "Hands‑on coding",
        focus: "Solve practical problems in your primary language.",
        why: "Confirms you can write clean, working code without heavy scaffolding."
      });
      rounds.push({
        title: "Technical deep dive",
        focus: "Discuss projects, debugging stories, and tools you actually use.",
        why: "Focuses on how you work day‑to‑day rather than theoretical CS depth."
      });
      rounds.push({
        title: "Founder / HR conversation",
        focus: "Motivation, expectations, and how you think about joining an early‑stage team.",
        why: "Ensures alignment on risk, learning pace, and responsibilities."
      });
    }
  }

  return rounds;
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

  const companyIntel = buildCompanyIntel(company, extractedSkills);
  const roundMapping = buildRoundMapping(companyIntel, extractedSkills);

  return {
    extractedSkills,
    checklist,
    plan,
    questions,
    readinessScore,
    companyIntel,
    roundMapping
  };
}

