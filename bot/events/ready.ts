import { ActivityType, Client, REST, Routes } from "discord.js";
import { BotClient } from "../types.js";
import { logger } from "../../lib/logger.js";

export default async function onReady(client: Client): Promise<void> {
  const botClient = client as BotClient;

  logger.info(`✅ ÆON conectado como ${client.user?.tag}`);

  const statuses = [
    { name: "el servidor 👁️", type: ActivityType.Watching },
    { name: "/ayuda | ÆON", type: ActivityType.Playing },
    { name: "las conversaciones 🎧", type: ActivityType.Listening },
  ];

  let i = 0;
  const setStatus = () => {
    const s = statuses[i % statuses.length];
    client.user?.setPresence({
      activities: [{ name: s.name, type: s.type }],
      status: "online",
    });
    i++;
  };

  setStatus();
  setInterval(setStatus, 20000);

  const commands = botClient.commands.map((cmd) => cmd.data.toJSON());

  const rest = new REST().setToken(process.env["DISCORD_TOKEN"]!);

  try {
    logger.info(`Registrando ${commands.length} comandos slash...`);
    await rest.put(Routes.applicationCommands(client.user!.id), { body: commands });
    logger.info("Comandos slash registrados correctamente.");
  } catch (err) {
    logger.error({ err }, "Error al registrar comandos slash");
  }
}
