const fallbackProjects = [
  {
    id: "ash-civic-rail-2026",
    title: "Civic Rail Terminal Modernization",
    category: "Transport Infrastructure",
    location: "Lagos, Nigeria",
    issuingOrganization: "Apex Strategic Holdings Infrastructure Office",
    estimatedValue: 184000000,
    currency: "USD",
    deadline: "2026-08-21T17:00:00+01:00",
    status: "Open",
    summary: "Design-build modernization of a multi-modal rail terminal including concourse upgrades, passenger systems, energy resilience, and phased operational continuity.",
    thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    publicNotice: "/documents/public/ash-civic-rail-notice.pdf",
    packagePrice: 2450,
    packageCode: "RAIL-MOD-PKG-2026",
    issuingType: "Private stakeholder mandate",
    timeline: [["Public notice issued", "2026-05-16"], ["Pre-bid conference", "2026-06-12"], ["Final questions due", "2026-07-03"], ["Submission deadline", "2026-08-21"], ["Preferred bidder notice", "2026-10-02"]],
    scope: ["Terminal civil works and passenger flow reconfiguration", "MEP upgrades, backup power, fire protection, and building controls", "Digital signage, access control, CCTV, and networked systems", "Night work phasing plan to maintain active operations"],
    requirements: ["Minimum 10 years comparable transport infrastructure experience", "Audited financial statements for the last three fiscal years", "ISO 9001-aligned quality management system", "Bonding capacity equal to at least 20% of contract value"],
    premiumDocuments: ["Full technical specification set", "Architectural and civil drawing package", "Systems integration matrix", "Tender addendum register"]
  },
  {
    id: "ash-grid-storage-2026",
    title: "Grid Storage and Renewable Integration Program",
    category: "Energy",
    location: "Accra, Ghana",
    issuingOrganization: "Apex Strategic Holdings Energy Advisory",
    estimatedValue: 96000000,
    currency: "USD",
    deadline: "2026-07-29T16:00:00+00:00",
    status: "Open",
    summary: "Procurement of EPC and O&M services for battery energy storage systems supporting renewable dispatch, grid stability, and peak shaving.",
    thumbnail: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80",
    publicNotice: "/documents/public/ash-grid-storage-notice.pdf",
    packagePrice: 1800,
    packageCode: "GRID-BESS-PKG-2026",
    issuingType: "Investor-backed commercial procurement",
    timeline: [["Expression of interest window opens", "2026-05-20"], ["Technical clarification webinar", "2026-06-18"], ["Site visit window", "2026-06-24"], ["Submission deadline", "2026-07-29"], ["Commercial negotiations", "2026-09-09"]],
    scope: ["Battery energy storage system design and installation", "Power conversion systems, EMS, SCADA, and telemetry", "Grid interconnection support and commissioning", "Five-year operations and maintenance framework"],
    requirements: ["Demonstrated delivery of at least 100 MWh BESS capacity", "Grid compliance and interconnection experience in West Africa", "OEM warranty support and spare parts plan", "Documented HSE management system"],
    premiumDocuments: ["Interconnection requirements brief", "Single line diagrams", "Technical performance guarantees", "Draft EPC and O&M contract exhibits"]
  },
  {
    id: "ash-commercial-campus-2026",
    title: "Regional Commercial Campus Development",
    category: "Commercial Real Estate",
    location: "Abuja, Nigeria",
    issuingOrganization: "Apex Strategic Holdings Development Group",
    estimatedValue: 142000000,
    currency: "USD",
    deadline: "2026-09-11T17:00:00+01:00",
    status: "Prequalification",
    summary: "Prequalification for general contractors and specialist trades for a mixed-use commercial campus with office, retail, and structured parking assets.",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
    publicNotice: "/documents/public/ash-commercial-campus-notice.pdf",
    packagePrice: 2150,
    packageCode: "CAMPUS-PQ-PKG-2026",
    issuingType: "Private development procurement",
    timeline: [["Prequalification notice issued", "2026-05-27"], ["Contractor briefing", "2026-06-27"], ["Qualification submissions due", "2026-09-11"], ["Shortlist announcement", "2026-10-16"], ["RFP issued to shortlist", "2026-11-03"]],
    scope: ["Core and shell construction", "Facade, vertical transportation, and MEP trade packages", "Structured parking and access roadway works", "Sustainability, commissioning, and handover documentation"],
    requirements: ["Corporate profile and project delivery history", "Evidence of liquidity and bonding capacity", "Key personnel resumes and availability", "Litigation, claims, and safety history disclosures"],
    premiumDocuments: ["Concept design package", "Preliminary BOQ", "Procurement phasing memorandum", "Site constraints and logistics report"]
  },
  {
    id: "ash-water-works-2026",
    title: "Industrial Water Works Expansion",
    category: "Utilities",
    location: "Tema, Ghana",
    issuingOrganization: "Apex Strategic Holdings Utilities Desk",
    estimatedValue: 67500000,
    currency: "USD",
    deadline: "2026-08-07T16:00:00+00:00",
    status: "Open",
    summary: "Procurement for expansion of treatment capacity, process piping, pumping systems, controls, and environmental compliance instrumentation.",
    thumbnail: "https://images.unsplash.com/photo-1581093458791-9f3c3b933eb0?auto=format&fit=crop&w=1400&q=80",
    publicNotice: "/documents/public/ash-water-works-notice.pdf",
    packagePrice: 1650,
    packageCode: "WATER-EXP-PKG-2026",
    issuingType: "Partner organization mandate",
    timeline: [["Bid notice posted", "2026-05-24"], ["Mandatory clarification call", "2026-06-20"], ["Final addendum issued", "2026-07-18"], ["Submission deadline", "2026-08-07"], ["Award recommendation", "2026-09-18"]],
    scope: ["Treatment process expansion and equipment installation", "High-duty pumping, process piping, and controls", "Instrumentation for quality and environmental compliance", "Commissioning, operator training, and maintenance manuals"],
    requirements: ["Water treatment plant construction experience", "Licensed engineers assigned to civil, process, and controls work", "Manufacturer authorization letters for major equipment", "Commissioning plan and post-completion support model"],
    premiumDocuments: ["Process flow diagrams", "Equipment data sheets", "Geotechnical and survey package", "Draft performance testing protocol"]
  }
];

