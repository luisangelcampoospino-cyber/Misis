import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";
import { checkJerarquia } from "../../lib/permisos.js";

const kick: Command = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa a un usuario del servidor")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((opt) =>
      opt.setName("usuario").setDescription("El usuario a expulsar").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("razon").setDescription("Razón de la expulsión").setRequired(false)
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
    await member.kick(razon);

    const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle("👢 Usuario Expulsado")
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

export default kick;
