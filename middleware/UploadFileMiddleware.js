import util from "util";
import multer from "multer";
import md5 from "md5";
import SharpMulter from "sharp-multer";

const maxSize = 2 * 1024 * 1024; //2MB

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, __basedir + "/resources/static/assets/uploads/");
//   },
//   filename: (req, file, cb) => {
//     console.log(
//       `Filename : ${file.originalname}; Encode : ${md5(file.originalname)}`
//     );
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `${md5(file.originalname)}-${Date.now()}.${ext}`);
//     // cb(null, file.originalname);
//   },
// });

const storage = SharpMulter({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(
      `Filename : ${file.originalname}; Encode : ${md5(file.originalname)}`
    );
    const ext = file.mimetype.split("/")[1];
    cb(null, `${md5(file.originalname)}-${Date.now()}.${ext}`);
  },
  // cb(null, file.originalname);
  imageOptions: {
    useTimestamp: true,
    fileFormat: "jpg",
    quality: 10,
    // resize: { width: 500, height: 500 },
  },
});
// const upload  =  multer({ storage });

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
export default uploadFileMiddleware;
