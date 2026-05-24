import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";

const ruleta: Command = {
  data: new SlashCommandBuilder()
    .setName("ruleta")
    .setDescription("¿Te atreves a jugar a la ruleta rusa?"),

  async execute(interaction: ChatInputCommandInteraction) {
    const sobrevivio = Math.random() > 1 / 6;

    const embed = new EmbedBuilder()
      .setTitle("🔫 Ruleta Rusa")
      .setDescription(
        sobrevivio
          ? "💨 **¡Click!** El tambor giró y sobreviviste... por esta vez."
          : "💥 **¡BANG!** La bala te encontró. Más suerte la próxima vez..."
      )
      .setColor(sobrevivio ? 0x2ecc71 : 0xe74c3c)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default ruleta;
