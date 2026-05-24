import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";

const calculadora: Command = {
  data: new SlashCommandBuilder()
    .setName("calcular")
    .setDescription("Realiza un cálculo matemático")
    .addStringOption((opt) =>
      opt.setName("expresion").setDescription("Expresión matemática (ej: 2+2, 10*5, 100/4)").setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const expr = interaction.options.getString("expresion", true);

    const sanitized = expr.replace(/[^0-9+\-*/().%\s]/g, "");

    if (!sanitized.trim()) {
      await interaction.reply({ content: "❌ Expresión inválida. Solo se permiten números y operadores (+,-,*,/,%,())", ephemeral: true });
      return;
    }

    let resultado: number;
    try {
      resultado = Function(`"use strict"; return (${sanitized})`)() as number;
      if (!isFinite(resultado)) throw new Error("Resultado no finito");
    } catch {
      await interaction.reply({ content: "❌ No se pudo calcular esa expresión.", ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle("🧮 Calculadora ÆON")
      .addFields(
        { name: "📥 Expresión", value: `\`${sanitized}\``, inline: true },
        { name: "📤 Resultado", value: `\`${resultado}\``, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default calculadora;
