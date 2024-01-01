import rateLimit from "express-rate-limit";

export const Ratelimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 20 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
