const express = require("express"); // import Express
const sql = require("mssql"); // import SQL
const dbConfig = require("./dbConfig"); // import dbConfig
const bodyParser = require("body-parser"); //import body parser 
require('dotenv').config(); // Import dotenv
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

// User Controllers //

const loginController = require("../controllers/loginController")
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const bookmarkController = require("../controllers/bookmarkController");
const tagController = require("../controllers/tagController");
const voteController = require("../controllers/voteController");

// Ticketing Controllers // 

const ticketController = require("../controllers/ticketController");
const ticketReplyController = require("../controllers/ticketReplyController")

// -------------------- //

const app = express();

const staticMiddleware = express.static("public");

const port = process.env.PORT || 3000; // Use Environment variable or default port

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.use(staticMiddleware); // Mount the static middleware

//----- CRUD OPERATIONS ----- //
// GET OPERATIONS ( RETRIEVE ) //









// POST OPERATIONS ( CREATE ) //








// PUT OPERATIONS ( UPDATE ) //








// DELETE OPERATIONS ( DELETE )



//setup route for news
app.get('/news', async (req, res) => {
  try {
      const response = await newsapi.v2.topHeadlines({
          sources: 'bbc-news,the-verge',
          q: 'bitcoin',
          category: 'business',
          language: 'en',
          country: 'us'
      });
      res.json(response.articles);
  } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Failed to fetch news' });
  }
});


app.listen(port, async () => {
    try {
      // Connect to the database
      await sql.connect(dbConfig);
      console.log("Database connection established successfully");
    } catch (err) {
      console.error("Database connection error:", err);
      // Terminate the application with an error code (optional)
      process.exit(1); // Exit with code 1 indicating an error
    }
  
    console.log(`Server listening on port ${port}`);
  });
  
  // Close the connection pool on SIGINT signal
  process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    // Perform cleanup tasks (e.g., close database connections)
    await sql.close();
    console.log("Database connection closed");
    process.exit(0); // Exit with code 0 indicating successful shutdown
  });
