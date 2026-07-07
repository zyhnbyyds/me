import list from '~~/server/data/wy-like-song.json'
import { Result } from '~~/server/utils/result'
import { prisma } from '~~/server/lib/prisma'

interface WySong {
  name: string
  id: number
  ar: { id: number; name: string }[]
  al: {
    id: number
    name: string
    picUrl: string
  }
}

/** 网易云音乐我喜欢的歌曲导入 */
export default defineEventHandler(async () => {
  try {
    const PLAYLIST_ID = 'wy-like'
    const PLAYLIST_TITLE = '我喜欢的音乐'
    const SOURCE_NAME = 'netease'

    // 1. 先创建/更新歌单
    await prisma.music_playlist.upsert({
      where: { id: PLAYLIST_ID },
      update: {
        title: PLAYLIST_TITLE,
        description: '网易云音乐我喜欢的歌曲',
        cover: (list[0] as WySong)?.al?.picUrl ?? null,
      },
      create: {
        id: PLAYLIST_ID,
        title: PLAYLIST_TITLE,
        description: '网易云音乐我喜欢的歌曲',
        cover: (list[0] as WySong)?.al?.picUrl ?? null,
        sort_order: 0,
      },
    })

    // 2. 批量导入歌曲
    const result = await Promise.all(
      (list as WySong[]).map(async (item, index) => {
        const artist = item.ar?.map((a) => a.name).join(' / ') ?? null
        const songId = String(item.id)

        return prisma.music_song.upsert({
          where: { id: `${PLAYLIST_ID}_${songId}` },
          update: {
            title: item.name,
            artist,
            album: item.al?.name ?? null,
            cover: item.al?.picUrl ?? null,
            source_url: `https://music.163.com/#/song?id=${songId}`,
            sort_order: index,
          },
          create: {
            id: `${PLAYLIST_ID}_${songId}`,
            playlist_id: PLAYLIST_ID,
            title: item.name,
            artist,
            album: item.al?.name ?? null,
            cover: item.al?.picUrl ?? null,
            source_name: SOURCE_NAME,
            source_url: `https://music.163.com/#/song?id=${songId}`,
            sort_order: index,
          },
        })
      }),
    )

    return Result.success({
      playlistId: PLAYLIST_ID,
      count: result.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return Result.fail(500, message)
  }
})
