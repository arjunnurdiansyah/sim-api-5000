import uploadFileMiddleware from "../../middleware/Attendance/AttendanceMiddleware.js";
import fs from "fs";
import { OATT } from "../../models/Oatt/OattModel.js";

export const insertDataAttendance = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ msg: "Please upload a file!" });
    }

    req.body.file_name = req.file.filename;
    req.body.file_type = req.file.mimetype.split("/")[1];
    req.body.file_path = req.file.path;
    await OATT.create(req.body);

    res.status(200).send({
      msg: `Uploaded the file successfully: ${req.file.originalname}`,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        msg: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      msg: `Could not upload the file: ${req.file}. ${err}`,
    });
  }
};

export const getListFilesAttendance = (req, res) => {
  const directoryPath =
    __basedir + "/resources/static/assets/uploads/attendance/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        msg: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: directoryPath + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

export const getListFilesAttendanceByName = (req, res) => {
  const fileName = req.params.name;
  const directoryPath =
    __basedir + "/resources/static/assets/uploads/attendance/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        msg: "Could not download the file. " + err,
      });
    }
  });
};
