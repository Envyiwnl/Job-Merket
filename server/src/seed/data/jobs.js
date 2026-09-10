const companyNames = [
  "Google",
  "Microsoft",
  "Adobe",
  "Amazon",
  "Atlassian",
  "Spotify",
  "Freshworks",
  "Deloitte",
  "IBM",
  "Oracle",
  "Salesforce",
  "SAP",
  "Infosys",
  "TCS",
  "Wipro",
  "Accenture",
  "Cognizant",
  "Capgemini",
  "HCLTech",
  "Tech Mahindra",
  "Flipkart",
  "Walmart Global Tech",
  "PhonePe",
  "Paytm",
  "Razorpay",
  "Swiggy",
  "Zomato",
  "Meesho",
  "Ola",
  "Uber",
  "Airbnb",
  "Netflix",
  "Meta",
  "Apple",
  "NVIDIA",
  "Intel",
  "AMD",
  "Cisco",
  "Dell Technologies",
  "HP",
  "Zoho",
  "ServiceNow",
  "Intuit",
  "JPMorgan Chase",
  "Goldman Sachs",
  "Morgan Stanley",
  "PwC",
  "EY",
  "KPMG",
  "McKinsey & Company",
];

const locations = [
  "Bengaluru, India",
  "Hyderabad, India",
  "Pune, India",
  "Mumbai, India",
  "Gurugram, India",
  "Noida, India",
  "Chennai, India",
  "Delhi, India",
  "Kolkata, India",
  "Ahmedabad, India",
  "Guwahati, India",
  "Remote",
];

