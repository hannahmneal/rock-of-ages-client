/**
 * A string representation of a hex color (e.g., #030303)
 */
export type HexColor = `#${string}`;

/**
 * The three levels of a color type (these do not have to be in the same tonal family but it is recommended that they be close)
 */
export interface ColorLevel {
    light: HexColor | "#FFFFFF";
    main: HexColor | "#FFFFFF"
    dark: HexColor | "#FFFFFF";
}

/**
 * A map of our color types (allows for custom color types) 
 */
export interface ShadowPalette {
    primary: ColorLevel;
    secondary: ColorLevel;
    error: ColorLevel;
    warning: ColorLevel;
    info: ColorLevel;
    success: ColorLevel;
    action: ColorLevel;
    text: ColorLevel;
    neutral: ColorLevel;
    [key: string]: ColorLevel | unknown;
}

/**
 * The keys of the color type as defined in @ShadowPalette
 */
export type ColorType = keyof ShadowPalette;

/**
 * The three tonal levels
 */
export type ColorTone = "light" | "main" | "dark";

/**
 * The Shade (lighter or darker) relative to the given color level (main, light, or dark) wrapped in a typle to make the intent explicit: [+2] = two Shades lighter, [-1] = one Shade darker, [0] = the given color level
 */
export type ShadeOffset = [number];

// Horizontal offset: positive means the shadow will be on the right of the box, negative offset will put the shadow on the left of the box.
// Vertical offset: a negative one means the box shadow will be above the box, a positive one means the shadow will be below the box.
// The blur radius(optional), if set to 0 the shadow will be sharp, the higher the number, the more blurred it will be.
// The spread radius(optional), positive values increase the size of the shadow, negative values decrease the size.Default is 0(the shadow is same size as blur).


/**
 * The direction of the shadow on the x-axis (i.e., horizontal offset)
 * 
 *      "l" | -1 -> left (negative x)
 *      "c" | 0 -> center (no x offset)
 *      "r" | 1 -> right (positive x)
 */
export type DirectionX = "l" | -1 | "c" | 0 | "r" | 1 | undefined;

/**
 * The direction of the shadow on the y-axis (i.e., vertical offset)
 * 
 *      "c" | 0 -> center (no v offset)
 *      "d" | "b" | "l" | 1 -> down/bottom/lower (negative y) 
 *      "u" | -1 -> upper (positive y)
*/
export type DirectionY = "u" | -1 | "c" | 0 | "d" | "b" | "l" | 1 | undefined;

/**
 * The ShadowSize of the shadow
 * 
 *      "xs" -> very small
 *      "s" -> small
 *      "m" -> medium (default)
 *      "l" -> large
 *      "xl" -> very large
 */
export type ShadowSize = "xs" | "s" | "m" | "l" | "xl";

/**
 * A full reference to the color types and their tones (e.g., `"primary"` or `"primary.main"`)
 */
export type ColorTypeReference =
    | ColorType
    | `${string}.${ColorTone}`


export interface ShadowProps {
    /** The color type, e.g. "primary" or "primary.dark" */
    type: ColorTypeReference;
    /**
     * Shade offset tuple. [+2] = 2 steps lighter, [-2] = 2 steps darker.
     * Affects the alpha opacity of the shadow color.
     */
    shade?: ShadeOffset;
    /** Horizontal shadow direction */
    x?: DirectionX;
    /** Vertical shadow direction */
    y?: DirectionY;
    /** Whether the shadow is inset */
    isInset?: boolean;
    /** size preset controlling offsets and blur */
    size?: ShadowSize;
    /** Spread radius in px (default: 0) */
    spread?: number;
    isOutline?: boolean;
}

// [-3]: "#030303"; // primary.dark
// [-2]: "#070707";
// [-1]: "#111111";
// [0]: "#1B1B1B"; // primary.main
// [+1]: "#2f2f2f";
// [+2]: "#252525";
// [+3]: "#383838";
// [+4]: "#424242"; // primary.light
// [+5]: "#4c4c4c";
// [+6]: "#565656";
// [+7]: "#606060";
// [+8]: "#696969";
// [+9]: "#737373";
// [+10]: "#7d7d7d";
// --------------------------------------------------------------------------
// Shadow build functions
// --------------------------------------------------------------------------

export interface SizeConfig {
    offset: number;
    blur: number;
    spread: number;
}
