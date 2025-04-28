const logger = require("./logger");
const morgan = require("morgan");

//logger

// logger.info("This is an info message");
// logger.error("This is an error message");
// logger.warn("This is a warning message");
// logger.debug("This is a debug message");

const morganFormat = ":method :url :status :response-time ms";

const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(" ")[0],
        url: message.split(" ")[1],
        status: message.split(" ")[2],
        responseTime: message.split(" ")[3],
      };
      logger.info(JSON.stringify(logObject));
    },
  },
});

module.exports = morganMiddleware;
