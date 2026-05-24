import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types.js";

const dado: Command = {
  data: new SlashCommandBuilder()
    .setName("dado")
    .setDescription("Tira un dado personalizado")
    .addIntegerOption((opt) =>
      opt
        .setName("caras")
        .setDescription("Número de caras del dado (por defecto: 6)")
        .setRequired(false)
        .setMinValue(2)
        .setMaxValue(1000)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("cantidad")
        .setDescription("Cantidad de dados a tirar (por defecto: 1)")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(10)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const caras = interaction.options.getInteger("caras") ?? 6;
    const cantidad = interaction.options.getInteger("cantidad") ?? 1;

    const resultados: number[] = [];
    for (let i = 0; i < cantidad; i++) {
      resultados.push(Math.floor(Math.random() * caras) + 1);
    }

    const total = resultados.reduce((a, b) => a + b, 0);

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle("🎲 Tirada de Dado")
      .addFields(
        { name: "Dados", value: `${cantidad}d${caras}`, inline: true },
        { name: "Resultados", value: resultados.join(", "), inline: true },
        { name: "Total", value: `**${total}**`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default dado;
