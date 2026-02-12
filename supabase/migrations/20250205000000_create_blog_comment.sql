-- 博客评论表：将评论从 Redis 迁移到 PostgreSQL
CREATE TABLE IF NOT EXISTS public.blog_comment (
  id TEXT PRIMARY KEY,
  file_id TEXT NOT NULL,
  from_user_id BIGINT NOT NULL,
  to_user_id BIGINT NOT NULL DEFAULT 0,
  parent_id TEXT NOT NULL DEFAULT '0',
  depth INTEGER NOT NULL DEFAULT 1,
  content JSONB NOT NULL,
  from_user_snapshot JSONB NOT NULL,
  to_user_snapshot JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_comment_file_id ON public.blog_comment (file_id);
CREATE INDEX IF NOT EXISTS idx_blog_comment_parent_id ON public.blog_comment (parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comment_created_at ON public.blog_comment (created_at DESC);

COMMENT ON TABLE public.blog_comment IS '博客文章评论';
COMMENT ON COLUMN public.blog_comment.file_id IS '文章 ID，如 code_Go和NestJs对比';
COMMENT ON COLUMN public.blog_comment.content IS '评论内容 EmojiInfo[]';
COMMENT ON COLUMN public.blog_comment.from_user_snapshot IS '评论者用户信息快照';
COMMENT ON COLUMN public.blog_comment.to_user_snapshot IS '被回复者用户信息快照，根评论为 null';
