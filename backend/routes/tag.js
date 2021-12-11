const express = require('express');
const router = express.Router()

//controllers
const { requireSignin, adminMiddleware } = require('../controller/auth');
const { create, list, read, remove } = require('../controller/tag');



//validators
const{ runValidation } = require('../validators');
const { CreateTagValidator } = require('../validators/tag');


router.post('/tag', CreateTagValidator, runValidation, requireSignin, adminMiddleware, create)
router.get('/tags', list)
router.get('/tag/:slug', read)
router.delete ('/tag/:slug', requireSignin, adminMiddleware, remove)

module.exports = router;