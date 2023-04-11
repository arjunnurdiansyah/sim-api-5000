import util from "util";
import multer from "multer";
import md5 from "md5";

const maxSize = 3 * 1024 * 1024; //3MB

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/visit-plan");
  },
  filename: (req, file, cb) => {
    console.log(
      `Filename : ${file.originalname}; Encode : ${md5(file.originalname)}`
    );
    const ext = file.mimetype.split("/")[1];
    cb(
      null,
      `${md5(
        file.originalname.split(".").slice(0, -1).join(".")
      )}-${Date.now()}.${ext}`
    );
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
export default uploadFileMiddleware;
