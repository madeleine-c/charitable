import { createServer } from "http";
import { createApp, log } from "./app.js";
import { serveStatic } from "./static.js";

// Local entry point for `npm run dev` / `npm start`. On Vercel, api/index.ts
// serves the API and the CDN serves the built client.
const app = createApp();
const httpServer = createServer(app);

if (process.env.NODE_ENV === "production") {
  serveStatic(app);
} else {
  const { setupVite } = await import("./vite.js");
  await setupVite(httpServer, app);
}

const port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen({ port, host: "0.0.0.0" }, () => {
  log(`serving on port ${port}`);
});
