import brandModel from "../modles/brandModel.js";

// Fetch all brands
export const getBrands = async (req, res) => {
  try {
    const brands = await brandModel.find();
    res.json({ success: true, brands });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add a new brand
export const addBrand = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({ success: false, message: "Brand name is required" });
    }

    const existingBrand = await brandModel.findOne({ name });
    if (existingBrand) {
      return res.json({ success: false, message: "Brand already exists" });
    }

    const newBrand = new brandModel({ name });
    await newBrand.save();
    res.json({ success: true, message: "Brand added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete a brand
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.json({ success: false, message: "Brand ID required" });

    await brandModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update a brand
export const updateBrand = async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const brand = await brandModel.findByIdAndUpdate(id, { name }, { new: true });
    if (!brand) {
      return res.json({ success: false, message: "Brand not found" });
    }

    res.json({ success: true, message: "Brand updated successfully", brand });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
