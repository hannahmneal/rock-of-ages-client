import type {
    ColorLevel,
    ColorTone,
    ShadowPalette,
    ShadowProps,
    ShadowSize,
    SizeConfig,
    DirectionX,
    DirectionY
} from "./ShadowTypes";

// --------------------------------------------------------------------------
// Size config functions
// --------------------------------------------------------------------------

const SIZE_MAP: Record<ShadowSize, SizeConfig> = {
    xs: { offset: 1, blur: 2, spread: 0 },
    s: { offset: 2, blur: 4, spread: 0 },
    m: { offset: 4, blur: 8, spread: 0 },
    l: { offset: 6, blur: 12, spread: 0 },
    xl: { offset: 8, blur: 16, spread: 0 },
};

const VALID_ShadowSizeS = new Set<string>(["xs", "s", "m", "l", "xl"]);

function resolveShadowSizeConfig(ShadowSize: ShadowSize | undefined): SizeConfig {
    if (ShadowSize != null && VALID_ShadowSizeS.has(ShadowSize)) {
        return SIZE_MAP[ShadowSize];
    }
    // // Too noisy
    // if (process.env.NODE_ENV !== "production" && ShadowSize != null) {
    //     console.warn(`[buildShadow] Unknown ShadowSize "${ShadowSize}", falling back to "m".`);
    // }
    return SIZE_MAP["m"];
}

// --------------------------------------------------------------------------
// Direction normalization
// --------------------------------------------------------------------------

/**
 * Clamps a direction value to -1, 0, or 1.
 * If the value is not a recognized string alias AND not a valid number in
 * {-1, 0, 1}, falls back to 0 with a dev warning — ensuring hOffset and
 * vOffset never become NaN even if a wrong alias is passed (e.g. "u" to x).
 */
function clampSign(value: unknown, axis: "x" | "y", raw: unknown): -1 | 0 | 1 {
    const n = Number(value);
    if (n === -1 || n === 0 || n === 1) return n as -1 | 0 | 1;
    // // Too noisy!
    // if (process.env.NODE_ENV !== "production") {
    //     console.warn(
    //         `[buildShadow] Unrecognized ${axis} direction value: "${raw}". ` +
    //         `x expects "r"/"l"/"c" or 1/-1/0; y expects "u"/"d"/"m" or 1/-1/0. ` +
    //         `Falling back to 0.`
    //     );
    // }
    return 0;
}

// Horizontal offset: positive means the shadow will be on the right of the box, negative offset will put the shadow on the left of the box.

function resolveX(x: DirectionX | undefined): -1 | 0 | 1 {    
    if (x === "r") return 1;
    if (x === "l") return -1;
    if (x === "c" || x === null) return 0;
    
    return clampSign(x, "x", x);
}

// Vertical offset: a negative one means the box shadow will be above the box, a positive one means the shadow will be below the box.

function resolveY(y: DirectionY | undefined): -1 | 0 | 1 {
    if (y === "u") return -1;
    if (y === "c" || y === null) return 0;
    if (y === "b" || y === "d" || y === "l") return 1;
    
    return clampSign(y, "y", y);
}


// --------------------------------------------------------------------------
// Color resolution
// --------------------------------------------------------------------------

function isColorLevel(value: unknown): value is ColorLevel {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        ("main" in value || "light" in value || "dark" in value)
    );
}

const TONE_FALLBACK: ColorTone[] = ["main", "light", "dark"];

function resolveTone(colorLevel: ColorLevel, tone: ColorTone): string | undefined {
    
    if (colorLevel[tone] != null) return colorLevel[tone];

    for (const fallback of TONE_FALLBACK) {
        if (fallback !== tone && colorLevel[fallback] != null) return colorLevel[fallback];
    }

    return undefined;
}

/**
 * From the given `type` and `palette`, resolves the final color string.
 * 
 * 
 * @param type A string representing a `"colorKey.tone"`, such as `"primary.main"`
 * @example The palette key `"primary"` resolves to `primary.main`
 * @example A raw color string may also be used, such as `"#303030",  "rgb(...)", an MUI value, etc.
 * @param palette A key.value pair representing the hex values for the shadows 
 * @example The palette key + tone such as `primary.dark`
 * @returns A string
 */
