import { UserSchema } from '../model/user'

export default defineEventHandler(async () => {
  const list = await UserSchema.find({ isDelete: false })
    .sort({ createTime: -1 })
    .select('title createTime id isDelete createTime updateTime')
    .exec()

  return {
    list,
  }
})
