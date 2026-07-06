import type { MusicPlaylist, MusicSong } from '~~/shared/types/music'
import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(
  async (event): Promise<Result<MusicPlaylist | null>> => {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: '缺少歌单 ID' })
    }

    try {
      const playlist = await prisma.music_playlist.findUnique({
        where: { id },
        include: {
          songs: {
            orderBy: { sort_order: 'asc' },
          },
        },
      })

      if (!playlist) {
        return Result.success(null)
      }

      const songs: MusicSong[] = playlist.songs.map((s) => ({
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

      const result: MusicPlaylist = {
        id: playlist.id,
        title: playlist.title,
        description: playlist.description,
        cover: playlist.cover,
        sortOrder: playlist.sort_order,
        createdAt: playlist.created_at.toISOString(),
        updatedAt: playlist.updated_at.toISOString(),
        songs,
      }

      return Result.success(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw createError({ statusCode: 500, statusMessage: message })
    }
  },
)
