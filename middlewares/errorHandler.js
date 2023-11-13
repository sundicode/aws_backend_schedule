import { errorCodes } from "../utils/errorCode.js";
export const errorHandler = (err, req, res, next) => {
  const status = res.statusCode ? res.statusCode : 500;
  switch (status) {
    case errorCodes.badRequest:
      res.json({
        title: "Bad Request",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case errorCodes.forbidden:
      res.json({
        title: "Forbiden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case errorCodes.notFound:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case errorCodes.unAuthorized:
      res.json({
        title: "UnAuthorize",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case errorCodes.serverError:
      res.json({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      res.json({
        message: err.message,
        stackTrace: err.stack,
      });
      break;
  }
};
