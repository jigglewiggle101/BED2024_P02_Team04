require("dotenv").config();
const express = require("express"); // import Express
const sql = require("mssql"); // import SQL
const dbConfig = require("./dbConfig"); // import dbConfig
const bodyParser = require("body-parser"); //import body parser
const { OAuth2Client } = require('google-auth-library'); // Import Google OAuth2Client
const client = new OAuth2Client('78537916437-27e0ogu3jmbf80da4p3r75s0qsin84n6.apps.googleusercontent.com'); // Replace with your actual client ID
const cors = require("cors"); // import cors

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

const GNEWS_API_KEY = process.env.GNEWS_API_KEY || 'dffe0c45dddbbbcaea086977e5475a0d';

// Routes for fetching news data from GNews API
app.get("/news/top-headlines", async (req, res) => {
  const { type } = req.query;
  let apiUrl = `https://gnews.io/api/v4/top-headlines?category=general,world,nation,business,technology,science,health&lang=en&country=sg,my,ph,bn,kh,id,la,mm,th,vn,id&max=10&apikey=${GNEWS_API_KEY}`;

  if (type === 'forum') {
    apiUrl = `https://gnews.io/api/v4/search?q=forum&lang=en&country=sg,my,ph,bn,kh,id,la,mm,th,vn,id&max=20&apikey=${GNEWS_API_KEY}`;
  }

  try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      res.json(data.articles);
  } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.get("/news/search", async (req, res) => {
  const query = req.query.q || 'example';
  try {
      const response = await fetch(`https://gnews.io/api/v4/search?q=${query}&lang=en&country=sg,my,ph,bn,kh,id,la,mm,th,vn,id&max=10&apikey=${GNEWS_API_KEY}`);
      const data = await response.json();
      res.json(data.articles);
  } catch (error) {
      console.error('Error fetching general news:', error);
      res.status(500).json({ error: 'Failed to fetch general news' });
  }
});

// new endpoint for forum-related articles
app.get("/news/forum", async (req, res) => {
  const query = req.query.q || 'forum';
  try {
      const response = await fetch(`https://gnews.io/api/v4/search?q=${query}&lang=en&country=sg,my,ph,bn,kh,id,la,mm,th,vn,id&max=20&apikey=${GNEWS_API_KEY}`);
      const data = await response.json();
      res.json(data.articles);
  } catch (error) {
      console.error('Error fetching forum news:', error);
      res.status(500).json({ error: 'Failed to fetch forum news' });
  }
});






//----- CRUD OPERATIONS ----- //
app.get("/user", userController.getAllUsers);

// <JOVAN> //
// GET OPERATIONS ( RETRIEVE ) //
app.get("/login", loginController.login); // Good Just Missing Middleware //
// Endpoint to handle ID token verification
app.post('/your-backend-endpoint', async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: 'YOUR_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual client ID
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    // Handle successful verification, send response back
    res.status(200).send('ID Token verified');
  } catch (error) {
    // Handle error
    console.error('Error verifying ID token:', error);
    res.status(400).send('ID Token verification failed');
  }
});

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

