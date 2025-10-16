require("dotenv").config();
console.log("Mongo URI:", process.env.MONGODB_URI);
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const { swaggerUi, specs } = require("./swagger/swagger");
const errorHandler = require("./middleware/errorHandler");
const { passport } = require("./config/oauth"); // ✅ NUEVO

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize()); // ✅ NUEVO: Inicializar Passport

// Routes
app.use("/auth", require("./routes/auth")); // ✅ ACTUALIZADO con OAuth
app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/Orders")); // ✅ NUEVO
app.use("/reviews", require("./routes/Reviews")); // ✅ NUEVO



// DIAGNÓSTICO TEMPORAL - agregar esto
console.log("=== SWAGGER DIAGNÓSTICO ===");
console.log("Total de paths:", Object.keys(specs.paths || {}).length);
if (specs.paths) {
  console.log("Paths encontrados:", Object.keys(specs.paths));
} else {
  console.log("NO hay paths definidos");
}
console.log("=== FIN DIAGNÓSTICO ===");

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "CodeMath Science Hub API"
}));

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    message: "CodeMath Science Hub API is running!",
    version: "2.0.0",
    features: {
      oauth: true,
      orders: true,
      reviews: true,
      testing: true
    }
  });
});

// Main route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CodeMath Science Hub API!",
    version: "2.0.0",
    documentation: "/api-docs",
    health: "/health",
    endpoints: {
      auth: "/auth",
      users: "/users",
      products: "/products",
      orders: "/orders", // ✅ NUEVO
      reviews: "/reviews" // ✅ NUEVO
    },
    features: [
      "JWT Authentication",
      "Google OAuth Integration", // ✅ NUEVO
      "Order Management", // ✅ NUEVO
      "Product Reviews", // ✅ NUEVO
      "Swagger Documentation",
      "Unit Testing" // ✅ NUEVO
    ]
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    code: "ROUTE_NOT_FOUND",
    availableRoutes: {
      home: "/",
      documentation: "/api-docs",
      health: "/health",
      auth: "/auth",
      users: "/users",
      products: "/products",
      orders: "/orders", // ✅ NUEVO
      reviews: "/reviews" // ✅ NUEVO
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
  console.log("📚 Documentation: http://localhost:" + PORT + "/api-docs");
  console.log("❤️  Health check: http://localhost:" + PORT + "/health");
  console.log("🔐 OAuth available: http://localhost:" + PORT + "/auth/google"); // ✅ NUEVO
  console.log("🧪 Testing: npm test"); // ✅ NUEVO
});

module.exports = app;