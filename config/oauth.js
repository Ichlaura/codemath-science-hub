const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true
},
async function(request, accessToken, refreshToken, profile, done) {
  try {
    console.log('Google OAuth profile received:', profile.email);
    
    let user = await User.findOne({ 
      $or: [
        { email: profile.email },
        { googleId: profile.id }
      ]
    });
    
    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.email,
        googleId: profile.id,
        profilePicture: profile.picture || '',
        role: 'parent'
      });
      await user.save();
      console.log('New user created via Google OAuth:', user.email);
    } else {
      user.googleId = profile.id;
      user.profilePicture = profile.picture || user.profilePicture;
      await user.save();
      console.log('Existing user updated with Google OAuth:', user.email);
    }
    
    return done(null, user);
  } catch (error) {
    console.error('Error in Google OAuth:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          success: false,
          error: "Invalid or expired token",
          code: "INVALID_TOKEN"
        });
      }
      
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ 
      success: false,
      error: "Authentication token required. Format: Bearer <token>",
      code: "AUTH_TOKEN_REQUIRED"
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      error: "Admin privileges required",
      code: "ADMIN_ACCESS_REQUIRED"
    });
  }
};

module.exports = {
  passport,
  authenticateJWT,
  requireAdmin
};