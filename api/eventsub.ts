import type { VercelRequest, VercelResponse } from "@vercel/node";
import { typedFetch } from "../src/fetching";
import { MessageType } from "../src/interfaces";
import { discordMessage } from "../src/utils";
import { isRequestVerified } from "../src/verify";

export default async function (req: VercelRequest, res: VercelResponse) {
  if (!isRequestVerified(req)) return res.status(403).send("error");

  const messageType = req.headers["Twitch-Eventsub-Message-Type".toLowerCase()];

  switch (messageType) {
    case MessageType.WebhookCallbackVerification:
      handleCallbackVerification(req, res);
      break;

    case MessageType.Notification:
      await handleNotification(req, res);
      break;

    default:
      return res.status(403).send("error");
  }
}

async function handleNotification(req: VercelRequest, res: VercelResponse) {
  const message = discordMessage(req);

  await typedFetch(String(process.env.WEBHOOK), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  return res.status(204).send("");
}

function handleCallbackVerification(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "text/plain");

  const body: { challenge: string } = req.body;

  return res.status(200).send(body.challenge);
}
