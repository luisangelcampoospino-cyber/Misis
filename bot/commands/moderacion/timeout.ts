import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";
import { checkJerarquia } from "../../lib/permisos.js";

const timeout: Command = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Silencia a un usuario temporalmente")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) =>
      opt.setName("usuario").setDescription("El usuario").setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("minutos")
        .setDescription("Duración en minutos (1-40320)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320)
    )
    .addStringOption((opt) =>
      opt.setName("razon").setDescription("Razón del silencio").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("usuario", true);
    const minutos = interaction.options.getInteger("minutos", true);
    const razon = interaction.options.getString("razon") ?? "Sin razón especificada";

    const check = await checkJerarquia(interaction, target.id);
    if (!check.ok) {
      await interaction.reply({ content: check.error, ephemeral: true });
      return;
    }

    const guild = interaction.guild!;
    const member = guild.members.cache.get(target.id)!;
    await member.timeout(minutos * 60 * 1000, razon);

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle("🔇 Usuario Silenciado")
      .addFields(
        { name: "Usuario", value: `${target.tag}`, inline: true },
        { name: "Duración", value: `${minutos} minuto(s)`, inline: true },
        { name: "Razón", value: razon, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default timeout;
