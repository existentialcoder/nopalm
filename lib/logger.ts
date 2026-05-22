import path from 'path';
import { PassThrough } from 'stream';
import { transports, format, createLogger, Logger } from 'winston';

import { LoggerStream, LogLevel, WrapStreamerFunction } from './types.js';

const { Console, File } = transports;

const TEN_MB = 10 * 1024 * 1024;
const logFileName = 'nopalm.log';
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS ZZ';

const loggerStream: LoggerStream = new PassThrough({ objectMode: true });

/**
 * Constructs a lambda for the given log level which writes messages to the loggerStream
 */
function wrapStreamer(
  level: LogLevel,
  loggerStream: LoggerStream
): WrapStreamerFunction {
  return (message: string, ...splat: unknown[]) => {
    loggerStream.push({
      level,
      message,
      [Symbol.for('splat')]: splat
    });
  };
}

function loggerInit(logLevel: LogLevel): void {
  global.logger = {
    info: wrapStreamer('info', loggerStream),
    error: wrapStreamer('error', loggerStream),
    warn: wrapStreamer('warn', loggerStream),
    debug: wrapStreamer('debug', loggerStream)
  };

  global.__debug = (filename: string, ...args: unknown[]) => {
    global.logger.debug(
      '(\x1b[34m%s\x1b[0m) \x1b[31m%s\x1b[0m',
      path.basename(filename),
      ...args
    );
  };

  const loggerTransports = [
    new Console({
      format: format.combine(
        format.splat(),
        format.printf(info => info.stack ?? info.message)
      ),
      stderrLevels: ['error', 'warn'],
      level: logLevel
    }),
    new File({
      filename: path.join(process.cwd(), 'log', logFileName),
      format: format.combine(
        format.splat(),
        format.timestamp({ format: TIMESTAMP_FORMAT }),
        format.printf(
          info =>
            `${info.timestamp} [${info.level}] ${info.stack ?? info.message}`
        )
      ),
      maxsize: TEN_MB,
      maxFiles: 1,
      level: 'debug',
      tailable: true
    })
  ];

  const internalLogger: Logger = createLogger({
    format: format.errors({ stack: true }),
    transports: loggerTransports,
    exceptionHandlers: loggerTransports,
    exitOnError: true
  });

  loggerStream.pipe(internalLogger);
}

export default loggerInit;
