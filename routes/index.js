const express = require('express');
const router = express.Router();

router.get('/api', (req, res) => 
    res.send('Home')
);

router.get('/api/login', (req, res) => 
    res.send('use the POST method in postman')
);

router.get('/api/posts', (req, res) => 
    res.send('Forbidden, you need a token')
);

module.exports = router;