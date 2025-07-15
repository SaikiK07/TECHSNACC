import jwt from 'jsonwebtoken';

const userauth = async (req, res, next) => {
  // Try to get token from headers or cookies
  const token = req.headers.token || req.cookies.token;

  console.log("🔐 Incoming Token:", token);
  console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);

  if (!token) {
    return res.json({
      success: false,
      message: 'Not Authorized Login Again (No Token)'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    if (decoded.id) {
      req.body.userId = decoded.id;
      next();
    } else {
      return res.json({
        success: false,
        message: 'Not Authorized Login Again (Invalid Payload)'
      });
    }
  } catch (error) {
    console.error("❌ JWT Verify Error:", error.message);
    return res.json({
      success: false,
      message: 'JWT Error: ' + error.message
    });
  }
};

export default userauth;
