import type { NextFunction, Request, Response } from 'express';
import z from 'zod';

// ----------------------------------------------------------------

export const validateReqBody =
  (schema: z.ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const bodyValidation = schema.safeParse(req.body);

    if (!bodyValidation.success && bodyValidation.error instanceof z.ZodError) {
      const validationError = bodyValidation.error.errors.map((error) => ({
        type: 'manual',
        name: error.path[0],
        message: error.message,
      }));

      return res.status(400).json(validationError);
    }

    next();
  };

export const validateReqParams =
  (schema: z.ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const paramsValidation = schema.safeParse(req.params);

    if (
      !paramsValidation.success &&
      paramsValidation.error instanceof z.ZodError
    ) {
      const validationError = paramsValidation.error.errors.map((error) => ({
        type: 'manual',
        name: error.path[0],
        message: error.message,
      }));

      return res.status(400).json(validationError);
    }

    next();
  };

export const validateReqQuery =
  (schema: z.ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const queryValidation = schema.safeParse(req.query);

    if (
      !queryValidation.success &&
      queryValidation.error instanceof z.ZodError
    ) {
      const validationError = queryValidation.error.errors.map((error) => ({
        type: 'manual',
        name: error.path[0],
        message: error.message,
      }));

      return res.status(400).json(validationError);
    }

    next();
  };

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  void next;
  console.error('Unhandled error:', error);

  if (res.headersSent) return;

  res.status(500).json({
    message: 'Oops! An internal server error occurred on our end.',
  });
};
