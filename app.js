const express = require('express');
const app = express();
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use(express.json());

app.use('/api', bookRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
