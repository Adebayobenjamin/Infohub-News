const { Router } = require('express');
const  {blogs_get, categories_get, reader_get, profile_get, about_get} = require('../controller/blogcontroller');
const {requireAuth} = require('../middleware/authmidleware')

const router = Router();

router.get('/', blogs_get);
router.get('/category', categories_get);
router.get('/reader', reader_get);
router.get('/profile', requireAuth, profile_get );
router.get('/about', about_get);

module.exports = router;