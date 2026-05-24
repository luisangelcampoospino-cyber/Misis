import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";
import { economyData } from "../../data/store.js";

const ranking: Command = {
  data: new SlashCommandBuilder()
    .setName("ranking")
    .setDescription("Muestra el top 10 de usuarios más ricos"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const sorted = Object.entries(economyData)
      .sort(([, a], [, b]) => b.balance - a.balance)
      .slice(0, 10);

    if (sorted.length === 0) {
      await interaction.editReply("No hay datos de economía aún. ¡Usa `/daily` para empezar!");
      return;
    }

    const medals = ["🥇", "🥈", "🥉"];
    const lines: string[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const [userId, data] = sorted[i];
      let userTag = `<@${userId}>`;
      try {
        const user = await interaction.client.users.fetch(userId);
        userTag = user.tag;
      } catch {
        // keep mention
      }
      const prefix = medals[i] ?? `**${i + 1}.**`;
      lines.push(`${prefix} ${userTag} — **${data.balance.toLocaleString()} 🪙**`);
    }

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle("🏆 Ranking de Riqueza ÆON")
      .setDescription(lines.join("\n"))
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};

export default ranking;
