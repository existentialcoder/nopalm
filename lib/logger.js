const os = require('os');

const path = require('path');

const { PassThrough } = require('stream');

const {
  transports: {
    Console,
    File
  },
  format,
  createLogger
} = require('winston');

const TEN_MB = 10485760;

const logFileName = 'nopalm.log';

const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS ZZ';

const loggerStream = new PassThrough({ objectMode: true });

/**
 * constructs a lambda for the given log level which writes messages to the loggerStream
 *
 * @param   {string} level - log level
 * @param   {Stream} loggerStream - native node stream object to write messages to
 *
 * @returns {Function} - lambda function that writes to the streamer
 */
function wrapStreamer(level, loggerStream) {
  return (message, ...splat) => loggerStream.push({ level, message, [Symbol.for('splat')]: splat });
}

function loggerInit(logLevel) {
  global.logger = {
    info: wrapStreamer('info', loggerStream),
    error: wrapStreamer('error', loggerStream),
    warn: wrapStreamer('warn', loggerStream),
    debug: wrapStreamer('debug', loggerStream)
  };

  global.__debug = (filename, ...args) => logger.debug('(\x1b[34m%s\x1b[0m) \x1b[31m%s\x1b[0m', path.basename(filename), ...args);

  const transports = [
    new Console({
      format: format.combine(
        format.splat(),
        format.printf(info => info.stack || info.message)
      ),
      stderrLevels: ['error', 'warn'],
      colorize: true,
      level: logLevel
    }),
    new File({
      filename: path.join(process.cwd(), 'log', logFileName),
      format: format.combine(
        format.splat(),
        format.timestamp({ format: TIMESTAMP_FORMAT }),
        format.printf(info => `${info.timestamp} [${info.level}] ${info.stack || info.message}`)
      ),
      maxsize: TEN_MB,
      maxFiles: 1,
      level: 'debug',
      tailable: true
    })
  ];

  const internalLogger = createLogger({
    format: format.errors({ stack: true }),
    transports,
    exceptionHandlers: transports,
    exitOnError: true
  });

  loggerStream.pipe(internalLogger);
}

module.exports = loggerInit;
