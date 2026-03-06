-- CreateTable
CREATE TABLE `blog_comment` (
    `id` VARCHAR(64) NOT NULL,
    `file_id` VARCHAR(64) NOT NULL,
    `from_user_id` BIGINT NOT NULL,
    `to_user_id` BIGINT NOT NULL DEFAULT 0,
    `parent_id` VARCHAR(64) NOT NULL DEFAULT '0',
    `depth` INTEGER NOT NULL DEFAULT 1,
    `content` JSON NOT NULL,
    `from_user_snapshot` JSON NOT NULL,
    `to_user_snapshot` JSON NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_blog_comment_created_at`(`created_at`),
    INDEX `idx_blog_comment_file_id`(`file_id`),
    INDEX `idx_blog_comment_parent_id`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_like` (
    `id` VARCHAR(64) NOT NULL,
    `file_id` VARCHAR(64) NOT NULL,
    `user_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_blog_like_file_id`(`file_id`),
    INDEX `idx_blog_like_user_id`(`user_id`),
    INDEX `idx_blog_like_created_at`(`created_at`),
    UNIQUE INDEX `uq_blog_like_file_user`(`file_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_view` (
    `id` VARCHAR(64) NOT NULL,
    `file_id` VARCHAR(64) NOT NULL,
    `viewer_id` VARCHAR(64) NOT NULL,
    `user_id` BIGINT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_blog_view_file_id`(`file_id`),
    INDEX `idx_blog_view_viewer_id`(`viewer_id`),
    INDEX `idx_blog_view_user_id`(`user_id`),
    INDEX `idx_blog_view_created_at`(`created_at`),
    UNIQUE INDEX `uq_blog_view_file_viewer`(`file_id`, `viewer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qq_content` (
    `tid` VARCHAR(64) NOT NULL,
    `uin` BIGINT NULL,
    `name` VARCHAR(64) NULL,
    `content` TEXT NULL,
    `created_time` BIGINT NULL,
    `create_time_str` VARCHAR(32) NULL,
    `create_time_str2` VARCHAR(32) NULL,
    `lastmodify` BIGINT NULL,
    `source_name` VARCHAR(128) NULL,
    `source_url` TEXT NULL,
    `source_appid` VARCHAR(64) NULL,
    `conlist` TEXT NULL,
    `commentlist` TEXT NULL,
    `video` TEXT NULL,
    `lbs` TEXT NULL,
    `pic` TEXT NULL,
    `cmtnum` INTEGER NULL,
    `fwdnum` INTEGER NULL,
    `rt_sum` INTEGER NULL,
    `videototal` INTEGER NULL,
    `secret` BOOLEAN NULL,
    `iseditable` BOOLEAN NULL,
    `issigin` BOOLEAN NULL,
    `certified` BOOLEAN NULL,
    `editmask` INTEGER NULL,
    `has_more_con` BOOLEAN NULL,
    `right` INTEGER NULL,
    `ugc_right` INTEGER NULL,
    `pic_template` TEXT NULL,
    `t1_source` SMALLINT NULL,
    `t1_subtype` SMALLINT NULL,
    `t1_termtype` SMALLINT NULL,
    `t2_source` SMALLINT NULL,
    `t2_subtype` SMALLINT NULL,
    `t2_termtype` SMALLINT NULL,
    `wbid` BIGINT NULL,
    `createtime` VARCHAR(20) NULL,

    PRIMARY KEY (`tid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
