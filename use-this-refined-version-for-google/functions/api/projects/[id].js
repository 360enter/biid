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

export async function onRequestGet({ params, env }) {
  if (env.APEX_DB) {
    const row = await env.APEX_DB.prepare("SELECT * FROM projects WHERE id = ?").bind(params.id).first();
    if (!row) return json({ error: "Project not found" }, { status: 404 });
    return json({ project: fromD1(row), source: "d1" });
  }

  const project = projects.find((item) => item.id === params.id);
  if (!project) return json({ error: "Project not found" }, { status: 404 });
  return json({ project, source: "static-seed" });
}
