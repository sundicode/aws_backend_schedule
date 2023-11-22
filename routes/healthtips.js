import { Router } from "express";
import {
  createHealthTip,
  deleteHealthTip,
  editHealthTip,
  getAllHealthTips,
  getSingleHealthTip,
} from "../controllers/healthtips";

const route = Router();
route.get("/", getAllHealthTips);
route.post("/", createHealthTip);
route.get("/:id", getSingleHealthTip);
route.delete("/:id", deleteHealthTip);
route.patch("/:id", editHealthTip);

export default route;
