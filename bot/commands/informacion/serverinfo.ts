import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";

const serverinfo: Command = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Muestra información del servidor"),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;

    if (!guild) {
      await interaction.reply({ content: "❌ Solo puede usarse en servidores.", ephemeral: true });
      return;
    }

    await guild.fetch();

    const owner = await guild.fetchOwner().catch(() => null);
    const channels = guild.channels.cache;
    const textChannels = channels.filter((c) => c.isTextBased()).size;
    const voiceChannels = channels.filter((c) => c.isVoiceBased()).size;

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle(`🏠 ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 256 }) ?? null)
      .addFields(
        { name: "🆔 ID del servidor", value: guild.id, inline: true },
        { name: "👑 Dueño", value: owner ? owner.user.tag : "Desconocido", inline: true },
        { name: "👥 Miembros", value: `${guild.memberCount}`, inline: true },
        { name: "💬 Canales de texto", value: `${textChannels}`, inline: true },
        { name: "🔊 Canales de voz", value: `${voiceChannels}`, inline: true },
        { name: "🎭 Roles", value: `${guild.roles.cache.size}`, inline: true },
        {
          name: "📅 Servidor creado",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
          inline: false,
        },
        {
          name: "📊 Nivel de verificación",
          value: ["Ninguno", "Bajo", "Medio", "Alto", "Muy alto"][guild.verificationLevel] ?? "Desconocido",
          inline: true,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default serverinfo;
