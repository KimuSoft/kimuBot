import mongoose, { Model } from "mongoose"

export interface IPrice {
  kimuSoft: number
  kimuNovel: number
  kimuGames: number
  kimuPictures: number
  createdAt: Date
  updatedAt: Date
}

export interface IPriceMethods {}

export type PriceModel = Model<IPrice, {}, IPriceMethods>
export type PriceDocument = mongoose.Document<{}, {}, IPrice> & {
  _id: mongoose.Types.ObjectId
} & IPrice &
  IPriceMethods