const jobTemplates = [
  {
    title: "Frontend Developer",
    categoryValue: "development",
    skills: ["React", "JavaScript", "HTML", "CSS", "REST API"],
  },
  {
    title: "React Developer",
    categoryValue: "development",
    skills: ["React", "JavaScript", "Redux", "React Router", "Git"],
  },
  {
    title: "Backend Developer",
    categoryValue: "development",
    skills: ["Node.js", "Express", "MongoDB", "REST API", "Git"],
  },
  {
    title: "Full Stack Developer",
    categoryValue: "development",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript"],
  },
  {
    title: "Software Engineer",
    categoryValue: "development",
    skills: ["JavaScript", "Data Structures", "APIs", "Git", "System Design"],
  },
  {
    title: "Mobile App Developer",
    categoryValue: "mobile-development",
    skills: ["React Native", "JavaScript", "REST API", "Git", "Mobile UI"],
  },
  {
    title: "Flutter Developer",
    categoryValue: "mobile-development",
    skills: ["Flutter", "Dart", "Firebase", "REST API", "Git"],
  },
  {
    title: "Data Analyst",
    categoryValue: "data-science",
    skills: ["SQL", "Excel", "Python", "Power BI", "Data Analysis"],
  },
  {
    title: "Data Scientist",
    categoryValue: "data-science",
    skills: ["Python", "Pandas", "NumPy", "SQL", "Statistics"],
  },
  {
    title: "Machine Learning Engineer",
    categoryValue: "artificial-intelligence",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "APIs"],
  },
  {
    title: "AI Engineer",
    categoryValue: "artificial-intelligence",
    skills: [
      "Python",
      "LLMs",
      "Machine Learning",
      "APIs",
      "Prompt Engineering",
    ],
  },
  {
    title: "Data Engineer",
    categoryValue: "database-data-engineering",
    skills: ["Python", "SQL", "ETL", "Data Pipelines", "Cloud"],
  },
  {
    title: "Database Administrator",
    categoryValue: "database-data-engineering",
    skills: ["SQL", "MongoDB", "PostgreSQL", "Database Design", "Backup"],
  },
  {
    title: "DevOps Engineer",
    categoryValue: "devops-cloud",
    skills: ["Docker", "CI/CD", "AWS", "Linux", "Git"],
  },
  {
    title: "Cloud Engineer",
    categoryValue: "devops-cloud",
    skills: ["AWS", "Azure", "Docker", "Linux", "Networking"],
  },
  {
    title: "Site Reliability Engineer",
    categoryValue: "devops-cloud",
    skills: ["Linux", "Kubernetes", "Monitoring", "Cloud", "Automation"],
  },
  {
    title: "Cybersecurity Analyst",
    categoryValue: "cybersecurity",
    skills: [
      "Network Security",
      "SIEM",
      "Linux",
      "Security Auditing",
      "Incident Response",
    ],
  },
  {
    title: "Security Engineer",
    categoryValue: "cybersecurity",
    skills: [
      "Application Security",
      "OWASP",
      "Cloud Security",
      "Linux",
      "Networking",
    ],
  },
  {
    title: "UI/UX Designer",
    categoryValue: "design",
    skills: [
      "Figma",
      "Wireframing",
      "Prototyping",
      "User Research",
      "UI Design",
    ],
  },
  {
    title: "Product Designer",
    categoryValue: "design",
    skills: [
      "Figma",
      "Design Systems",
      "UX Research",
      "Prototyping",
      "Product Design",
    ],
  },
  {
    title: "QA Engineer",
    categoryValue: "qa-testing",
    skills: [
      "Manual Testing",
      "Test Cases",
      "API Testing",
      "Bug Tracking",
      "Git",
    ],
  },
  {
    title: "Automation Test Engineer",
    categoryValue: "qa-testing",
    skills: ["Selenium", "JavaScript", "API Testing", "Automation", "Git"],
  },
  {
    title: "Product Manager",
    categoryValue: "product-management",
    skills: [
      "Product Strategy",
      "Agile",
      "Analytics",
      "Roadmapping",
      "Communication",
    ],
  },
  {
    title: "Project Manager",
    categoryValue: "project-management",
    skills: [
      "Project Planning",
      "Agile",
      "Jira",
      "Communication",
      "Risk Management",
    ],
  },
  {
    title: "Business Analyst",
    categoryValue: "business",
    skills: [
      "Business Analysis",
      "Excel",
      "SQL",
      "Documentation",
      "Communication",
    ],
  },
  {
    title: "Management Consultant",
    categoryValue: "business",
    skills: [
      "Strategy",
      "Research",
      "Analytics",
      "Presentation",
      "Problem Solving",
    ],
  },
  {
    title: "Digital Marketing Executive",
    categoryValue: "marketing",
    skills: [
      "SEO",
      "Google Analytics",
      "Content Marketing",
      "Social Media",
      "Campaigns",
    ],
  },
  {
    title: "Performance Marketing Specialist",
    categoryValue: "marketing",
    skills: [
      "Google Ads",
      "Analytics",
      "SEO",
      "Campaign Management",
      "A/B Testing",
    ],
  },
  {
    title: "Sales Executive",
    categoryValue: "sales",
    skills: ["Sales", "CRM", "Negotiation", "Communication", "Lead Generation"],
  },
  {
    title: "Account Manager",
    categoryValue: "sales",
    skills: [
      "Account Management",
      "CRM",
      "Sales",
      "Communication",
      "Negotiation",
    ],
  },
  {
    title: "HR Executive",
    categoryValue: "human-resources",
    skills: [
      "Recruitment",
      "HR Operations",
      "Communication",
      "Onboarding",
      "HRIS",
    ],
  },
  {
    title: "Talent Acquisition Specialist",
    categoryValue: "human-resources",
    skills: [
      "Recruitment",
      "Sourcing",
      "Interviewing",
      "LinkedIn",
      "Communication",
    ],
  },
  {
    title: "Financial Analyst",
    categoryValue: "finance-accounting",
    skills: [
      "Excel",
      "Financial Analysis",
      "Accounting",
      "Forecasting",
      "Reporting",
    ],
  },
  {
    title: "Operations Executive",
    categoryValue: "operations",
    skills: [
      "Operations",
      "Excel",
      "Process Improvement",
      "Reporting",
      "Coordination",
    ],
  },
  {
    title: "Customer Support Executive",
    categoryValue: "customer-support",
    skills: [
      "Customer Support",
      "Communication",
      "CRM",
      "Problem Solving",
      "Email Support",
    ],
  },
  {
    title: "Content Writer",
    categoryValue: "content-writing",
    skills: ["Content Writing", "SEO", "Research", "Editing", "Communication"],
  },
  {
    title: "Research Analyst",
    categoryValue: "research",
    skills: ["Research", "Excel", "Data Analysis", "Reporting", "Presentation"],
  },
  {
    title: "Legal Associate",
    categoryValue: "legal-compliance",
    skills: [
      "Legal Research",
      "Contracts",
      "Compliance",
      "Documentation",
      "Communication",
    ],
  },
  {
    title: "Mechanical Engineer",
    categoryValue: "engineering",
    skills: [
      "CAD",
      "Mechanical Design",
      "Manufacturing",
      "Problem Solving",
      "Engineering",
    ],
  },
  {
    title: "Healthcare Operations Associate",
    categoryValue: "healthcare",
    skills: [
      "Healthcare Operations",
      "Documentation",
      "Communication",
      "Excel",
      "Compliance",
    ],
  },
];

