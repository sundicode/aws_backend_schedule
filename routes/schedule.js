import { Router } from "express";
import {
  bookSchedule,
  createSchedule,
  getScheduleAdmin,
  getScheduleByStudentMatricule,
  getScheduleUser,
} from "../controllers/schedule.js";
import { checkAdminAuth, checkUserAuth } from "../middlewares/checkAuth.js";
import multer from "multer";

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     const { originalname } = file;
//     cb(null, `${v4()}-${originalname}`);
//   },
// });

// const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] == "pdf") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};
const fileUploadHandler = multer({ storage, fileFilter });

const mutltipleUploadHandler = fileUploadHandler.fields([
  { name: "medicalReciept", maxCount: 1 },
  { name: "schoolfeesReciept", maxCount: 1 },
]);

const router = Router();
//@middleware multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError("LIMIT_FILE_SIZE")) {
    return res.status(400).json({
      message: "file is too large",
    });
  } else if (err instanceof multer.MulterError("LIMIT_FILE_COUNT")) {
    return res.status(400).json({
      message: "file limit has reached",
    });
  } else if (err instanceof multer.MulterError("LLIMIT_UNEXPECTED_FILE")) {
    return res.status(400).json({
      message: "wrong file type",
    });
  }
});
// @add schedule @admin route
router.post("/create", checkAdminAuth, createSchedule);
//@ admin route
router.get("/admin", checkAdminAuth, getScheduleAdmin);
//@ admin route
router.get("/users", checkUserAuth, getScheduleUser);
//@user route
router.get("/:matricule", checkAdminAuth, getScheduleByStudentMatricule);
//@user route
router.post("/book", checkUserAuth, mutltipleUploadHandler, bookSchedule);
export default router;
