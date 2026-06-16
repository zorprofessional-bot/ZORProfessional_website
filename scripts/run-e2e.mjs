import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.PORT ?? "3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;
const healthURL = `${baseURL}/hr`;
const args = process.argv.slice(2);

let serverProcess = null;

async function isServerReady() {
  try {
    const response = await fetch(healthURL, { redirect: "follow" });
    return response.status >= 200 && response.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(timeoutMs = 120_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isServerReady()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for ${healthURL}`);
}

function run(command, commandArgs, env = process.env) {
  return new Promise((resolve) => {
    const child = spawn(command, commandArgs, {
      cwd: root,
      env,
      stdio: "inherit",
      windowsHide: true,
    });

    child.on("exit", (code, signal) => {
      resolve({ code: code ?? 1, signal });
    });
  });
}

function waitForExit(child, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(false);
      }
    }, timeoutMs);

    child.once("exit", () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(true);
      }
    });
  });
}

async function stopServer() {
  if (!serverProcess?.pid) {
    return;
  }

  serverProcess.kill("SIGTERM");
  const stopped = await waitForExit(serverProcess, 2000);
  if (!stopped) {
    serverProcess.kill("SIGKILL");
    await waitForExit(serverProcess, 1000);
  }
}

async function main() {
  const hadServer = await isServerReady();

  if (!hadServer) {
    serverProcess = spawn(
      process.execPath,
      ["./node_modules/next/dist/bin/next", "dev", "-p", port],
      {
        cwd: root,
        env: process.env,
        stdio: "inherit",
        windowsHide: true,
      },
    );

    await waitForServer();
  }

  const result = await run(
    process.execPath,
    ["./node_modules/@playwright/test/cli.js", "test", ...args],
    {
      ...process.env,
      PLAYWRIGHT_BASE_URL: baseURL,
      PLAYWRIGHT_EXTERNAL_SERVER: "1",
    },
  );

  if (!hadServer) {
    await stopServer();
  }

  process.exitCode = result.code;
}

process.once("SIGINT", async () => {
  await stopServer();
  process.exit(130);
});

process.once("SIGTERM", async () => {
  await stopServer();
  process.exit(143);
});

main().catch(async (error) => {
  console.error(error);
  await stopServer();
  process.exitCode = 1;
});