const state = {
  projects: [],
  filtered: [],
  wizardStep: 1
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (value, currency = "USD") => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency,
  maximumFractionDigits: 0
}).format(value);
const date = (value) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
const daysLeft = (deadline) => Math.max(0, Math.ceil((new Date(deadline) - new Date()) / 86400000));

async function loadProjects() {
  $("#projectGrid").innerHTML = `<div class="skeleton"></div><div class="skeleton"></div>`;
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error("Project API unavailable");
    const data = await response.json();
    state.projects = data.projects;
  } catch {
    state.projects = fallbackProjects;
  }
  initFilters();
  renderProjects();
  renderAdmin();
  initWizardProjects();
}

function initFilters() {
  const categories = ["All", ...new Set(state.projects.map((project) => project.category))];
  $("#categoryFilter").innerHTML = categories.map((category) => `<option>${category}</option>`).join("");
  $("#categoryTabs").innerHTML = categories.map((category, index) =>
    `<button class="chip ${index === 0 ? "active" : ""}" type="button" data-category="${category}">${category}</button>`
  ).join("");
}

function renderProjects() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const category = $("#categoryFilter").value || "All";
  const status = $("#statusFilter").value || "All";
  const sort = $("#sortFilter").value || "deadline";

  state.filtered = state.projects
    .filter((project) => {
      const haystack = `${project.title} ${project.category} ${project.location} ${project.issuingOrganization} ${project.summary}`.toLowerCase();
      return (!query || haystack.includes(query))
        && (category === "All" || project.category === category)
        && (status === "All" || project.status === status);
    })
    .sort((a, b) => {
      if (sort === "value") return b.estimatedValue - a.estimatedValue;
      if (sort === "title") return a.title.localeCompare(b.title);
      return new Date(a.deadline) - new Date(b.deadline);
    });

  $("#projectGrid").innerHTML = state.filtered.map((project) => `
    <article class="project-card">
      <div class="project-thumb" style="background-image:url('${project.thumbnail}')"></div>
      <div class="project-body">
        <div class="project-meta">
          <span class="tag">${project.category}</span>
          <span class="tag status">${project.status}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="project-facts">
          <div class="fact"><small>Location</small><strong>${project.location}</strong></div>
          <div class="fact"><small>Value</small><strong>${money(project.estimatedValue, project.currency)}</strong></div>
          <div class="fact"><small>Deadline</small><strong>${date(project.deadline)}</strong></div>
          <div class="fact"><small>Days left</small><strong>${daysLeft(project.deadline)}</strong></div>
        </div>
        <div class="card-actions">
          <button class="btn primary" type="button" data-open-project="${project.id}">Review notice</button>
          <a class="btn tertiary" href="${project.publicNotice}" aria-label="Download public notice for ${project.title}">Public notice</a>
        </div>
      </div>
    </article>
  `).join("") || `<div class="procurement-panel"><h3>No matching opportunities</h3><p>Adjust the filters or search terms to view more bid notices.</p></div>`;

  $("#openPackageCount").textContent = state.projects.length;
  $("#nextDeadline").textContent = state.filtered[0] ? date(state.filtered[0].deadline) : "--";
}

