import constants from '../constants.js';

const { statusCodes, messages } = constants;

class InvalidProjectError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidProjectError';
  }
}

class InvalidRequestBodyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidRequestBodyError';
  }
}

const errorHandler = (er, res) => {
  switch (er.name) {
    case 'InvalidProjectError':
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ code: er.name, message: er.message });

    case 'InvalidRequestBodyError':
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ code: er.name, message: er.message });

    default:
      logger.error('Exception occured: ', er.message);
      return res
        .status(statusCodes.INTERNAL_ERROR)
        .json({ code: 'SomethingWentWrong', message: messages.SOMETHING_WRONG });
  }
};

export {
  // Error classes
  InvalidProjectError,
  InvalidRequestBodyError,
  // Error validation helper methods
  errorHandler,
};
