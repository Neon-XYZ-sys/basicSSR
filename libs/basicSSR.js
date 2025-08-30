fs = require("fs");
const { error } = require("console");
var http = require("http");

var html = "./html/index.html";
function htmlPath(path) {
  html = path;
}

function IO() {
  http
    .createServer((req, res) => {
      let resFile;

      if (req.url === "/") {resFile = "./html/index.html";} 
      else {resFile = "." + req.url;}

      fs.readFile(resFile, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        } else {
          let type = "text/plain";
          if (resFile.endsWith(".html")) type = "text/html";
          else if (resFile.endsWith(".css")) type = "text/css";
          else if (resFile.endsWith(".js")) type = "application/javascript";

          res.writeHead(200, { "Content-Type": type });
          res.end(data);
        }
      });
    }).listen(8080, "0.0.0.0");
}
module.exports = { IO };
