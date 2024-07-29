require("dotenv").config();
const express = require("express"); // import Express
const sql = require("mssql"); // import SQL
const dbConfig = require("./dbConfig"); // import dbConfig
const bodyParser = require("body-parser"); //import body parser
const cors = require("cors"); // import cors
const { verifyJWT, authorizeRoles } = require("./middlewares/authorizeUser");
const { validateUser, schemas } = require("./middlewares/validateUser");

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


//  News Controllers    //
const newsController = require('./controllers/newsController');


// -------------------- //


const app = express();

const staticMiddleware = express.static("public");

const port = process.env.PORT || 3000; // Use Environment variable or default port

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(cors()); // Use CORS middleware
app.use(staticMiddleware); // Mount the static middleware

//----- CRUD OPERATIONS ----- //
app.get("/user", userController.getAllUsers);
app.get("/tag", tagController.getAllTags);
app.get("/comment", commentController.getAllComments);

// <JOVAN> //
// GET OPERATIONS ( RETRIEVE ) //
app.post("/login", validateUser(schemas.login), loginController.login);
app.post("/register", validateUser(schemas.register), loginController.registerUser);

// PUT OPERATIONS ( UPDATE ) //
app.put("/user/:id", userController.updateUser); // No verification needed
// DELETE OPERATIONS ( DELETE )
app.delete("/user/:id", userController.deleteUser); // No verification needed
app.delete("/tag/:id", tagController.deleteTag); //Admin can Delete Any Tag (Route may differ) // Good //

//-----------------//
app.get("/user/:id", userController.getUserById);


// AIMAN //
// GET OPERATIONS ( RETRIEVE ) //
app.get('/news/top-headlines', newsController.getTopHeadlines);
app.get('/news/search', newsController.searchNews);
app.get('/voteCount/:id', postController.getVoteCountByPostID);

// (Missing GET (Search News))//
app.get('/getAllPosts', postController.getAllPosts);
app.get('/comments/:postID', commentController.getCommentsByPostID);

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
app.get('/bookmarks/user/:id', bookmarkController.getBookmarksByUserId);
app.get('/post/:id', postController.getPostById);

// POST OPERATIONS ( CREATE ) //
app.post("/post", postController.createPost); // Good Just Missing Middleware //
app.post("/bookmark", bookmarkController.createBookmark); // Good //

// PUT OPERATIONS ( UPDATE ) //
app.put("/post/:id", postController.updatePost); // Good Just Missing Middleware //

// DELETE OPERATIONS ( DELETE )
app.delete("/post/:id", postController.deletePost); // Good //
app.delete("/bookmark/:id", bookmarkController.deleteBookmark); // Good //

//-----------------//


app.get("/tickets-with-replies", ticketController.getAllTicketsWithReplies);

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

