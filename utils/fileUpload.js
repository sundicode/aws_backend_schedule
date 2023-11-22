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

const fileUploader = (files, fileType) => {
  // const fileFilter = (req, file, cb) => {
  //   if (file.mimetype.split("/")[1].includes(fileType)) {
  //     cb(null, true);
  //   } else {
  //     cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  //   }
  // };
  const fileUploadHandler = multer({ storage });
  const mutltipleUploadHandler = fileUploadHandler.fields(files);
  return mutltipleUploadHandler;
};

export { fileUploader };
