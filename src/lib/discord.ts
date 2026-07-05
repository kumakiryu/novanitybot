import axios from "axios";

const API = "https://discord.com/api/v10";

function headers() {
  return {
    Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    "Content-Type": "application/json",
  };
}

// Send a plain text or embed message to a channel
export async function sendMessage(channelId: string, payload: Record<string, unknown>) {
  const res = await axios.post(`${API}/channels/${channelId}/messages`, payload, { headers: headers() });
  return res.data;
}

// Send the verification panel embed + button to a channel
export async function sendVerificationPanel(channelId: string, config: {
  embedTitle: string;
  embedDescription: string;
  embedColor: number;
  embedFooter: string;
  buttonLabel: string;
  buttonStyle: string;
}) {
  const styleMap: Record<string, number> = {
    Primary: 1, Secondary: 2, Success: 3, Danger: 4,
  };

  return sendMessage(channelId, {
    embeds: [{
      title:       config.embedTitle,
      description: config.embedDescription,
      color:       config.embedColor,
      footer:      { text: config.embedFooter },
      timestamp:   new Date().toISOString(),
    }],
    components: [{
      type: 1,
      components: [{
        type:      2,
        style:     styleMap[config.buttonStyle] ?? 3,
        label:     config.buttonLabel,
        custom_id: "novanity_verify",
      }],
    }],
  });
}

// Fetch guild info from Discord
export async function getGuild(guildId: string) {
  const res = await axios.get(`${API}/guilds/${guildId}`, { headers: headers() });
  return res.data;
}

// Fetch channels for a guild
export async function getGuildChannels(guildId: string) {
  const res = await axios.get(`${API}/guilds/${guildId}/channels`, { headers: headers() });
  return res.data;
}
