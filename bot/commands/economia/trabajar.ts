import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { addBalance, getBalance, getLastWork, setLastWork } from "../../data/store.js";

const TRABAJOS = [
  { nombre: "Programador", min: 150, max: 400 },
  { nombre: "Repartidor", min: 80, max: 200 },
  { nombre: "Streamer", min: 50, max: 500 },
  { nombre: "Cocinero", min: 100, max: 250 },
  { nombre: "Médico", min: 200, max: 500 },
  { nombre: "Maestro", min: 120, max: 300 },
  { nombre: "Músico callejero", min: 30, max: 150 },
  { nombre: "Diseñador gráfico", min: 130, max: 350 },
  { nombre: "YouTuber", min: 20, max: 600 },
  { nombre: "Detective", min: 200, max: 450 },
];

const FRASES = [
  "Trabajaste duro toda la mañana y ganaste",
  "Tu jefe quedó impresionado y te pagó",
  "Completaste tu turno y recibiste",
  "Hiciste horas extra y ganaste",
  "Tu cliente te dio propina, total",
];

const COOLDOWN_MS = 60 * 60 * 1000;

const trabajar: Command = {
  data: new SlashCommandBuilder()
    .setName("trabajar")
    .setDescription("Trabaja para ganar monedas (cooldown: 1 hora)"),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    const now = Date.now();
    const lastWork = getLastWork(userId);
    const remaining = COOLDOWN_MS - (now - lastWork);

    if (remaining > 0) {
      const mins = Math.floor(remaining / 60000);
      const segs = Math.floor((remaining % 60000) / 1000);
      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle("⏰ Ya trabajaste")
        .setDescription(`Estás cansado. Vuelve en **${mins}m ${segs}s** para trabajar de nuevo.`)
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const trabajo = TRABAJOS[Math.floor(Math.random() * TRABAJOS.length)];
    const ganancia = Math.floor(Math.random() * (trabajo.max - trabajo.min + 1)) + trabajo.min;
    const frase = FRASES[Math.floor(Math.random() * FRASES.length)];

    setLastWork(userId, now);
    addBalance(userId, ganancia);

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle(`💼 Trabajaste como ${trabajo.nombre}`)
      .setDescription(`${frase} **${ganancia} 🪙 ÆON Coins**`)
      .addFields({ name: "💰 Balance actual", value: `${getBalance(userId).toLocaleString()} 🪙`, inline: true })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default trabajar;