const experienceLevels = [
  "Fresher",
  "Entry Level",
  "Mid Level",
  "Senior Level",
];

const modes = ["Remote", "On-site", "Hybrid"];

function getJobType(index) {
  if (index % 11 === 0) {
    return "Internship";
  }

  if (index % 13 === 0) {
    return "Contract";
  }

  if (index % 17 === 0) {
    return "Part Time";
  }

  return "Full Time";
}

function getExperience(index, type) {
  if (type === "Internship") {
    return "Fresher";
  }

  return experienceLevels[index % experienceLevels.length];
}

function getSalary(experience, type, index) {
  if (type === "Internship") {
    const min = 15000 + (index % 5) * 5000;

    return {
      min,
      max: min + 15000,
      currency: "INR",
      period: "month",
    };
  }

  const salaryRanges = {
    Fresher: {
      min: 300000,
      max: 500000,
    },
    "Entry Level": {
      min: 500000,
      max: 900000,
    },
    "Mid Level": {
      min: 900000,
      max: 1600000,
    },
    "Senior Level": {
      min: 1600000,
      max: 2800000,
    },
  };

  const range = salaryRanges[experience];

  const variation = (index % 4) * 50000;

  return {
    min: range.min + variation,
    max: range.max + variation,
    currency: "INR",
    period: "year",
  };
}

const jobs = Array.from({ length: 200 }, (_, index) => {
  const template = jobTemplates[index % jobTemplates.length];

  const companyName = companyNames[index % companyNames.length];

  const type = getJobType(index);

  const experience = getExperience(index, type);

  const salary = getSalary(experience, type, index);

  let location = locations[index % locations.length];

  const mode = modes[index % modes.length];

  if (mode === "Remote") {
    location = "Remote";
  }

  return {
    title: template.title,

    companyName,

    categoryValue: template.categoryValue,

    type,

    experience,

    location,

    mode,

    salary,

    description: `Join ${companyName} as a ${template.title} and contribute to meaningful products, services, and business initiatives. You will work with cross-functional teams, solve practical problems, and help deliver reliable outcomes for users and stakeholders.`,

    responsibilities: [
      `Contribute to day-to-day ${template.title} responsibilities and project delivery.`,
      "Collaborate with cross-functional teams to understand requirements and deliver solutions.",
      "Maintain high standards of quality, documentation, and communication.",
      "Participate in planning, reviews, and continuous improvement initiatives.",
      "Identify problems and contribute practical solutions.",
    ],

    requirements: [
      `Relevant knowledge or experience related to the ${template.title} role.`,
      `Understanding of ${template.skills[0]} and ${template.skills[1]}.`,
      "Strong problem-solving and communication skills.",
      "Ability to work independently and collaboratively.",
      experience === "Fresher"
        ? "Fresh graduates and candidates with relevant projects are encouraged to apply."
        : `Relevant professional experience suitable for a ${experience} position.`,
    ],

    skills: template.skills,

    benefits: [
      "Health insurance",
      "Learning and development support",
      "Flexible work environment",
      "Paid time off",
      "Employee wellness programs",
    ],

    status: index % 19 === 0 ? "closed" : "open",

    source: "seed",
  };
});

export default jobs;
