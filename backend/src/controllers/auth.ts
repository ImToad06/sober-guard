import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { User } from '../models/User';
import { config } from '../config';

export const authController = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: config.jwtSecret,
    }),
  )
  .group('/auth', (app) =>
    app
      .post(
        '/signup',
        async ({ body, set }) => {
          const { username, email, password } = body;
          const existingUser = await User.findOne({
            $or: [{ username }, { email }],
          });
          if (existingUser) {
            set.status = 400;
            return { error: 'User already exists' };
          }
          const passwordHash = await Bun.password.hash(password);
          const user = new User({ username, email, passwordHash });
          await user.save();
          return { success: true, message: 'User created' };
        },
        {
          body: t.Object({
            username: t.String(),
            email: t.String(),
            password: t.String(),
          }),
        },
      )
      .post(
        '/login',
        async ({ body, set, jwt }) => {
          const { username, password } = body;
          const user = await User.findOne({ username });
          if (!user) {
            set.status = 401;
            return { error: 'Invalid credentials' };
          }
          const isValid = await Bun.password.verify(password, user.passwordHash);
          if (!isValid) {
            set.status = 401;
            return { error: 'Invalid credentials' };
          }
          const token = await jwt.sign({
            sub: user.id,
            username: user.username,
          });
          return { success: true, token };
        },
        {
          body: t.Object({
            username: t.String(),
            password: t.String(),
          }),
        },
      ),
  );
