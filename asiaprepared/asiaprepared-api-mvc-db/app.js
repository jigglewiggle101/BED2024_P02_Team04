const express = require("express"); // import Express
const sql = require("mssql"); // import SQL
const dbConfig = require("./dbConfig"); // import dbConfig
const bodyParser = require("body-parser"); //import body parser
var cors = require('cors'); // import cors
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI('1ddba88858ce46cfa190cddd3143d4ae');


// User Controllers //

const loginController = require('./controllers/loginController');
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const commentController = require("./controllers/commentController");
const bookmarkController = require("./controllers/bookmarkController");
const tagController = require("./controllers/tagController");
const voteController = require("./controllers/voteController");

// Ticketing Controllers //

const ticketController = require("./controllers/ticketController");
const ticketReplyController = require("./controllers/ticketReplyController");

// -------------------- //

const app = express();

const staticMiddleware = express.static("public");

const port = process.env.PORT || 3000; // Use Environment variable or default port

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(cors()); // Use CORS middleware
app.use(staticMiddleware); // Mount the static middleware



// To query /v2/everything
// You must include at least one q, source, or domain
newsapi.v2.everything({
  q: 'southeast asia readiness',
  sources: 'bbc-news,the-verge',
  domains: 'bbc.co.uk, techcrunch.com',
  from: '2020-01-01',
  to: '2024-05-28',
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


// Route for fetching general news
app.get("/news/general", async (req, res) => {
  try {
    const response = await newsapi.v2.everything({
      q: "southeast asia readiness",
      language: "en",
      sortBy: "relevancy"
    });
    res.json(response.articles);
  } catch (error) {
    console.error("Error fetching general news:", error);
    res.status(500).json({ error: "Failed to fetch general news" });
  }
});


//----- CRUD OPERATIONS ----- //
app.get("/user", userController.getAllUsers);

// <JOVAN> //
// GET OPERATIONS ( RETRIEVE ) //
app.get("/login", loginController.login); // Good Just Missing Middleware //

// POST OPERATIONS ( CREATE ) //
app.post("/register", loginController.createUser); // Good Just Missing Middleware //

// PUT OPERATIONS ( UPDATE ) //
app.put("/user/:id", userController.updateUser); // Good Just Missing Middleware //

// DELETE OPERATIONS ( DELETE )
app.delete("/comment/:id", commentController.deleteComment); //Admin can Delete Any Comment (Route may differ) // Not Done //
app.delete("/tag", tagController.deleteTag); //Admin can Delete Any Tag (Route may differ) // Good //
app.delete("/post", postController.deletePost); //Admin can Delete Any Post (Route may differ) // Not Done //

//-----------------//




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

