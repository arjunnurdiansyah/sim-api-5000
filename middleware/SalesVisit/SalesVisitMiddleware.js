import util from "util";
import multer from "multer";
import md5 from "md5";
import SharpMulter from "sharp-multer";

const maxSize = 10 * 1024 * 1024; //10MB

const storage = SharpMulter({
  destination: (req, file, cb) => {
    cb(
      null,
      __basedir +
        "/resources/static/assets/uploads/sales-visit/so-request-reject"
    );
  },
  filename: (req, file, cb) => {
    console.log(
      `Filename : ${file.originalname}; Encode : ${md5(file.originalname)}`
    );
    const ext = file.mimetype.split("/")[1];
    cb(null, `${md5(file.originalname)}-${Date.now()}.${ext}`);
  },
  imageOptions: {
    useTimestamp: true,
    fileFormat: "jpg",
    quality: 10,
    // resize: { width: 500, height: 500 },
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
export default uploadFileMiddleware;
