import type { MusicPlaylistSummary } from '~~/shared/types/music'
import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(
  async (): Promise<Result<MusicPlaylistSummary[]>> => {
    try {
      const playlists = await prisma.music_playlist.findMany({
        orderBy: { sort_order: 'asc' },
        include: {
          _count: {
            select: { songs: true },
          },
        },
      })

      const list: MusicPlaylistSummary[] = playlists.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        cover: p.cover,
        songCount: p._count.songs,
        sortOrder: p.sort_order,
      }))

      return Result.success(list)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw createError({ statusCode: 500, statusMessage: message })
    }
  },
)
