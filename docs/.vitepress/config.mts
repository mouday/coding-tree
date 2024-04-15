import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Coding Tree",
  description: "编程学习路上的笔记与知识整理收集",
  base: "/coding-tree/",
  lastUpdated: true,
  head: [["link", { rel: "icon", href: "/coding-tree/img/favicon.ico" }]],
  sitemap: {
    hostname: 'https://mouday.github.io/coding-tree'
  },
  themeConfig: {
    search: {
      provider: "local",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: {
      '/': [
        {
          text: "Examples",
          items: [
            { text: "Markdown Examples", link: "/markdown-examples" },
            { text: "Runtime API Examples", link: "/api-examples" },
          ],
        },
      ],
      // 当用户位于 `guide` 目录时，会显示此侧边栏
      '/ruankao/': [
        {
          text: '软考',
          items: [
            { text: '第1章 信息化发展', link: '/ruankao/chapter-1' },
            { text: '第2章 信息技术发展', link: '/ruankao/chapter-2' },
            { text: '第3章 信息系统治理', link: '/ruankao/chapter-3' },
            { text: '第4章 信息系统管理', link: '/ruankao/chapter-4' },
          ]
        }
      ],
    },
    

    socialLinks: [
      { icon: "github", link: "https://github.com/mouday/coding-tree" },
    ],

    outline: {
      /**
       * outline 中要显示的标题级别。
       * 单个数字表示只显示该级别的标题。
       * 如果传递的是一个元组，第一个数字是最小级别，第二个数字是最大级别。
       * `'deep'` 与 `[2, 6]` 相同，将显示从 `<h2>` 到 `<h6>` 的所有标题。
       *
       * @default 2
       */
      level: "deep",
      /**
       * 显示在 outline 上的标题。
       *
       * @default 'On this page'
       */
      label: "大纲",
    },
  },
});
