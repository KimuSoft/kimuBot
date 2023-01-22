import * as mongoose from "mongoose"
import { Model } from "mongoose"

export interface IMuUser {
  id: string
  name: string
  atriumExp: number
  atelierExp: number
  streamingExp: number
  playgroundExp: number
  labExp: number
  artCoupon: number
  point: number
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
