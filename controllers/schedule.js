import expressAsyncHandler from "express-async-handler";
import Schedule from "../model/Schedule.js";
import mongoose from "mongoose";
import UserInfo from "../model/UserInfo.js";
import { s3Uploadv2 } from "../utils/awsConfig.js";

//@create Schedule
const createSchedule = expressAsyncHandler(async (req, res) => {
  const { date, time, maxNumber } = req.body;
  const existingSchedule = await Schedule.findOne({ time: time });
  if (existingSchedule) {
    res.status(400);
    throw new Error("Schedule already Exist");
  }
  if (!date || !time) {
    res.status(400);
    throw new Error("All feilds are required");
  }
  const newSchedule = new Schedule({
    date: date,
    time,
    numberOfPatients: maxNumber,
  });
  const schedule = await newSchedule.save();
  if (!schedule) {
    res.status(500);
    throw new Error("Schedule could not be created");
  }
  res.status(201).json({ message: "Schedule created successfully", schedule });
});

//@get todays schedule
const getScheduleAdmin = expressAsyncHandler(async (req, res) => {
  const date = new Date().toISOString().split("-");
  const year = date[0];
  const month = date[1];
  const day = date[2].split("T")[0];
  const currentDate = `${year}-${month}-${day}`;

  const popObj = {
    path: "patient",
    populate: {
      path: "user",
      select: "username  matricule department email",
    },
  };

  const todaysSchedule = await Schedule.find({ date: currentDate }).populate(
    popObj
  );
  res.status(200).json({ schedule: todaysSchedule });
});

const getScheduleUser = expressAsyncHandler(async (req, res) => {
  const date = new Date().toISOString().split("-");
  const year = date[0];
  const month = date[1];
  const day = date[2].split("T")[0];
  const currentDate = `${year}-${month}-${day}`;

  const todaysSchedule = await Schedule.find({ date: currentDate }).select("_id time date")
  res.status(200).json({ schedule: todaysSchedule });
});
const getScheduleByStudentMatricule = expressAsyncHandler(async (req, res) => {
  const date = new Date().toISOString().split("-");
  const year = date[0];
  const month = date[1];
  const day = date[2].split("T")[0];
  const currentDate = `${year}-${month}-${day}`;
  const { matricule } = req.params;
  const popObj = {
    path: "patient",
    populate: {
      path: "user",
      select: "username  matricule department email",
    },
  };

  const todaysSchedule = await Schedule.findOne({
    date: currentDate,
  }).populate(popObj);

  const singleUser = todaysSchedule.patient.find(
    (user) => user.user.matricule == matricule
  );
  res.status(200).json({ user: singleUser });
});

const bookSchedule = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  const { userId } = req.user;
  const schedule = await Schedule.findOne({ _id: id });
  const maxStudents = schedule.numberOfPatients;
  req.session.scheduleId = id;
  // Check if the schedule is full before uploading the files to S3.
  if (schedule.patient.length >= maxStudents) {
    return res
      .status(400)
      .json({ message: "All Spaces taken book for another day" });
  }

  // Upload both files to S3 in parallel.
  const { medicalReciept, schoolfeesReciept } = req.files;
  const files = [medicalReciept[0], schoolfeesReciept[0]];
  const results = await s3Uploadv2(files, "uploads");
  // const results

  // Create the new user info object.
  const userInfo = new UserInfo({
    user: userId,
    medicalReciet: results[0].Location,
    schoolfeeReciet: results[1].Location,
  });

  // Save the schedule and user info object in a single transaction.
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await userInfo.save({ session });
    schedule.patient.push(userInfo._id);
    await schedule.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ schedule });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const getUsersScheduleBySession = expressAsyncHandler(async (req, res) => {
  const { matricule } = req.user;
  const popObj = {
    path: "patient",
    populate: {
      path: "user",
      select: "username  matricule department email",
    },
  };
  if (req.session.scheduleId) {
    const todaysSchedule = await Schedule.findById({
      _id: req.session.scheduleId,
    }).populate(popObj);

    const singleUser = todaysSchedule.patient.find(
      (user) => user.user.matricule == matricule
    );
    res.status(200).json({
      user: singleUser.user,
      date: todaysSchedule.date,
      time: todaysSchedule.time,
    });
  }
});

export {
  createSchedule,
  getScheduleAdmin,
  getScheduleUser,
  getScheduleByStudentMatricule,
  bookSchedule,
  getUsersScheduleBySession,
};
