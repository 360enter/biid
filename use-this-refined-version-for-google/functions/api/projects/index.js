import { projects } from "../../data/projects.js";
import { json } from "../../_middleware.js";

const fromD1 = (row) => ({
  id: row.id,
  title: row.title,
  category: row.category,
  location: row.location,
  issuingOrganization: row.issuing_organization,
  estimatedValue: row.estimated_value,
  currency: row.currency,
  deadline: row.deadline,
  status: row.status,
  summary: row.summary,
  thumbnail: row.thumbnail,
  publicNotice: row.public_notice,
  packagePrice: row.package_price,
  packageCode: row.package_code,
  issuingType: row.issuing_type,
  timeline: JSON.parse(row.timeline_json),
  scope: JSON.parse(row.scope_json),
  requirements: JSON.parse(row.requirements_json),
  premiumDocuments: JSON.parse(row.premium_documents_json)
});

const filterProjects = (items, url) => {
  const query = (url.searchParams.get("q") || "").trim().toLowerCase();
  const category = url.searchParams.get("category") || "All";
  const status = url.searchParams.get("status") || "All";
  const sort = url.searchParams.get("sort") || "deadline";

  const filtered = items.filter((project) => {
    const haystack = [
      project.title,
      project.category,
      project.location,
      project.issuingOrganization,
      project.summary
    ].join(" ").toLowerCase();
    return (!query || haystack.includes(query))
      && (category === "All" || project.category === category)
      && (status === "All" || project.status === status);
  });

  return filtered.sort((a, b) => {
    if (sort === "value") return b.estimatedValue - a.estimatedValue;
    if (sort === "title") return a.title.localeCompare(b.title);
    return new Date(a.deadline) - new Date(b.deadline);
  });
};

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  if (env.APEX_DB) {
    const { results } = await env.APEX_DB.prepare("SELECT * FROM projects ORDER BY deadline ASC").all();
    return json({ projects: filterProjects(results.map(fromD1), url), source: "d1" });
  }

  return json({ projects: filterProjects(projects, url), source: "static-seed" });
}

export async function onRequestPost({ request, env }) {
  const payload = await request.json();
  const required = ["id", "title", "category", "location", "issuingOrganization", "deadline", "summary"];
  const missing = required.filter((field) => !payload[field]);
  if (missing.length) return json({ error: "Missing required project fields", missing }, { status: 422 });

  if (!env.APEX_DB) {
    return json({ error: "D1 binding APEX_DB is required to create projects." }, { status: 501 });
  }

  await env.APEX_DB.prepare(`
    INSERT INTO projects (
      id, title, category, location, issuing_organization, estimated_value, currency, deadline,
      status, summary, thumbnail, public_notice, package_price, package_code, issuing_type,
      timeline_json, scope_json, requirements_json, premium_documents_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    payload.id,
    payload.title,
    payload.category,
    payload.location,
    payload.issuingOrganization,
    Number(payload.estimatedValue || 0),
    payload.currency || "USD",
    payload.deadline,
    payload.status || "Draft",
    payload.summary,
    payload.thumbnail || "/assets/project-placeholder.svg",
    payload.publicNotice || "",
    Number(payload.packagePrice || 0),
    payload.packageCode || payload.id.toUpperCase(),
    payload.issuingType || "Managed procurement",
    JSON.stringify(payload.timeline || []),
    JSON.stringify(payload.scope || []),
    JSON.stringify(payload.requirements || []),
    JSON.stringify(payload.premiumDocuments || [])
  ).run();

  await notify(env, "Project created", {
    title: payload.title,
    category: payload.category,
    deadline: payload.deadline
  });

  return json({ ok: true, projectId: payload.id }, { status: 201 });
}

async function notify(env, title, fields) {
  if (!env.DISCORD_WEBHOOK_URL) return;
  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title,
        color: 0x1f6feb,
        fields: Object.entries(fields).map(([name, value]) => ({ name, value: String(value), inline: true })),
        timestamp: new Date().toISOString()
      }]
    })
  });
}
