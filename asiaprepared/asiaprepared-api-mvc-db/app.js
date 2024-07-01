const express = require("express"); // import Express
const sql = require("mssql"); // import SQL
const dbConfig = require("./dbConfig"); // import dbConfig
const bodyParser = require("body-parser"); //import body parser
var cors = require("cors"); // import cors
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("1ddba88858ce46cfa190cddd3143d4ae");
import { EventRegistry } from "eventregistry";

// User Controllers //

const loginController = require("./controllers/loginController");
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
newsapi.v2
  .everything({
    q: "southeast asia readiness",
    sources: "bbc-news,the-verge",
    domains: "bbc.co.uk, techcrunch.com",
    from: "2020-01-01",
    to: "2024-05-28",
    language: "en",
    sortBy: "relevancy",
    page: 2,
  })
  .then((response) => {
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
newsapi.v2
  .sources({
    category: "technology",
    language: "en",
    country: "us",
  })
  .then((response) => {
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
      sortBy: "relevancy",
    });
    res.json(response.articles);
  } catch (error) {
    console.error("Error fetching general news:", error);
    res.status(500).json({ error: "Failed to fetch general news" });
  }
});

// examples showing how to use the autosuggest functionalities for
// concepts, sources, categories, locations, ....

const er = new EventRegistry();

// get concept uris for concepts based on the concept labels
er.suggestConcepts("Obama", {lang: "eng", conceptLang: ["eng", "deu"]}).then((response) => {
    console.info(response);
});

// get only the top concept that best matches the prefix
er.getConceptUri("Obama").then((response) => {
    console.info(`A URI of the top concept that contains the term 'Obama': ${response}`);
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

// AIMAN //
// GET OPERATIONS ( RETRIEVE ) //

// (Missing GET (Search News))//

// POST OPERATIONS ( CREATE ) //
app.post("/comment", commentController.createComment); // Good Just Missing Middleware //
app.post("/vote", voteController.createVote); // Alright Just Missing Middleware and Duplicates Error  //

// PUT OPERATIONS ( UPDATE ) //
app.put("/comment/:id", commentController.updateComment); // Good Just Missing Middleware //

// DELETE OPERATIONS ( DELETE )
app.delete("/comment/:id", commentController.deleteComment); // Good //
app.delete("/vote/:id", voteController.deleteVote); // Good //

//-----------------//

// <Jesmine> //
// GET OPERATIONS ( RETRIEVE ) //
app.get("/bookmarks/search", bookmarkController.searchBookmarkByContent);

// POST OPERATIONS ( CREATE ) //
app.post("/post", postController.createPost); // Good Just Missing Middleware //
app.post("/bookmark", bookmarkController.createBookmark); // Good //

// PUT OPERATIONS ( UPDATE ) //
app.put("/post/:id", postController.updatePost); // Good Just Missing Middleware //

// DELETE OPERATIONS ( DELETE )
app.delete("/post/:id", postController.deletePost); // Good //
app.delete("/bookmark/:id", bookmarkController.deleteBookmark); // Good //

//-----------------//

// Kai Jie //
// GET OPERATIONS ( RETRIEVE ) //
app.get("/ticket/:id", ticketController.getTicketByID); // Good //
app.get("/reply/:ticketID", ticketReplyController.getRepliesByTicketID); // Good //

// POST OPERATIONS ( CREATE ) //
app.post("/tag", tagController.createTag); // Good //
app.post("/ticket", ticketController.createTicket); // Good //
app.post("/reply", ticketReplyController.createReply); // Good //

// PUT OPERATIONS ( UPDATE ) //
app.put("/ticket/:id", ticketController.updateTicketStatus); // Good //

// DELETE OPERATIONS ( DELETE )
app.delete("/tag/:id", tagController.deleteTag); // Good //

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

  console.log("Server listening on port ${port}");
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});

//just for information THE API was working not sure what happened... I will try to fix it
