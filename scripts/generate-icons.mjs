/**
 * Генерация PNG-иконок из favicon.svg и OG-изображения.
 * Запуск: node scripts/generate-icons.mjs
 * После генерации скрипт можно удалить, PNG файлы закоммитить в public/.
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");
const svgBuffer = readFileSync(resolve(publicDir, "favicon.svg"));

async function generateFavicons() {
  // apple-touch-icon.png (180×180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(resolve(publicDir, "apple-touch-icon.png"));
  console.log("✓ apple-touch-icon.png (180×180)");

  // favicon-192.png (192×192)
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(resolve(publicDir, "favicon-192.png"));
  console.log("✓ favicon-192.png (192×192)");

  // favicon-512.png (512×512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(resolve(publicDir, "favicon-512.png"));
  console.log("✓ favicon-512.png (512×512)");
}

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  const svgImage = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#09090b"/>
    <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="24" fill="#111113" stroke="#27272a" stroke-width="1"/>

    <!-- Accent circle decoration -->
    <circle cx="100" cy="315" r="200" fill="#3b82f6" opacity="0.05"/>
    <circle cx="1100" cy="315" r="200" fill="#8b5cf6" opacity="0.05"/>

    <!-- Letter E from favicon -->
    <rect x="80" y="200" width="80" height="80" rx="16" fill="#0a0a0b"/>
    <text x="120" y="258" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="50" fill="#3b82f6">E</text>
    <circle cx="150" cy="210" r="8" fill="#3b82f6"/>

    <!-- Name -->
    <text x="190" y="240" font-family="system-ui, sans-serif" font-weight="800" font-size="42" fill="#fafafa">Евгений Надточеев</text>

    <!-- Role -->
    <text x="190" y="275" font-family="system-ui, sans-serif" font-weight="500" font-size="22" fill="#3b82f6">Fullstack Developer — Backend, DevOps, AI</text>

    <!-- Tagline -->
    <text x="120" y="370" font-family="system-ui, sans-serif" font-weight="400" font-size="18" fill="#a1a1aa">Node.js · Go · React · Kubernetes · Docker · Microservices</text>
    <text x="120" y="400" font-family="system-ui, sans-serif" font-weight="400" font-size="18" fill="#a1a1aa">AI/LLM · RAG · Telegram Bots · High-load Systems</text>

    <!-- URL -->
    <text x="120" y="470" font-family="system-ui, sans-serif" font-weight="600" font-size="20" fill="#3b82f6">nadtocheev.ru</text>

    <!-- Bottom accent line -->
    <rect x="80" y="${height - 80}" width="200" height="3" rx="2" fill="#3b82f6"/>
    <rect x="290" y="${height - 80}" width="100" height="3" rx="2" fill="#8b5cf6" opacity="0.5"/>
  </svg>`;

  await sharp(Buffer.from(svgImage))
    .png()
    .toFile(resolve(publicDir, "og-image.png"));
  console.log("✓ og-image.png (1200×630)");
}

await generateFavicons();
await generateOgImage();
console.log("\nDone! All icons generated in public/");
