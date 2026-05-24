import { EmbedBuilder, GuildMember, TextChannel, Role } from "discord.js";
import { logger } from "../../lib/logger.js";
import { getGuildConfig } from "../data/store.js";

export default async function onGuildMemberAdd(member: GuildMember): Promise<void> {
  const guild = member.guild;
  const config = getGuildConfig(guild.id);

  // --- AUTOROLE ---
  if (config.autoroleId) {
    try {
      const role = guild.roles.cache.get(config.autoroleId) as Role | undefined;
      if (role) {
        await member.roles.add(role);
        logger.info({ userId: member.id, roleId: role.id }, "Autorole asignado");
      }
    } catch (err) {
      logger.error({ err }, "Error asignando autorole");
    }
  }

  // --- BIENVENIDA ---
  let channel: TextChannel | undefined;

  if (config.welcomeChannelId) {
    channel = guild.channels.cache.get(config.welcomeChannelId) as TextChannel | undefined;
  }

  if (!channel) {
    channel =
      (guild.channels.cache.find(
        (c) => c.isTextBased() && ["bienvenidas", "bienvenidos", "welcome", "general"].includes(c.name.toLowerCase())
      ) as TextChannel | undefined) ??
      (guild.channels.cache.find((c) => c.isTextBased()) as TextChannel | undefined);
  }

  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle(`👋 ¡Bienvenido a ${guild.name}!`)
    .setDescription(
      `Hola ${member.toString()}, ¡nos alegra tenerte aquí!\n` +
      `Ya somos **${guild.memberCount}** miembros.\n\n` +
      `Usa \`/ayuda\` para ver todo lo que puedo hacer.`
    )
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: "🏷️ Usuario", value: member.user.tag, inline: true },
      { name: "📅 Cuenta creada", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
    )
    .setFooter({ text: "ÆON • Sistema de Bienvenidas" })
    .setTimestamp();

  try {
    await channel.send({ embeds: [embed] });
  } catch (err) {
    logger.error({ err }, "Error enviando mensaje de bienvenida");
  }
}
