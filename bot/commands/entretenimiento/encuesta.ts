import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../types.js";

const EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

const encuesta: Command = {
  data: new SlashCommandBuilder()
    .setName("encuesta")
    .setDescription("Crea una encuesta con hasta 4 opciones")
    .addStringOption((opt) =>
      opt.setName("pregunta").setDescription("La pregunta de la encuesta").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("opcion1").setDescription("Primera opción").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("opcion2").setDescription("Segunda opción").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("opcion3").setDescription("Tercera opción (opcional)").setRequired(false)
    )
    .addStringOption((opt) =>
      opt.setName("opcion4").setDescription("Cuarta opción (opcional)").setRequired(false)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("duracion")
        .setDescription("Duración en minutos (por defecto: 5)")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(60)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const pregunta = interaction.options.getString("pregunta", true);
    const duracion = interaction.options.getInteger("duracion") ?? 5;

    const opciones: string[] = [
      interaction.options.getString("opcion1", true),
      interaction.options.getString("opcion2", true),
      interaction.options.getString("opcion3") ?? "",
      interaction.options.getString("opcion4") ?? "",
    ].filter(Boolean);

    const descripcion = opciones
      .map((op, i) => `${EMOJIS[i]} ${op}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`📊 ${pregunta}`)
      .setDescription(descripcion)
      .addFields({ name: "⏰ Duración", value: `${duracion} minuto(s)`, inline: true })
      .setFooter({ text: `Encuesta creada por ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    const msg = await interaction.fetchReply();

    for (let i = 0; i < opciones.length; i++) {
      await (msg as any).react(EMOJIS[i]);
    }

    setTimeout(async () => {
      try {
        const fetched = await (interaction.channel as TextChannel).messages.fetch(msg.id);
        const resultados = opciones.map((op, i) => {
          const votos = (fetched.reactions.cache.get(EMOJIS[i])?.count ?? 1) - 1;
          return `${EMOJIS[i]} **${op}**: ${votos} voto(s)`;
        });

        const resultEmbed = new EmbedBuilder()
          .setColor(0x2ecc71)
          .setTitle(`📊 Resultados: ${pregunta}`)
          .setDescription(resultados.join("\n"))
          .setTimestamp();

        await interaction.followUp({ embeds: [resultEmbed] });
      } catch { /* silencioso si el mensaje fue eliminado */ }
    }, duracion * 60 * 1000);
  },
};

export default encuesta;
