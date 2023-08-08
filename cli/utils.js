const { marked } = require("marked");
const fs = require("fs");
const path = require("path");

const nunjucks = require("nunjucks");

function markdown2Html(markdown) {
  return marked.parse(markdown);
}

function renderFile(name) {
  const content = fs.readFileSync(name, "utf-8");
  const template = fs.readFileSync(path.join(__dirname, "template.html"), "utf-8");

  const html = markdown2Html(content);
  return nunjucks.renderString(template, { body: html });
}

module.exports = {
  renderFile,
};
