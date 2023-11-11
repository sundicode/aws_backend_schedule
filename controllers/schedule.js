import expressAsyncHandler from "express-async-handler";
import Schedule from "../model/Schedule.js";
import UserInfo from "../model/UserInfo.js";
import { s3Uploadv2 } from "../utils/awsConfig.js";

//@create Schedule
const createSchedule = expressAsyncHandler(async (req, res) => {
  const { date, time, maxNumber } = req.body;
  const existingSchedule = await Schedule.findOne({ date: date});
  if (existingSchedule)
    return res.status(400).json({ message: "Schedule already Exist" });
  if (!date || !time)
    return res.status(400).json({ message: "All field required" });
  const newSchedule = new Schedule({ date, time, numberOfPatients: maxNumber });
  const schedule = await newSchedule.save();
  if (!schedule)
    return res.status(500).json({ message: "Failed to create schedule" });
  res.status(201).json({ message: "Schedule created successfully", schedule });
});

//@get todays schedule
const getSchedule = expressAsyncHandler(async (req, res) => {
  const today = new Date().toDateString();
  const todaysSchedule = await Schedule.findOne({ date: today });
  res.status(200).json({ schedule: todaysSchedule });
});
const getScheduleByStudentMatricule = expressAsyncHandler(async (req, res) => {
  const { matricule } = req.params;
  const schedules = await Schedule.find({}).populate("users userinfos");
  const scheduleInfos = schedules.flatMap();
});
const bookSchedule = expressAsyncHandler(async (req, res) => {
  const { time, date, id } = req.body;
  const { userId } = req.user;
  const schedule = await Schedule.findOne({ _id:id});
  if (!schedule) return res.status(400).json({ message: "No schedule found" });
  const maxStudents = schedule.numberOfPatients;
  const { medicalReciept, schoolfeesReciept } = req.files;
  const files = [medicalReciept[0], schoolfeesReciept[0]];
  const results = await s3Uploadv2(files);
  if (schedule.patient.length === maxStudents)
    return res
      .status(400)
      .json({ message: "All Spaces taken book for another day" });

  const userInfo = new UserInfo({
    user: userId,
    medicalReciet: results[0].Location,
    schoolfeeReciet: results[1].Location,
  });

  schedule.patient.push(userInfo);
  await userInfo.save();
  await schedule.save();
  res.status(201).json({ schedule });
});
export {
  createSchedule,
  getSchedule,
  getScheduleByStudentMatricule,
  bookSchedule,
};
