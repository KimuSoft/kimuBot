import mongoose, { Schema } from "mongoose"
import { IPrice, PriceModel } from "../types/price"
import { StockType } from "../constants"

const schema = new Schema<IPrice, PriceModel>(
  {
    kimuSoft: { type: "Number" },
    kimuNovel: { type: "Number" },
    kimuGames: { type: "Number" },
    kimuPictures: { type: "Number" },
  },
  {
    timestamps: true,
  }
)

export const Price = mongoose.model<IPrice, PriceModel>("price", schema)

export const getPriceData = async () =>
  Price.findOne({}).sort({ createdAt: -1 })

export const getPrice = async (item: StockType) => {
  // 가장 최근 해당 종목의 가격을 불러옴
  const pd = await getPriceData()
  if (!pd) throw new Error("가격 데이터가 없습니다!")
  return pd[item]
}
