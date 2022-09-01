const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController/category');
const isAuth = require('../middlewares/is-auth/is-auth');

router.post('/createCategory', isAuth, categoryController.createCatgory);

router.delete(
    '/deleteCategory/:categoryId',
    isAuth,
    categoryController.deleteCategory
);

router.post(
    '/updateCategory/:categoryId',
    isAuth,
    categoryController.updateCategory
);

router.get('/getAllCategories', isAuth, categoryController.getAllCategories);

module.exports = router;
