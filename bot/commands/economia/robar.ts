import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types.js";
import { getBalance, addBalance } from "../../data/store.js";

const robCooldowns = new Map<string, number>();
const COOLDOWN_MS = 30 * 60 * 1000;

const robar: Command = {
  data: new SlashCommandBuilder()
    .setName("robar")
    .setDescription("Intenta robar monedas a otro usuario (riesgo de perder el 20%)")
    .addUserOption((opt) =>
      opt.setName("usuario").setDescription("A quién quieres robar").setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("usuario", true);
    const userId = interaction.user.id;
    const now = Date.now();

    if (target.id === userId) {
      await interaction.reply({ content: "❌ No puedes robarte a ti mismo.", ephemeral: true });
      return;
    }
    if (target.bot) {
      await interaction.reply({ content: "❌ Los bots tienen seguridad militar 🤖.", ephemeral: true });
      return;
    }

    const lastRob = robCooldowns.get(userId) ?? 0;
    const remaining = COOLDOWN_MS - (now - lastRob);
    if (remaining > 0) {
      const mins = Math.floor(remaining / 60000);
      await interaction.reply({
        content: `⏰ Estás demasiado sospechoso. Espera **${mins} minutos** antes de robar de nuevo.`,
        ephemeral: true,
      });
      return;
    }

    const victimBalance = getBalance(target.id);
    if (victimBalance < 50) {
      await interaction.reply({ content: "❌ Esa persona está en la quiebra, no vale la pena.", ephemeral: true });
      return;
    }

    robCooldowns.set(userId, now);
    const exito = Math.random() < 0.45;

    if (exito) {
      const robado = Math.floor(victimBalance * (0.1 + Math.random() * 0.2));
      addBalance(target.id, -robado);
      addBalance(userId, robado);

      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("🦹 ¡Robo Exitoso!")
        .setDescription(`Robaste **${robado} 🪙** a **${target.username}** sin que se diera cuenta.`)
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else {
      const multa = Math.floor(getBalance(userId) * 0.2);
      addBalance(userId, -multa);

      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle("🚔 ¡Te Atraparon!")
        .setDescription(
          `Intentaste robar a **${target.username}** pero te capturaron.\nPagaste una multa de **${multa} 🪙**.`
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    }
  },
};

export default robar;
