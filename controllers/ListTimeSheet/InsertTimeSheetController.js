// import fs from "fs";
<<<<<<< HEAD
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
=======
// import { OTMS } from "../../models/Otms/OtmsModel.js";

// export const insertDataTimeSheet = async (req, res) => {
   
//   try {
//     await OTMS.create(req.body);
//     res.status(200).json({ msg: "Success"});
//   } catch (err) {

//       res.status(404).json({ msg: "Data Not Found! " });
//       console.log(error);
    
//   }
// };



import uploadFileMiddleware from "../../middleware/ChekIn/ChekInMiddleware.js";
import fs from "fs";
import { OTMS } from "../../models/Otms/OtmsModel.js";

export const insertDataTimeSheet = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    await OTMS.create(req.body);

    res.status(200).send({
      msg: `Insert Done: ${req.body}`,
    });
  } catch (err) {

    res.status(500).send({
      msg: `Insert Error:  ${err}`,
>>>>>>> 1076ddffb92c6c204f6e2adea0d2e4c0f599d51d
    });
  }
};

<<<<<<< HEAD

=======
>>>>>>> 1076ddffb92c6c204f6e2adea0d2e4c0f599d51d
