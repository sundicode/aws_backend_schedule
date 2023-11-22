const allowedOrigins = [
  "http://localhost:3000",
  "https://mediks-project.vercel.app/",
  "mediks.link",
  "https://mediks-admin-dashboard.vercel.app/",
];
export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  credentials: true,
};
