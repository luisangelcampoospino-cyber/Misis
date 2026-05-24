import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { levelData } from "../../data/store.js";

const rankingnivel: Command = {
  data: new SlashCommandBuilder()
    .setName("rankingnivel")
    .setDescription("Muestra el top 10 de usuarios por nivel"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const sorted = Object.entries(levelData)
      .sort(([, a], [, b]) => b.level - a.level || b.xp - a.xp)
      .slice(0, 10);

    if (sorted.length === 0) {
      await interaction.editReply("No hay datos de niveles aún. ¡Chatea para ganar XP!");
      return;
    }

    const medals = ["🥇", "🥈", "🥉"];
    const lines: string[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const [userId, data] = sorted[i];
      let tag = `<@${userId}>`;
      try {
        const user = await interaction.client.users.fetch(userId);
        tag = user.tag;
      } catch { /* keep mention */ }
      const prefix = medals[i] ?? `**${i + 1}.**`;
      lines.push(`${prefix} ${tag} — Nivel **${data.level}** (${data.xp} XP)`);
    }

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle("🏆 Ranking de Niveles ÆON")
      .setDescription(lines.join("\n"))
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};

export default rankingnivel;
