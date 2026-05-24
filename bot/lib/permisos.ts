import { ChatInputCommandInteraction, GuildMember } from "discord.js";

export interface PermCheck {
  ok: boolean;
  error?: string;
}

export async function checkJerarquia(
  interaction: ChatInputCommandInteraction,
  targetId: string
): Promise<PermCheck> {
  const guild = interaction.guild;
  if (!guild) return { ok: false, error: "❌ Este comando solo puede usarse en un servidor." };

  const botMember = guild.members.me;
  if (!botMember) return { ok: false, error: "❌ No puedo obtener mis propios datos en el servidor." };

  const actorMember = interaction.member as GuildMember | null;
  const targetMember = guild.members.cache.get(targetId);

  if (!targetMember) return { ok: false, error: "❌ No encontré a ese usuario en el servidor." };

  const botPos = botMember.roles.highest.position;
  const targetPos = targetMember.roles.highest.position;

  if (targetPos >= botPos) {
    return {
      ok: false,
      error: `❌ No puedo actuar sobre **${targetMember.user.tag}** porque su rol más alto es igual o superior al mío.`,
    };
  }

  if (actorMember) {
    const actorPos = actorMember.roles.highest.position;
    if (targetPos >= actorPos) {
      return {
        ok: false,
        error: `❌ No puedes actuar sobre **${targetMember.user.tag}** porque su rol es igual o superior al tuyo.`,
      };
    }
  }

  return { ok: true };
}
