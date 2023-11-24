import jwt from "jsonwebtoken";
const signAccessToken = (userId, matricule, role, res) => {
  const payload = {
    matricule,
    userId,
    role,
  };
  const options = {
    expiresIn: "7d",
  };
  const secret = process.env.JWT_USER_TOKEN;
  const token = jwt.sign(payload, secret, options);
  res.cookie("UserToken", token, {
    httpOnly: process.env.NODE_ENV === "production" ? false : true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 1000 * 60 * 60 * 24 * 8,
  });
};

const signAdminToken = (adminId, email, role, res) => {
  const payload = {
    email,
    adminId,
    role,
  };
  const options = {
    expiresIn: "8d",
  };
  const secret = process.env.JWT_ADMIN_TOKEN;
  const token = jwt.sign(payload, secret, options);
  res.cookie("AdminToken", token, {
    httpOnly: process.env.NODE_ENV === "production" ? false : true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 1000 * 60 * 60 * 24 * 8,
  });
};
const userLogoutToken = (res) => {
  res.clearCookie("UserToken");
};

const adminLogoutToken = (res) => {
  res.clearCookie("AdminToken");
};

export { signAccessToken, userLogoutToken, adminLogoutToken, signAdminToken };
