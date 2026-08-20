/**
 * G-TEC EDUCATION RAJAKUMARI - COURSE DATA ENGINE (REFINED EDITION)
 * Contains full data array, distinct category visual fallbacks, and dynamic statistics calculators.
 */

const GTEC_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeJFvyySrpeK4BG2ZAZUw_M4-Ct95dRPb6ZQ-bz7sEQKCxLtQ/viewform";
const GTEC_WHATSAPP_NUM = "919400059100";

// Category-Specific Distinct Fallback Image System
const CATEGORY_FALLBACK_IMAGES = {
  software: "assets/images/courses/software/python.jpg",
  accounting: "assets/images/courses/accounting/sap-fico.jpg",
  multimedia: "assets/images/backgrounds/multimedia-bg.jpg",
  sap: "assets/images/courses/accounting/sap-fico.jpg"
};

const COURSES_DATA = [
  // ==========================================
  // SOFTWARE COURSES (DISTINCT SOFTWARE VISUALS)
  // ==========================================
  {
    id: "soft-pgdca",
    category: "software",
    level: "master",
    title: "Post Graduate Diploma in Computer Application (PGDCA)",
    duration: "12 Months",
    image: "assets/images/courses/software/python.jpg",
    shortDesc: "Comprehensive master program covering programming, web design, database administration, and software architecture.",
    overview: "The Post Graduate Diploma in Computer Application (PGDCA) is a flagship 12-month program engineered to prepare graduates for high-level technology roles in software engineering, database management, and IT administration.",
    learnings: [
      "Programming fundamentals in C, C++, and Python",
      "Relational Database Management Systems (SQL / MySQL)",
      "Web Technologies (HTML5, CSS3, JavaScript, PHP)",
      "Object-Oriented Analysis & Software Engineering",
      "Office Automation & AI Integrated Productivity"
    ],
    skills: ["Software Engineering", "Full-Stack Web Development", "Database Administration", "Python Programming"],
    careerRoles: ["Junior Software Developer", "Database Administrator", "Web Application Developer", "IT Systems Analyst"],
    careerPath: ["PGDCA Foundation", "Software Developer Intern", "Full Stack Engineer", "Senior Tech Lead"],
    certificates: [
      { provider: "G-Tec Education", name: "Post Graduate Diploma in Computer Application", logo: "assets/images/certificates/course-placeholder.svg" },
      { provider: "Certiport", name: "Information Technology Specialist (ITS)", logo: "assets/images/certificates/microsoft.svg" }
    ]
  },
  {
    id: "soft-adv-data-analysis-6m",
    category: "software",
    level: "diploma",
    title: "Advanced Diploma in Data Analysis",
    duration: "6 Months",
    image: "assets/images/courses/software/python.jpg",
    shortDesc: "Master statistical modeling, Power BI dashboards, Python data stack, and SQL query optimization for enterprise analytics.",
    overview: "This 6-month intensive diploma equips students with real-world analytical tools required by modern data-driven enterprises, including Power BI, Python Pandas, and advanced SQL data mining.",
    learnings: [
      "Data Cleaning & Feature Engineering with Pandas",
      "Power BI Interactive Dashboard Creation & DAX",
      "Advanced Excel Formulas, Pivot Charts & VBA",
      "Statistical Analysis & Data Visualization",
      "SQL Querying & Data Warehousing Basics"
    ],
    skills: ["Data Modeling", "Power BI DAX", "Python Analytics", "SQL Data Extraction"],
    careerRoles: ["Data Analyst", "Business Intelligence Specialist", "Operations Analyst", "Reporting Engineer"],
    careerPath: ["Diploma Completion", "Junior Analyst", "BI Developer", "Lead Data Strategist"],
    certificates: [
      { provider: "Microsoft", name: "Microsoft Certified: Power BI Data Analyst Associate", logo: "assets/images/certificates/microsoft.svg" }
    ]
  },
  {
    id: "soft-dca-6m",
    category: "software",
    level: "diploma",
    title: "Diploma in Computer Application (DCA)",
    duration: "6 Months",
    image: "assets/images/backgrounds/software-bg.jpg",
    shortDesc: "Core computer operational training including MS Office suite, basic programming, web design, and internet utilities.",
    overview: "DCA provides a robust foundation in computer science principles, hardware concepts, software tools, programming logic, and office productivity tools.",
    learnings: [
      "MS Office Suite (Word, Excel, PowerPoint, Access)",
      "Programming Logic in C",
      "HTML & CSS Web Fundamentals",
      "Cyber Safety & Internet Utilities",
      "Computer Operating Systems & Troubleshooting"
    ],
    skills: ["Office Automation", "C Programming", "Web Basics", "Computer Hardware Basics"],
    careerRoles: ["Computer Operator", "Office Administrator", "Technical Support Executive", "Data Entry Specialist"],
    careerPath: ["DCA Certification", "Administrative Executive", "Senior Office Lead", "IT Support Supervisor"],
    certificates: [
      { provider: "Microsoft", name: "Microsoft Office Specialist (MOS)", logo: "assets/images/certificates/microsoft.svg" }
    ]
  },
  {
    id: "soft-adv-g-operator",
    category: "software",
    level: "diploma",
    title: "Advanced G Operator",
    duration: "6 Months",
    image: "assets/images/backgrounds/software-bg.jpg",
    shortDesc: "Specialized G-Tec operator program combining advanced office automation, graphic utilities, and digital workflow tools.",
    overview: "Designed for high-efficiency administrative and technical support roles requiring multi-software operational mastery.",
    learnings: ["Advanced Excel & Automation", "Document Design & Desktop Publishing", "Internet & Cloud Operations", "Database Handling"],
    skills: ["Multitasking Systems Handling", "Cloud Productivity", "Data Processing"],
    careerRoles: ["Executive Computer Operator", "Data Manager", "Documentation Specialist"],
    careerPath: ["G Operator Training", "Operations Associate", "Office Manager"],
    certificates: [
      { provider: "G-Tec Education", name: "Advanced G-Operator Professional Certification", logo: "assets/images/certificates/course-placeholder.svg" }
    ]
  },
  {
    id: "soft-diploma-data-entry-4m",
    category: "software",
    level: "diploma",
    title: "Diploma in Data Entry",
    duration: "4 Months",
    image: "assets/images/backgrounds/software-bg.jpg",
    shortDesc: "High-speed touch typing, data validation, database entry tools, and error-free record management.",
    overview: "Focuses on speed, accuracy, data verification, and digital filing techniques across bilingual keyboard standards.",
    learnings: ["Touch Typing Mastery (English & Vernacular)", "MS Access & Excel Data Sheets", "Data Quality Control & Auditing", "Typing Ergonomics"],
    skills: ["High-speed Keying", "Spreadsheet Accuracy", "Data Verification"],
    careerRoles: ["Data Entry Operator", "Documentation Assistant", "Back Office Executive"],
    careerPath: ["Diploma Entry", "Data Specialist", "Data Operations Supervisor"],
    certificates: [
      { provider: "G-Tec Education", name: "Diploma in Professional Data Entry", logo: "assets/images/certificates/course-placeholder.svg" }
    ]
  },
  {
    id: "soft-diploma-data-analysis-4m",
    category: "software",
    level: "diploma",
    title: "Diploma in Data Analysis",
    duration: "4 Months",
    image: "assets/images/courses/software/python.jpg",
    shortDesc: "Fast-track analytics course covering Excel business intelligence, Power BI reports, and essential data metrics.",
    overview: "Build strong data literacy skills to turn complex numerical datasets into actionable executive insights.",
    learnings: ["Advanced Excel Formulas & VLOOKUP/XLOOKUP", "Pivot Charts & Slicers", "Power BI Basics", "Data Cleaning Techniques"],
    skills: ["Spreadsheet Modeling", "Power BI Reporting", "Data Visualization"],
    careerRoles: ["Junior Data Analyst", "MIS Executive", "Business Assistant"],
    careerPath: ["4-Month Analyst", "MIS Lead", "BI Associate"],
    certificates: [
      { provider: "Microsoft", name: "Microsoft Certified Data Analyst Associate", logo: "assets/images/certificates/microsoft.svg" }
    ]
  },
  {
    id: "soft-ai-ms-office-4m",
    category: "software",
    level: "diploma",
    title: "Diploma in AI Integrated MS Office",
    duration: "4 Months",
    image: "assets/images/backgrounds/software-bg.jpg",
    shortDesc: "Modern productivity course leveraging AI prompts, Microsoft Copilot features, and automated document generation.",
    overview: "Transform modern office workflows by integrating generative AI tools with traditional Microsoft Office applications.",
    learnings: ["AI Prompts for Excel & Word", "Automated Presentation Generation in PowerPoint", "Smart Data Wrangling", "Workflow Automation"],
    skills: ["AI Prompting", "Copilot Integration", "Smart Office Productivity"],
    careerRoles: ["AI Productivity Specialist", "Executive Assistant", "Digital Office Coordinator"],
    careerPath: ["AI Office Certified", "Senior Administrative Partner", "Operations Director"],
    certificates: [
      { provider: "Microsoft", name: "Microsoft Office Specialist (MOS) AI Integrated", logo: "assets/images/certificates/microsoft.svg" }
    ]
  },
  {
    id: "soft-diploma-git-8m",
    category: "software",
    level: "diploma",
    title: "Diploma in Graphics & Information Technology",
    duration: "8 Months",
    image: "assets/images/backgrounds/software-bg.jpg",
    shortDesc: "Dual-domain diploma blending graphic design fundamentals with essential IT and software operations.",
    overview: "Ideal for creative IT enthusiasts who want to manage both IT infrastructure and digital visual communications.",
    learnings: ["Photoshop & CorelDraw Fundamentals", "IT Hardware & Networking Basics", "Web Design Basics (HTML/CSS)", "Digital Media Production"],
    skills: ["Graphic Publishing", "IT Support", "Web Layouts"],
    careerRoles: ["IT Graphic Assistant", "Desktop Publishing Operator", "Web Content Coordinator"],
    careerPath: ["GIT Diploma", "UI/DTP Associate", "IT Creative Manager"],
    certificates: [
      { provider: "Adobe", name: "Adobe Certified Professional", logo: "assets/images/certificates/adobe.svg" },
      { provider: "Cisco", name: "Cisco Certified Support Technician (CCST)", logo: "assets/images/certificates/cisco.svg" }
    ]
  },
  {
    id: "soft-cert-powerbi-2m",
    category: "software",
    level: "certificate",
    title: "Certificate Course in Power BI",
    duration: "2 Months",
    image: "assets/images/courses/software/python.jpg",
    shortDesc: "Dedicated module for building interactive business dashboards, DAX queries, and ETL pipelines in Microsoft Power BI.",
    overview: "Master Power BI from data ingestion to interactive publishing on Power BI Service.",
    learnings: ["Power Query Data Transformation", "DAX Measures & Calculated Columns", "Interactive Report Design", "Row-Level Security & Publishing"],
    skills: ["Power BI", "DAX", "Data Modeling", "ETL Pipelines"],
    careerRoles: ["Power BI Developer", "Business Intelligence Specialist", "Data Visualization Analyst"],
    careerPath: ["Power BI Specialist", "Senior BI Developer", "Analytics Lead"],
    certificates: [
      { provider: "Microsoft", name: "Microsoft Power BI Certification", logo: "assets/images/certificates/microsoft.svg" }
    ]
  },
  {
    id: "soft-g-operator-3m",
    category: "software",
    level: "certificate",
    title: "G-Operator",
    duration: "3 Months",
    image: "assets/images/backgrounds/software-bg.jpg",
    shortDesc: "Core G-Tec certified operator course covering essential office tools and computer management.",
    overview: "Quick-start practical computer operating certificate for front-desk and back-office management.",
    learnings: ["Operating System Navigation", "Word Processing & Formatting", "Basic Spreadsheets", "Internet & Email Etiquette"],
    skills: ["Computer Fundamentals", "Office Operations", "Speed Typing"],
    careerRoles: ["Front Office Operator", "Data Entry Associate", "Receptionist Assistant"],
    careerPath: ["G-Operator", "Office Assistant", "Administrative Lead"],
    certificates: [
      { provider: "G-Tec Education", name: "G-Tec Certified Computer Operator", logo: "assets/images/certificates/course-placeholder.svg" }
    ]
  },
  {
    id: "soft-cert-msexcel-1m",
    category: "software",
    level: "certificate",
    title: "Certificate Course in MS Excel",
    duration: "1 Month",
    image: "assets/images/courses/software/python.jpg",
    shortDesc: "Focused 30-day practical training in spreadsheet formulas, formatting, tables, and data presentation.",
    overview: "Master foundational Excel concepts required for every office, retail, and business setting.",
    learnings: ["Formula Logic (SUM, AVERAGE, IF)", "Cell Formatting & Tables", "Charts & Graphs", "Print & Export Settings"],
    skills: ["Excel Core", "Data Organization", "Basic Analytics"],
    careerRoles: ["Excel Operator", "Billing Assistant", "Office Clerk"],
    careerPath: ["Excel Certified", "Office Administrator"],
    certificates: [
      { provider: "Microsoft", name: "Microsoft Office Specialist: Excel Associate", logo: "assets/images/certificates/microsoft.svg" }
    ]
  },
  {
    id: "soft-cert-adv-python-3m",
    category: "software",
    level: "certificate",
    title: "Certificate Course in Advanced Python",
    duration: "3 Months",
    image: "assets/images/courses/software/python.jpg",
    shortDesc: "Deep dive into OOP, data structures, web scraping, API development, and Python libraries.",
    overview: "Advance your Python mastery with object-oriented software engineering and modern backend frameworks.",
    learnings: ["OOP Concepts & Design Patterns", "File I/O & Exception Handling", "REST API Development with Flask/FastAPI", "Data Analysis with Pandas"],
    skills: ["Advanced Python", "OOP", "API Design", "Pandas"],
    careerRoles: ["Python Developer", "Backend Engineer", "Software Automation Trainee"],
    careerPath: ["Python Cert", "Python Engineer", "Senior Backend Architect"],
    certificates: [
      { provider: "Certiport", name: "IT Specialist: Python Programming", logo: "assets/images/certificates/microsoft.svg" },
      { provider: "EC-Council", name: "Certified Ethical Hacking Essential (EHE)", logo: "assets/images/certificates/eccouncil.svg" }
    ]
  },

  // ==========================================
  // ACCOUNTING COURSES (DISTINCT ACCOUNTING VISUALS)
  // ==========================================
  {
    id: "acc-mfa-12m",
    category: "accounting",
    level: "master",
    title: "Master in Financial Accounting",
    duration: "12 Months",
    image: "assets/images/courses/accounting/sap-fico.jpg",
    shortDesc: "Comprehensive master level program covering Indian & Foreign accounting, Tally Prime, GST, Corporate Finance, and ERP fundamentals.",
    overview: "The Master in Financial Accounting (MFA) prepares students for senior financial analyst and accounting management positions in domestic and global companies.",
    learnings: [
      "Financial Accounting Principles & Balance Sheet Preparation",
      "Tally Prime Advanced with Payroll & Inventory",
      "Goods & Services Tax (GST) Filing & Returns",
      "Corporate Finance & Auditing Standards",
      "Computerized Accounting Systems"
    ],
    skills: ["Financial Accounting", "Tally Prime", "GST Compliance", "Corporate Ledger"],
    careerRoles: ["Chief Accountant", "Financial Analyst", "Tax Consultant", "Audit Executive"],
    careerPath: ["MFA Student", "Junior Accountant", "Senior Accountant", "Finance Manager"],
    certificates: [
      { provider: "Tally Education", name: "Tally Essential Level 3 & Comprehensive", logo: "assets/images/certificates/tally.svg" },
      { provider: "Intuit", name: "Intuit QuickBooks Financial Certification", logo: "assets/images/certificates/intuit.svg" }
    ]
  },
  {
    id: "acc-prof-dip-sap-s4hana-11m",
    category: "accounting",
    level: "master",
    title: "Professional Diploma in Indian & Foreign Accounting in SAP S/4 HANA",
    duration: "11 Months",
    image: "assets/images/courses/accounting/sap-fico.jpg",
    shortDesc: "Master domestic Indian taxation, international accounting standards, and SAP S/4 HANA enterprise finance modules.",
    overview: "Equips accounting professionals with advanced dual-geography accounting skills and enterprise ERP SAP S/4HANA Finance practical training.",
    learnings: ["Indian Taxation (GST/TDS) & Gulf VAT", "SAP S/4 HANA Finance Ledger & Assets", "International Financial Reporting (IFRS)", "Financial Statements Analysis"],
    skills: ["SAP S/4 HANA Finance", "IFRS", "GST/VAT Compliance", "Foreign Accounting"],
    careerRoles: ["SAP Accounting Consultant", "Foreign Accounting Executive", "Tax Accountant"],
    careerPath: ["SAP Graduate", "SAP Finance Associate", "Senior SAP Specialist"],
    certificates: [
      { provider: "SAP Global", name: "SAP Certified Application Associate - SAP S/4HANA Financial Accounting", logo: "assets/images/certificates/sap.svg" }
    ]
  },
  {
    id: "acc-prof-dip-sap-fico-11m",
    category: "accounting",
    level: "master",
    title: "Professional Diploma in Indian and Foreign Accounting with SAP FICO",
    duration: "11 Months",
    image: "assets/images/backgrounds/accounting-bg.jpg",
    shortDesc: "In-depth corporate accounting program combining Tally Prime, Income Tax, GST, and SAP FICO module implementation.",
    overview: "Master General Ledger, Accounts Receivable, Accounts Payable, and Asset Accounting in SAP FICO alongside domestic tax systems.",
    learnings: ["SAP FICO Configuration & End-User Operations", "Tally Prime Advanced & GST Filing", "Corporate Accounting & Reconciliation", "Gulf VAT Basics"],
    skills: ["SAP FICO", "Tally Prime", "Corporate Reconciliation"],
    careerRoles: ["SAP FICO End-User", "Accounts Officer", "Senior Accountant"],
    careerPath: ["Diploma Completion", "Accounts Executive", "SAP FICO Lead"],
    certificates: [
      { provider: "SAP Global", name: "Certificate in SAP Financial Accounting & Controlling (FICO)", logo: "assets/images/certificates/sap.svg" },
      { provider: "Tally Education", name: "GST & TDS Using Tally", logo: "assets/images/certificates/tally.svg" }
    ]
  },
  {
    id: "acc-global-prof-acc-sap-fico-20m",
    category: "accounting",
    level: "master",
    title: "Global Professional Accounting with SAP FICO",
    duration: "20 Months",
    image: "assets/images/backgrounds/accounting-bg.jpg",
    shortDesc: "Extensive 20-month flagship master program targeting international finance careers, SAP FICO mastery, and global corporate taxation.",
    overview: "The ultimate 20-month global accounting qualification designed for individuals aiming for multinational finance careers in Gulf/Europe/Asia.",
    learnings: ["Global Accounting Standards (US GAAP & IFRS)", "Complete SAP FICO Architecture & Financial Controlling", "GCC VAT & Corporate Tax Regulations", "Advanced Corporate Auditing"],
    skills: ["Global Finance", "SAP FICO Master", "IFRS", "Corporate Taxation"],
    careerRoles: ["Global Finance Manager", "SAP Senior Consultant", "Internal Auditor"],
    careerPath: ["20-Month Scholar", "Senior Financial Analyst", "Global Finance Director"],
    certificates: [
      { provider: "SAP Global", name: "SAP Certified Enterprise Financial Consultant", logo: "assets/images/certificates/sap.svg" },
      { provider: "Tally Education", name: "Tally Essential International Certification", logo: "assets/images/certificates/tally.svg" }
    ]
  },
  {
    id: "acc-prof-gulf-acc-8m",
    category: "accounting",
    level: "diploma",
    title: "Professional Gulf Accountant",
    duration: "8 Months",
    image: "assets/images/backgrounds/accounting-bg.jpg",
    shortDesc: "Customized for jobs in GCC countries (UAE, Saudi, Qatar, Oman) with GCC VAT, Corporate Tax, and Arabic invoices.",
    overview: "Directly prepares candidates for high-demand Gulf accounting roles with practical Middle East taxation focus.",
    learnings: ["GCC VAT Law & Registration", "UAE Corporate Tax Compliance", "Arabic-English Bilingual Billing", "Tally Prime & Zoho Books"],
    skills: ["GCC VAT", "UAE Corporate Tax", "Gulf Accounting"],
    careerRoles: ["Gulf Accountant", "VAT Executive (GCC)", "Accounts Manager"],
    careerPath: ["Gulf Certified", "Chief Accountant (UAE/GCC)"],
    certificates: [
      { provider: "Tally Education", name: "GCC VAT using TALLY", logo: "assets/images/certificates/tally.svg" },
      { provider: "Zoho Books", name: "Zoho Books Certified Accountant", logo: "assets/images/certificates/zoho.svg" }
    ]
  },
  {
    id: "acc-g-accountant-tally-4m",
    category: "accounting",
    level: "certificate",
    title: "G-Accountant - Tally Essential Comprehensive",
    duration: "4 Months",
    image: "assets/images/backgrounds/accounting-bg.jpg",
    shortDesc: "Official G-Tec certified comprehensive Tally training covering vouchers, inventory, GST, and payroll.",
    overview: "The gold standard G-Tec certification for Tally Prime operations in business environments.",
    learnings: ["Company Creation & Chart of Accounts", "Inventory Management", "GST & TDS Ledgers", "Payroll & Reports"],
    skills: ["Tally Essential", "Inventory", "GST"],
    careerRoles: ["G-Certified Accountant", "Tally Specialist"],
    careerPath: ["G-Accountant", "Senior Accounts Executive"],
    certificates: [
      { provider: "Tally Education", name: "Tally Essential Comprehensive", logo: "assets/images/certificates/tally.svg" }
    ]
  },

  // ==========================================
  // MULTIMEDIA COURSES (DISTINCT MULTIMEDIA VISUALS)
  // ==========================================
  {
    id: "multi-dip-motion-graphics-7m",
    category: "multimedia",
    level: "diploma",
    title: "Diploma in Motion Graphics",
    duration: "7 Months",
    image: "assets/images/backgrounds/multimedia-bg.jpg",
    shortDesc: "7-month professional diploma in 2D/3D motion design, visual effects (VFX), video editing, and animation graphics.",
    overview: "Master motion graphics artwork, kinetic typography, compositing, and video post-production using Adobe After Effects and Premiere Pro.",
    learnings: [
      "Adobe After Effects Keyframing & Compositing",
      "Adobe Premiere Pro Video Editing & Audio Mixing",
      "Kinetic Typography & Title Animation",
      "Green Screen Keying & Visual Effects (VFX)",
      "Portfolio Project & Reel Creation"
    ],
    skills: ["Motion Graphics", "After Effects", "Premiere Pro", "VFX Compositing"],
    careerRoles: ["Motion Graphics Designer", "Video Editor", "VFX Artist", "Digital Content Creator"],
    careerPath: ["Diploma Student", "Junior Motion Designer", "Senior Video Editor", "Creative Director"],
    certificates: [
      { provider: "Adobe", name: "Adobe Certified Professional (Visual Effects)", logo: "assets/images/certificates/adobe.svg" }
    ]
  },
  {
    id: "multi-dip-ai-graphics-6m",
    category: "multimedia",
    level: "diploma",
    title: "Diploma in AI Integrated Graphics Designing",
    duration: "6 Months",
    image: "assets/images/backgrounds/multimedia-bg.jpg",
    shortDesc: "Modern creative diploma combining traditional design principles with Midjourney, Firefly, and Photoshop AI tools.",
    overview: "Revolutionize your graphic design workflow by pairing Adobe Photoshop & Illustrator with generative AI tools.",
    learnings: [
      "Adobe Photoshop & Illustrator Mastery",
      "AI Prompt Engineering for Visual Assets",
      "Adobe Firefly Generative Fill & Expand",
      "Brand Identity & Vector Illustration",
      "UI/UX Layout Concepts & Prototyping"
    ],
    skills: ["AI Graphic Design", "Adobe Photoshop", "Adobe Illustrator", "AI Prompting"],
    careerRoles: ["AI Graphic Designer", "Creative Brand Designer", "UI/UX Layout Artist"],
    careerPath: ["AI Designer", "Senior Brand Stylist", "Creative Lead"],
    certificates: [
      { provider: "Adobe", name: "Adobe Certified Professional (Graphic Design)", logo: "assets/images/certificates/adobe.svg" },
      { provider: "Meta", name: "Meta Certified Digital Marketing Associate", logo: "assets/images/certificates/meta.svg" }
    ]
  },
  {
    id: "multi-cert-adv-photoshop-2m",
    category: "multimedia",
    level: "certificate",
    title: "Certificate Course in Advanced Adobe Photoshop",
    duration: "2 Months",
    image: "assets/images/backgrounds/multimedia-bg.jpg",
    shortDesc: "Master non-destructive photo editing, complex masking, retouching, color grading, and digital manipulation.",
    overview: "Take your Photoshop skills to professional studio grade with advanced retouching techniques.",
    learnings: ["Pen Tool & Advanced Selections", "Layer Masks & Frequency Separation", "Camera Raw & Color Grading", "Digital Compositing"],
    skills: ["Advanced Photoshop", "Photo Retouching", "Color Grading"],
    careerRoles: ["Photo Retoucher", "Digital Image Editor", "Graphic Artist"],
    careerPath: ["Photoshop Specialist", "Senior Retoucher"],
    certificates: [
      { provider: "Adobe", name: "Adobe Certified Professional in Visual Design", logo: "assets/images/certificates/adobe.svg" }
    ]
  },

  // ==========================================
  // SAP GLOBAL COURSES (DISTINCT SAP VISUALS)
  // ==========================================
  {
    id: "sap-fin-s4hana-3m",
    category: "sap",
    level: "sap",
    title: "Certificate in SAP Finance and Accounting (S/4HANA)",
    duration: "3 Months",
    image: "assets/images/courses/accounting/sap-fico.jpg",
    shortDesc: "Focused 3-month ERP certification in SAP S/4HANA Finance module configuration, general ledger, and reporting.",
    overview: "Intensive 90-day practical ERP course focused strictly on SAP S/4HANA Financial Accounting module operations.",
    learnings: ["S/4HANA Navigation & Organizational Units", "General Ledger Accounting", "Accounts Payable & Receivable", "Asset Accounting & Financial Closing"],
    skills: ["SAP S/4HANA FI", "GL Posting", "Financial Closing"],
    careerRoles: ["SAP FI End User", "SAP Financial Associate", "Junior SAP Consultant"],
    careerPath: ["SAP Certified", "SAP FI Consultant", "Senior SAP Lead"],
    certificates: [
      { provider: "SAP Global", name: "SAP Certified Application Associate - S/4HANA Financial Accounting", logo: "assets/images/certificates/sap.svg" }
    ]
  },
  {
    id: "sap-mm-s4hana-3m",
    category: "sap",
    level: "sap",
    title: "Certificate in SAP Material Management (S/4HANA)",
    duration: "3 Months",
    image: "assets/images/courses/accounting/sap-fico.jpg",
    shortDesc: "Specialized 3-month ERP certification in SAP S/4HANA Material Management (MM), procurement, and inventory control.",
    overview: "Learn supply chain management and procurement automation using SAP S/4HANA Material Management.",
    learnings: ["Procure-to-Pay (P2P) Cycle", "Master Data (Material & Vendor)", "Purchasing & Inventory Management", "Invoice Verification"],
    skills: ["SAP MM", "Procurement Automation", "Inventory Control"],
    careerRoles: ["SAP MM End User", "Procurement Specialist", "Inventory Controller"],
    careerPath: ["SAP MM Certified", "Supply Chain Analyst", "SAP MM Consultant"],
    certificates: [
      { provider: "SAP Global", name: "SAP Certified Application Associate - S/4HANA Material Management", logo: "assets/images/certificates/sap.svg" }
    ]
  }
];