function resolveColor (
    type: string = "#00000000",
    palette?: ShadowPalette
): string {
    // colorKey.tone -------------------------------------------------------------------------
    if (type.includes(".")) {
        const dotIndex = type.indexOf(".");
        const colorKey = type.slice(0, dotIndex);
        const toneKey = type.slice(dotIndex + 1) as ColorTone;

        
        if (palette) {
            const entry = palette[colorKey];
            if (isColorLevel(entry)) {
                const resolved = resolveTone(entry, toneKey);

                if (resolved != null) return resolved;

                if (process.env.NODE_ENV !== "production") {
                    console.warn(
                        `[buildShadow] Tone "${toneKey}" not found on "${colorKey}".` +
                        `No fallback tones available - treating "${type}" as a raw color.`
                    );
                }
            }
        }
    }

    // Plain palette key ("primary") --------------------------------------------------------------------------

    if (palette && type.includes(".")) {
        const entry = palette[type];
        if (isColorLevel(entry)) {
            
            const resolved = resolveTone(entry, "main");
            
            if (resolved != null) return resolved;

            if (process.env.NODE_ENV !== "production") {
                console.warn(
                    `[buildShadow] Color "${type}" found in palette but has no defined tones.` +
                    `Treating as raw color string.`
                )
            }
        }
    }

    // Raw color string for direct use --------------------------------------------------------------------------

    if (type && type.length > 0) return type;
    
    // Fallback --------------------------------------------------------------------------

    if (process.env.NODE_ENV !== "production") {
        console.warn(`[buildShadow] Could not resolve color from type "${type}". Using transparent.`)
    }
    return "transparent";
}

// --------------------------------------------------------------------------
// Convert color to RGBA
// --------------------------------------------------------------------------

