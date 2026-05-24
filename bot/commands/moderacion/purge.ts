import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Command } from "../../types.js";

const purge: Command = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Elimina mensajes en masa del canal")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((opt) =>
      opt
        .setName("cantidad")
        .setDescription("Cantidad de mensajes a eliminar (1-100)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const cantidad = interaction.options.getInteger("cantidad", true);
    const channel = interaction.channel as TextChannel;

    if (!channel) {
      await interaction.reply({ content: "❌ No se puede usar en este canal.", ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    const deleted = await channel.bulkDelete(cantidad, true);

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle("🗑️ Mensajes Eliminados")
      .setDescription(`Se eliminaron **${deleted.size}** mensajes correctamente.`)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};

export default purge;
