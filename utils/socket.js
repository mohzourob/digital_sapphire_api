import { createRequire } from 'module';
import logger from './logger.js';
const require = createRequire(import.meta.url);

let io;

export const init = async (httpServer) => {
    logger.info(`Init socket to server..`)
    io = require("socket.io")(httpServer);
    return io;
}

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not Initialized!!", 500)
    }
    return io;
}