function hexToRgb(hex: string): {
    r: number,
    g: number,
    b: number
} | null {
    
    const clean = hex.replace(/^#/, "");
    
    let full: string;

    if (clean.length === 3 || clean.length === 4) {
     full = clean.split("").map((c) => c + c).join("").slice(0, 6);
    } else if (clean.length === 6 || clean.length === 8) {
        full = clean.slice(0, 6);
    } else {
        return null;
    }

    const num = parseInt(full, 16);

    if (isNaN(num)) return null;

    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

function alpha(color: string, opacity: number): string {
    const clamped = Math.min(1, Math.max(0, opacity));
    const fixed = parseFloat(clamped.toFixed(2));
    
    // Hex color
    if (color.startsWith("#")) {
        const rgb = hexToRgb(color);
        if (rgb) {
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fixed})`;
        }
    }

      // Already rgba — replace alpha
      if (color.startsWith("rgba(")) {
        return color.replace(/,\s*[\d.]+\s*\)$/, `, ${fixed})`);
    }
    
    // rgb() — convert to rgba
     if (color.startsWith("rgb(")) {
        return color.replace("rgb(", "rgba(").replace(")", `, ${fixed})`);
    }

      // hsl() → hsla()
      if (color.startsWith("hsl(")) {
        return color.replace("hsl(", "hsla(").replace(")", `, ${fixed})`);
    
    }
    
    // hsla() — replace alpha
    if (color.startsWith("hsla(")) {
        return color.replace(/,\s*[\d.]+\s*\)$/, `, ${fixed})`);
    }
    
     // Unknown format — return as-is (can't apply alpha reliably)
    if (process.env.NODE_ENV !== "production") {
        console.warn(
            `[buildShadow] Cannot apply alpha to color "${color}" — unknown format. ` +
            `Using color as-is.`
        );

    }
    return color;
}

// --------------------------------------------------------------------------
// Convert Shade to Opacity
// --------------------------------------------------------------------------

function shadeToOpacity(ShadeOffset: number): number {
    
    const BASE = 0.50;
    const STEP = 0.08;
    
    return Math.min(0.95, Math.max(0.05, BASE - ShadeOffset * STEP));
}

// ─────────────────────────────────────────────
// Core Builder
// ─────────────────────────────────────────────

/**
 * Builds a CSS box-shadow string from structured props and an optional palette.
 *
 * @example
 * const shadow = buildShadow({
 *   type: "primary",
 *   Shade: [+2],
 *   x: "l",
 *   y: "u",
 *   isInset: false,
 *   size: "m",
 * }, myPalette);
 * // → "-4px -4px 8px 0px rgba(37, 37, 37, 0.34)"
 */
export function buildShadow(props: ShadowProps, palette?: ShadowPalette): string {
    const {
        type,
        shade = [0],
        x,
        y,
        isInset = false,
        size,
        spread,
        isOutline = false,
    } = props;

    const sizeConfig = resolveShadowSizeConfig(size);
    
    const xSign = resolveX(x);
    const ySign = resolveY(y);
    
    const hOffset = xSign * sizeConfig.offset;
    const vOffset = ySign * sizeConfig.offset;
    const blur = sizeConfig.blur;
    const spreadPx = spread ?? sizeConfig.spread;
    
    const colorStr = resolveColor(type?.toString(), palette);
    const opacity = shadeToOpacity(shade[0] ?? 0);
    let color;
    const inset = isInset ? "inset" : "";

    if (isOutline === true) {
        color = alpha(colorStr, 0.25);
        return `${inset} 0px 0px 3px ${color}`;
    }
    else {
        color = alpha(colorStr, opacity);
    }
   
   return `${inset} ${hOffset}px ${vOffset}px ${blur}px ${spreadPx}px ${color}`;
}

// ─────────────────────────────────────────────
// React Hook (optional convenience)
// ─────────────────────────────────────────────

/**
 * Returns a buildShadow function pre-bound to your palette.
 * Use this to avoid passing the palette on every call.
*
* @example
* const shadow = useShadow(myPalette);
* const s = shadow({ type: "primary", ShadowSize: "l", y: "d" });
*/
export function useShadow(palette: ShadowPalette) {
    return (props: ShadowProps): string => buildShadow(props, palette);
}

// ─────────────────────────────────────────────
// Custom shadows
// ─────────────────────────────────────────────

export function primaryMainShadow(theme: any) {

    const shadows = [
        buildShadow({ type: theme.palette.common.orange, shade: [+4],  x: 1, y: 1, size: "m", isInset: true }),
        buildShadow({ type: theme.palette.common.lightOrange, shade: [0], x: -1, y: -1, size: "xl" }),
        buildShadow({ type: theme.palette.common.black, shade: [-1], x: 1, y: 1, size: "xl" }),
        buildShadow({ type: theme.palette.primary.dark, shade: [-5], spread: 0, x: 1, y: 1, size: "xl" }),
        buildShadow({type: theme.palette.common.black, shade: [0], isOutline: true }),
    ]

    return shadows.join(",")
}

export function primaryMainInputShadow(theme: any) {

    const shadows = [
        buildShadow({ type: theme.palette.common.orange, shade: [+4], x: 1, y: 1, size: "xs" }),
        buildShadow({ type: theme.palette.common.lightOrange, shade: [0], x: -1, y: -1, size: "xs", isInset: true }),
        buildShadow({ type: theme.palette.common.black, shade: [-1], x: 1, y: 1, size: "xs", isInset: true }),
        buildShadow({ type: theme.palette.primary.dark, shade: [-5], spread: 0, x: 1, y: 1, size: "s", isInset: true }),
        buildShadow({ type: theme.palette.common.black, shade: [0], isOutline: true }),
    ]

    return shadows.join(",")
}

export function primaryMainButtonShadow(theme: any) {

    const shadows = [
        buildShadow({ type: theme.palette.common.orange, shade: [+4], x: 1, y: 1, size: "s", isInset: true }),
        buildShadow({ type: theme.palette.common.lightOrange, shade: [+1], x: -1, y: -1, size: "m" }),
        buildShadow({ type: theme.palette.common.black, shade: [-1], x: 1, y: 1, size: "m" }),
        buildShadow({ type: theme.palette.primary.dark, shade: [-5], spread: 0, x: -1, y: -1, size: "s" }),
        buildShadow({ type: theme.palette.common.black, shade: [0], isOutline: true }),
    ]

    return shadows.join(",")
}

export function authButtonShadowSelected(theme: any, x: DirectionX | undefined, y: DirectionY | undefined) {
    const shadows = [
        buildShadow({ type: theme.palette.primary.dark, shade: [0], x: x, y: 0, size: "s", isInset: true }),
        buildShadow({ type: theme.palette.primary.dark, shade: [0], x: x, y: 1, size: "s", isInset: true }),
        buildShadow({ type: theme.palette.primary.light, shade: [0], isOutline: true }),
    ]
    
    return shadows.join(",")
}

export function authButtonShadow(theme: any, x: DirectionX | undefined, y: DirectionY | undefined) {
    const shadows = [
        buildShadow({ type: theme.palette.common.orange, shade: [+4], x: x, y: 1, size: "xs", isInset: true }),
        buildShadow({ type: theme.palette.common.lightOrange, shade: [+1], x: 0, y: -1, size: "xs" }),
        buildShadow({ type: theme.palette.common.black, shade: [-1], x: x, y: 1, size: "s" }),
        buildShadow({ type: theme.palette.primary.dark, shade: [-5], spread: 0, x: x, y: -1, size: "s" }),
        buildShadow({ type: theme.palette.common.black, shade: [0], isOutline: true }),
    ]
    
    return shadows.join(",")
}

export { alpha, hexToRgb };