function renderAdmin() {
  $("#adminRows").innerHTML = state.projects.map((project) => `
    <tr>
      <td><strong>${project.title}</strong><br><small>${project.location}</small></td>
      <td><span class="tag status">${project.status}</span></td>
      <td>${date(project.deadline)}</td>
      <td>${project.packageCode}<br><small>${money(project.packagePrice, project.currency)}</small></td>
      <td>Review / Archive / Access</td>
    </tr>
  `).join("");
}

function openProject(projectId) {
  const project = state.projects.find((item) => item.id === projectId);
  if (!project) return;
  $("#projectDetail").innerHTML = `
    <section class="detail-hero" style="background-image:url('${project.thumbnail}')">
      <div>
        <p class="eyebrow">${project.category} / ${project.status}</p>
        <h2>${project.title}</h2>
        <p>${project.issuingOrganization} · ${project.location}</p>
      </div>
    </section>
    <section class="detail-body">
      <div class="detail-grid">
        <div class="detail-panel">
          <h3>Notice to Bidders</h3>
          <p>${project.summary}</p>
          <p><strong>Issuing model:</strong> ${project.issuingType}</p>
          <p><strong>Estimated value:</strong> ${money(project.estimatedValue, project.currency)}</p>
          <p><strong>Submission deadline:</strong> ${date(project.deadline)}</p>
          <a class="btn tertiary wide" href="${project.publicNotice}">Download public notice</a>
        </div>
        <div class="detail-panel">
          <h3>Procurement Timeline</h3>
          <div class="timeline">${project.timeline.map(([label, value]) => `<div class="timeline-row"><span>${label}</span><strong>${date(value)}</strong></div>`).join("")}</div>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-panel"><h3>Technical Scope</h3><ul>${project.scope.map((item) => `<li>${item}</li>`).join("")}</ul></div>
        <div class="detail-panel"><h3>Qualification Criteria</h3><ul>${project.requirements.map((item) => `<li>${item}</li>`).join("")}</ul></div>
      </div>
      <div class="payment-box">
        <h3>Premium Bid Package</h3>
        <p>Includes ${project.premiumDocuments.join(", ")}. Access requires payment confirmation or administrator approval.</p>
        <div class="project-facts">
          <div class="fact"><small>Package code</small><strong>${project.packageCode}</strong></div>
          <div class="fact"><small>Access fee</small><strong>${money(project.packagePrice, project.currency)}</strong></div>
        </div>
        <form data-purchase-form="${project.id}">
          <label>Email for receipt and access <input type="email" name="contractorEmail" required placeholder="procurement@example.com"></label>
          <label class="checkbox"><input type="checkbox" name="termsAccepted" required> I agree to document access terms and confidentiality requirements.</label>
          <button class="btn primary" type="submit">Continue to secure payment</button>
        </form>
      </div>
    </section>
  `;
  $("#projectModal").showModal();
}

