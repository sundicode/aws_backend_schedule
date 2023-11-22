import { Router } from "express";
import {
  bookSchedule,
  createSchedule,
  deleteSchedule,
  getScheduleAdmin,
  getScheduleByStudentMatricule,
  getScheduleUser,
  getUsersScheduleBySession,
  updateSchedule,
} from "../controllers/schedule.js";
import { checkAdminAuth, checkUserAuth } from "../middlewares/checkAuth.js";
import { fileUploader } from "../utils/fileUpload.js";

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
router.get("/my-schedule", checkUserAuth, getUsersScheduleBySession);
//@ admin route
router.patch("/:id", checkAdminAuth, updateSchedule);
//@ admin route
router.delete("/:id", checkAdminAuth, deleteSchedule);
//@ admin route
router.get("/:matricule", checkAdminAuth, getScheduleByStudentMatricule);
//@user route
router.post(
  "/book",
  checkUserAuth,
  fileUploader(
    [
      { name: "medicalReciept", maxCount: 1 },
      { name: "schoolfeesReciept", maxCount: 1 },
    ],
    "pdf"
  ),
  bookSchedule
);

export default router;
