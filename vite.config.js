import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {

  const cwd = process.cwd();
  const env = { ...loadEnv(mode, cwd, 'PORT') };
  // reusable config for both server and preview
  const serverConfig = {
    host: true,
    port: Number(env.PORT || 3000),
  };

  return {
    base: '/',
    preview: serverConfig,
    server: serverConfig,
  };
});
