import { Client } from 'minio'

const { minio } = useRuntimeConfig()
const oss = new Client(minio)

export default oss
