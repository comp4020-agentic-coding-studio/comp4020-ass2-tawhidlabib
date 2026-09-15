// Artwork for SLOP3908, generated rather than sourced.
//
// The starter ships placeholder images and `pnpm check:evidence` hashes them,
// so they have to go. Deleting them passes the gate but leaves a colder site,
// so these are drawn instead: flat two-ink shapes on warm cream, in the Slop
// palette, rendered from SVG by sharp and committed as rasters. Re-run with
// `pnpm artwork`; nothing in the build depends on this script.
//
// The register is risograph: a small number of flat inks, overlapping at
// partial opacity so the overlaps read as a second pass, plus a gaussian
// grain composited over the top.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";

// The Slop brand tokens, from astro-theme-slop/slop.css. Cream is the paper.
const GOLD = "#b97d1c";
const BRONZE = "#8a5c13";
const GREY = "#6b6154";
const CREAM = "#f5efe3";

const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";

/** Render an SVG string through the grain pass and out to `path`. */
async function render(path, svg, width, height, format) {
  const grain = sharp({
    create: {
      width,
      height,
      channels: 3,
      noise: { type: "gaussian", mean: 128, sigma: 11 },
    },
  }).png();

  const base = sharp(Buffer.from(svg)).resize(width, height);
  const pipeline = base.composite([
    { input: await grain.toBuffer(), blend: "overlay", opacity: 0.5 },
  ]);

  await mkdir(dirname(path), { recursive: true });
  const out =
    format === "avif"
      ? pipeline.avif({ quality: 62, effort: 6 })
      : pipeline.png({ compressionLevel: 9 });
  await out.toFile(path);
  console.log(`  ${path} (${width}x${height})`);
}

/** A row of bottles on the back shelf, as flat rounded rects. */
function bottles(x0, baseline, count) {
  const inks = [GOLD, BRONZE, GREY];
  return Array.from({ length: count }, (_, i) => {
    const w = 34 + (i % 3) * 10;
    const h = 150 + ((i * 47) % 110);
    const x = x0 + i * 88;
    const ink = inks[i % inks.length];
    return `<rect x="${x}" y="${baseline - h}" width="${w}" height="${h}" rx="${w / 2}"
      fill="${ink}" fill-opacity="${0.5 + ((i % 3) * 0.12).toFixed(2)}"/>`;
  }).join("\n");
}

/** A stool: a flat elliptical seat on a stem, with two feet. */
function stool(cx, seatY, floorY, scale = 1) {
  const rx = 128 * scale;
  const stem = 22 * scale;
  return `
    <ellipse cx="${cx}" cy="${seatY}" rx="${rx}" ry="${34 * scale}" fill="${BRONZE}" fill-opacity="0.85"/>
    <rect x="${cx - stem / 2}" y="${seatY}" width="${stem}" height="${floorY - seatY}" fill="${GREY}" fill-opacity="0.75"/>
    <rect x="${cx - rx * 0.62}" y="${floorY - 26 * scale}" width="${rx * 1.24}" height="${14 * scale}" rx="7"
      fill="${GREY}" fill-opacity="0.6"/>`;
}

// ---------------------------------------------------------------- the counter
// Home hero: the bar seen from a stool. A counter across the lower third, the
// back shelf behind it, a window throwing light in from the left.
function heroSvg(w, h) {
  const counterTop = h * 0.57;
  const counterFace = counterTop + h * 0.075;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${CREAM}"/>

  <!-- back wall, then the window: flat light, no gradient -->
  <rect x="0" y="0" width="${w}" height="${counterTop}" fill="${GREY}" fill-opacity="0.14"/>
  <rect x="${w * 0.06}" y="${h * 0.1}" width="${w * 0.23}" height="${h * 0.37}" fill="${GOLD}" fill-opacity="0.32"/>
  <rect x="${w * 0.175}" y="${h * 0.1}" width="8" height="${h * 0.37}" fill="${CREAM}" fill-opacity="0.85"/>
  <rect x="${w * 0.06}" y="${h * 0.28}" width="${w * 0.23}" height="8" fill="${CREAM}" fill-opacity="0.85"/>

  <!-- back shelf and its bottles -->
  ${bottles(w * 0.58, h * 0.44, 11)}
  <rect x="${w * 0.55}" y="${h * 0.44}" width="${w * 0.44}" height="14" fill="${BRONZE}" fill-opacity="0.9"/>

  <!-- two glasses left standing on the counter -->
  <rect x="${w * 0.35}" y="${counterTop - h * 0.075}" width="${w * 0.022}" height="${h * 0.075}" rx="6" fill="${GOLD}" fill-opacity="0.6"/>
  <rect x="${w * 0.385}" y="${counterTop - h * 0.055}" width="${w * 0.019}" height="${h * 0.055}" rx="6" fill="${BRONZE}" fill-opacity="0.5"/>

  <!-- the counter itself -->
  <rect x="0" y="${counterTop}" width="${w}" height="${counterFace - counterTop}" fill="${BRONZE}" fill-opacity="0.95"/>
  <rect x="0" y="${counterFace}" width="${w}" height="${h - counterFace}" fill="${GOLD}" fill-opacity="0.88"/>

  <!-- three stools, nobody on them yet -->
  ${stool(w * 0.22, counterFace + h * 0.1, h)}
  ${stool(w * 0.5, counterFace + h * 0.1, h)}
  ${stool(w * 0.78, counterFace + h * 0.1, h)}
</svg>`;
}

// ------------------------------------------------------------- the link card
function cardSvg(w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${CREAM}"/>
  <rect x="0" y="0" width="${w}" height="12" fill="${GOLD}"/>

  <!-- the same counter motif, cropped to a corner -->
  <rect x="0" y="${h * 0.78}" width="${w}" height="26" fill="${BRONZE}" fill-opacity="0.9"/>
  <rect x="0" y="${h * 0.82}" width="${w}" height="${h * 0.18}" fill="${GOLD}" fill-opacity="0.85"/>
  ${stool(w * 0.14, h * 0.88, h, 0.42)}
  ${stool(w * 0.31, h * 0.88, h, 0.42)}
  ${bottles(w * 0.63, h * 0.78, 5)}

  <text x="72" y="152" font-family="${FONT}" font-size="46" font-weight="700"
    letter-spacing="7" fill="${BRONZE}">SLOP3908</text>
  <text x="72" y="300" font-family="${FONT}" font-size="128" font-weight="700"
    fill="${GREY}">Regulars</text>
  <text x="72" y="380" font-family="${FONT}" font-size="46" font-weight="400"
    fill="${GREY}" fill-opacity="0.85">The Psychology of Third Places</text>
</svg>`;
}

