import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";

const recordarme: Command = {
  data: new SlashCommandBuilder()
    .setName("recordarme")
    .setDescription("Configura un recordatorio personal")
    .addStringOption((opt) =>
      opt.setName("mensaje").setDescription("¿Qué debo recordarte?").setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt.setName("minutos").setDescription("En cuántos minutos").setRequired(false).setMinValue(1).setMaxValue(1440)
    )
    .addIntegerOption((opt) =>
      opt.setName("horas").setDescription("En cuántas horas").setRequired(false).setMinValue(1).setMaxValue(24)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const mensaje = interaction.options.getString("mensaje", true);
    const minutos = interaction.options.getInteger("minutos") ?? 0;
    const horas = interaction.options.getInteger("horas") ?? 0;

    const totalMs = (horas * 60 + minutos) * 60 * 1000;

    if (totalMs === 0) {
      await interaction.reply({ content: "❌ Debes especificar minutos u horas.", ephemeral: true });
      return;
    }

    const tiempoTexto = horas > 0 ? `${horas}h ${minutos}m` : `${minutos} minuto(s)`;

    const embed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setTitle("⏰ Recordatorio Configurado")
      .setDescription(`Te recordaré: **${mensaje}**\nEn: **${tiempoTexto}**`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });

    setTimeout(async () => {
      try {
        const user = await interaction.client.users.fetch(interaction.user.id);
        const recordEmbed = new EmbedBuilder()
          .setColor(0xf39c12)
          .setTitle("🔔 ¡Recordatorio!")
          .setDescription(`Hace ${tiempoTexto} me pediste recordarte:\n\n**${mensaje}**`)
          .setTimestamp();

        await user.send({ embeds: [recordEmbed] });
      } catch {
        try {
          await interaction.followUp({ content: `🔔 ${interaction.user}, tu recordatorio: **${mensaje}**`, ephemeral: true });
        } catch { /* ignorar si falla */ }
      }
    }, totalMs);
  },
};

export default recordarme;
