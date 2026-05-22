import { WrapStreamerFunction, Meta } from './types.js';

declare global {
  var logger: {
    info: WrapStreamerFunction;
    error: WrapStreamerFunction;
    warn: WrapStreamerFunction;
    debug: WrapStreamerFunction;
  };

  var __debug: ((filename: string, ...args: unknown[]) => void) | undefined;
}

declare module 'express-serve-static-core' {
  interface Request {
    meta: Meta;
  }
}

export {};

