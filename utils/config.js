// utils/config.js

<<<<<<< HEAD
const ENV = "school"; // Change to "production" when deploying

const CONFIG = {
  school: {
    SERVER_URL: "http://192.168.0.125:3000",
  },
  home: {
    SERVER_URL: "http://192.168.1.92:3000",
  },
=======
const ENV = "development"; // Change to "production" when deploying

const CONFIG = {
    development: {
        SERVER_URL: "http://192.168.1.92:3000",
    },
    production: {
        SERVER_URL: "http://192.168.1.92:3000",
    },
>>>>>>> parent of b370365 (gfrwg)
};

export const SERVER_URL = CONFIG[ENV].SERVER_URL;
