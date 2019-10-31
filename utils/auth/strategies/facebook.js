const passport = require("passport");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const axios = require("axios");
const boom = require("@hapi/boom");

const { config } = require("../../../config");

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookClientId,
      clientSecret: config.facebookClientSecret,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "email", "displayName"]
    },
    async function(accessToken, refreshToken, profile, done) {
      const email = profile.email
        ? profile.email
        : `${profile.id}@facebook.com`;

      console.log(email);

      const { data, status } = await axios({
        url: `${config.apiUrl}/api/auth/sign-provider`,
        method: "post",
        data: {
          name: profile.displayName,
          email: email,
          password: profile.id,
          apiKeyToken: config.apiKeyToken
        }
      });

      console.log(data);

      if (!data || status !== 200) {
        done(boom.unauthorized(), false);
      }

      return done(null, data);
    }
  )
);
