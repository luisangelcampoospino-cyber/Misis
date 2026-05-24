import { EmbedBuilder, Message, SendableChannels, TextChannel } from "discord.js";
import { BotClient } from "../types.js";
import { logger } from "../../lib/logger.js";
import {
  addXp,
  triviaActive,
  numberGames,
  spamTracker,
  getGuildConfig,
  addWarn,
  getWarns,
} from "../data/store.js";

const XP_COOLDOWNS = new Set<string>();
const SPAM_THRESHOLD = 5;
const SPAM_WINDOW_MS = 5000;
const BAD_WORDS = ["mierda", "puta", "culo", "cabrón", "maricón", "puto"];

export default async function onMessageCreate(message: Message): Promise<void> {
  if (message.author.bot || !message.guild) return;

  const guildId = message.guild.id;
  const userId = message.author.id;
  const channelId = message.channelId;
  const config = getGuildConfig(guildId);

  // --- ANTI-SPAM ---
  if (config.antiSpamEnabled) {
    const key = `${guildId}-${userId}`;
    const now = Date.now();
    const tracker = spamTracker.get(key);

    if (tracker && now - tracker.timestamp < SPAM_WINDOW_MS) {
      tracker.count++;
      if (tracker.count >= SPAM_THRESHOLD) {
        try {
          await message.delete();
          const warns = addWarn(guildId, userId, "Anti-spam automático");
          const sendable = message.channel as unknown as SendableChannels;

          if (warns >= 3) {
            const member = message.guild.members.cache.get(userId);
            if (member?.moderatable) {
              await member.timeout(5 * 60 * 1000, "Spam reiterado (automod)");
              await sendable.send(
                `🔇 ${message.author} fue silenciado 5 minutos por spam reiterado.`
              );
            }
          } else {
            await sendable.send(
              `⚠️ ${message.author}, por favor no hagas spam. (Advertencia ${warns}/3)`
            );
          }

          spamTracker.set(key, { count: 0, timestamp: now });
        } catch (err) {
          logger.error({ err }, "Error en anti-spam");
        }
        return;
      }
    } else {
      spamTracker.set(key, { count: 1, timestamp: now });
    }
  }

  // --- AUTOMOD (palabras prohibidas) ---
  if (config.automodEnabled) {
    const contenido = message.content.toLowerCase();
    const hasBadWord = BAD_WORDS.some((w) => contenido.includes(w));
    if (hasBadWord) {
      try {
        await message.delete();
        const sendable = message.channel as unknown as SendableChannels;
        await sendable.send(
          `⚠️ ${message.author}, ese tipo de lenguaje no está permitido aquí.`
        );
        addWarn(guildId, userId, "Lenguaje inapropiado (automod)");
      } catch (err) {
        logger.error({ err }, "Error en automod palabras");
      }
      return;
    }
  }

  // --- TRIVIA ---
  const triviaData = triviaActive.get(channelId);
  if (triviaData) {
    const respuesta = message.content.toLowerCase().trim();
    if (respuesta === triviaData.answer) {
      clearTimeout(triviaData.timeout);
      triviaActive.delete(channelId);

      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("🎉 ¡Respuesta Correcta!")
        .setDescription(`${message.author} acertó la respuesta: **${triviaData.answer}**`)
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    }
    return;
  }

  // --- NÚMERO SECRETO (en chat) ---
  const numGame = numberGames.get(userId);
  if (numGame) {
    const intento = parseInt(message.content.trim(), 10);
    if (!isNaN(intento) && intento >= 1 && intento <= 100) {
      numGame.attempts++;
      if (intento === numGame.number) {
        numberGames.delete(userId);
        await message.reply(`🎉 ¡Correcto! El número era **${numGame.number}**. Lo lograste en **${numGame.attempts}** intento(s).`);
      } else {
        const pista = intento < numGame.number ? "📈 más alto" : "📉 más bajo";
        await message.reply(`❌ No es ese. El número es ${pista}. (Intento ${numGame.attempts})`);
      }
    }
  }

  // --- SISTEMA DE XP ---
  const xpKey = `${guildId}-${userId}`;
  if (!XP_COOLDOWNS.has(xpKey) && message.content.length >= 5) {
    XP_COOLDOWNS.add(xpKey);
    setTimeout(() => XP_COOLDOWNS.delete(xpKey), 60000);

    const xpGained = Math.floor(Math.random() * 15) + 10;
    const { leveledUp, newLevel } = addXp(userId, xpGained);

    if (leveledUp) {
      try {
        const channel = message.channel as unknown as SendableChannels;
        const embed = new EmbedBuilder()
          .setColor(0x9b59b6)
          .setTitle("🎊 ¡Subiste de Nivel!")
          .setDescription(
            `¡Felicidades ${message.author}! Llegaste al **Nivel ${newLevel}** 🚀`
          )
          .setThumbnail(message.author.displayAvatarURL())
          .setTimestamp();

        await channel.send({ embeds: [embed] });
      } catch (err) {
        logger.error({ err }, "Error enviando mensaje de level-up");
      }
    }
  }
}
