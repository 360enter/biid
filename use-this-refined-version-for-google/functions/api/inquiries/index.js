import { json } from "../../_middleware.js";

export async function onRequestPost({ request, env }) {
  const payload = await request.json();
  const required = ["name", "email", "message"];
  const missing = required.filter((field) => !payload[field]);
  if (missing.length) return json({ error: "Missing required inquiry fields", missing }, { status: 422 });

  await notify(env, "Project inquiry", {
    name: payload.name,
    email: payload.email,
    project: payload.projectId || "General",
    message: payload.message.slice(0, 900)
  });

  return json({ ok: true, status: "received" }, { status: 202 });
}

async function notify(env, title, fields) {
  if (!env.DISCORD_WEBHOOK_URL) return;
  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title,
        color: 0x8b5cf6,
        fields: Object.entries(fields).map(([name, value]) => ({ name, value: String(value), inline: false })),
        timestamp: new Date().toISOString()
      }]
    })
  });
}
