import "express";

declare global {
  namespace Express {
    interface User {
      userId?: number;
      email?: string;
      givenName?: string;
      familyName?: string;
    }
  }
}

export {};
