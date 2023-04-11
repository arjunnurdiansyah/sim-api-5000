import { Users } from "../../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const id_ousr = user[0].id_ousr;
        const id_karyawan = user[0].id_karyawan;
        const user_name = user[0].user_name;
        const accessToken = jwt.sign(
          { id_ousr, id_karyawan, user_name },
          process.env.ACCESS_TOKEN_SECRET,
          {
            // expiresIn: "60s",
            expiresIn: "1h",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const accessToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const id_ousr = user[0].id_ousr;
        const id_karyawan = user[0].id_karyawan;
        const user_name = user[0].user_name;
        const accessToken = jwt.sign(
          { id_ousr, id_karyawan, user_name },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
