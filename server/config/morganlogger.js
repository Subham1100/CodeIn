import logger from "./logger.js"; // Import logger
import morgan from "morgan"; // Import morgan

// morgan format
const morganFormat = ":method :url :status :response-time ms";

// Create morgan middleware with a custom stream
const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(" ")[0],
        url: message.split(" ")[1],
        status: message.split(" ")[2],
        responseTime: message.split(" ")[3],
      };
      logger.info(JSON.stringify(logObject)); // Log the message
    },
  },
});

// Export the morgan middleware
export default morganMiddleware;
