import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";

const chistes = [
  "¿Por qué el libro de matemáticas estaba triste? Porque tenía demasiados problemas.",
  "¿Qué le dijo el 0 al 8? ¡Bonito cinturón!",
  "¿Cómo se llama el campeón de buceo japonés? Tokofondo.",
  "¿Por qué los pájaros vuelan hacia el sur en invierno? Porque caminar sería demasiado lejos.",
  "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
  "¿Cómo se llama un boomerang que no regresa? Un palo.",
  "¿Qué le dijo el semáforo al conductor? No me mires, me estoy cambiando.",
  "¿Por qué el espantapájaros ganó un premio? Porque era sobresaliente en su campo.",
  "¿Qué hace un pez cuando le duele el estómago? Va al médico, ¿qué esperabas?",
  "¿Cuál es el colmo de un electricista? Que su hijo sea un apagado.",
  "¿Qué hace una vaca con una computadora? Navegar por internet... moo-vilmente.",
  "¿Por qué los programadores no salen al sol? Porque tienen demasiados bugs.",
  "¿Cuál es el café más peligroso del mundo? ¡El ex-preso!",
  "¿Qué le dijo el océano a la playa? Nada.",
  "¿Por qué no confías en los átomos? Porque lo forman todo.",
];

const chiste: Command = {
  data: new SlashCommandBuilder()
    .setName("chiste")
    .setDescription("Escucha un chiste aleatorio"),

  async execute(interaction: ChatInputCommandInteraction) {
    const chisteAleatorio = chistes[Math.floor(Math.random() * chistes.length)];

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle("😂 Chiste del Momento")
      .setDescription(chisteAleatorio)
      .setFooter({ text: "ÆON | Entretenimiento" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default chiste;
