import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../types.js";
import { triviaActive } from "../../data/store.js";

const preguntas = [
  { p: "¿Cuál es la capital de Francia?", r: "paris", pistas: "Empieza con 'P'" },
  { p: "¿Cuántos planetas hay en el sistema solar?", r: "8", pistas: "Un número de un dígito" },
  { p: "¿En qué año llegó el hombre a la Luna?", r: "1969", pistas: "Década de los 60" },
  { p: "¿Cuál es el elemento químico del oro?", r: "au", pistas: "Dos letras, del latín" },
  { p: "¿Cuántos lados tiene un hexágono?", r: "6", pistas: "Más de 5" },
  { p: "¿Quién pintó la Mona Lisa?", r: "da vinci", pistas: "Artista italiano del Renacimiento" },
  { p: "¿Cuál es el océano más grande del mundo?", r: "pacifico", pistas: "Empieza con 'P'" },
  { p: "¿En qué país se inventó el fútbol moderno?", r: "inglaterra", pistas: "País europeo" },
  { p: "¿Cuántos huesos tiene el cuerpo humano adulto?", r: "206", pistas: "Número entre 200 y 210" },
  { p: "¿Cuál es el animal terrestre más rápido?", r: "guepardo", pistas: "Felino manchado" },
  { p: "¿Cuántos continentes hay en el mundo?", r: "7", pistas: "Un dígito mayor que 6" },
  { p: "¿Cuál es la montaña más alta del mundo?", r: "everest", pistas: "Está en el Himalaya" },
  { p: "¿Cuántos colores tiene el arcoíris?", r: "7", pistas: "Un dígito" },
  { p: "¿Cuál es el idioma más hablado del mundo?", r: "mandarin", pistas: "Idioma asiático" },
  { p: "¿Qué planeta es el más grande del sistema solar?", r: "jupiter", pistas: "Empieza con 'J'" },
];

const trivia: Command = {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Responde una pregunta de trivia en el chat"),

  async execute(interaction: ChatInputCommandInteraction) {
    const channelId = interaction.channelId;

    if (triviaActive.has(channelId)) {
      await interaction.reply({ content: "⚠️ Ya hay una trivia activa en este canal. ¡Respóndela primero!", ephemeral: true });
      return;
    }

    const pregunta = preguntas[Math.floor(Math.random() * preguntas.length)];

    const timeout = setTimeout(() => {
      triviaActive.delete(channelId);
      const ch = interaction.channel;
      if (ch && "send" in ch) {
        (ch as TextChannel).send(`⏰ Tiempo agotado. La respuesta era: **${pregunta.r}**`).catch(() => {});
      }
    }, 30000);

    triviaActive.set(channelId, { answer: pregunta.r, timeout });

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle("🧠 ¡Trivia!")
      .setDescription(`**${pregunta.p}**`)
      .addFields({ name: "💡 Pista", value: pregunta.pistas, inline: true })
      .setFooter({ text: "Tienes 30 segundos para responder en el chat" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default trivia;
