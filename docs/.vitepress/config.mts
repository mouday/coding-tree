import { defineConfig } from "vitepress";
import AutoSidebar from "vite-plugin-vitepress-auto-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  title: "Coding Tree",
  description: "编程学习路上的笔记与知识整理收集",
  base: "/coding-tree/",
  lastUpdated: true,
  head: [["link", { rel: "icon", href: "/coding-tree/img/favicon.ico" }]],
  sitemap: {
    hostname: "https://mouday.github.io/coding-tree",
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

    // sidebar: {
    //   "/": [
    //     {
    //       text: "Examples",
    //       items: [
    //         { text: "Markdown Examples", link: "/markdown-examples" },
    //         { text: "Runtime API Examples", link: "/api-examples" },
    //       ],
    //     },
    //   ],
    //   // 当用户位于 `ruankao` 目录时，会显示此侧边栏
    //   // "/ruankao/": ruankaoSidebar,
    // },

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
  vite: {
    plugins: [
      // https://github.com/QC2168/vite-plugin-vitepress-auto-sidebar
      AutoSidebar({
        ignoreList: [".DS_Store"],
        titleFromFile: true,

        // 侧边栏排序
        beforeCreateSideBarItems: (data) => {
          // console.log(data);

          function getOrder(item: string): number {
            let res = item.match(/(?<order>\d+)/);
            if (res) {
              return parseInt(res.groups.order);
            } else {
              return 0;
            }
          }

          data.sort((a, b) => {
            return getOrder(a) - getOrder(b);
          });

          return data;
        },
      }),
    ],
  },
});
