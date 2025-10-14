require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());


app.get('/', (req, res) => {
    res.send('ZK-Auth backend running');
});


app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});