import { EmbedBuilder, GuildMember, PartialGuildMember, TextChannel } from "discord.js";
import { logger } from "../../lib/logger.js";

export default async function onGuildMemberRemove(
  member: GuildMember | PartialGuildMember
): Promise<void> {
  const guild = member.guild;

  const channel =
    (guild.channels.cache.find(
      (c) => c.isTextBased() && ["bienvenidas", "bienvenidos", "welcome", "general"].includes(c.name.toLowerCase())
    ) as TextChannel | undefined) ??
    (guild.channels.cache.find((c) => c.isTextBased()) as TextChannel | undefined);

  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle("👋 Un miembro nos dejó")
    .setDescription(
      `**${member.user?.tag ?? "Alguien"}** abandonó el servidor.\nAhora somos **${guild.memberCount}** miembros.`
    )
    .setThumbnail(member.user?.displayAvatarURL({ size: 256 }) ?? null)
    .setFooter({ text: "ÆON • Sistema de Bienvenidas" })
    .setTimestamp();

  try {
    await channel.send({ embeds: [embed] });
  } catch (err) {
    logger.error({ err }, "Error enviando mensaje de despedida");
  }
}
