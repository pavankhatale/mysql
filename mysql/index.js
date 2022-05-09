const express = require("express");
const app = express();
const { Sequelize } = require("sequelize");
const PORT = process.env.PORT || 7000;
require("dotenv").config();

app.use(express.json());




const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.MYSQLUSERNAME,
  process.env.MYSQLPASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

async function collection() {
 
  try {
    await sequelize.authenticate();
    console.log("Connected successfully.");
    return null;
  } catch (error) {
    console.error("not connect:", error);
    return error;
  }
}

const Employee = sequelize.define("employees", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  number: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

app.get("/", async (req, res) => {
  try {
    const user = await Employee.findAll();

    res.render("home", { data: user });
    console.log(user);
  } catch (err) {
    res.json({ message: "Error", data: err });
  }
});

app.get("/createAccount", (req, res) => {
  res.render("employee");
});

app.post("/createAccount", async (req, res) => {
  try {
    const body = req.body;
    const user = await Employee.create({
      name: body.name,
      age: body.age,
      place: body.place,
    });
    console.log(req.body);
    res.redirect("/");
  } catch (err) {
    res.json({ message: "Error", data: err });
  }
});

app.get("/edit/:empID", async (req, res) => {
  try {
    const user = await Employee.findOne({
      where: {
        empID: req.params.empID,
      },
    });
    res.render("edit", { data: user });
    console.log(user);
  } catch (err) {
    res.json({ message: "Error", data: err });
  }
});

app.post("/editUser/:empID", async (req, res) => {
  try {
    const body = req.body;

    const user = await Employee.update(
      {
        name: body.name,
        age: body.age,
        place: body.place,
      },
      {
        where: {
          empID: req.params.empID,
        },
      }
    );
    console.log(user);
    res.redirect("/");
  } catch (err) {
    res.json({ message: "Error", data: err });
  }
});


app.get("/delete/:empID", async (req, res) => {
  try {
    const user = await Employee.destroy({
      where: {
        empID: req.params.empID,
      },
    });

    res.redirect("/");
  } catch (err) {
    res.json({ message: "Error", data: err });
  }
});

collection().then((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log("your server is running at port" + PORT);
    });
  } else {
    console.log(err);
  }
});