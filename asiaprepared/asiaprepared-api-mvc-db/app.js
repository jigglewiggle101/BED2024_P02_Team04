
const express = require("express"); // import Express
const sql = require("mssql"); // import SQL
const dbConfig = require("./dbConfig"); // import dbConfig
const bodyParser = require("body-parser"); //import body parser 
var cors = require('cors')
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('1ddba88858ce46cfa190cddd3143d4ae');

// User Controllers //

const loginController = require("./controllers/loginController")
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const commentController = require("./controllers/commentController");
const bookmarkController = require("./controllers/bookmarkController");
const tagController = require("./controllers/tagController");
const voteController = require("./controllers/voteController");

// Ticketing Controllers // 

const ticketController = require("./controllers/ticketController");
const ticketReplyController = require("./controllers/ticketReplyController")

// -------------------- //


const app = express();

const staticMiddleware = express.static("public");

const port = process.env.PORT || 3000; // Use Environment variable or default port

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(cors()); // Enable CORS
app.use(staticMiddleware); // Mount the static middleware

//----- CRUD OPERATIONS ----- //
// GET OPERATIONS ( RETRIEVE ) //









// POST OPERATIONS ( CREATE ) //








// PUT OPERATIONS ( UPDATE ) //








// DELETE OPERATIONS ( DELETE )



//setup route for news
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
newsapi.v2.topHeadlines({
  sources: 'bbc-news,the-verge',
  q: 'bitcoin',
  category: 'business',
  language: 'en',
  country: 'us'
}).then(response => {
  console.log(response);
  /*
    {
      status: "ok",
      articles: [...]
    }
  */
});
// To query /v2/everything
// You must include at least one q, source, or domain
newsapi.v2.everything({
  q: 'bitcoin',
  sources: 'bbc-news,the-verge',
  domains: 'bbc.co.uk, techcrunch.com',
  from: '2017-12-01',
  to: '2017-12-12',
  language: 'en',
  sortBy: 'relevancy',
  page: 2
}).then(response => {
  console.log(response);
  /*
    {
      status: "ok",
      articles: [...]
    }
  */
});
// To query sources
// All options are optional
newsapi.v2.sources({
  category: 'technology',
  language: 'en',
  country: 'us'
}).then(response => {
  console.log(response);
  /*
    {
      status: "ok",
      sources: [...]
    }
  */
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
