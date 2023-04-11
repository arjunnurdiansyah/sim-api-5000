// import fs from "fs";
 import { OTMS } from "../../models/Otms/OtmsModel.js";

export const insertHeaderTimeSheet = async (req, res) => {
  try {

    await OTMS.create(req.body);

    res.status(200).json({ msg: "Success"});
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).json({
        msg: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).json({
      msg: `Could not upload the file: ${req.file}. ${err}`,
    });
  }
};


