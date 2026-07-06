-- CreateTable
CREATE TABLE `music_playlist` (
    `id` VARCHAR(64) NOT NULL,
    `title` VARCHAR(128) NOT NULL,
    `description` TEXT NULL,
    `cover` VARCHAR(512) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `idx_music_playlist_sort`(`sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `music_song` (
    `id` VARCHAR(64) NOT NULL,
    `playlist_id` VARCHAR(64) NOT NULL,
    `title` VARCHAR(256) NOT NULL,
    `artist` VARCHAR(128) NULL,
    `album` VARCHAR(256) NULL,
    `cover` VARCHAR(512) NULL,
    `source_name` VARCHAR(64) NULL,
    `source_url` VARCHAR(512) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_music_song_playlist`(`playlist_id`),
    INDEX `idx_music_song_sort`(`sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `music_song` ADD CONSTRAINT `music_song_playlist_id_fkey` FOREIGN KEY (`playlist_id`) REFERENCES `music_playlist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
