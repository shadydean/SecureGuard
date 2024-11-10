const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require("cors")

dotenv.config();
connectDB();

// Import route files
const loginRoute = require('./routes/login.route');
const signupRoute = require('./routes/signup.route');
const bankRoute = require('./routes/bankvault.route');
const mediaRoute = require('./routes/mediavault.route');
const credentialsRoute = require('./routes/credentials.route');
const adminRoute = require('./routes/admin.route');
const vaultRoute = require('./routes/vault.route')

app.use(cors({
    origin: ['https://secure-guard-smoky.vercel.app/','https://secure-guard-anudeeps-projects-3d2b22db.vercel.app/','https://secure-guard-git-main-anudeeps-projects-3d2b22db.vercel.app/'],
    credentials : true
}))
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
});

// Set base endpoint for all routes
app.use('/api/login', loginRoute);
app.use('/api/signup', signupRoute);
app.use('/api/bank', bankRoute);
app.use('/api/media', mediaRoute);
app.use('/api/vault', vaultRoute);
app.use('/api/admin', adminRoute);
app.use('/api/credentials', credentialsRoute);
const PORT = process.env.PORT || 4321;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
