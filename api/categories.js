const express = require("express");
const router = express.Router();
const { getAllCategories, createCategory, deleteCategory } = require('../db/models/categories')
const { requireAdminUser } = require('./utils');

router.get('/', async (req, res, next) => {
    try {
        const categories = await getAllCategories();

        res.send(categories);
    }

    catch ({ name, message }) {
        next({ name, message });
    }
})

router.post('/', requireAdminUser, async (req, res, next) => {
    try {
        const category = await createCategory(req.body)

        res.send(category)
    }

    catch ({ name, message }) {
        next({ name, message });
    }
})

router.delete('/:categoryId', requireAdminUser, async (req, res, next) => {
    const { categoryId } = req.params;
    try {
        const deletedCategoryId = await deleteCategory(categoryId);

        res.send(deletedCategoryId);
    }

    catch ({ name, message }) {
        next({ name, message });
    }

})

module.exports = router;