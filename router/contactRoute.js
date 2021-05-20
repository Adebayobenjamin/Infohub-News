const { Router } = require('express');
const { contact_get, contact_post } = require('../controller/contactController')

const router = Router();

router.get('/contact', contact_get);
router.post('/contact', contact_post);

module.exports = router;