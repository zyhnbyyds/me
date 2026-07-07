import type { MusicSong } from '~~/shared/types/music'
import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(
  async (
    event,
  ): Promise<
    Result<{ songs: MusicSong[]; total: number; hasMore: boolean }>
  > => {
    const query = getQuery(event)
    const page = Math.max(1, Number(query.page) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 30))

    const PLAYLIST_ID = 'wy-like'

    try {
      const [songs, total] = await Promise.all([
        prisma.music_song.findMany({
          where: { playlist_id: PLAYLIST_ID },
          orderBy: { sort_order: 'asc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.music_song.count({
          where: { playlist_id: PLAYLIST_ID },
        }),
      ])

      const list: MusicSong[] = songs.map((s) => ({
        id: s.id,
        playlistId: s.playlist_id,
        title: s.title,
        artist: s.artist,
        album: s.album,
        cover: s.cover,
        sourceName: s.source_name,
        sourceUrl: s.source_url,
        sortOrder: s.sort_order,
      }))

      return Result.success({
        songs: list,
        total,
        hasMore: page * pageSize < total,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw createError({ statusCode: 500, statusMessage: message })
    }
  },
)
