const Product = require("../models/productModel");

//Filter, Sorting and Pagination

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query
    const exludeFields = ["page", "sort", "limit"];
    exludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join("");
      this.query = this.query.sort(sortBy);
    }
    else {
      this.query = this.query.sort("-createdAt");
    }
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.limit(limit).skip(skip);

    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Product.find(), req.query).filtering().sorting().paginating();
      const products = await features.query;
      res.json({result: products.length, products});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;
      if (!images) return res.status(400).json({ message: "No image upload" });

      const product = await Product.findOne({ product_id });

      if (product)
        return res.status(400).json({ message: "This product already exists" });

      const newProduct = new Product({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });

      await newProduct.save();

      res.json({ message: "Created a product" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted a product" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;

      if (!images) return res.status(400).json({ message: "No image upload" });

      await Product.findByIdAndUpdate(req.params.id, {
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });

      res.json({ message: "Updated a product" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = productCtrl;
