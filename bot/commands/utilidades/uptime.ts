import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";

const uptime: Command = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Muestra cuánto tiempo lleva activo el bot"),

  async execute(interaction: ChatInputCommandInteraction) {
    const uptimeMs = interaction.client.uptime ?? 0;

    const dias = Math.floor(uptimeMs / 86400000);
    const horas = Math.floor((uptimeMs % 86400000) / 3600000);
    const minutos = Math.floor((uptimeMs % 3600000) / 60000);
    const segundos = Math.floor((uptimeMs % 60000) / 1000);

    const embed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setTitle("⏱️ Uptime de ÆON")
      .setDescription(`El bot lleva activo:\n**${dias}d ${horas}h ${minutos}m ${segundos}s**`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default uptime;
