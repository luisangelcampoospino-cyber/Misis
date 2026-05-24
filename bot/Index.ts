import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { BotClient, Command } from "./types.js";
import { logger } from "../lib/logger.js";
import { initDB, loadAllData } from "./db.js";
import { economyData, warnData, levelData, guildConfig } from "./data/store.js";

import onReady from "./events/ready.js";
import onInteractionCreate from "./events/interactionCreate.js";
import onGuildMemberAdd from "./events/guildMemberAdd.js";
import onGuildMemberRemove from "./events/guildMemberRemove.js";
import onMessageCreate from "./events/messageCreate.js";

// Moderación
import ban from "./commands/moderacion/ban.js";
import kick from "./commands/moderacion/kick.js";
import warn from "./commands/moderacion/warn.js";
import purge from "./commands/moderacion/purge.js";
import timeout from "./commands/moderacion/timeout.js";
import unban from "./commands/moderacion/unban.js";
import slowmode from "./commands/moderacion/slowmode.js";

// Entretenimiento
import ocho from "./commands/entretenimiento/ocho.js";
import dado from "./commands/entretenimiento/dado.js";
import chiste from "./commands/entretenimiento/chiste.js";
import moneda from "./commands/entretenimiento/moneda.js";
import ruleta from "./commands/entretenimiento/ruleta.js";
import trivia from "./commands/entretenimiento/trivia.js";
import numero from "./commands/entretenimiento/numero.js";
import encuesta from "./commands/entretenimiento/encuesta.js";
import ship from "./commands/entretenimiento/ship.js";

// Economía
import balance from "./commands/economia/balance.js";
import daily from "./commands/economia/daily.js";
import transferir from "./commands/economia/transferir.js";
import ranking from "./commands/economia/ranking.js";
import trabajar from "./commands/economia/trabajar.js";
import robar from "./commands/economia/robar.js";

// Información
import avatar from "./commands/informacion/avatar.js";
import roleinfo from "./commands/informacion/roleinfo.js";
import serverinfo from "./commands/informacion/serverinfo.js";
import userinfo from "./commands/informacion/userinfo.js";

// Niveles
import rango from "./commands/niveles/rango.js";
import rankingnivel from "./commands/niveles/rankingnivel.js";

// Utilidades
import ayuda from "./commands/utilidades/ayuda.js";
import calculadora from "./commands/utilidades/calculadora.js";
import ping from "./commands/utilidades/ping.js";
import recordarme from "./commands/utilidades/recordarme.js";
import say from "./commands/utilidades/say.js";
import uptime from "./commands/utilidades/uptime.js";

// Configuración
import automod from "./commands/config/automod.js";
import autorole from "./commands/config/autorole.js";
import bienvenida from "./commands/config/bienvenida.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.GuildMember, Partials.User, Partials.Message],
}) as BotClient;

client.commands = new Collection<string, Command>();
client.xpCooldowns = new Set<string>();

const allCommands: Command[] = [
  ban, kick, warn, purge, timeout, unban, slowmode,
  ocho, dado, chiste, moneda, ruleta, trivia, numero, encuesta, ship,
  balance, daily, transferir, ranking, trabajar, robar,
  avatar, roleinfo, serverinfo, userinfo,
  rango, rankingnivel,
  ayuda, calculadora, ping, recordarme, say, uptime,
  automod, autorole, bienvenida,
];

for (const command of allCommands) {
  client.commands.set(command.data.name, command);
}

client.once("ready", (c) => onReady(c));
client.on("interactionCreate", (i) => onInteractionCreate(i));
client.on("guildMemberAdd", (m) => onGuildMemberAdd(m));
client.on("guildMemberRemove", (m) => onGuildMemberRemove(m));
client.on("messageCreate", (m) => onMessageCreate(m));

const token = process.env["DISCORD_TOKEN"];
if (!token) {
  logger.error("La variable de entorno DISCORD_TOKEN no está definida.");
  process.exit(1);
}

if (process.env["DATABASE_URL"]) {
  try {
    await initDB();
    const data = await loadAllData();
    Object.assign(economyData, data.economy);
    Object.assign(warnData, data.warns);
    Object.assign(levelData, data.levels);
    Object.assign(guildConfig, data.config);
  } catch (err) {
    logger.error({ err }, "Error iniciando base de datos — continuando sin persistencia");
  }
} else {
  logger.warn("DATABASE_URL no definida — los datos no se guardarán al reiniciar");
}

client.login(token).catch((err) => {
  logger.error({ err }, "Error al iniciar sesión en Discord");
  process.exit(1);
});
