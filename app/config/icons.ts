/**
 * 菜单 SVG 图标集
 * 24×24 极简线条风格，统一 2px 描边，圆角端点
 * 灵感来自 Lucide / Feather 图标系统
 *
 * 每个图标只需定义 outline 路径，
 * 激活态由 AppIcon 组件的 active prop 自动处理（加粗 + 浅色填充）
 */

export interface SvgIconDef {
  viewBox: string
  paths: string[]
}

const icons: Record<string, SvgIconDef> = {
  // ──── 主页 ────
  home: {
    viewBox: '0 0 24 24',
    paths: [
      // 屋顶
      'M3 9.5L12 3l9 6.5',
      // 墙壁 + 门
      'M5 10v9a1 1 0 0 0 1 1h4v-4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20h4a1 1 0 0 0 1-1v-9',
    ],
  },

  // ──── 日历 ────
  calendar: {
    viewBox: '0 0 24 24',
    paths: [
      'M8 2v3',
      'M16 2v3',
      'M3 9h18',
      'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
    ],
  },

  // ──── 探索（搜索） ────
  explore: {
    viewBox: '0 0 24 24',
    paths: ['M21 21l-5.2-5.2', 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z'],
  },

  // ──── QQ 空间（对话气泡） ────
  qq: {
    viewBox: '0 0 24 24',
    paths: ['M7.9 20A9 9 0 1 0 4 13c0 1.5.5 3 1.5 4.2L4 21l3.9-1z'],
  },

  // ──── 随笔（钢笔） ────
  essay: {
    viewBox: '0 0 24 24',
    paths: ['M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z', 'M15 5l4 4'],
  },

  // ──── 社交（用户群组） ────
  social: {
    viewBox: '0 0 24 24',
    paths: [
      'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
      'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      'M22 21v-2a4 4 0 0 0-3-3.87',
      'M16 3.13a4 4 0 0 1 0 7.75',
    ],
  },
}

export default icons
