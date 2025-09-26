import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const BOT_REGEX =
  /(googlebot|bingbot|yahoo|baiduspider|yandex|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|discord)/i;

export async function handler(event) {
  const userAgent = event.headers["user-agent"] || "";
  const isBot = BOT_REGEX.test(userAgent);

  // Extract the path after /prerender
  const rawPath = event.path.replace("/.netlify/functions/prerender", "") || "/";
  const requestUrl = `https://www.opusama.com${rawPath}`;

  try {
    if (isBot) {
      // 🔹 Forward to Prerender.io
      const prerenderRes = await fetch(
        `https://service.prerender.io/${requestUrl}`,
        {
          headers: {
            "User-Agent": userAgent,
            "X-Prerender-Token": process.env.PRERENDER_TOKEN,
          },
        }
      );

      const body = await prerenderRes.text();

      return {
        statusCode: prerenderRes.status,
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "public, max-age=600",
        },
        body,
      };
    } else {
      // 🔹 Serve SPA for humans
      const filePath = path.join(process.cwd(), "dist", "index.html");
      const html = fs.readFileSync(filePath, "utf8");

      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: html,
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: "Prerender proxy error: " + error.message,
    };
  }
}