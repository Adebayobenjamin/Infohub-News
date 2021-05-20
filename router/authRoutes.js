const { Router } = require('express');
const  {login_get,signup_get , signup_post, login_post, logout_get, update_user, delete_user} = require('../controller/authController');

const router = Router();

router.get('/login', login_get);
router.post('/login', login_post);
router.get('/signup', signup_get);
router.post('/signup', signup_post);
router.get('/logout', logout_get);
router.put('/profile', update_user);
router.delete('/delete/:id', delete_user);


module.exports = router;