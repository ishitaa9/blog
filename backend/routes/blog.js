const express = require('express')
const router = express.Router()
const{create, list, listAllBlogsCategoriesTags, read, remove, update, photo, listRelated, listSearch, listByUser} = require('../controller/blog');

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog} = require('../controller/auth');

router.post('/blog',requireSignin, adminMiddleware, create);
router.get('/blogs', list);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/search', listSearch);
router.get('/blog/:slug', read);
router.delete('/blog/:slug', requireSignin, adminMiddleware,remove);
router.put('/blog/:slug', requireSignin, adminMiddleware, update);
router.get('/blog/photo/:slug', photo);
router.post('/blogs/related', listRelated)

//auth user blog part
router.post('/user/blog',requireSignin, authMiddleware, create);
router.get('/:username/blog', listByUser);
router.delete('/user/blog/:slug', requireSignin, authMiddleware,canUpdateDeleteBlog, remove);
router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);


module.exports = router;


