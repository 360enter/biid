import { json } from "../../_middleware.js";

export async function onRequestPost({ request, env }) {
  const payload = await request.json();
  const required = ["projectId", "companyName", "contactName", "email", "proposalTitle", "acknowledged"];
  const missing = required.filter((field) => !payload[field]);
  if (missing.length) return json({ error: "Missing required bid submission fields", missing }, { status: 422 });
  if (!payload.acknowledged) return json({ error: "Submission acknowledgments are required." }, { status: 422 });

  const contractorId = crypto.randomUUID();
  const bidId = crypto.randomUUID();

  if (env.APEX_DB) {
    await env.APEX_DB.prepare(`
      INSERT INTO contractors (id, company_name, contact_name, email, phone, country, registration_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      contractorId,
      payload.companyName,
      payload.contactName,
      payload.email,
      payload.phone || "",
      payload.country || "",
      payload.registrationNumber || ""
    ).run();

    await env.APEX_DB.prepare(`
      INSERT INTO bids (id, project_id, contractor_id, proposal_title, commercial_value, currency, submission_json, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      bidId,
      payload.projectId,
      contractorId,
      payload.proposalTitle,
      Number(payload.commercialValue || 0),
      payload.currency || "USD",
      JSON.stringify(payload),
      "submitted"
    ).run();
  }

  await notify(env, "New contractor bid submission", {
    project: payload.projectId,
    company: payload.companyName,
    contact: payload.contactName,
    email: payload.email,
    proposal: payload.proposalTitle
  });

  return json({ ok: true, bidId, contractorId, status: "submitted" }, { status: 201 });
}

async function notify(env, title, fields) {
  if (!env.DISCORD_WEBHOOK_URL) return;
  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title,
        color: 0x334155,
        fields: Object.entries(fields).map(([name, value]) => ({ name, value: String(value), inline: false })),
        timestamp: new Date().toISOString()
      }]
    })
  });
}
