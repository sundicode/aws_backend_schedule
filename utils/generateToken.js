import jwt from "jsonwebtoken";
const signAccessToken = (userId, matricule, role, res) => {
  const payload = {
    matricule,
    userId,
    role,
  };
  const options = {
    expiresIn: "1d",
  };
  const secret = process.env.JWT_USER_TOKEN;
  const token = jwt.sign(payload, secret, options);
  res.cookie("jwtToken", token, {
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
  res.cookie("jwtToken", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });
};
const logoutToken = (res) => {
  res.cookie("jwtToken", "", {
    httpOnly: true,
    maxAge: new Date(),
  });
};

export { signAccessToken, logoutToken ,signAdminToken};
