// eslint-disable-next-line max-classes-per-file
const constants = require('../constants');

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
        .status(constants.statusCodes.BAD_REQUEST)
        .send(er.message);

    case 'InvalidRequestBodyError':
      return res
        .status(constants.statusCodes.BAD_REQUEST)
        .send(er.message);

    default:
      console.error('Exception occured: ', er);
      return res
        .status(constants.statusCodes.INTERNAL_ERROR)
        .send(constants.messages.SOMETHING_WRONG);
  }
};

module.exports = {
  // Error classes
  InvalidProjectError,
  InvalidRequestBodyError,
  // Error validation helper methods
  errorHandler,
};
