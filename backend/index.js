const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Import route files
const loginRoute = require('./routes/login.route');
const signupRoute = require('./routes/signup.route');
const bankRoute = require('./routes/bankvault.route');
const mediaRoute = require('./routes/mediavault.route');
//const credentialsRoute = require('./routes/credentials.route');
//const adminRoute = require('./routes/admin.route');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
});

// Set base endpoint for all routes
app.use('/api', loginRoute);
app.use('/api', signupRoute);
app.use('/api', bankRoute);
app.use('/api', mediaRoute);
app.use('/api', credentialsRoute);
app.use('/api', adminRoute);

const PORT = process.env.PORT || 4321;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
