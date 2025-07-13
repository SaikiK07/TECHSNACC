import userModel from "../modles/userModel.js";
import orderModel from "../modles/orderModel.js";

// GET Profile Data
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await userModel.findById(userId).select("username email isAccountVerified");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const orderCount = await orderModel.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        orderCount,
      },
    });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE Profile Data
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { username, email } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true, select: "username email" }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// DELETE Profile (Delete Account)
export const deleteUserProfile = async (req, res) => {
    try {
      const userId = req.body.userId;
  
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Delete user's orders
      await orderModel.deleteMany({ userId });
  
      // Delete user
      await userModel.findByIdAndDelete(userId);
  
      return res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete Profile Error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  