import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";

const unban: Command = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Desbanea a un usuario por su ID")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((opt) =>
      opt.setName("id").setDescription("ID del usuario a desbanear").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("razon").setDescription("Razón del desbaneo").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.options.getString("id", true);
    const razon = interaction.options.getString("razon") ?? "Sin razón especificada";
    const guild = interaction.guild;

    if (!guild) {
      await interaction.reply({ content: "❌ Solo en servidores.", ephemeral: true });
      return;
    }

    try {
      const ban = await guild.bans.fetch(userId);
      await guild.members.unban(userId, razon);

      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("✅ Usuario Desbaneado")
        .addFields(
          { name: "Usuario", value: ban.user.tag, inline: true },
          { name: "Razón", value: razon, inline: true },
          { name: "Moderador", value: interaction.user.tag, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply({ content: "❌ No se encontró ese usuario en la lista de bans.", ephemeral: true });
    }
  },
};

export default unban;
