import fs from 'fs';
import winston from 'winston';

const fsPromise = fs.promises;

// logging manually
/*
async function log(logData) {
    try {
        logData = `\n ${new Date().toString()} - ${logData}`;
        await fsPromise.appendFile(
            'log.txt', 
            logData
            );
    } catch(err) {
        console.log(err);
    }
}  */

// log using winston library
const logger = winston.createLogger({
    level : 'info',  // This is minimum level above which all level can be used
    format : winston.format.json(),
    defaultMeta : { service : 'request-logging' },
   transports : [
    new winston.transports.File({filename: 'logs_winston.txt'})
   ]
});

const loggerMiddleware = async (
    req, 
    res, 
    next
) => { 
    // 1. Log request body.
    if(!req.url.includes("signin")){
        const logData = `${req.url
        } - ${JSON.stringify(req.body)}`;
        // await log(logData); // for manual
        logger.info(logData); // winston logging
    }
    next();
};

export default loggerMiddleware;