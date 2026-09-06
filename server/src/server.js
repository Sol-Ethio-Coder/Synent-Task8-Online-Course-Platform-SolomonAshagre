// Local dev entry point. Deploys to Vercel use api/index.js instead, which
// imports the same app from ./app.js but never calls .listen() — Vercel
// handles that itself via its serverless function runtime.
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`STCA API running on port ${PORT}`));
