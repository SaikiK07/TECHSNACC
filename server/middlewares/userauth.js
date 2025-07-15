import jwt from 'jsonwebtoken'

const userauth = async (req, res, next) => {
  // Check token in headers OR cookies
  const token = req.headers.token || req.cookies.token;

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized Login Again' });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (token_decode.id) {
      req.body.userId = token_decode.id;
      next();
    } else {
      return res.json({ success: false, message: 'Not Authorized Login Again' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message || 'Invalid token' });
  }
};

export default userauth;
