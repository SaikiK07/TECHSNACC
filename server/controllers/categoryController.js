import categoryModel from "../modles/categoryModel.js";

// Fetch all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.json({ success: true, categories });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add a new category
export const addCategory = async (req, res) => {
  try {
    const { name, attributes } = req.body;
    if (!name || !attributes) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const attributeArray = attributes.split(",").map(attr => attr.trim());

    const newCategory = new categoryModel({
      name,
      attributes: attributeArray
    });

    await newCategory.save();
    res.json({ success: true, message: "Category added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.json({ success: false, message: "Category ID required" });

    await categoryModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id, name, attributes } = req.body;
    if (!id || !name || !attributes) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const updatedAttributes = attributes.split(",").map(attr => attr.trim());

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, attributes: updatedAttributes },
      { new: true }
    );

    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category updated successfully", category });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};