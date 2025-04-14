require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const scraper = require("./crawl");
// const scraper = require("./crawlThrottle").default;


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

// app.get("/scrawl", async (req, res) => {
//   try {
//     // Call the scrapeWebsite function
//     const scrapeResult = await scraper.scrapeWebsite();
//     res.json(scrapeResult); // Send the scrape result as JSON
//   } catch (error) {
//     console.error("Error during scraping:", error);
//     res.status(500).json({ error: "Failed to scrape the website." });
//   }
// });

// app.get('/scrape', scraper.scrapeWebsite); // 👈 now it works properly
app.post('/scrape', scraper.scrapeWebsite); // 👈 now it works properly


// Set the port to listen on
const port = process.env.PORT || 8082;

// Start the server with WebSocket
server.listen(port, () => {
  console.log("Server is running on port", port);
});

// import dotenv from 'dotenv';
// import express from 'express';
// import http from 'http';
// import cors from 'cors';
// import { default as scraper } from './crawlThrottle.js'; // Adjust to import the default export from 'crawlThrottle.js'

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       callback(null, true); // Accepts all origins
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static('public'));

// // Routes for the API
// app.get('/', (req, res) => {
//   res.send('Welcome to the backend system...');
// });

// // Uncomment the following to use scraping with a GET request
// // app.get("/scrawl", async (req, res) => {
// //   try {
// //     const scrapeResult = await scraper.scrapeWebsite();
// //     res.json(scrapeResult);
// //   } catch (error) {
// //     console.error("Error during scraping:", error);
// //     res.status(500).json({ error: "Failed to scrape the website." });
// //   }
// // });

// // POST route for scraping
// app.post('/scrape', scraper.scrapeWebsite); // Now works properly with ES module syntax

// // Set the port to listen on
// const port = process.env.PORT || 8082;

// // Start the server with WebSocket
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
