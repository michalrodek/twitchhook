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

  const broadcasterName = escape(body.event.broadcaster_user_name);
  const title = escape(body.event.title);

  switch (body.subscription.type) {
    case SubscriptionType.StreamOnline:
      message = {
        ...message,
        embeds: [
          {
            ...message.embeds?.[0],
            title: broadcasterName,
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
            description: `${broadcasterName} je offline`,
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
            description: `Update streamu **${broadcasterName}**\n${title} - ${body.event.category_name}`,
          },
        ],
      };
      break;

    default:
      break;
  }

  return message;
}

function escape(string: string) {
  return string
    .replace(/\*/g, "\\*")
    .replace(/_/g, "\\_")
    .replace(/~/g, "\\~")
    .replace(/\|/g, "\\|")
    .replace(/`/g, "\\`");
}
