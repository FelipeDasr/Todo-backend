import rateLimit from 'express-rate-limit';

const ChangePasswordLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    standardHeaders: true,
    legacyHeaders: false,
    max: 1,
    message: { errors: ["Too many requests, please try again later!"] }
});

export { ChangePasswordLimiter } 