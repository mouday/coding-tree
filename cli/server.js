const express = require("express");
const { renderFile } = require("./utils.js");

const BASE_URL = "./";

const app = express();

app.use(express.static("public"));

app.get("/", (request, response) => {
  let name = "README.md";
  response.send(renderFile(name));
});

app.get("/*", (request, response) => {
  // console.dir(request);

  let name = path.join(BASE_URL, request.path);

  console.log("name:", name);
  response.send(renderFile(name));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server runing on http://127.0.0.1:${port}`);
});
