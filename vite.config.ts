import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");

  // Log available env variables (without values)
  console.log("Available env variables:", Object.keys(env));

  return {
    plugins: [react()],
    define: {
      __ENV__: env,
    },
  };
});
