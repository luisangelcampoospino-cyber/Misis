import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";

const ayuda: Command = {
  data: new SlashCommandBuilder()
    .setName("ayuda")
    .setDescription("Muestra todos los comandos de ÆON")
    .addStringOption((opt) =>
      opt
        .setName("categoria")
        .setDescription("Categoría específica")
        .setRequired(false)
        .addChoices(
          { name: "🛡️ Moderación", value: "mod" },
          { name: "🎮 Entretenimiento", value: "fun" },
          { name: "💰 Economía", value: "eco" },
          { name: "📊 Niveles", value: "lvl" },
          { name: "ℹ️ Información", value: "info" },
          { name: "🔧 Utilidades", value: "util" },
          { name: "⚙️ Configuración", value: "cfg" }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const categoria = interaction.options.getString("categoria");

    const comandos: Record<string, { emoji: string; titulo: string; cmds: [string, string][] }> = {
      mod: {
        emoji: "🛡️", titulo: "Moderación",
        cmds: [
          ["/ban", "Banear a un usuario"],
          ["/unban", "Desbanear por ID"],
          ["/kick", "Expulsar a un usuario"],
          ["/timeout", "Silenciar temporalmente"],
          ["/warn agregar", "Agregar advertencia"],
          ["/warn ver", "Ver advertencias"],
          ["/warn limpiar", "Limpiar advertencias"],
          ["/purge", "Eliminar mensajes en masa"],
          ["/slowmode", "Activar modo lento"],
        ],
      },
      fun: {
        emoji: "🎮", titulo: "Entretenimiento",
        cmds: [
          ["/8ball", "Pregunta al 8-Ball mágico"],
          ["/dado", "Tira dados personalizados"],
          ["/chiste", "Chiste aleatorio"],
          ["/moneda", "Lanza una moneda"],
          ["/ruleta", "Ruleta rusa"],
          ["/trivia", "Pregunta de trivia"],
          ["/numero", "Adivina el número secreto"],
          ["/encuesta", "Crea una encuesta"],
          ["/ship", "Compatibilidad entre usuarios"],
        ],
      },
      eco: {
        emoji: "💰", titulo: "Economía",
        cmds: [
          ["/balance", "Ver saldo de monedas"],
          ["/daily", "Recompensa diaria (24h)"],
          ["/trabajar", "Trabajar para ganar monedas (1h)"],
          ["/robar", "Intentar robar monedas (riesgo)"],
          ["/transferir", "Transferir monedas a otro"],
          ["/ranking", "Top 10 más ricos"],
        ],
      },
      lvl: {
        emoji: "📊", titulo: "Niveles",
        cmds: [
          ["/rango", "Ver tu nivel y XP"],
          ["/rankingnivel", "Top 10 por nivel"],
        ],
      },
      info: {
        emoji: "ℹ️", titulo: "Información",
        cmds: [
          ["/userinfo", "Info de un usuario"],
          ["/serverinfo", "Info del servidor"],
          ["/avatar", "Ver avatar de un usuario"],
          ["/roleinfo", "Info de un rol"],
        ],
      },
      util: {
        emoji: "🔧", titulo: "Utilidades",
        cmds: [
          ["/ping", "Latencia del bot"],
          ["/uptime", "Tiempo activo del bot"],
          ["/calcular", "Calculadora matemática"],
          ["/recordarme", "Configurar recordatorio"],
          ["/say", "Hacer hablar al bot"],
          ["/ayuda", "Este menú de ayuda"],
        ],
      },
      cfg: {
        emoji: "⚙️", titulo: "Configuración",
        cmds: [
          ["/bienvenida set", "Configurar canal de bienvenida"],
          ["/bienvenida ver", "Ver canal de bienvenida"],
          ["/bienvenida quitar", "Desactivar bienvenidas"],
          ["/autorole set", "Configurar rol automático"],
          ["/autorole ver", "Ver rol automático"],
          ["/autorole quitar", "Quitar rol automático"],
          ["/automod activar", "Activar anti-spam y automod"],
          ["/automod desactivar", "Desactivar automod"],
          ["/automod estado", "Ver estado del automod"],
        ],
      },
    };

    if (categoria && comandos[categoria]) {
      const cat = comandos[categoria];
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(`${cat.emoji} Categoría: ${cat.titulo}`)
        .setDescription(cat.cmds.map(([cmd, desc]) => `\`${cmd}\` — ${desc}`).join("\n"))
        .setFooter({ text: "ÆON • Bot All-in-One | /ayuda para ver categorías" })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("⚡ ÆON — Bot All-in-One")
      .setDescription(
        "Usa `/ayuda [categoría]` para ver los comandos de cada sección.\n" +
        "El XP se gana automáticamente al chatear (cooldown: 1 minuto)."
      )
      .addFields(
        Object.values(comandos).map((cat) => ({
          name: `${cat.emoji} ${cat.titulo}`,
          value: `\`${cat.cmds.length}\` comandos`,
          inline: true,
        }))
      )
      .addFields({
        name: "🤖 Características automáticas",
        value: "✨ XP por mensajes • 👋 Bienvenidas • 🎭 Autorole • 🚫 Anti-spam • 📢 Subida de nivel",
        inline: false,
      })
      .setFooter({ text: "ÆON • Siempre activo, siempre contigo" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default ayuda;