// ---------------------------------------------------------------- portraits
// Abstract rather than representational: a head and shoulders reduced to two
// flat shapes, with the second ink pass offset the way a riso mis-registers.
// No face — these stand in for a person without pretending to be one.
function portraitSvg(w, h, variant) {
  const warm = variant === 0 ? GOLD : BRONZE;
  const cool = variant === 0 ? BRONZE : GREY;
  const headCy = h * 0.4;
  const headR = w * 0.19;
  const bodyTop = h * 0.58;
  const offset = variant === 0 ? 18 : -18;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${CREAM}"/>

  <!-- the wall behind, a flat field rather than a horizon -->
  <rect x="0" y="0" width="${w}" height="${h * 0.34}" fill="${cool}" fill-opacity="0.12"/>

  <!-- second ink pass first, so the mis-registration sits under the shapes -->
  <circle cx="${w * 0.5 + offset}" cy="${headCy + 14}" r="${headR}" fill="${cool}" fill-opacity="0.45"/>
  <rect x="${w * 0.19 + offset}" y="${bodyTop + 14}" width="${w * 0.62}" height="${h - bodyTop}"
    rx="${w * 0.17}" fill="${cool}" fill-opacity="0.45"/>

  <!-- shoulders, overlapping the head so the two read as one figure -->
  <rect x="${w * 0.19}" y="${bodyTop}" width="${w * 0.62}" height="${h - bodyTop}"
    rx="${w * 0.17}" fill="${cool}" fill-opacity="0.9"/>
  <circle cx="${w * 0.5}" cy="${headCy}" r="${headR}" fill="${warm}" fill-opacity="0.95"/>

  <!-- one mark each, so the two portraits are not the same picture -->
  ${
    variant === 0
      ? `<rect x="${w * 0.31}" y="${h * 0.82}" width="${w * 0.38}" height="${h * 0.035}" rx="${h * 0.018}" fill="${CREAM}" fill-opacity="0.55"/>`
      : `<circle cx="${w * 0.43}" cy="${headCy - headR * 0.3}" r="${headR * 0.34}" fill="${CREAM}" fill-opacity="0.26"/>`
  }
</svg>`;
}

const w = 2560;
const h = 1086;
console.log("artwork:");
await render("src/assets/images/hero-home.avif", heroSvg(w, h), w, h, "avif");
await render("src/assets/images/card.png", cardSvg(1200, 630), 1200, 630, "png");
await render("src/content/people/noor-vickery.avif", portraitSvg(800, 800, 0), 800, 800, "avif");
await render("src/content/people/teo-ballantyne.avif", portraitSvg(800, 800, 1), 800, 800, "avif");

// PNG proofs, for looking at. Not part of the site.
if (process.env.ARTWORK_PROOFS) {
  const dir = process.env.ARTWORK_PROOFS;
  await render(`${dir}/hero.png`, heroSvg(w, h), 1280, 543, "png");
  await render(`${dir}/card.png`, cardSvg(1200, 630), 1200, 630, "png");
  await render(`${dir}/portrait-0.png`, portraitSvg(800, 800, 0), 400, 400, "png");
  await render(`${dir}/portrait-1.png`, portraitSvg(800, 800, 1), 400, 400, "png");
}
