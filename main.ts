// bring-the-humans-03 entry program (Node 22, standard library only).
//
// The entry itself is a video: an original short vertical ad for make.fun,
// posted publicly on TikTok. This program's whole job is to hand the house
// the video's address: it copies VIDEO.json from the repository root into
// the output directory, byte for byte, creating that directory first if it
// is not there. It never removes the output directory or anything in it.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const repoDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = join(repoDir, "VIDEO.json");

// Read the file before copying anything: a VIDEO.json that is not a JSON
// object with a string "url" can never name the entry's video, so fail
// loudly here instead of handing the house a file it has to refuse. The
// copy below still moves the original bytes, never a re-serialisation.
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, "utf8"));
} catch (err) {
  console.error(`VIDEO.json could not be read and parsed: ${(err as Error).message}`);
  process.exit(1);
}
if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== "string"
) {
  console.error('VIDEO.json must be a JSON object of the form {"url": "https://www.tiktok.com/@<handle>/video/<id>"}');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, "VIDEO.json"));
