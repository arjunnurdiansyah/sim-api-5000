import uploadFileMiddleware from "../../middleware/Attendance/AttendanceMiddleware.js";
import fs from "fs";
import { OATT } from "../../models/Oatt/OattModel.js";
import https from "https";

export const insertDataAttendance = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ msg: "Please upload a file!" });
    }

    // req.body.file_name = req.file.filename;
    // req.body.file_type = req.file.mimetype.split("/")[1];
    // req.body.file_path = req.file.path;
    // await OATT.create(req.body);

    // res.status(200).send({
    //   msg: `Uploaded the file successfully: ${req.file.originalname}`,
    // });

    // let url = `https://geocode.maps.co/reverse?lat=${req.body.latitude}&lon=${req.body.longitude}`;
    let url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${req.body.longitude}%2C${req.body.latitude}`;

    https
      .get(url, (res2) => {
        let body = "",
          json = "";

        res2.on("data", (chunk) => {
          body += chunk;
        });

        res2.on("end", async () => {
          try {
            json = JSON.parse(body);
            // req.body.road = json.address.road;
            // req.body.village = json.address.village;
            // req.body.suburb = json.address.suburb;
            // req.body.city_district = json.address.city_district;
            // req.body.town = json.address.town;
            // req.body.county = json.address.county;
            // req.body.city = json.address.city;
            // req.body.state = json.address.state;
            // req.body.postcode = json.address.postcode;
            // req.body.display_name = json.display_name;

            req.body.road = json.address.Address;
            req.body.village = json.address.Neighborhood;
            req.body.suburb = json.address.PlaceName;
            req.body.city_district = json.address.District;
            // req.body.town = json.address.town;
            req.body.county = json.address.City;
            req.body.city = json.address.Subregion;
            req.body.state = json.address.Region;
            req.body.postcode = json.address.Postal;
            req.body.display_name = json.address.LongLabel;

            req.body.file_name = req.file.filename;
            req.body.file_type = req.file.mimetype.split("/")[1];
            req.body.file_path = req.file.path;

            await OATT.create(req.body);
            res.status(200).send({
              msg: `Uploaded the file successfully: ${req.file.originalname}`,
            });
          } catch (error) {
            console.error(error.message);
          }
        });
      })
      .on("error", (error) => {
        console.error(error.message);
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
