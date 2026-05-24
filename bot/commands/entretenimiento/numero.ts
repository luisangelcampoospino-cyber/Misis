import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { numberGames } from "../../data/store.js";

const numero: Command = {
  data: new SlashCommandBuilder()
    .setName("numero")
    .setDescription("Adivina el número secreto entre 1 y 100")
    .addIntegerOption((opt) =>
      opt
        .setName("adivina")
        .setDescription("Tu número (1-100) — omite para iniciar un juego nuevo")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(100)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    const intento = interaction.options.getInteger("adivina");

    if (!numberGames.has(userId)) {
      const secreto = Math.floor(Math.random() * 100) + 1;
      numberGames.set(userId, { number: secreto, attempts: 0 });

      const embed = new EmbedBuilder()
        .setColor(0xf39c12)
        .setTitle("🔢 Adivina el Número")
        .setDescription("He pensado un número entre **1 y 100**.\nUsa `/numero adivina: <número>` para intentarlo.")
        .setFooter({ text: "Tienes intentos ilimitados" })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (intento === null) {
      await interaction.reply({ content: "Ya tienes un juego activo. Usa `/numero adivina: <número>` para continuar.", ephemeral: true });
      return;
    }

    const juego = numberGames.get(userId)!;
    juego.attempts++;

    if (intento === juego.number) {
      numberGames.delete(userId);
      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("🎉 ¡Acertaste!")
        .setDescription(`El número era **${juego.number}** y lo encontraste en **${juego.attempts}** intento(s).`)
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else {
      const pista = intento < juego.number ? "📈 Es **más alto**" : "📉 Es **más bajo**";
      const embed = new EmbedBuilder()
        .setColor(0xe67e22)
        .setTitle("❌ No es ese")
        .addFields(
          { name: "Tu intento", value: `${intento}`, inline: true },
          { name: "Pista", value: pista, inline: true },
          { name: "Intentos", value: `${juego.attempts}`, inline: true }
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    }
  },
};

export default numero;
