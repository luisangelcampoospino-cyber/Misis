import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getGuildConfig, setGuildConfig } from "../../data/store.js";

const autorole: Command = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Configura el rol automático al unirse")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName("set")
        .setDescription("Define el rol automático")
        .addRoleOption((opt) =>
          opt.setName("rol").setDescription("El rol a asignar automáticamente").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("ver").setDescription("Ver el autorole configurado actualmente")
    )
    .addSubcommand((sub) =>
      sub.setName("quitar").setDescription("Eliminar el autorole configurado")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId ?? "global";

    if (sub === "set") {
      const rol = interaction.options.getRole("rol", true);
      setGuildConfig(guildId, { autoroleId: rol.id });

      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("✅ Autorole Configurado")
        .setDescription(`Los nuevos miembros recibirán el rol **${rol.name}** automáticamente.`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (sub === "ver") {
      const config = getGuildConfig(guildId);
      const rolId = config.autoroleId;

      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("⚙️ Autorole Actual")
        .setDescription(rolId ? `Rol configurado: <@&${rolId}>` : "No hay ningún autorole configurado.")
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (sub === "quitar") {
      setGuildConfig(guildId, { autoroleId: null });
      await interaction.reply({ content: "✅ Autorole eliminado correctamente.", ephemeral: true });
    }
  },
};

export default autorole;
