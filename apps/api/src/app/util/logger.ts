import winston from 'winston';
import { NODE_ENV } from '@thxnetwork/api/config/secrets';

// Custom format for better log readability
const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define different colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

const formatWinston = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    NODE_ENV !== 'production' ? winston.format.colorize({ all: true }) : winston.format.uncolorize(),
    customFormat,
);

// Create separate transports for different log levels
const transports: (winston.transports.FileTransportInstance | winston.transports.ConsoleTransportInstance)[] = [
    // Write all logs with level 'error' and below to 'error.log'
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 50,
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),

    // Write all logs with level 'info' and below to 'combined.log'
    new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 50,
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
];

// Add console transport in non-production environments
if (NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
    );
} else {
    // In production, only log errors to console
    transports.push(
        new winston.transports.Console({
            level: 'error',
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
    );
}

const winstonLogger = winston.createLogger({
    level: NODE_ENV === 'production' ? 'info' : 'debug',
    levels,
    format: formatWinston,
    transports,
    // Prevent exit on error
    exitOnError: false,
    // Add exception handling
    exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
    // Add rejection handling
    rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
});

// Create a stream object with a 'write' function that will be used by Morgan
export const stream = {
    write: (message: string) => {
        // Use winstonLogger directly to avoid circular reference
        winstonLogger.http(message.trim());
    }
};

function getCallerInfo() {
    const err = new Error();
    if (!err.stack) return '';
    const stackLines = err.stack.split('\n');
    // stackLines[0] is 'Error', stackLines[1] is this function, stackLines[2] is the logger wrapper, stackLines[3] is the actual caller
    return stackLines[3]?.trim() || '';
}

function formatLogArgs(args: unknown[]) {
    if (args.length === 1 && typeof args[0] === 'object' && args[0] && Object.keys(args[0]).length === 0) {
        return ['[WARNING: Empty error object]', getCallerInfo()];
    }
    return [getCallerInfo(), ...args.map(arg => {
        if (arg instanceof Error) {
            return `${arg.message}\n${arg.stack}`;
        }
        if (typeof arg === 'object') {
            try {
                return JSON.stringify(arg);
            } catch {
                return '[Unserializable Object]';
            }
        }
        return arg;
    })];
}

const logger = {
    error: (...args: unknown[]) => winstonLogger.error(formatLogArgs(args).join(' ')),
    warn: (...args: unknown[]) => winstonLogger.warn(formatLogArgs(args).join(' ')),
    info: (...args: unknown[]) => winstonLogger.info(formatLogArgs(args).join(' ')),
    debug: (...args: unknown[]) => winstonLogger.debug(formatLogArgs(args).join(' ')),
    http: (...args: unknown[]) => winstonLogger.http(formatLogArgs(args).join(' ')),
};

export { logger };

