import express from "express";
import session from 'express-session';
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "fitLife",
  password: "your password",
  port: 5432,
});
db.connect();

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", { user: req.session.user });
});

app.get("/index.ejs", (req, res) => {
    res.render("index.ejs", { user: req.session.user });
  });

app.get("/Abdominals", (req, res) => {
    res.render("partials/Abdominals.ejs", { user: req.session.user });
});

app.get("/Biceps", (req, res) => {
    res.render("partials/Biceps.ejs", { user: req.session.user });
});

app.get("/Calves", (req, res) => {
    res.render("partials/Calves.ejs", { user: req.session.user });
});

app.get("/Chest", (req, res) => {
    res.render("partials/Chest.ejs", { user: req.session.user });
});

app.get("/Forearms", (req, res) => {
    res.render("partials/Forearms.ejs", { user: req.session.user });
});

app.get("/Glutes", (req, res) => {
    res.render("partials/Glutes.ejs", { user: req.session.user });
});

app.get("/Hamstrings", (req, res) => {
    res.render("partials/Hamstrings.ejs", { user: req.session.user });
});

app.get("/Lats", (req, res) => {
    res.render("partials/Lats.ejs", { user: req.session.user });
});

app.get("/LowerBack", (req, res) => {
    res.render("partials/LowerBack.ejs", { user: req.session.user });
});

app.get("/Obliques", (req, res) => {
    res.render("partials/Obliques.ejs", { user: req.session.user });
});

app.get("/Quads", (req, res) => {
    res.render("partials/Quads.ejs", { user: req.session.user });
});

app.get("/Shoulder", (req, res) => {
    res.render("partials/Shoulder.ejs", { user: req.session.user });
});

app.get("/Traps", (req, res) => {
    res.render("partials/Traps.ejs", { user: req.session.user });
});

app.get("/TrapsMidBack", (req, res) => {
    res.render("partials/Traps(Mid-back).ejs", { user: req.session.user });
});

app.get("/Triceps", (req, res) => {
    res.render("partials/Triceps.ejs", { user: req.session.user });
});

app.get("/index", (req, res) => {
    res.render("index.ejs", { user: req.session.user });
});

app.get("/logout",(req,res) => {
    res.render("index.ejs");
})

app.get("/Fetaures", (req, res) => {
    res.render("partials/Fetaures.ejs", { user: req.session.user });

});

app.get("/Products", (req, res) => {
    res.render("partials/Products.ejs", { user: req.session.user });
});

app.get("/FitGuides", (req,res) => {
    res.render("partials/FitGuides.ejs", { user: req.session.user });
});

app.get("/Articles", (req,res) => {
    res.render("partials/Articles.ejs", { user: req.session.user });
});

app.get("/login", (req, res) => {
  res.render("partials/login", { user: req.session.user });
});

app.get("/signUp", (req, res) => {
  res.render("partials/signUp", { user: req.session.user });
});


app.post('/signUp', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  
      if (checkResult.rows.length > 0) {
        res.send("Email already exists. Try logging in.");
      } else {
        await db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, password]);
  
        req.session.user = { name: name, email: email };
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    }
  });
  
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedPassword = user.password;
  
        if (password === storedPassword) {
          req.session.user = { name: user.name, email: user.email };
          res.redirect("/");
        } else {
          res.send("Incorrect Password");
        }
      } else {
        res.send("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  });
  

app.post("/calculate", (req, res) => {
    const { gender, age, weight, height, activity, goal } = req.body;

    let bmr;
    if (gender === "male") {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  
    let calories = Math.round(bmr * parseFloat(activity));
  
    let adjustedCalories;
    if (goal === "bulk") {
      adjustedCalories = Math.round(calories * 1.15); // eating 15% more
    } else if (goal === "cut") {
      adjustedCalories = Math.round(calories * 0.85); // eating 15% less
    } else {
      adjustedCalories = calories;
    }

    let dietPlan;
    if (goal === "bulk") {
      dietPlan = "High-protein diet with a slight calorie surplus. Include lean meats, eggs, dairy, whole grains, and healthy fats.";
    } else if (goal === "cut") {
      dietPlan = "Moderate protein, low-carb, and healthy fats. Focus on lean meats, fish, leafy vegetables, and whole foods.";
    } else {
      dietPlan = "Balanced diet with an even distribution of protein, carbs, and fats. Include lean meats, whole grains, and plenty of vegetables.";
    }

    res.render("partials/Fetaures.ejs", { calories: adjustedCalories, dietPlan });
});

app.post("/macroCalculate", (req, res) => {
    const { dailyCalories, mealsPerDay } = req.body;

    const CARBS_PERCENTAGE = 0.40;
    const PROTEIN_PERCENTAGE = 0.30;
    const FATS_PERCENTAGE = 0.30;

    const dailyCarbs = ((dailyCalories * CARBS_PERCENTAGE) / 4).toFixed(2);
    const dailyProtein = ((dailyCalories * PROTEIN_PERCENTAGE) / 4).toFixed(2);
    const dailyFats = ((dailyCalories * FATS_PERCENTAGE) / 9).toFixed(2);

    const mealCarbs = (dailyCarbs / mealsPerDay).toFixed(2);
    const mealProtein = (dailyProtein / mealsPerDay).toFixed(2);
    const mealFats = (dailyFats / mealsPerDay).toFixed(2);

    res.render("partials/Fetaures.ejs", {
        dailyCarbs, dailyProtein, dailyFats,
        mealCarbs, mealProtein, mealFats,
        dailyCalories, mealsPerDay
    });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});