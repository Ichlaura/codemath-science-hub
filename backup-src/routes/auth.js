const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { passport, authenticateJWT } = require("../config/oauth");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - googleId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated user ID
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         googleId:
 *           type: string
 *           description: Google OAuth ID
 *         profilePicture:
 *           type: string
 *           description: User's profile picture URL
 *         role:
 *           type: string
 *           enum: [parent, admin]
 *           default: parent
 *         children:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *         isActive:
 *           type: boolean
 *           default: true
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *             profilePicture:
 *               type: string
 *             children:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   age:
 *                     type: number
 *                   interests:
 *                     type: array
 *                     items:
 *                       type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user via Google OAuth
 *     description: Redirects to Google OAuth for registration (traditional registration not supported)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Redirect instructions to Google OAuth
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 oauth_url:
 *                   type: string
 */
router.post("/register", async (req, res) => {
  // Como tu User.js no tiene campo password, deshabilitamos registro tradicional
  res.json({
    message: "Please use Google OAuth for registration. Visit GET /auth/google",
    oauth_url: "/auth/google",
    note: "Traditional email/password registration is not supported in this version"
  });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login via Google OAuth
 *     description: Redirects to Google OAuth for login (traditional login not supported)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Redirect instructions to Google OAuth
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 oauth_url:
 *                   type: string
 */
router.post("/login", async (req, res) => {
  // Como tu User.js no tiene campo password, deshabilitamos login tradicional
  res.json({
    message: "Please use Google OAuth for login. Visit GET /auth/google", 
    oauth_url: "/auth/google",
    note: "Traditional email/password login is not supported in this version"
  });
});

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google OAuth authentication
 *     description: Start Google OAuth authentication flow for registration and login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 *       500:
 *         description: OAuth configuration error
 */
router.get("/google",
  passport.authenticate("google", { 
    scope: ["email", "profile"],
    session: false 
  })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handle Google OAuth callback and return JWT token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OAuth authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       500:
 *         description: OAuth authentication failed
 */
router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      // Crear token JWT
      const token = jwt.sign(
        { 
          id: req.user._id,
          email: req.user.email, 
          name: req.user.name,
          role: req.user.role
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ 
        success: true,
        message: 'Google authentication successful', 
        token,
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          profilePicture: req.user.profilePicture,
          children: req.user.children || []
        }
      });
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.status(500).json({ 
        success: false,
        error: "Google authentication failed",
        code: "OAUTH_ERROR"
      });
    }
  }
);

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify JWT token
 *     description: Verify if the provided JWT token is valid
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid or missing token
 */
router.get("/verify", authenticateJWT, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user (client should remove token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post("/logout", authenticateJWT, (req, res) => {
  res.json({ 
    success: true,
    message: 'Logout successful. Please remove the token from client storage.' 
  });
});

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Get authenticated user's profile information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     profilePicture:
 *                       type: string
 *                     children:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           age:
 *                             type: number
 *                           interests:
 *                             type: array
 *                             items:
 *                               type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        children: user.children || [],
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error retrieving user profile' 
    });
  }
});

/**
 * @swagger
 * /auth/profile/children:
 *   put:
 *     summary: Update user's children information
 *     description: Update the children data for authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               children:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     age:
 *                       type: number
 *                     interests:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Children information updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/profile/children", authenticateJWT, async (req, res) => {
  try {
    const { children } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { children: children || [] },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Children information updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        children: user.children
      }
    });
  } catch (error) {
    console.error('Update children error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating children information'
    });
  }
});

module.exports = router;