import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connect from "./config/Database.js";
import Validationrouter from "./src/routes/ValidationRoutes.js";
import { Ratelimiter } from "./src/helpers/RateLimitRequest.js";
import UserRoutes from "./src/routes/UserOnlyRoutes.js";

dotenv.config();

// express port setup
const app = express();

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5713 , https://muxik.netlify.app",
    methods: "GET,PUT,POST,DELETE",
  })
);

// logs middleware
app.use(morgan("tiny"));

app.disable("x-powered-by");

connect()
  .then(() => {
    try {
      app.listen(process.env.PORT || 8080, () => {
        console.log(
          "📑 Visit the docs at https://github.com/ShivaBhattacharjee/Muxik-backend/blob/main/README.MD"
        );
        console.log("🎶 Visit Muxik https://muxik.netlify.app/");
        console.log(
          "🗄️ Server started at http://localhost:" + process.env.PORT || 8080
        );
      });
    } catch (error) {
      console.log("⚠️ Cannot connect to server" + error);
    }
  })
  .catch((error) => {
    console.log("⚠️ Connection failed " + error);
  });

app.get("/", (req, res) => {
  if (req)
    res.redirect(
      "https://github.com/ShivaBhattacharjee/Muxik-backend?tab=readme-ov-file#routes"
    );
});

// rate limiter middleware
app.use(Ratelimiter);

app.use((err, _, res, next) => {
  if (err instanceof Ratelimiter.RateLimitExceeded) {
    return res.status(429).json({ message: "Rate limit exceeded" });
  }
  next();
});

app.use("/api/validation", Validationrouter);
app.use("/api/user", UserRoutes);
