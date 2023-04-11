import { Sequelize } from "sequelize";

const dbHris = new Sequelize("hris", "mysql_client", "1BMclient!", {
  host: "192.168.1.8",
  dialect: "mysql",
  timezone: "+07:00",
});

export default dbHris;
