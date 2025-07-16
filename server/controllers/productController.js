import cloudinary from '../config/cloudinary.js';
import productModel from '../modles/productModel.js';
import categoryModel from '../modles/categoryModel.js';
import mongoose from 'mongoose';

// Add Product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, bestseller, category, brand } = req.body;
    const attributes = req.body.attributes || {};

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.json({ success: false, message: "Invalid category ID format" });
    }

    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
      return res.json({ success: false, message: "Invalid category" });
    }

    // Handle image uploads
    const image1 = req.files.image1?.[0];
    const image2 = req.files.image2?.[0];
    const image3 = req.files.image3?.[0];
    const image4 = req.files.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    // Extract valid attributes
    const validAttributes = {};
    (categoryExists.attributes || []).forEach(attr => {
      if (attributes[attr.name]) {
        validAttributes[attr.name] = attributes[attr.name];
      }
    });

    const productData = {
      name,
      description,
      price: Number(price),
      bestseller: bestseller === "true",
      image: imagesUrl,
      category: new mongoose.Types.ObjectId(category),
      attributes: validAttributes,
      brand,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List Products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).populate("category");
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove Product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Single Product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId).populate("category");

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id, name, description, price, category, brand, bestseller } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ success: false, message: "Invalid product ID" });
    }

    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.json({ success: false, message: "Product not found" });
    }

    const updatedData = {
      name,
      description,
      price: Number(price),
      category: new mongoose.Types.ObjectId(category),
      brand,
      bestseller: bestseller === "true",
      date: Date.now(),
      image: [...existingProduct.image],
    };

    // Replace specific images if provided
    const imagesUrl = {};
    if (req.files?.image1) imagesUrl[0] = req.files.image1[0].path;
    if (req.files?.image2) imagesUrl[1] = req.files.image2[0].path;
    if (req.files?.image3) imagesUrl[2] = req.files.image3[0].path;
    if (req.files?.image4) imagesUrl[3] = req.files.image4[0].path;

    await Promise.all(
      Object.keys(imagesUrl).map(async (index) => {
        const result = await cloudinary.uploader.upload(imagesUrl[index], { resource_type: "image" });
        updatedData.image[index] = result.secure_url;
      })
    );

    const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });

    res.json({ success: true, message: "Product Updated Successfully", updatedProduct });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Export all
export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateProduct,
};
