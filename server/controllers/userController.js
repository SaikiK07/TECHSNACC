import userModel from '../modles/userModel.js'

export const getUserData =async(req,res)=>{
    try {
        const {userId} = req.body
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({success:false, message: 'User not found' })
        }
        res.json({
            success:true, 
            userData:{
                name:user.name,
                isAccountVerified: user.isAccountVerified
            }
        })
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const updateUser = async (req, res) => {
    try {
      const { userId } = req.user; // Extracted from middleware
      const { username, email } = req.body;
  
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Update fields if provided
      if (username) user.username = username;
      if (email) user.email = email;
  
      await user.save();
  
      res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };