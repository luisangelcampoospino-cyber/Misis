import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getGuildConfig, setGuildConfig } from "../../data/store.js";

const bienvenida: Command = {
  data: new SlashCommandBuilder()
    .setName("bienvenida")
    .setDescription("Configura el canal de bienvenida")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName("set")
        .setDescription("Define el canal de bienvenida")
        .addChannelOption((opt) =>
          opt.setName("canal").setDescription("Canal de bienvenida").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("ver").setDescription("Ver el canal de bienvenida actual")
    )
    .addSubcommand((sub) =>
      sub.setName("quitar").setDescription("Desactivar el canal de bienvenida")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId ?? "global";

    if (sub === "set") {
      const canal = interaction.options.getChannel("canal", true);
      setGuildConfig(guildId, { welcomeChannelId: canal.id });

      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("✅ Canal de Bienvenida Configurado")
        .setDescription(`Las bienvenidas se enviarán en <#${canal.id}>.`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (sub === "ver") {
      const config = getGuildConfig(guildId);
      const canalId = config.welcomeChannelId;

      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("⚙️ Canal de Bienvenida")
        .setDescription(canalId ? `Canal: <#${canalId}>` : "No hay canal de bienvenida configurado.")
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (sub === "quitar") {
      setGuildConfig(guildId, { welcomeChannelId: null });
      await interaction.reply({ content: "✅ Canal de bienvenida desactivado.", ephemeral: true });
    }
  },
};

export default bienvenida;
