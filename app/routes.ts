import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('auth/sign-in', 'routes/auth.sign-in.tsx'),
  route('auth/sign-up', 'routes/auth.sign-up.tsx'),
  // specific mobile-auth routes before the better-auth catch-all
  route('api/auth/register', 'routes/api.auth.register.ts'),
  route('api/auth/*', 'routes/api.auth.$.tsx'),
  route('api/auth', 'routes/api.auth.ts'),
  // data routes
  route('api/semesters', 'routes/api.semesters.ts'),
  route('api/semesters/:id', 'routes/api.semesters.$id.ts'),
  route('api/courses', 'routes/api.courses.ts'),
  route('api/courses/:id', 'routes/api.courses.$id.ts'),
  route('api/cwa', 'routes/api.cwa.ts'),
  route('api/academic-status', 'routes/api.academic-status.ts'),
] satisfies RouteConfig
