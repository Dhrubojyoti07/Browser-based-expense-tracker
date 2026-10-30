import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

/**
 * Configure Passport with a local strategy using email + password.
 * This strategy is used by the login route to authenticate users.
 */
const configurePassport = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // Use 'email' instead of default 'username'
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          // Find the user by email
          const user = User.findByEmail(email);
          if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          // Compare provided password with stored hash
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          // Authentication successful — return user
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Serialize user ID into the session (required by Passport even if unused)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session by ID
  passport.deserializeUser((id, done) => {
    const user = User.findById(id);
    done(null, user);
  });
};

export default configurePassport;
