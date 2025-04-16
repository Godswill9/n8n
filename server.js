require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const scraper = require("./crawl");
const access = require("./access");


app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // Accepts all origins
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));


// Routes for the API
app.get("/", (req, res) => {
  res.send("welcome to backend system...");
});

 
app.post('/scrape', scraper.scrapeWebsite); 
app.post('/permission', access.makeEditable);


// Set the port to listen on
const port = process.env.PORT || 8082;

// Start the server with WebSocket
server.listen(port, () => {
  console.log("Server is running on port", port);
});
