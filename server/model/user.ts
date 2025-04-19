import { defineMongooseModel } from '#nuxt/mongoose'

export const UserSchema = defineMongooseModel('User', {
  nick: {
    type: String,
    default: null,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  createTime: {
    type: String,
    required: true,
  },
  updateTime: {
    type: String,
    required: true,
  },
  isDelete: {
    type: Boolean,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
})
