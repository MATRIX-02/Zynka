const category = require('../models/categoryModels');

const categoryCtrl = {
    getCategories: async (req, res) => {
        try{
            const categories = await category.find();
            res.json(categories);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    createCategory: async (req, res) => {
        try{
            const {name} = req.body;
            const categories = await category.findOne({name});

            if(categories) return res.status(400).json({msg: "This category already exists."});

            const newCategory = new category({name});

            await newCategory.save();

            res.json({msg: "Created a category."})
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteCategory: async (req, res) => {
        try{
            await category.findByIdAndDelete(req.params.id);
            res.json({msg: "Deleted a category."});
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateCategory: async (req, res) => {
        try{
            const {name} = req.body;
            await category.findOneAndUpdate({_id: req.params.id}, {name});

            res.json({msg: "Updated a category."});
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}

module.exports = categoryCtrl;