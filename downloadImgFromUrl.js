import { readFileSync } from 'node:fs'
import fs from 'node:fs'
import path from 'node:path'
import axios from 'axios'

const qqList = JSON.parse(readFileSync('./server/data/data.json', 'utf-8'))

/**
 * 下载网络图片到本地
 * @param url 图片链接
 * @param outputDir 输出目录
 * @param filename 可选的保存文件名
 */
async function downloadImage(
  url,
  outputDir = './downloads',
  filename,
) {
  // 提取文件名或使用默认名
  const defaultName = `image_${Date.now()}.jpg`
  const name = filename || path.basename(url.split('?')[0]) || defaultName

  // 确保目录存在
  fs.mkdirSync(outputDir, { recursive: true })

  const filePath = path.resolve(outputDir, `${name}.jpg`)

  const writer = fs.createWriteStream(filePath)

  const response = await axios.get(url, {
    responseType: 'stream',
  })

  return new Promise((resolve, reject) => {
    response.data.pipe(writer)
    writer.on('finish', () => {
      resolve(filePath)
    })
    writer.on('error', reject)
  })
}

qqList.forEach((item) => {
  if (item.pic) {
    item.pic.forEach((itm, i) => {
      downloadImage(itm.url1, './public/qq', `image_${item.tid}_${i}`)
    })
  }
})
