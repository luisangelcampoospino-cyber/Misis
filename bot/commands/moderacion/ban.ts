import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";
import { checkJerarquia } from "../../lib/permisos.js";

const ban: Command = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario del servidor")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((opt) =>
      opt.setName("usuario").setDescription("El usuario a banear").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("razon").setDescription("Razón del ban").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("usuario", true);
    const razon = interaction.options.getString("razon") ?? "Sin razón especificada";

    const check = await checkJerarquia(interaction, target.id);
    if (!check.ok) {
      await interaction.reply({ content: check.error, ephemeral: true });
      return;
    }

    const guild = interaction.guild!;
    const member = guild.members.cache.get(target.id)!;
    await member.ban({ reason: razon });

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle("🔨 Usuario Baneado")
      .addFields(
        { name: "Usuario", value: `${target.tag}`, inline: true },
        { name: "Razón", value: razon, inline: true },
        { name: "Moderador", value: `${interaction.user.tag}`, inline: true }
      )
      .setThumbnail(target.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default ban;
