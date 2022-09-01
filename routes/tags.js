const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/is-auth/is-auth');

const TagsController = require('../controllers/tagsController/tags');

// const authController = require('../controllers/auth')

router.post('/postTags', isAuth, TagsController.createTag);

module.exports = router;
