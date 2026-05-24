import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface BotClient extends Client {
  commands: Collection<string, Command>;
  xpCooldowns: Set<string>;
}

export interface EconomyData {
  [userId: string]: {
    balance: number;
    lastDaily: number;
    lastWork: number;
  };
}

export interface WarnData {
  [guildId: string]: {
    [userId: string]: string[];
  };
}

export interface LevelData {
  [userId: string]: {
    xp: number;
    level: number;
  };
}

export interface GuildConfig {
  [guildId: string]: {
    welcomeChannelId: string | null;
    autoroleId: string | null;
    automodEnabled: boolean;
    antiSpamEnabled: boolean;
  };
}

