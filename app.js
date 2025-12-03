import express from "express";
import dotenv from 'dotenv';
import movieRoutes from './routes/movie.js';

dotenv.config();

const app = express();
app.disable("x-powered-by");
app.use(express.json()); // importante para poder leer req.body

const PORT = process.env.PORT || 3000;
const ACCEPTED_ORIGINS = new Set([
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:4200",
  "http://localhost:5173",
]);

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ACCEPTED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/movies', movieRoutes);

// Solo iniciar el servidor si no está siendo importado para pruebas
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log("Server is running on port http://localhost:" + PORT);
  });
}

// Exportar para pruebas
export default app;
