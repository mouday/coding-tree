module.exports = {
  // 此处填写部署路径 https://mouday.github.io/hello-vuepress
  base: "/coding-tree/",
  title: "Coding Tree",
  description: "编程学习路上的笔记与知识整理收集",

  themeConfig: {
    // 最后更新时间
    lastUpdated: "Last Updated", // string | boolean

    // 导航栏
    nav: [
      {
        text: "程序员导航",
        link: "https://mouday.github.io/hao123/",
      },
      {
        text: "学习笔记",
        link: "https://mouday.github.io/LearningNote/",
      },
      {
        text: "代码Demo",
        // link: "/guide/",
        items: [
          { text: "前端 Demo", link: "https://mouday.github.io/front-end-demo/" },
          { text: "Vue Demo", link: "https://mouday.github.io/vue-demo/" },
          { text: "SpringBoot Demo", link: "https://mouday.github.io/spring-boot-demo/" },
        ],
      },
      { text: "External", link: "https://google.com" },
    ],

    // 侧边栏
    sidebar: [
      {
        text: "目录", // 必要的
        link: "/_sidebar",
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 0, //
      },
      {
        text: "导航", // 必要的
        link: "/_navbar",
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 0, //
      },
      {
        text: "常用", // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 0, // 可选的, 默认值是 1
        children: [
          {
            text: "在线工具", // 必要的
            link: "/doc/tools.md", // 可选的, 标题的跳转链接，应为绝对路径
          },
          {
            text: "知识博主", // 必要的
            link: "/doc/nav.md", // 可选的, 标题的跳转链接，应为绝对路径
          },
          {
            text: "开源库", // 必要的
            link: "/doc/open.md", // 可选的, 标题的跳转链接，应为绝对路径
          },
        ],
      },
    ],
  },
};
