// config.ts
const ENV = process.env.NODE_ENV;

const config = {
  development: {
    API_URL: "http://localhost:8080",
  },
  production: {
    API_URL: "http://18.144.165.97",
  },
};

export default config[ENV || "development"];
