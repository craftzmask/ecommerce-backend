"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.login(DISCORD_BOT_TOKEN);

client.on("clientReady", () => {
  console.log(`Logged as ${client.user.tag}`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "hello") {
    msg.reply("Hello there!!!");
  }
});

const sendToFormatCode = async (logData) => {
  const {
    code,
    message = "Additional information about the code",
    title = "Code Example",
  } = logData;

  const codeMessage = {
    content: message,
    embeds: [
      {
        color: parseInt("00ff00", 16),
        title,
        description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
      },
    ],
  };

  await sendToMessage(codeMessage);
};

const sendToMessage = async (message = "message") => {
  const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
  if (!channel) {
    console.error("Could not find the channel", DISCORD_CHANNEL_ID);
    return;
  }

  await channel.send(message);
};

const LoggerService = { sendToMessage, sendToFormatCode };

module.exports = LoggerService;
