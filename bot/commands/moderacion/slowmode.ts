import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../types.js";

const slowmode: Command = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Activa o desactiva el modo lento en el canal")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption((opt) =>
      opt
        .setName("segundos")
        .setDescription("Segundos entre mensajes (0 = desactivar)")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const segundos = interaction.options.getInteger("segundos", true);
    const channel = interaction.channel as TextChannel;

    await channel.setRateLimitPerUser(segundos);

    const embed = new EmbedBuilder()
      .setColor(segundos === 0 ? 0x2ecc71 : 0xf39c12)
      .setTitle(segundos === 0 ? "✅ Modo Lento Desactivado" : "🐢 Modo Lento Activado")
      .setDescription(
        segundos === 0
          ? "Los usuarios pueden enviar mensajes libremente."
          : `Los usuarios deben esperar **${segundos} segundo(s)** entre mensajes.`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default slowmode;
