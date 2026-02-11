const ms = require('ms');
const parseTimeString = (timeString, defaultValue) => {
  try {
    return parseInt(ms(timeString || defaultValue)) / 1000;
  } catch (error) {
    return parseInt(ms(defaultValue)) / 1000;
  }
};
export const Redis = {
  PREFIX: process.env.REDIS_PREFIX || 'kq',
  EXPIRY_TIMES: {
    REFRESH_TOKEN: parseTimeString(
      process.env.JWT_REFRESH_EXPIRATION,
      '30d',
    ),
  },
  KEYS: {
    REFRESH_TOKENS: (userId: string) =>
      `${Redis.PREFIX}:refresh_tokens:${userId}`,
  },
};
