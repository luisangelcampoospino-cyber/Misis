import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";
import { getBalance, addBalance } from "../../data/store.js";

const transferir: Command = {
  data: new SlashCommandBuilder()
    .setName("transferir")
    .setDescription("Transfiere monedas a otro usuario")
    .addUserOption((opt) =>
      opt.setName("usuario").setDescription("A quién transferir").setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("cantidad")
        .setDescription("Cantidad a transferir")
        .setRequired(true)
        .setMinValue(1)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("usuario", true);
    const cantidad = interaction.options.getInteger("cantidad", true);

    if (target.id === interaction.user.id) {
      await interaction.reply({ content: "❌ No puedes transferirte monedas a ti mismo.", ephemeral: true });
      return;
    }

    if (target.bot) {
      await interaction.reply({ content: "❌ No puedes transferir monedas a un bot.", ephemeral: true });
      return;
    }

    const balancePropio = getBalance(interaction.user.id);

    if (balancePropio < cantidad) {
      await interaction.reply({
        content: `❌ No tienes suficientes monedas. Tienes **${balancePropio} 🪙**.`,
        ephemeral: true,
      });
      return;
    }

    addBalance(interaction.user.id, -cantidad);
    addBalance(target.id, cantidad);

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle("💸 Transferencia Exitosa")
      .addFields(
        { name: "De", value: interaction.user.tag, inline: true },
        { name: "Para", value: target.tag, inline: true },
        { name: "Cantidad", value: `${cantidad} 🪙`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default transferir;
