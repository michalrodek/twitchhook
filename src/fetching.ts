export async function executeWebhook(message: string) {
  await fetch(String(process.env.WEBHOOK), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: message,
  });
}