async function handlePurchase(event) {
  const form = event.target.closest("[data-purchase-form]");
  if (!form) return;
  event.preventDefault();
  const project = state.projects.find((item) => item.id === form.dataset.purchaseForm);
  const formData = new FormData(form);
  const payload = {
    projectId: project.id,
    contractorEmail: formData.get("contractorEmail"),
    packageCode: project.packageCode,
    amount: project.packagePrice,
    currency: project.currency,
    termsAccepted: formData.get("termsAccepted") === "on"
  };

  try {
    const response = await fetch("/api/purchases", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Purchase could not be confirmed");
    const result = await response.json();
    toast(`Package unlocked. Receipt ${result.receipt.receiptNumber} issued.`);
  } catch {
    toast("Sandbox payment confirmed locally. Configure provider webhooks for production.");
  }
}

function initWizardProjects() {
  $("#bidProjectSelect").innerHTML = state.projects.map((project) =>
    `<option value="${project.id}">${project.title}</option>`
  ).join("");
  updateWizard();
}

function updateWizard() {
  $$("[data-step]").forEach((fieldset) => {
    fieldset.hidden = Number(fieldset.dataset.step) !== state.wizardStep;
  });
  $("#prevStep").hidden = state.wizardStep === 1;
  $("#nextStep").hidden = state.wizardStep === 3;
  $("#submitBid").hidden = state.wizardStep !== 3;
  $("#wizardProgress").innerHTML = [1, 2, 3].map((step) =>
    `<span class="progress-dot ${step <= state.wizardStep ? "active" : ""}"></span>`
  ).join("");
}

async function submitBid(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.acknowledged = form.elements.acknowledged.checked;
  $("#bidStatus").textContent = "Submitting secure bid package...";

  try {
    const response = await fetch("/api/bids", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Submission failed");
    const result = await response.json();
    $("#bidStatus").textContent = `Bid submitted. Reference ${result.bidId}.`;
    toast("Bid submission received and operations notified.");
    form.reset();
    state.wizardStep = 1;
    updateWizard();
  } catch {
    $("#bidStatus").textContent = "Demo submission captured locally. Connect D1 and Discord secrets for production.";
    toast("Submission flow verified in demo mode.");
  }
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  $("#toastRegion").append(node);
  setTimeout(() => node.remove(), 4600);
}

function animateStats() {
  document.querySelectorAll("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count);
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / 1100);
      node.textContent = Math.round(target * progress).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

document.addEventListener("input", (event) => {
  if (["searchInput", "categoryFilter", "statusFilter", "sortFilter"].includes(event.target.id)) renderProjects();
});

document.addEventListener("change", (event) => {
  if (["categoryFilter", "statusFilter", "sortFilter"].includes(event.target.id)) renderProjects();
});

document.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-project]");
  if (openButton) openProject(openButton.dataset.openProject);

  if (event.target.closest("[data-close-modal]")) $("#projectModal").close();

  const chip = event.target.closest("[data-category]");
  if (chip) {
    $$(".chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    $("#categoryFilter").value = chip.dataset.category;
    renderProjects();
  }

  if (event.target.closest("[data-mobile-toggle]")) {
    const panel = $("[data-mobile-panel]");
    panel.classList.toggle("open");
    panel.setAttribute("aria-hidden", String(!panel.classList.contains("open")));
  }
});

document.addEventListener("submit", handlePurchase);
$("#prevStep").addEventListener("click", () => {
  state.wizardStep = Math.max(1, state.wizardStep - 1);
  updateWizard();
});
$("#nextStep").addEventListener("click", () => {
  const current = $(`[data-step="${state.wizardStep}"]`);
  const valid = [...current.querySelectorAll("input, select, textarea")].every((input) => input.reportValidity());
  if (!valid) return;
  state.wizardStep = Math.min(3, state.wizardStep + 1);
  updateWizard();
});
$("#bidForm").addEventListener("submit", submitBid);
window.addEventListener("scroll", () => {
  $(".site-header").dataset.elevated = String(window.scrollY > 20);
}, { passive: true });

loadProjects();
animateStats();
