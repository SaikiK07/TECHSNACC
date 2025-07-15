import jwt from 'jsonwebtoken'

const userauth = async (req, res, next) => {
  const token = req.headers.token || req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized Login Again' });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (token_decode?.id) {
      req.body.userId = token_decode.id;
      next();
    } else {
      return res.status(401).json({ success: false, message: 'Not Authorized Login Again' });
    }
  } catch (error) {
    console.error('JWT Verify Error:', error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default userauth;
