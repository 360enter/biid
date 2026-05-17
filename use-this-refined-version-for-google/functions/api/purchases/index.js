import { json } from "../../_middleware.js";

export async function onRequestPost({ request, env }) {
  const payload = await request.json();
  const required = ["projectId", "contractorEmail", "packageCode", "amount", "termsAccepted"];
  const missing = required.filter((field) => !payload[field]);
  if (missing.length) return json({ error: "Missing required purchase fields", missing }, { status: 422 });
  if (!payload.termsAccepted) return json({ error: "Terms must be accepted before payment." }, { status: 422 });

  const purchaseId = crypto.randomUUID();
  const receipt = {
    receiptNumber: `ASH-${Date.now().toString(36).toUpperCase()}`,
    issuedAt: new Date().toISOString(),
    unlockWindowHours: 72
  };

  if (env.APEX_DB) {
    await env.APEX_DB.prepare(`
      INSERT INTO purchases (id, project_id, contractor_email, package_code, amount, currency, provider_reference, status, receipt_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      purchaseId,
      payload.projectId,
      payload.contractorEmail,
      payload.packageCode,
      Number(payload.amount),
      payload.currency || "USD",
      payload.providerReference || `sandbox-${purchaseId}`,
      "confirmed",
      JSON.stringify(receipt)
    ).run();
  }

  if (env.DOCUMENT_ACCESS) {
    await env.DOCUMENT_ACCESS.put(
      `access:${payload.projectId}:${payload.contractorEmail.toLowerCase()}`,
      JSON.stringify({ purchaseId, packageCode: payload.packageCode, receipt }),
      { expirationTtl: 60 * 60 * 72 }
    );
  }

  await notify(env, "Document package purchase", {
    project: payload.projectId,
    contractor: payload.contractorEmail,
    package: payload.packageCode,
    amount: `${payload.currency || "USD"} ${payload.amount}`
  });

  return json({ ok: true, purchaseId, receipt, accessStatus: "unlocked" }, { status: 201 });
}

async function notify(env, title, fields) {
  if (!env.DISCORD_WEBHOOK_URL) return;
  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title,
        color: 0x0f766e,
        fields: Object.entries(fields).map(([name, value]) => ({ name, value: String(value), inline: true })),
        timestamp: new Date().toISOString()
      }]
    })
  });
}
