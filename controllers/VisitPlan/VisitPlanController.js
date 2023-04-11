import uploadFileMiddleware from "../../middleware/VisitPlan/VisitPlanMiddleware.js";
import fs from "fs";
import { OATT } from "../../models/Oatt/OattModel.js";

export const insertDataVisitPlan = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {
      return res.status(400).json({ msg: "Please upload a file!" });
    }

    req.body.file_name = req.file.filename;
    req.body.file_type = req.file.mimetype.split("/")[1];
    req.body.file_path = req.file.path;
    await OATT.create(req.body);

    res.status(200).json({
      msg: `Uploaded the file successfully: ${req.file.originalname}`,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).json({
        msg: "File size cannot be larger than 3MB!",
      });
    }

    res.status(500).json({
      msg: `Could not upload the file! ${err}`,
    });
  }
};

export const getListFilesVisitPlan = (req, res) => {
  const directoryPath =
    __basedir + "/resources/static/assets/uploads/visit-plan/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).json({
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

    res.status(200).json(fileInfos);
  });
};

export const getListFilesVisitPlanByName = (req, res) => {
  const fileName = req.params.name;
  const directoryPath =
    __basedir + "/resources/static/assets/uploads/visit-plan/";

  // res.download;
  res.sendFile(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).json({
        msg: "Could not download the file. " + err,
      });
    }
  });
};
