import express from "express";
import bodyParser from "body-parser";
import helment from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import logger from "./utils/logger.js";
import {
    connectMongodb
} from "./utils/mongoodb.js"
import symbols from "figures";
import moment from "moment"
import morgan from "morgan"
import checkOrigin from "./middleware/cors.js";


// import routes

// import middlewaresdigdi
import {
    errorHandler,
    routerNotFound
} from "./middleware/index.js"


const PORT = process.env.PORT || 6400;

const app = express();
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    },
}))


const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 60 // limit each IP to 10 requests per windowMs
});

//  apply to all requests
app.use(limiter);


// Set security headers
app.use(helment())

// Prevent XSS attacks
app.use(xss())

// Prevent http param pollution
app.use(hpp())




// Morgan to use our custom logger instead of the console.log.
const stream = {
    // Use the http severity
    write: (message) => logger.info(message),
};

app.use(morgan(':IpAddress :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
    stream
}));

morgan.token('IpAddress', function (req, res, param) {
    return (req.headers['x-forwarded-for'].split(",")[0]) || (req.ip.startsWith("::ffff:") ? req.ip.replace("::ffff:", "") : req.ip);
});

// cors
app.use(checkOrigin())

// check ip

// routes

// routes not founds
app.use(() => {
    routerNotFound()
})

// error handler
app.use(errorHandler)


// Server
let server;
server = app.listen(PORT, async () => {
    try {
        logger.info(`(${process.env.NODE_ENV} environment) ${moment(new Date()).format("YYYY/MM/DD HH:MM:SS")} ${symbols.heart} App running...`)
        logger.info(`Server Run Successful port ${PORT}...`);
        const scoketObj = await import("./utils/socket.js")
        const io = await scoketObj.init(server);
        io.on("connection", socket => {
            logger.info("New client connection..")
            socket.on("join_chat_room", (data) => {
                socket.join(data.room);
                logger.info(`Socket new connection ${data.room}`)
            })


            socket.on('leave_chat_room', ({
                roomId
            }) => {
                socket.leave(roomId);
                logger.info('leaveRoom');
                cb();
            });
        })

        await connectMongodb()
    } catch (err) {
        logger.error(err);
        logger.error(err.message)
    }
});


// Handle unhandled promise rejections
process.on('uncaughtException', (err) => {

})


process.on('unhandledRejection', (err, promise) => {

});