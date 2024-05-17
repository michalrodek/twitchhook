import { executeWebhook } from "../src/fetching.js";
import { MessageType } from "../src/interfaces.js";
import { discordMessage } from "../src/utils.js";
import { isRequestVerified } from "../src/verify.js";

export async function POST(req: Request) {
  const body = await req.text();

  if (!isRequestVerified(req, body)) {
    return new Response("error", { status: 403 });
  }

  const messageType = req.headers.get(
    "Twitch-Eventsub-Message-Type".toLowerCase()
  );

  switch (messageType) {
    case MessageType.WebhookCallbackVerification:
      return handleCallbackVerification(req, body);

    case MessageType.Notification:
      return await handleNotification(body);

    default:
      return new Response("error", { status: 403 });
  }
}

async function handleNotification(body: string) {
  const message = discordMessage(body);

  await executeWebhook(JSON.stringify(message));

  return new Response(null, { status: 204 });
}

function handleCallbackVerification(req: Request, rawBody: string) {
  const body: { challenge: string } = JSON.parse(rawBody);

  return new Response(body.challenge, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
