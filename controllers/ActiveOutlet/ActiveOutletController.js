import { OCAO } from "../../models/Ocao/OcaoModel.js";

export const insertDataActiveOutlet = async (req, res) => {
  try {
    await OCAO.create(req.body);
    res.status(200).json({ msg: "Success", data: [] });
  } catch (err) {
    res.status(500).json({ msg: err });
    console.log(err);
  }
};
