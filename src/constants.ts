import { APIApplicationCommandOptionChoice } from "discord.js"

export enum Stock {
  KimuSoft = "kimuSoft",
  KimuNovel = "kimuNovel",
  KimuGames = "kimuGames",
  KimuPictures = "kimuPictures",
}

export type StockType = "kimuSoft" | "kimuNovel" | "kimuGames" | "kimuPictures"

export const itemChoice: APIApplicationCommandOptionChoice<string>[] = [
  {
    name: "KimuSoft",
    name_localizations: { ko: "💻 키뮤소프트" },
    value: "kimuSoft",
  },
  {
    name: "KimuNovel",
    name_localizations: { ko: "📖 키뮤노블" },
    value: "kimuNovel",
  },
  {
    name: "KimuGames",
    name_localizations: { ko: "🎮 키뮤게임즈" },
    value: "kimuGames",
  },
  {
    name: "KimuPictures",
    name_localizations: { ko: "🎨 키뮤픽쳐스" },
    value: "kimuPictures",
  },
]
