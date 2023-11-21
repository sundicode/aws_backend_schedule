import jwt from "jsonwebtoken";
const checkAdminAuth = (req, res, next) => {
  const token = req.cookies.AdminToken;
  if (token) {
    jwt.verify(token, process.env.JWT_ADMIN_TOKEN, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role !== "admin") {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          req.admin = decodedToken;
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};

const checkUserAuth = (req, res, next) => {
  const token = req.cookies.UserToken;
  if (token) {
    jwt.verify(token, process.env.JWT_USER_TOKEN, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role !== "user") {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          req.user = decodedToken;
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};

export { checkAdminAuth, checkUserAuth };
