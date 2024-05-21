import { defineConfig } from "vitepress";
import AutoSidebar from "vite-plugin-vitepress-auto-sidebar";

// https://vitepress.dev/zh/reference/site-config
// ref: https://gitee.com/zhontai/zhontai-admin-doc/blob/master/docs/.vitepress/config.ts
export default defineConfig({
  lang: "zh-CN",
  title: "Coding Tree",
  description: "编程学习路上的笔记与知识整理收集",
  base: "/coding-tree/",
  ignoreDeadLinks: true,
  lastUpdated: true,
  head: [["link", { rel: "icon", href: "/coding-tree/favicon.ico" }]],
  sitemap: {
    hostname: "https://mouday.github.io/coding-tree",
  },
  locales: {
    "/": {
      lang: "zh-CN", // 设置为中文
    },
  },
  themeConfig: {
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            displayDetails: "显示详细列表",
            footer: {
              navigateText: "切换",
              selectText: "选择",
              closeText: "关闭",
            },
          },
        },
      },
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: "Home", link: "/" },
      { text: "软考", link: "/ruankao/" },

      { text: "在线工具箱", link: "https://mouday.github.io/tools/" },
      {
        text: "其他",
        items: [
          { text: "CSDN", link: "https://blog.csdn.net/mouday" },
          { text: "程序员导航", link: "https://mouday.github.io/hao123/" },
          { text: "前端Demo", link: "https://mouday.github.io/front-end-demo/" },
          { text: "学习笔记", link: "https://mouday.github.io/LearningNote/" },
          { text: "SpringBoot Demo", link: "https://mouday.github.io/spring-boot-demo/" },
          { text: "全栈爱好者周刊", link: "/weekly/" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/mouday/coding-tree" },
    ],

    outlineTitle: "导航目录",
    darkModeSwitchLabel: "外观",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    lastUpdatedText: "上次更新",
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
        ignoreList: ["/public/"],
        titleFromFile: true,
        // 侧边栏排序
        beforeCreateSideBarItems: (data: string[]): string[] => {
          // console.log(data);

          // 通过正则提取文件名中的数字
          function getOrder(item: string): number {
            let res = item.match(/(?<order>\d+)/);

            if (res && res.groups) {
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
  docFooter: {
    prev: "上一页",
    next: "下一页",
  },
});
