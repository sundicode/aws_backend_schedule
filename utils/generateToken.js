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
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
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
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });
};
const userLogoutToken = (res) => {
  res.cookie("", "", {
    httpOnly: true,
    maxAge: new Date(),
  });
};

const adminLogoutToken = (res) => {
  res.cookie("", "", {
    httpOnly: true,
    maxAge: new Date(),
  });
};

export { signAccessToken, userLogoutToken, adminLogoutToken, signAdminToken };
