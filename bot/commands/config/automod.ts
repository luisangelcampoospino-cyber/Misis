import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getGuildConfig, setGuildConfig } from "../../data/store.js";

const automod: Command = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Configura el sistema de moderación automática")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName("activar")
        .setDescription("Activa el anti-spam y automod")
    )
    .addSubcommand((sub) =>
      sub
        .setName("desactivar")
        .setDescription("Desactiva el automod")
    )
    .addSubcommand((sub) =>
      sub.setName("estado").setDescription("Ver el estado actual del automod")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId ?? "global";

    if (sub === "activar") {
      setGuildConfig(guildId, { automodEnabled: true, antiSpamEnabled: true });

      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("✅ Automod Activado")
        .setDescription(
          "El sistema de moderación automática está activo:\n\n" +
          "🚫 **Anti-spam**: Detecta y elimina mensajes repetidos\n" +
          "⚠️ **Auto-warn**: Advierte a usuarios que spamean\n" +
          "🔇 **Auto-mute**: Silencia a reincidentes automáticamente"
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (sub === "desactivar") {
      setGuildConfig(guildId, { automodEnabled: false, antiSpamEnabled: false });
      await interaction.reply({ content: "✅ Automod desactivado.", ephemeral: true });
    } else if (sub === "estado") {
      const config = getGuildConfig(guildId);
      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("⚙️ Estado del Automod")
        .addFields(
          { name: "Anti-spam", value: config.antiSpamEnabled ? "✅ Activo" : "❌ Inactivo", inline: true },
          { name: "Automod general", value: config.automodEnabled ? "✅ Activo" : "❌ Inactivo", inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  },
};

export default automod;
