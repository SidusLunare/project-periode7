const ENV = "school"; // Change to "production" when deploying

const CONFIG = {
  school: {
    SERVER_URL: "http://10.250.163.99:3000",
  },
  home: {
    SERVER_URL: "http://192.168.1.92:3000",
  },
};

export const SERVER_URL = CONFIG[ENV].SERVER_URL;
