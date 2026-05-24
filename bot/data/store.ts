import { EconomyData, WarnData, LevelData, GuildConfig } from "../types.js";

export const economyData: EconomyData = {};
export const warnData: WarnData = {};
export const levelData: LevelData = {};
export const guildConfig: GuildConfig = {};
export const reminders: Array<{ userId: string; channelId: string; message: string; time: number }> = [];
export const spamTracker: Map<string, { count: number; timestamp: number }> = new Map();
export const triviaActive: Map<string, { answer: string; timeout: ReturnType<typeof setTimeout> }> = new Map();
export const numberGames: Map<string, { number: number; attempts: number }> = new Map();

export function getBalance(userId: string): number {
  if (!economyData[userId]) economyData[userId] = { balance: 0, lastDaily: 0, lastWork: 0 };
  return economyData[userId].balance;
}

export function addBalance(userId: string, amount: number): void {
  if (!economyData[userId]) economyData[userId] = { balance: 0, lastDaily: 0, lastWork: 0 };
  economyData[userId].balance = Math.max(0, economyData[userId].balance + amount);
}

export function setBalance(userId: string, amount: number): void {
  if (!economyData[userId]) economyData[userId] = { balance: 0, lastDaily: 0, lastWork: 0 };
  economyData[userId].balance = Math.max(0, amount);
}

export function getLastDaily(userId: string): number {
  if (!economyData[userId]) economyData[userId] = { balance: 0, lastDaily: 0, lastWork: 0 };
  return economyData[userId].lastDaily;
}

export function setLastDaily(userId: string, timestamp: number): void {
  if (!economyData[userId]) economyData[userId] = { balance: 0, lastDaily: 0, lastWork: 0 };
  economyData[userId].lastDaily = timestamp;
}

export function getLastWork(userId: string): number {
  if (!economyData[userId]) economyData[userId] = { balance: 0, lastDaily: 0, lastWork: 0 };
  return economyData[userId].lastWork ?? 0;
}

export function setLastWork(userId: string, timestamp: number): void {
  if (!economyData[userId]) economyData[userId] = { balance: 0, lastDaily: 0, lastWork: 0 };
  economyData[userId].lastWork = timestamp;
}

export function addWarn(guildId: string, userId: string, reason: string): number {
  if (!warnData[guildId]) warnData[guildId] = {};
  if (!warnData[guildId][userId]) warnData[guildId][userId] = [];
  warnData[guildId][userId].push(reason);
  return warnData[guildId][userId].length;
}

export function getWarns(guildId: string, userId: string): string[] {
  if (!warnData[guildId]) return [];
  return warnData[guildId][userId] ?? [];
}

export function clearWarns(guildId: string, userId: string): void {
  if (warnData[guildId]) warnData[guildId][userId] = [];
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

  return { leveledUp, newLevel: levelData[userId].level };
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
}
