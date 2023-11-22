import expressAsyncHandler from "express-async-handler";

const getAllHealthTips = expressAsyncHandler(async (req, res) => {});
const createHealthTip = expressAsyncHandler(async (req, res) => {});
const deleteHealthTip = expressAsyncHandler(async (req, res) => {});
const editHealthTip = expressAsyncHandler(async (req, res) => {});
const getSingleHealthTip = expressAsyncHandler(async (req, res) => {});

export {
  getAllHealthTips,
  createHealthTip,
  deleteHealthTip,
  editHealthTip,
  getSingleHealthTip,
};
