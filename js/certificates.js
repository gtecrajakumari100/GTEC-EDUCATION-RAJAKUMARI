/**
 * G-TEC EDUCATION RAJAKUMARI - INTERNATIONAL CERTIFICATES DATA ENGINE
 * Master list of 28 global certifications (Microsoft, Meta, Adobe, SAP, Tally, EC-Council 7-cert suite, Cisco, PMI, Autodesk, Zoho Books, Intuit, etc.)
 */

const CERTIFICATES_DATA = [
  {
    id: "cert-meta-dm",
    name: "Meta Certified Digital Marketing Associate",
    provider: "Meta",
    category: "multimedia",
    logo: "assets/images/certificates/meta.svg",
    description: "Industry-recognized credential validating foundational digital marketing techniques across Meta platforms.",
    relatedCourses: ["Diploma in AI Integrated Graphics Designing", "Graphics and Web Expert"]
  },
  {
    id: "cert-ms-office-spec",
    name: "Microsoft Office Specialist (MOS)",
    provider: "Microsoft",
    category: "software",
    logo: "assets/images/certificates/microsoft.svg",
    description: "Globally accredited certification validating expert skills in Microsoft Excel, Word, PowerPoint, and Access.",
    relatedCourses: ["Diploma in AI Integrated MS Office", "Certificate Course in Advanced Excel", "DCA"]
  },
  {
    id: "cert-intuit",
    name: "Intuit Certifications",
    provider: "Intuit",
    category: "accounting",
    logo: "assets/images/certificates/intuit.svg",
    description: "Certification in QuickBooks Online accounting software for global small-to-medium enterprise bookkeeping.",
    relatedCourses: ["Diploma in International Finance Management", "Smart Accountant"]
  },
  {
    id: "cert-zoho-books",
    name: "Prime Students Certification in ZOHO BOOKS",
    provider: "Zoho Books",
    category: "accounting",
    logo: "assets/images/certificates/zoho.svg",
    description: "Recognized certification in cloud accounting, automated billing, and GST compliance using Zoho Books.",
    relatedCourses: ["Professional Certification in AI Integrated Accounting", "Smart Accountant"]
  },
  {
    id: "cert-its",
    name: "Information Technology Specialist (ITS)",
    provider: "Certiport",
    category: "software",
    logo: "assets/images/certificates/microsoft.svg",
    description: "Validates foundational IT knowledge across software development, database administration, and python coding.",
    relatedCourses: ["PGDCA", "Diploma in Computer Application"]
  },
  {
    id: "cert-adobe-prof",
    name: "Adobe Certified Professional",
    provider: "Adobe",
    category: "multimedia",
    logo: "assets/images/certificates/adobe.svg",
    description: "Industry-standard certification validating expert capabilities in Adobe Photoshop, Illustrator, and Premiere Pro.",
    relatedCourses: ["Diploma in Motion Graphics", "Certificate Course in Advanced Adobe Photoshop", "Adobe Illustrator"]
  },
  {
    id: "cert-autodesk",
    name: "AUTODESK Certified User",
    provider: "Autodesk",
    category: "multimedia",
    logo: "assets/images/certificates/autodesk.svg",
    description: "Validates entry-level 2D/3D CAD design and modeling skills required for engineering and visual media production.",
    relatedCourses: ["Diploma in Motion Graphics", "Graphics and Web Expert"]
  },
  {
    id: "cert-digital-literacy",
    name: "Digital Literacy Certification",
    provider: "G-Tec Global",
    category: "software",
    logo: "assets/images/certificates/course-placeholder.svg",
    description: "Foundational digital skills credential covering operating systems, internet security, and office productivity.",
    relatedCourses: ["G-Operator", "Diploma in Data Entry"]
  },
  {
    id: "cert-esb",
    name: "ESB Entrepreneurship and Small Business",
    provider: "Certiport",
    category: "accounting",
    logo: "assets/images/certificates/intuit.svg",
    description: "Certification confirming readiness to launch, manage, and scale small business financial operations.",
    relatedCourses: ["Master in Corporate Management with SAP", "Professional Accountant"]
  },
  {
    id: "cert-pmi-ready",
    name: "PMI Project Management Ready",
    provider: "PMI",
    category: "software",
    logo: "assets/images/certificates/pmi.svg",
    description: "Project Management Institute (PMI) credential introducing foundational project management frameworks.",
    relatedCourses: ["Master in Corporate Management with SAP", "PGDCA"]
  },
  {
    id: "cert-cisco-support",
    name: "Cisco Certified Support Technician (CCST)",
    provider: "Cisco",
    category: "software",
    logo: "assets/images/certificates/cisco.svg",
    description: "Validates fundamental networking, IT infrastructure, hardware troubleshooting, and cybersecurity concepts.",
    relatedCourses: ["Diploma in Graphics & Information Technology"]
  },
  {
    id: "cert-eccouncil-suite",
    name: "EC-Council Security Certification Suite",
    provider: "EC-Council",
    category: "software",
    logo: "assets/images/certificates/eccouncil.svg",
    description: "Master cybersecurity suite from EC-Council validating ethical hacking, SOC monitoring, and network defense.",
    relatedCourses: ["Diploma in Computer Application", "Certificate Course in Advanced Python"]
  },
  {
    id: "cert-ecc-cptp",
    name: "Certified Penetration Testing Professional (CPENT)",
    provider: "EC-Council",
    category: "software",
    logo: "assets/images/certificates/eccouncil.svg",
    description: "Advanced penetration testing certification assessing network attack techniques and vulnerability discovery.",
    relatedCourses: ["Certificate Course in Advanced Python"]
  },
  {
    id: "cert-ecc-cscu",
    name: "Certified Secure Computer User (CSCU)",
    provider: "EC-Council",
    category: "software",
    logo: "assets/images/certificates/eccouncil.svg",
    description: "Provides individuals with essential security knowledge to safeguard information assets in connected environments.",
    relatedCourses: ["Diploma in Computer Application", "DCA"]
  },
  {
    id: "cert-ecc-ehe",
    name: "Ethical Hacking Essential (EHE)",
    provider: "EC-Council",
    category: "software",
    logo: "assets/images/certificates/eccouncil.svg",
    description: "Foundational ethical hacking certification covering offensive security concepts and defensive controls.",
    relatedCourses: ["Certificate Course in Advanced Python"]
  },
  {
    id: "cert-ecc-nde",
    name: "Network Defense Essential (NDE)",
    provider: "EC-Council",
    category: "software",
    logo: "assets/images/certificates/eccouncil.svg",
    description: "Certification covering network security fundamentals, firewalls, threat monitoring, and perimeter defense.",
    relatedCourses: ["Diploma in Graphics & Information Technology"]
  },
  {
    id: "cert-ecc-dfe",
    name: "Digital Forensic Essential (DFE)",
    provider: "EC-Council",
    category: "software",
    logo: "assets/images/certificates/eccouncil.svg",
    description: "Introduces computer forensics principles, digital evidence collection, and incident investigation.",
    relatedCourses: ["Advanced Diploma in Data Analysis"]
  },
  {
    id: "cert-ecc-cct",
    name: "CCT - Certified Cybersecurity Technician",
    provider: "EC-Council",
    category: "software",
    logo: "assets/images/certificates/eccouncil.svg",
    description: "Entry-level cybersecurity operational certification covering network defense, ethical hacking, and SOC monitoring.",
    relatedCourses: ["Diploma in Computer Application"]
  },
  {
    id: "cert-ecc-csa",
    name: "CSA - Certified SOC Analyst",
    provider: "EC-Council",
    category: "software",
    logo: "assets/images/certificates/eccouncil.svg",
    description: "Specialized Security Operations Center (SOC) training covering SIEM log analysis and incident handling.",
    relatedCourses: ["Advanced Diploma in Data Analysis"]
  },
  {
    id: "cert-tally-comp",
    name: "Tally Essential Comprehensive",
    provider: "Tally Education",
    category: "accounting",
    logo: "assets/images/certificates/tally.svg",
    description: "Complete certification in Tally Prime covering voucher posting, inventory control, GST ledgers, and payroll.",
    relatedCourses: ["G-Accountant - Tally Essential Comprehensive", "Diploma in Finance Management with SAP FICO & Tally"]
  },
  {
    id: "cert-tally-prof",
    name: "Tally Professional",
    provider: "Tally Education",
    category: "accounting",
    logo: "assets/images/certificates/tally.svg",
    description: "Advanced Tally certification covering Manufacturing BOM, Cost Centers, Advanced GST, and Audit Trail.",
    relatedCourses: ["Certificate Course in Tally Professional", "Diploma in Professional and Taxation with Tally Prime"]
  },
  {
    id: "cert-tally-gcc-vat",
    name: "GCC VAT using TALLY",
    provider: "Tally Education",
    category: "accounting",
    logo: "assets/images/certificates/tally.svg",
    description: "Specialized GCC tax module certification for UAE, Saudi, Qatar, and Oman Gulf accounting standards.",
    relatedCourses: ["Professional Certification in AI Integrated Accounting with GCC VAT & Corporate Tax", "Professional Gulf Accountant"]
  },
  {
    id: "cert-tally-gst",
    name: "GST Using TALLY",
    provider: "Tally Education",
    category: "accounting",
    logo: "assets/images/certificates/tally.svg",
    description: "Dedicated GST compliance certification covering GSTR-1, GSTR-3B filings and E-Way bills in Tally Prime.",
    relatedCourses: ["Certification in GST Filing", "Professional Accountant Tally Prime with GST"]
  },
  {
    id: "cert-tally-lvl1",
    name: "TALLY Essential Level 1",
    provider: "Tally Education",
    category: "accounting",
    logo: "assets/images/certificates/tally.svg",
    description: "Foundational Tally Prime credential covering chart of accounts and daily journal voucher entry.",
    relatedCourses: ["G-Tally", "Certificate Course in Tally and Advanced Excel"]
  },
  {
    id: "cert-tally-lvl2",
    name: "TALLY Essential Level 2",
    provider: "Tally Education",
    category: "accounting",
    logo: "assets/images/certificates/tally.svg",
    description: "Intermediate Tally Prime credential focusing on inventory valuation, order processing, and daybook auditing.",
    relatedCourses: ["Diploma in Computerized Accounting Packages"]
  },
  {
    id: "cert-tally-lvl3",
    name: "TALLY Essential Level 3",
    provider: "Tally Education",
    category: "accounting",
    logo: "assets/images/certificates/tally.svg",
    description: "Advanced Tally Prime credential covering payroll, TDS computation, and multi-currency ledgers.",
    relatedCourses: ["Master in Financial Accounting"]
  },
  {
    id: "cert-tally-tds",
    name: "TDS Using TALLY",
    provider: "Tally Education",
    category: "accounting",
    logo: "assets/images/certificates/tally.svg",
    description: "Tax Deducted at Source (TDS) computation, challenger generation, and quarterly return filing via Tally.",
    relatedCourses: ["Diploma in Professional and Taxation with Tally Prime"]
  },
  {
    id: "cert-tally-intl",
    name: "Tally Essential International",
    provider: "Tally Education",
    category: "accounting",
    logo: "assets/images/certificates/tally.svg",
    description: "Global cross-border bookkeeping certification using Tally Prime international multi-currency features.",
    relatedCourses: ["Global Professional Accounting", "Certified Global Accountant"]
  }
];

