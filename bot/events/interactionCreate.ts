import { Interaction } from "discord.js";
import { BotClient } from "../types.js";
import { logger } from "../../lib/logger.js";

export default async function onInteractionCreate(interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const client = interaction.client as BotClient;
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`Comando desconocido: ${interaction.commandName}`);
    await interaction.reply({ content: "❌ Comando no encontrado.", ephemeral: true });
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    logger.error({ err, command: interaction.commandName }, "Error ejecutando comando");
    const msg = "❌ Ocurrió un error al ejecutar este comando. Inténtalo de nuevo.";
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: msg, ephemeral: true }).catch(() => {});
    } else {
      await interaction.reply({ content: msg, ephemeral: true }).catch(() => {});
    }
  }
}
