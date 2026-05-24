import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";
import { getBalance, addBalance, getLastDaily, setLastDaily } from "../../data/store.js";

const DAILY_AMOUNT = 200;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

const daily: Command = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Reclama tu recompensa diaria de monedas"),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    const now = Date.now();
    const lastDaily = getLastDaily(userId);
    const remaining = COOLDOWN_MS - (now - lastDaily);

    if (remaining > 0) {
      const horas = Math.floor(remaining / 3600000);
      const minutos = Math.floor((remaining % 3600000) / 60000);

      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle("⏰ Daily ya reclamado")
        .setDescription(`Ya reclamaste tu daily hoy.\nVuelve en **${horas}h ${minutos}m**.`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    setLastDaily(userId, now);
    addBalance(userId, DAILY_AMOUNT);
    const nuevoBalance = getBalance(userId);

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle("🎁 ¡Daily Reclamado!")
      .setDescription(
        `Recibiste **${DAILY_AMOUNT} 🪙 ÆON Coins**.\nBalance total: **${nuevoBalance.toLocaleString()} 🪙**`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default daily;
