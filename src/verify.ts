import { VercelRequest } from "@vercel/node";
import crypto from "crypto";

export function isRequestVerified(req: VercelRequest) {
  const secret = process.env.SECRET;
  const message = getHmacMessage(req);
  const signature =
    req.headers["Twitch-Eventsub-Message-Signature".toLowerCase()];

  if (!message || !secret || typeof signature !== "string") {
    return false;
  }

  const hmac = "sha256=" + getHmac(secret, message);

  const isVerified = crypto.timingSafeEqual(
    Buffer.from(hmac),
    Buffer.from(signature)
  );

  if (!isVerified) {
    return false;
  }

  return true;
}

function getHmacMessage(request: VercelRequest) {
  const id = request.headers["Twitch-Eventsub-Message-Id".toLowerCase()];
  const timestamp =
    request.headers["Twitch-Eventsub-Message-Timestamp".toLowerCase()];
  const body = request.body;

  if (typeof id !== "string") return;

  return id + timestamp + JSON.stringify(body);
}

function getHmac(secret: string, message: string) {
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}