// Helper Functions
function getCourseById(id) {
  return COURSES_DATA.find(c => c.id === id);
}

function getCoursesByCategory(category) {
  if (!category || category === 'all') return COURSES_DATA;
  return COURSES_DATA.filter(c => c.category === category);
}

/**
 * Master Dataset Statistics Calculator
 */
function getCourseStats() {
  return {
    total: COURSES_DATA.length,
    software: COURSES_DATA.filter(c => c.category === "software").length,
    accounting: COURSES_DATA.filter(c => c.category === "accounting").length,
    multimedia: COURSES_DATA.filter(c => c.category === "multimedia").length,
    sap: COURSES_DATA.filter(c => c.category === "sap").length,
    master: COURSES_DATA.filter(c => c.level === "master").length,
    diploma: COURSES_DATA.filter(c => c.level === "diploma").length,
    certificate: COURSES_DATA.filter(c => c.level === "certificate" || c.level === "sap").length
  };
}

/**
 * Dynamic Category-Specific Statistics Calculator
 */
function getCategoryStats(category) {
  const categoryCourses = getCoursesByCategory(category);
  const total = categoryCourses.length;
  const master = categoryCourses.filter(c => c.level === "master").length;
  const diploma = categoryCourses.filter(c => c.level === "diploma").length;
  const certificate = categoryCourses.filter(c => c.level === "certificate" || c.level === "sap").length;
  
  const providersSet = new Set();
  categoryCourses.forEach(c => {
    if (c.certificates && Array.isArray(c.certificates)) {
      c.certificates.forEach(cert => {
        if (cert.provider) providersSet.add(cert.provider);
      });
    }
  });
  if (typeof CERTIFICATES_DATA !== 'undefined' && Array.isArray(CERTIFICATES_DATA)) {
    CERTIFICATES_DATA.filter(cert => cert.category === category || cert.category === 'all').forEach(cert => {
      if (cert.provider) providersSet.add(cert.provider);
    });
  }
  
  return {
    total,
    master,
    diploma,
    certificate,
    certOptions: Math.max(providersSet.size, 1)
  };
}

