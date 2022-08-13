const { readdir, readFile, writeFile } = require("fs");

const express = require("express");
const app = express();
const port = 3000;

async function fileList() {
  return new Promise((resolve, reject) => {
    readdir("./src", (err, data) => {
      if (err) return reject(err);

      return resolve(data);
    });
  });
}

async function loadFile(f) {
  return new Promise((resolve, reject) => {
    readFile(`./src/${f}`, "utf-8", (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

async function generaGameFile() {
  const files = await fileList();
  const loading = files.sort().map(file => loadFile(file));

  const content = await Promise.all(loading);
  return content.join("\n");
}

app.get("/", (_, res) => {
  readFile("./index.html", (err, data) => {
    res.setHeader("content-type", "text/html");
    res.send(data);
    res.end();
  });
});

app.get("/bin/game.js", async (req, res) => {
  res.setHeader("content-type", "text/javascript");
  const out = await generaGameFile();
  res.write(out);
  res.end();
});

app.get("/generate_bin", async (req, res) => {
  const out = await generaGameFile();
  writeFile("./bin/game.js", out, () => res.send("DONE"));
});

app.listen(port, () => {
  console.log(`Game running on port ${port}`);
});
