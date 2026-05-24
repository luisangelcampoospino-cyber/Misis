import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";

const ship: Command = {
  data: new SlashCommandBuilder()
    .setName("ship")
    .setDescription("Calcula la compatibilidad entre dos usuarios")
    .addUserOption((opt) =>
      opt.setName("usuario1").setDescription("Primer usuario").setRequired(true)
    )
    .addUserOption((opt) =>
      opt.setName("usuario2").setDescription("Segundo usuario").setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const u1 = interaction.options.getUser("usuario1", true);
    const u2 = interaction.options.getUser("usuario2", true);

    const seed = (u1.id + u2.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const pct = seed % 101;

    let emoji: string;
    let descripcion: string;

    if (pct >= 80) { emoji = "💘"; descripcion = "¡Una conexión increíble! Hechos el uno para el otro."; }
    else if (pct >= 60) { emoji = "💕"; descripcion = "Muy buena compatibilidad. ¡Hacen buena pareja!"; }
    else if (pct >= 40) { emoji = "💛"; descripcion = "Compatible, aunque hay cosas por trabajar."; }
    else if (pct >= 20) { emoji = "🤔"; descripcion = "La compatibilidad es cuestionable..."; }
    else { emoji = "💔"; descripcion = "Cero química. Mejor como amigos."; }

    const progreso = Math.floor(pct / 5);
    const barra = "❤️".repeat(progreso) + "🖤".repeat(20 - progreso);

    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle(`${emoji} Ship-o-metro`)
      .setDescription(`**${u1.username}** 💑 **${u2.username}**`)
      .addFields(
        { name: "Compatibilidad", value: `**${pct}%**\n${barra}`, inline: false },
        { name: "Veredicto", value: descripcion, inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default ship;
