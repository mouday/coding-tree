const fs = require("fs");
const path = require("path");
const { renderFile } = require("./utils.js");

function traverseFolder(folderPath) {
  // 读取文件夹列表
  const files = fs.readdirSync(folderPath);

  // 遍历文件夹列表
  for (const fileName of files) {
    // 拼接当前文件路径
    const filePath = path.join(folderPath, fileName);

    // 判断该路径是文件夹还是文件
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // 如果是文件夹，递归遍历
      traverseFolder(filePath);
    } else {
      // 如果是文件，执行操作
      if (path.extname(fileName) === ".md") {
        console.log(filePath);

        const output = path.join("dist", filePath.slice(0, -3) + ".html");

        console.log(output);

        const fileDir = path.dirname(output);
        console.log(fileDir);

        if (!fs.existsSync(fileDir)) {
          fs.mkdirSync(fileDir, { recursive: true });
        }

        fs.writeFileSync(output, renderFile(filePath));
      }
    }
  }
}

traverseFolder("./docs");
