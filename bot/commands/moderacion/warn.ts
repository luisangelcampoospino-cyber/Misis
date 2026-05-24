import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";
import { addWarn, getWarns, clearWarns } from "../../data/store.js";
import { checkJerarquia } from "../../lib/permisos.js";

const warn: Command = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Gestiona advertencias de usuarios")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((sub) =>
      sub
        .setName("agregar")
        .setDescription("Agrega una advertencia a un usuario")
        .addUserOption((opt) =>
          opt.setName("usuario").setDescription("El usuario").setRequired(true)
        )
        .addStringOption((opt) =>
          opt.setName("razon").setDescription("Razón de la advertencia").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("ver")
        .setDescription("Ver advertencias de un usuario")
        .addUserOption((opt) =>
          opt.setName("usuario").setDescription("El usuario").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("limpiar")
        .setDescription("Limpiar advertencias de un usuario")
        .addUserOption((opt) =>
          opt.setName("usuario").setDescription("El usuario").setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const target = interaction.options.getUser("usuario", true);
    const guildId = interaction.guildId ?? "global";

    if (sub === "agregar") {
      const razon = interaction.options.getString("razon", true);
      const total = addWarn(guildId, target.id, razon);

      const embed = new EmbedBuilder()
        .setColor(0xf39c12)
        .setTitle("⚠️ Advertencia Registrada")
        .addFields(
          { name: "Usuario", value: `${target.tag}`, inline: true },
          { name: "Razón", value: razon, inline: true },
          { name: "Total de warns", value: `${total}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (sub === "ver") {
      const warns = getWarns(guildId, target.id);
      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle(`⚠️ Advertencias de ${target.tag}`)
        .setDescription(
          warns.length === 0
            ? "Este usuario no tiene advertencias."
            : warns.map((w, i) => `**${i + 1}.** ${w}`).join("\n")
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (sub === "limpiar") {
      clearWarns(guildId, target.id);
      await interaction.reply({ content: `✅ Se han limpiado las advertencias de **${target.tag}**.` });
    }
  },
};

export default warn;
