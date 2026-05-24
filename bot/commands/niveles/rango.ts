import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getLevelData, levelData } from "../../data/store.js";

const rango: Command = {
  data: new SlashCommandBuilder()
    .setName("rango")
    .setDescription("Muestra tu nivel y XP actual")
    .addUserOption((opt) =>
      opt.setName("usuario").setDescription("Ver el rango de otro usuario").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("usuario") ?? interaction.user;
    const data = getLevelData(target.id);

    const xpNeeded = Math.floor(100 * Math.pow(data.level + 1, 1.5));
    const progreso = Math.min(20, Math.floor((data.xp / xpNeeded) * 20));
    const barra = "█".repeat(progreso) + "░".repeat(20 - progreso);

    const sorted = Object.entries(levelData)
      .sort(([, a], [, b]) => b.level - a.level || b.xp - a.xp);
    const posicion = sorted.findIndex(([id]) => id === target.id) + 1;

    const rangos = [
      { min: 0, nombre: "🌱 Novato" },
      { min: 5, nombre: "⚡ Aprendiz" },
      { min: 10, nombre: "🔥 Veterano" },
      { min: 20, nombre: "💎 Élite" },
      { min: 35, nombre: "👑 Leyenda" },
      { min: 50, nombre: "⚔️ Inmortal" },
    ];
    const rango = [...rangos].reverse().find((r) => data.level >= r.min)?.nombre ?? "🌱 Novato";

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle(`📊 Rango de ${target.username}`)
      .setThumbnail(target.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: "🏅 Rango", value: rango, inline: true },
        { name: "📈 Nivel", value: `${data.level}`, inline: true },
        { name: "🏆 Posición", value: posicion > 0 ? `#${posicion}` : "Sin rankear", inline: true },
        { name: `✨ XP [${data.xp}/${xpNeeded}]`, value: `\`${barra}\``, inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default rango;
