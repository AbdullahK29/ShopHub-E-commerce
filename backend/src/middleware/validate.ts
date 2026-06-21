import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source])
      req[source] = data
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        // .issues is the correct property in Zod v3
        const errors = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`)
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        })
        return
      }
      next(error)
    }
  }
}