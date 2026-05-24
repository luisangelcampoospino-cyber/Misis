import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { BotClient, Command } from "./types.js";
import { logger } from "../lib/logger.js";

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

