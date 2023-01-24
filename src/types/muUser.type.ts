import * as mongoose from "mongoose"
import { Model } from "mongoose"

export interface IMuUser {
  id: string
  name: string
  point: number

  // 서버 별 경험치
  atriumExp: number
  atelierExp: number
  streamingExp: number
  playgroundExp: number
  labExp: number

  // 그림권
  artCoupon: number

  // 주식
  kimuSoft: number
  kimuNovel: number
  kimuGames: number
  kimuPictures: number
}

export interface IMuUserMethods {
  getIntegratedExp: () => number
  getLevel: () => number
}

export type MuUserModel = Model<IMuUser, {}, IMuUserMethods>
export type MuUserDocument = mongoose.Document<{}, {}, IMuUser> & {
  _id: mongoose.Types.ObjectId
} & IMuUser &
  IMuUserMethods
