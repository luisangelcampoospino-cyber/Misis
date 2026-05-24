import { EconomyData, WarnData, LevelData, GuildConfig } from "../types.js";
import { saveEconomy, saveLevel, saveWarn, deleteWarns, saveGuildConfig } from "../db.js";

export const economyData: EconomyData = {};
export const warnData: WarnData = {};
export const levelData: LevelData = {};
export const guildConfig: GuildConfig = {};
export const reminders: Array<{ userId: string; channelId: string; message: string; time: number }> = [];
export const spamTracker: Map<string, { count: number; timestamp: number }> = new Map();
export const triviaActive: Map<string, { answer: string; timeout: ReturnType<typeof setTimeout> }> = new Map();
export const numberGames: Map<string, { number: number; attempts: number }> = new Map();

function ensureEconomy(userId: string) {
  if (!economyData[userId]) economyData[userId] = { balance: 0, lastDaily: 0, lastWork: 0 };
}

export function getBalance(userId: string): number {
  ensureEconomy(userId);
  return economyData[userId].balance;
}

export function addBalance(userId: string, amount: number): void {
  ensureEconomy(userId);
  economyData[userId].balance = Math.max(0, economyData[userId].balance + amount);
  const e = economyData[userId];
  saveEconomy(userId, e.balance, e.lastDaily, e.lastWork);
}

export function setBalance(userId: string, amount: number): void {
  ensureEconomy(userId);
  economyData[userId].balance = Math.max(0, amount);
  const e = economyData[userId];
  saveEconomy(userId, e.balance, e.lastDaily, e.lastWork);
}

export function getLastDaily(userId: string): number {
  ensureEconomy(userId);
  return economyData[userId].lastDaily;
}

export function setLastDaily(userId: string, timestamp: number): void {
  ensureEconomy(userId);
  economyData[userId].lastDaily = timestamp;
  const e = economyData[userId];
  saveEconomy(userId, e.balance, e.lastDaily, e.lastWork);
}

export function getLastWork(userId: string): number {
  ensureEconomy(userId);
  return economyData[userId].lastWork ?? 0;
}

export function setLastWork(userId: string, timestamp: number): void {
  ensureEconomy(userId);
  economyData[userId].lastWork = timestamp;
  const e = economyData[userId];
  saveEconomy(userId, e.balance, e.lastDaily, e.lastWork);
}

export function addWarn(guildId: string, userId: string, reason: string): number {
  if (!warnData[guildId]) warnData[guildId] = {};
  if (!warnData[guildId][userId]) warnData[guildId][userId] = [];
  warnData[guildId][userId].push(reason);
  saveWarn(guildId, userId, reason);
  return warnData[guildId][userId].length;
}

export function getWarns(guildId: string, userId: string): string[] {
  if (!warnData[guildId]) return [];
  return warnData[guildId][userId] ?? [];
}

export function clearWarns(guildId: string, userId: string): void {
  if (warnData[guildId]) warnData[guildId][userId] = [];
  deleteWarns(guildId, userId);
}

export function getLevelData(userId: string): { xp: number; level: number } {
  if (!levelData[userId]) levelData[userId] = { xp: 0, level: 0 };
  return levelData[userId];
}

export function addXp(userId: string, amount: number): { leveledUp: boolean; newLevel: number } {
  if (!levelData[userId]) levelData[userId] = { xp: 0, level: 0 };
  levelData[userId].xp += amount;

  const xpNeeded = (level: number) => 100 * Math.pow(level + 1, 1.5);
  let leveledUp = false;

  while (levelData[userId].xp >= xpNeeded(levelData[userId].level)) {
    levelData[userId].xp -= xpNeeded(levelData[userId].level);
    levelData[userId].level += 1;
    leveledUp = true;
  }

  const { xp, level } = levelData[userId];
  saveLevel(userId, xp, level);
  return { leveledUp, newLevel: level };
}

export function getGuildConfig(guildId: string): GuildConfig[string] {
  if (!guildConfig[guildId]) {
    guildConfig[guildId] = {
      welcomeChannelId: null,
      autoroleId: null,
      automodEnabled: false,
      antiSpamEnabled: false,
    };
  }
  return guildConfig[guildId];
}

export function setGuildConfig(guildId: string, config: Partial<GuildConfig[string]>): void {
  const current = getGuildConfig(guildId);
  guildConfig[guildId] = { ...current, ...config };
  const c = guildConfig[guildId];
  saveGuildConfig(guildId, c.welcomeChannelId, c.autoroleId, c.automodEnabled, c.antiSpamEnabled);
}
