import { DiscordMessage, SubscriptionType } from "./interfaces.js";

export function discordMessage(rawBody: string) {
  let message: DiscordMessage = {
    embeds: [{ color: 9520895 }],
  };

  const body: {
    subscription: { type: string };
    event: {
      broadcaster_user_name: string;
      broadcaster_user_login: string;
      title: string;
      category_name: string;
    };
  } = JSON.parse(rawBody);

  switch (body.subscription.type) {
    case SubscriptionType.StreamOnline:
      message = {
        ...message,
        embeds: [
          {
            ...message.embeds?.[0],
            title: body.event.broadcaster_user_name,
            url: `https://www.twitch.tv/${body.event.broadcaster_user_login}`,
            description: "je online!",
          },
        ],
      };
      break;

    case SubscriptionType.StreamOffline:
      message = {
        ...message,
        embeds: [
          {
            ...message.embeds?.[0],
            description: `${body.event.broadcaster_user_name} je offline`,
          },
        ],
      };
      break;

    case SubscriptionType.ChannelUpdate:
      message = {
        ...message,
        embeds: [
          {
            ...message.embeds?.[0],
            description: `Update streamu **${body.event.broadcaster_user_name}**\n${body.event.title} - ${body.event.category_name}`,
          },
        ],
      };
      break;

    default:
      break;
  }

  return message;
}
