export interface APIResponse<T> {
  data?: T;
  error?: string;
}

export interface DiscordMessage {
  embeds?: {
    title?: string;
    url?: string;
    description?: string;
    color?: number;
  }[];
}

export enum SubscriptionType {
  StreamOnline = "stream.online",
  StreamOffline = "stream.offline",
  ChannelUpdate = "channel.update",
}

export enum MessageType {
  WebhookCallbackVerification = "webhook_callback_verification",
  Notification = "notification",
}
