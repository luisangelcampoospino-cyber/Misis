import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Conectado como ${client.user?.tag}`);
});

client.login("MTQ4MTM4OTU1ODY3ODY4NzgzOQ.G7dNuU.fsXqddtBu2FxnXgxyYTnpLSbwEOpFWqO8GXdUg");
