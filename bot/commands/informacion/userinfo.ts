import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";

const userinfo: Command = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Muestra información de un usuario")
    .addUserOption((opt) =>
      opt.setName("usuario").setDescription("El usuario a consultar").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("usuario") ?? interaction.user;
    const guild = interaction.guild;
    const member = guild?.members.cache.get(target.id);

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`👤 Información de ${target.username}`)
      .setThumbnail(target.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: "🏷️ Tag", value: target.tag, inline: true },
        { name: "🆔 ID", value: target.id, inline: true },
        { name: "🤖 Bot", value: target.bot ? "Sí" : "No", inline: true },
        {
          name: "📅 Cuenta creada",
          value: `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`,
          inline: false,
        }
      );

    if (member) {
      embed.addFields(
        {
          name: "📥 Se unió al servidor",
          value: member.joinedTimestamp
            ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
            : "Desconocido",
          inline: false,
        },
        {
          name: "🎭 Roles",
          value:
            member.roles.cache
              .filter((r) => r.id !== interaction.guildId)
              .map((r) => r.toString())
              .slice(0, 10)
              .join(", ") || "Ninguno",
          inline: false,
        }
      );
    }

    embed.setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};

export default userinfo;
