export default {
  jwt: {
    secret: process.env.JWT_SECRET_KEY || 'jwtScretKey',
    expiresIn: '1d',
  },
};
