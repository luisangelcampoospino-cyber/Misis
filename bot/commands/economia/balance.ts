import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";
import { getBalance } from "../../data/store.js";

const balance: Command = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Consulta tu saldo de monedas ÆON")
    .addUserOption((opt) =>
      opt.setName("usuario").setDescription("Ver el balance de otro usuario").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("usuario") ?? interaction.user;
    const saldo = getBalance(target.id);

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle("💰 Balance de Monedas")
      .setDescription(`**${target.username}** tiene **${saldo.toLocaleString()} 🪙 ÆON Coins**`)
      .setThumbnail(target.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default balance;
