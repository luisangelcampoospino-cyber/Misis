import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";

const moneda: Command = {
  data: new SlashCommandBuilder()
    .setName("moneda")
    .setDescription("Lanza una moneda al aire"),

  async execute(interaction: ChatInputCommandInteraction) {
    const resultado = Math.random() < 0.5 ? "🪙 Cara" : "🌟 Cruz";

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle("🪙 Lanzamiento de Moneda")
      .setDescription(`El resultado es: **${resultado}**`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default moneda;