/**
 * Render Course Cards Grid with Guaranteed Image Fallbacks & Consistent Level/Category/Duration Order
 */
function renderCourseCards(containerId, coursesList) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!coursesList || coursesList.length === 0) {
    container.innerHTML = `<div class="no-courses-found" style="grid-column: 1/-1; text-align: center; padding: 3rem; background: #FFF; border-radius: 12px; border: 1px solid #D4AF37;">No courses found matching your criteria.</div>`;
    return;
  }

  const managedSettings = window.GTEC_MANAGED_SETTINGS || {};
  const defaultJoinUrl = managedSettings.form || GTEC_FORM_URL;

  container.innerHTML = coursesList.map(course => {
    const defaultImg = CATEGORY_FALLBACK_IMAGES[course.category] || CATEGORY_FALLBACK_IMAGES.software;
    const certBadge = (course.certificates && course.certificates[0]) 
      ? `📜 ${course.certificates[0].provider}: ${course.certificates[0].name}` 
      : `📜 G-TEC Certificate`;

    // Safely normalize course level (MASTER, DIPLOMA, CERTIFICATE)
    const rawLevel = (course.level || "certificate").toLowerCase();
    let displayLevel = "CERTIFICATE";
    let levelClass = "badge-certificate";

    if (rawLevel.includes("master")) {
      displayLevel = "MASTER";
      levelClass = "badge-master";
    } else if (rawLevel.includes("diploma")) {
      displayLevel = "DIPLOMA";
      levelClass = "badge-diploma";
    } else {
      displayLevel = "CERTIFICATE";
      levelClass = "badge-certificate";
    }

    return `
      <article class="course-card glass-card is-visible">
        <div class="card-img-wrapper">
          <img src="${course.image || defaultImg}" alt="${course.title}" class="card-img" loading="lazy" onerror="this.src='${defaultImg}'" />
          <span class="card-level-badge badge ${levelClass}">${displayLevel}</span>
        </div>
        <div class="card-content">
          <!-- CARD BADGES ORDER: LEVEL -> CATEGORY -> DURATION -->
          <div class="card-badges-row">
            <span class="badge ${levelClass}">${displayLevel}</span>
            <span class="badge badge-gold">${course.category.toUpperCase()}</span>
          </div>
          <div class="card-duration">⏱️ ${course.duration.toUpperCase()}</div>
          <h3 class="card-title">${course.title}</h3>
          <p class="card-desc">${course.shortDesc}</p>
          <div class="card-cert-info">${certBadge}</div>
          ${course.fee ? `<div class="card-cert-info"><strong>Fee:</strong> ${course.fee}</div>` : ''}
          <div class="card-footer-btns">
            <button class="btn btn-primary btn-sm" onclick="openCourseModal('${course.id}')">View Details</button>
            <a href="${course.enquiryLink || defaultJoinUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm btn-glow">Join Now</a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  if (typeof initScrollReveals === "function") {
    initScrollReveals();
  }
}

/**
 * Open Course Details Modal
 */
function openCourseModal(courseId) {
  const course = getCourseById(courseId);
  if (!course) return;

  let modal = document.getElementById("course-details-modal");
  if (!modal) {
    modal = createModalDOM();
  }

  const encodedTitle = encodeURIComponent(`Hi G-Tec Rajakumari, I would like to inquire about the course: ${course.title} (${course.duration || 'Flexible'}).`);
  const managedSettings = window.GTEC_MANAGED_SETTINGS || {};
  const whatsappNumber = String(managedSettings.whatsapp || GTEC_WHATSAPP_NUM).replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedTitle}`;
  const defaultImg = CATEGORY_FALLBACK_IMAGES[course.category] || CATEGORY_FALLBACK_IMAGES.software;

  document.getElementById("modal-course-title").textContent = course.title;
  document.getElementById("modal-course-meta").innerHTML = `
    <span><strong>Category:</strong> ${course.category.toUpperCase()}</span> | 
    <span><strong>Level:</strong> ${(course.level || 'Certificate').toUpperCase()}</span> | 
    <span><strong>Duration:</strong> ${course.duration}</span>${course.fee ? ` | <span><strong>Fee:</strong> ${course.fee}</span>` : ''}
  `;
  document.getElementById("modal-course-overview").textContent = course.overview || course.shortDesc;
  document.getElementById("modal-course-img").src = course.image || defaultImg;
  document.getElementById("modal-course-img").onerror = function() { this.src = defaultImg; };

  // Learnings / Features
  const learningsList = document.getElementById("modal-course-learnings");
  if (learningsList) {
    let items = course.learnings && course.learnings.length ? course.learnings : (course.features ? String(course.features).split(/\r?\n/).map(x => x.trim()).filter(Boolean) : []);
    learningsList.innerHTML = items.map(item => `<li>✓ ${item}</li>`).join("");
    const section = learningsList.closest('.modal-section');
    if (section) section.style.display = items.length ? '' : 'none';
  }

  // Skills
  const skillsList = document.getElementById("modal-course-skills");
  if (skillsList) {
    const skills = course.skills || [];
    skillsList.innerHTML = skills.map(skill => `<span class="badge badge-gold" style="margin: 0.2rem;">${skill}</span>`).join(" ");
    const section = skillsList.closest('.modal-section');
    if (section) section.style.display = skills.length ? '' : 'none';
  }

  // Career Roles
  const rolesList = document.getElementById("modal-course-roles");
  if (rolesList) {
    const roles = course.careerRoles || [];
    rolesList.innerHTML = roles.map(role => `<li>• ${role}</li>`).join("");
    const section = rolesList.closest('.modal-section');
    if (section) section.style.display = roles.length ? '' : 'none';
  }

  const featuresList = document.getElementById("modal-course-features");
  if (featuresList) {
    const features = String(course.features || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean);
    featuresList.innerHTML = features.map(item => `<li>• ${item}</li>`).join("");
    const section = featuresList.closest('.modal-section');
    if (section) section.style.display = features.length ? '' : 'none';
  }

  // Certificates List inside Modal
  const certContainer = document.getElementById("modal-course-certs");
  if (certContainer) {
    let matchedCertificates = [];
    if (typeof CERTIFICATES_DATA !== 'undefined' && Array.isArray(CERTIFICATES_DATA)) {
      matchedCertificates = CERTIFICATES_DATA.filter(cert => 
        cert.global || 
        (cert.relatedCourses && cert.relatedCourses.some(rc => 
          rc.toLowerCase().includes(course.title.toLowerCase()) || 
          course.title.toLowerCase().includes(rc.toLowerCase())
        ))
      ).map(c => ({ provider: c.provider, name: c.name, logo: c.logo }));
    }
    const combinedCerts = [
      ...(course.certificates || []),
      ...matchedCertificates,
      { provider: "G-TEC Education Rajakumari", name: "G-TEC Certificate", logo: "assets/images/certificates/course-placeholder.svg" }
    ];
    const uniqueCerts = [];
    const seen = new Set();
    combinedCerts.forEach(cert => {
      const key = `${cert.provider}:${cert.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueCerts.push(cert);
      }
    });
    certContainer.innerHTML = uniqueCerts.map(cert => `
      <div class="modal-cert-card">
        <img src="${cert.logo || 'assets/images/certificates/course-placeholder.svg'}" alt="${cert.provider} Logo" class="modal-cert-logo" onerror="this.src='assets/images/certificates/course-placeholder.svg'" />
        <div>
          <div class="modal-cert-provider">${cert.provider}</div>
          <div class="modal-cert-name">${cert.name}</div>
        </div>
      </div>
    `).join("");
  }

  // Buttons
  document.getElementById("modal-join-btn").href = course.enquiryLink || managedSettings.form || GTEC_FORM_URL;
  document.getElementById("modal-wa-btn").href = whatsappUrl;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function createModalDOM() {
  const modalHTML = `
    <div id="course-details-modal" class="modal-overlay">
      <div class="modal-card">
        <button class="modal-close-btn" onclick="closeCourseModal()">&times;</button>
        <div class="modal-header">
          <h2 id="modal-course-title" class="modal-heading">Course Title</h2>
          <div id="modal-course-meta" class="modal-meta"></div>
        </div>
        <div class="modal-body-grid">
          <div>
            <img id="modal-course-img" src="" alt="Course Visual" class="modal-cover-img" />
            
            <div class="modal-section">
              <h3>Certificate & Accreditation</h3>
              <div id="modal-course-certs" class="modal-cert-list"></div>
            </div>

            <div class="modal-section">
              <h3>Skills You Gain</h3>
              <div id="modal-course-skills"></div>
            </div>
          </div>

          <div>
            <div class="modal-section">
              <h3>Course Overview</h3>
              <p id="modal-course-overview" style="font-size: 0.95rem; color: var(--text-muted);"></p>
            </div>

            <div class="modal-section">
              <h3>What You Will Learn</h3>
              <ul id="modal-course-learnings" style="font-size: 0.9rem; color: var(--text-main); list-style: none;"></ul>
            </div>

            <div class="modal-section">
              <h3>Career Opportunities</h3>
              <ul id="modal-course-roles" style="font-size: 0.9rem; color: var(--text-main); list-style: none;"></ul>
            </div>

            <div class="modal-section">
              <h3>Course Features</h3>
              <ul id="modal-course-features" style="font-size: 0.9rem; color: var(--text-main); list-style: none;"></ul>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
              <a id="modal-join-btn" href="" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-glow" style="flex: 1;">
                Join Now (Google Form)
              </a>
              <a id="modal-wa-btn" href="" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="flex: 1;">
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  
  const modal = document.getElementById("course-details-modal");
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeCourseModal();
  });

  return modal;
}

function closeCourseModal() {
  const modal = document.getElementById("course-details-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}
