import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";

const avatar: Command = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Muestra el avatar de un usuario")
    .addUserOption((opt) =>
      opt.setName("usuario").setDescription("El usuario").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("usuario") ?? interaction.user;

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle(`🖼️ Avatar de ${target.username}`)
      .setImage(target.displayAvatarURL({ size: 512 }))
      .addFields(
        {
          name: "🔗 Links",
          value: [
            `[PNG](${target.displayAvatarURL({ size: 512, extension: "png" })})`,
            `[JPG](${target.displayAvatarURL({ size: 512, extension: "jpg" })})`,
            `[WEBP](${target.displayAvatarURL({ size: 512, extension: "webp" })})`,
          ].join(" | "),
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default avatar;
