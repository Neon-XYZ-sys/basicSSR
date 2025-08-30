const fs = require("fs");
const { error } = require("console");
const http = require("http");
const userDb = require('./userDb');
const { parse } = require('url');

async function initializeDb() {
    try {
        await userDb.createTable();
        console.log('Database and table are ready for use.');
    } catch (err) {
        console.error('Failed to initialize database:', err);
    }
}

function handleApiRequest(req, res) {
    const { pathname, query } = parse(req.url, true);

    if (pathname.startsWith('/api/user/') && req.method === 'GET') {
        const telegramId = pathname.split('/').pop();
        userDb.getProgress(telegramId)
            .then(user => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            })
            .catch(err => {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error retrieving user data.');
            });
    } 
    else if (pathname.startsWith('/api/user/') && req.method === 'POST') {
        const telegramId = pathname.split('/').pop();
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                userDb.createOrUpdateUser(telegramId, data)
                    .then(() => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    })
                    .catch(err => {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error updating user data.');
                    });
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON body.');
            }
        });
    }
    else {
        return false; 
    }
    return true; 
}

function IO() {
    http.createServer((req, res) => {
        if (handleApiRequest(req, res)) {
            return;
        }

        let resFile;
        if (req.url === "/") { resFile = "./html/index.html"; }
        else { resFile = "." + req.url; }

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
    }).listen(8080, "0.0.0.0", () => {
      console.log('Server is running on http://0.0.0.0:8080');
      initializeDb(); 
    });
}

module.exports = { IO };
