import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";

const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Muestra la latencia del bot"),

  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({ content: "📡 Calculando...", fetchReply: true });
    const latencia = sent.createdTimestamp - interaction.createdTimestamp;
    const wsLatencia = interaction.client.ws.ping;

    const embed = new EmbedBuilder()
      .setColor(wsLatencia < 100 ? 0x2ecc71 : wsLatencia < 200 ? 0xf39c12 : 0xe74c3c)
      .setTitle("🏓 Pong!")
      .addFields(
        { name: "📨 Latencia del bot", value: `${latencia}ms`, inline: true },
        { name: "💓 Latencia WebSocket", value: `${wsLatencia}ms`, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ content: "", embeds: [embed] });
  },
};

export default ping;
