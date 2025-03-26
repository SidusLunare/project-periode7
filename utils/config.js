// utils/config.js

const ENV = "home"; // Change to "production" when deploying

const CONFIG = {
    development: {
        SERVER_URL: "http://192.168.1.92:3000",
    },
    home: {
        SERVER_URL: "http://192.168.1.92:3000",
    },
};

export const SERVER_URL = CONFIG[ENV].SERVER_URL;
