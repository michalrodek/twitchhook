import crypto from "crypto";

export function isRequestVerified(req: Request, body: string) {
  const secret = process.env.SECRET;
  const message = getHmacMessage(req, body);
  const signature = req.headers.get(
    "Twitch-Eventsub-Message-Signature".toLowerCase()
  );

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

function getHmacMessage(request: Request, body: string) {
  const id = request.headers.get("Twitch-Eventsub-Message-Id".toLowerCase());
  const timestamp = request.headers.get(
    "Twitch-Eventsub-Message-Timestamp".toLowerCase()
  );

  if (typeof id !== "string") return;

  return id + timestamp + body;
}

function getHmac(secret: string, message: string) {
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}
