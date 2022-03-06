import rateLimit from 'express-rate-limit';

const CodeVeficationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    standardHeaders: true,
    legacyHeaders: false,
    max: 3,
    message: { errors: ["Too many requests, please try again later!"] }
});

export { CodeVeficationLimiter } 