// config.ts

type Environment = "development" | "production" | "test"

const ENV = (process.env.NODE_ENV as Environment) || "development";

const config: Record<Environment, { API_URL: string }>  = {
  development: {
    API_URL: "http://localhost:8080",
  },
  production: {
    API_URL: "http://18.144.165.97:8080",
  },
  test: {
    API_URL: "http://localhost:8080",
  },
};

export default config[ENV || "development"];
