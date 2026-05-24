import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";

const respuestas = [
  "🟢 Sí, definitivamente.",
  "🟢 Es cierto.",
  "🟢 Sin lugar a dudas.",
  "🟢 Puedes contar con ello.",
  "🟢 En mi opinión, sí.",
  "🟡 Las perspectivas son buenas.",
  "🟡 Pregunta de nuevo más tarde.",
  "🟡 No puedo predecirlo ahora.",
  "🟡 Concéntrate y vuelve a preguntar.",
  "🟡 Mejor no decirte ahora.",
  "🔴 No cuentes con ello.",
  "🔴 Mi respuesta es no.",
  "🔴 Mis fuentes dicen que no.",
  "🔴 Las perspectivas no son buenas.",
  "🔴 Muy dudoso.",
];

const ocho: Command = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Haz una pregunta al mágico 8-Ball")
    .addStringOption((opt) =>
      opt.setName("pregunta").setDescription("Tu pregunta").setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const pregunta = interaction.options.getString("pregunta", true);
    const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];

    const embed = new EmbedBuilder()
      .setColor(0x1a1a2e)
      .setTitle("🎱 La Bola Mágica 8")
      .addFields(
        { name: "❓ Pregunta", value: pregunta },
        { name: "💬 Respuesta", value: respuesta }
      )
      .setFooter({ text: `Preguntado por ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default ocho;
