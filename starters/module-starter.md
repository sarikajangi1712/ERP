# Starter: New ERP/CRM Module Boilerplate

When creating a new domain module in `server/src/`:
1. Define Prisma model in `prisma/schema.prisma`.
2. Create validator schema in `src/validators/<module>Validator.js`.
3. Create controller in `src/controllers/<module>Controller.js`.
4. Create route handler in `src/routes/<module>Routes.js`.
5. Mount route in `src/routes/apiRouter.js`.
6. Add corresponding React API service in `client/src/api/<module>Api.js`.
7. Add React page component in `client/src/pages/<module>.jsx`.
