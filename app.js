const express = require("express"); // import Express
const sql = require("mssql"); // import SQL
const dbConfig = require("./dbConfig"); // import dbConfig
const bodyParser = require("body-parser"); //import body parser 
require('dotenv').config(); // Import dotenv
const axios = require('axios'); // Import axios
const { Configuration, OpenAIApi } = require('openai'); // Import OpenAI API

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






// Set up OpenAI configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  
  app.use(express.json());
  
  // In-memory store for posts
  const posts = [];
  
  app.get('/', (req, res) => {
    res.send('Welcome to the Southeast Asia Readiness API');
  });
  
  // Route to generate a new post
  app.post('/generate-post', async (req, res) => {
    try {
      const { topic } = req.body;
  
      // Fetch news data from NewsAPI
      const newsResponse = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: topic,
          apiKey: process.env.NEWS_API_KEY,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 1
        }
      });
  
      const articles = newsResponse.data.articles;
      if (articles.length === 0) {
        return res.status(404).send('No news articles found for the given topic');
      }
  
      const article = articles[0];
  
      // Generate additional content using OpenAI
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Generate a readiness post about the following news article in Southeast Asia: ${article.title}. ${article.description}. Include a brief summary and any additional insights.`,
        max_tokens: 150,
      });
  
      const content = completion.data.choices[0].text.trim();
  
      const post = {
        id: Date.now(), // Generate a unique ID based on the current timestamp
        picture: article.urlToImage,
        content: content,
        source: article.url,
      };
  
      // Store the post in the in-memory store
      posts.push(post);
  
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error generating post');
    }
  });
  
// Route to retrieve all posts
app.get('/posts', (req, res) => {
    res.json(posts);
  });

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
