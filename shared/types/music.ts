/** 歌曲 */
export interface MusicSong {
  id: string
  playlistId: string
  title: string
  artist: string | null
  album: string | null
  cover: string | null
  sourceName: string | null
  sourceUrl: string | null
  sortOrder: number
}

/** 歌单（含歌曲列表） */
export interface MusicPlaylist {
  id: string
  title: string
  description: string | null
  cover: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  songs: MusicSong[]
}

/** 歌单摘要（不含歌曲列表） */
export interface MusicPlaylistSummary {
  id: string
  title: string
  description: string | null
  cover: string | null
  songCount: number
  sortOrder: number
}
