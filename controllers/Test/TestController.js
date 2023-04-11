import { OTEST } from "../../models/Otest/OtestModel.js";

export const insertDataTest = async (req, res) => {
  try {
    await OTEST.bulkCreate(req.body);

    res.status(200).json({
      msg: `Success: ${req.body}`,
    });
  } catch (err) {
    res.status(500).json({
      msg: `Error: ${req.body}. ${err}`,
    });
  }
};

export const getDataTest = async (req, res) => {
  try {
    const tests = await OTEST.findAll();
    res.status(200).json({
      msg: `Success`,
      data: tests,
    });
  } catch (err) {
    res.status(500).json({
      msg: `Error: ${err}`,
    });
    console.log(err);
  }
};