function renderCertificatesGrid(containerId, certsList) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!certsList || certsList.length === 0) {
    container.innerHTML = `<div class="no-courses-found">No certificates match your search query.</div>`;
    return;
  }

  const defaultLogo = "assets/images/certificates/course-placeholder.svg";

  const getCategoryTag = (provider) => {
    const p = (provider || '').toLowerCase();
    if (p.includes('microsoft')) return 'Technology Certification';
    if (p.includes('meta')) return 'Industry Credential';
    if (p.includes('adobe')) return 'Software & Design';
    if (p.includes('sap')) return 'Professional Certification';
    if (p.includes('tally')) return 'Accounting Certification';
    if (p.includes('ec-council') || p.includes('eccouncil')) return 'Cybersecurity Certification';
    if (p.includes('cisco')) return 'Networking Certification';
    if (p.includes('zoho')) return 'Financial Software';
    return 'Professional Certification';
  };

  container.innerHTML = certsList.map(cert => `
    <article class="certificate-card glass-card is-visible" data-category="${cert.category || 'software'}">
      <div class="cert-card-header">
        <img src="${cert.logo || defaultLogo}" alt="${cert.provider} Logo" class="cert-provider-logo" onerror="this.src='${defaultLogo}'" />
        <span class="badge badge-gold">${getCategoryTag(cert.provider)}</span>
      </div>
      <div class="cert-card-body">
        <h3 class="cert-card-title">${cert.name}</h3>
        <p class="cert-card-provider">Provider: ${cert.provider}${cert.university ? ` · ${cert.university}` : ''}</p>
        <p class="cert-card-desc">${cert.description}</p>
        <div class="cert-card-courses">
          <strong>Associated Courses:</strong>
          <ul>
            ${cert.relatedCourses.map(c => `<li>• ${c}</li>`).join("")}
          </ul>
        </div>
      </div>
      <div class="cert-card-footer">
        <a href="${(window.GTEC_MANAGED_SETTINGS && window.GTEC_MANAGED_SETTINGS.form) || 'https://docs.google.com/forms/d/e/1FAIpQLSeJFvyySrpeK4BG2ZAZUw_M4-Ct95dRPb6ZQ-bz7sEQKCxLtQ/viewform'}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-glow btn-sm" style="width: 100%;" data-gtec-form>
          Get Certified (Enroll Now)
        </a>
      </div>
    </article>
  `).join("");

  if (typeof initScrollReveals === "function") {
    initScrollReveals();
  }
}
