import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";

const roleinfo: Command = {
  data: new SlashCommandBuilder()
    .setName("roleinfo")
    .setDescription("Muestra información de un rol")
    .addRoleOption((opt) =>
      opt.setName("rol").setDescription("El rol a consultar").setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const rol = interaction.options.getRole("rol", true);
    const guild = interaction.guild;

    const role = interaction.guild?.roles.cache.get(rol.id);
    const miembrosConRol = guild?.members.cache.filter((m) => m.roles.cache.has(rol.id)).size ?? 0;

    const permisos = role
      ? role.permissions.toArray().slice(0, 5).join(", ") || "Ninguno"
      : "Desconocido";

    const embed = new EmbedBuilder()
      .setColor(role?.color ?? 0x99aab5)
      .setTitle(`🎭 Información del Rol: ${rol.name}`)
      .addFields(
        { name: "🆔 ID", value: rol.id, inline: true },
        { name: "🎨 Color", value: role?.hexColor ?? "N/A", inline: true },
        { name: "👥 Miembros", value: `${miembrosConRol}`, inline: true },
        { name: "📌 Mencionable", value: rol.mentionable ? "Sí" : "No", inline: true },
        { name: "📍 Separado", value: role?.hoist ? "Sí" : "No", inline: true },
        { name: "⚙️ Posición", value: `${rol.position}`, inline: true },
        { name: "📅 Creado", value: role ? `<t:${Math.floor(role.createdTimestamp / 1000)}:F>` : "Desconocido", inline: false },
        { name: "🔑 Permisos (muestra)", value: permisos, inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default roleinfo;
