import pg from "pg";
import { logger } from "../lib/logger.js";
import { EconomyData, WarnData, LevelData, GuildConfig } from "./types.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({ connectionString: process.env["DATABASE_URL"], ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

export async function initDB(): Promise<void> {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS economy (
      user_id TEXT PRIMARY KEY,
      balance INTEGER NOT NULL DEFAULT 0,
      last_daily BIGINT NOT NULL DEFAULT 0,
      last_work BIGINT NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS warns (
      id SERIAL PRIMARY KEY,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      reason TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS levels (
      user_id TEXT PRIMARY KEY,
      xp REAL NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS guild_config (
      guild_id TEXT PRIMARY KEY,
      welcome_channel_id TEXT,
      autorole_id TEXT,
      automod_enabled BOOLEAN NOT NULL DEFAULT FALSE,
      anti_spam_enabled BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);
  logger.info("Base de datos inicializada correctamente.");
}

export async function loadAllData(): Promise<{
  economy: EconomyData;
  warns: WarnData;
  levels: LevelData;
  config: GuildConfig;
}> {
  const db = getPool();

  const [ecoRows, warnRows, levelRows, configRows] = await Promise.all([
    db.query("SELECT * FROM economy"),
    db.query("SELECT * FROM warns"),
    db.query("SELECT * FROM levels"),
    db.query("SELECT * FROM guild_config"),
  ]);

  const economy: EconomyData = {};
  for (const row of ecoRows.rows) {
    economy[row.user_id] = {
      balance: row.balance,
      lastDaily: Number(row.last_daily),
      lastWork: Number(row.last_work),
    };
  }

  const warns: WarnData = {};
  for (const row of warnRows.rows) {
    if (!warns[row.guild_id]) warns[row.guild_id] = {};
    if (!warns[row.guild_id][row.user_id]) warns[row.guild_id][row.user_id] = [];
    warns[row.guild_id][row.user_id].push(row.reason);
  }

  const levels: LevelData = {};
  for (const row of levelRows.rows) {
    levels[row.user_id] = { xp: row.xp, level: row.level };
  }

  const config: GuildConfig = {};
  for (const row of configRows.rows) {
    config[row.guild_id] = {
      welcomeChannelId: row.welcome_channel_id,
      autoroleId: row.autorole_id,
      automodEnabled: row.automod_enabled,
      antiSpamEnabled: row.anti_spam_enabled,
    };
  }

  logger.info("Datos cargados desde la base de datos.");
  return { economy, warns, levels, config };
}

export function saveEconomy(userId: string, balance: number, lastDaily: number, lastWork: number): void {
  getPool().query(
    `INSERT INTO economy (user_id, balance, last_daily, last_work)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) DO UPDATE SET balance=$2, last_daily=$3, last_work=$4`,
    [userId, balance, lastDaily, lastWork]
  ).catch((err) => logger.error({ err }, "Error guardando economía"));
}

export function saveLevel(userId: string, xp: number, level: number): void {
  getPool().query(
    `INSERT INTO levels (user_id, xp, level)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE SET xp=$2, level=$3`,
    [userId, xp, level]
  ).catch((err) => logger.error({ err }, "Error guardando nivel"));
}

export function saveWarn(guildId: string, userId: string, reason: string): void {
  getPool().query(
    "INSERT INTO warns (guild_id, user_id, reason) VALUES ($1, $2, $3)",
    [guildId, userId, reason]
  ).catch((err) => logger.error({ err }, "Error guardando advertencia"));
}

export function deleteWarns(guildId: string, userId: string): void {
  getPool().query(
    "DELETE FROM warns WHERE guild_id=$1 AND user_id=$2",
    [guildId, userId]
  ).catch((err) => logger.error({ err }, "Error borrando advertencias"));
}

export function saveGuildConfig(guildId: string, welcomeChannelId: string | null, autoroleId: string | null, automodEnabled: boolean, antiSpamEnabled: boolean): void {
  getPool().query(
    `INSERT INTO guild_config (guild_id, welcome_channel_id, autorole_id, automod_enabled, anti_spam_enabled)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (guild_id) DO UPDATE SET welcome_channel_id=$2, autorole_id=$3, automod_enabled=$4, anti_spam_enabled=$5`,
    [guildId, welcomeChannelId, autoroleId, automodEnabled, antiSpamEnabled]
  ).catch((err) => logger.error({ err }, "Error guardando configuración del servidor"));
}
