// oklch to rgb conversion functions

type FormatType = 'hex' | 'number';


export function oklch(s: string, F: 'hex'): string;
export function oklch(s: string, F?: 'number'): number;
export function oklch(l: number, cOrF: number, h: number, format: 'hex'): string;
export function oklch(l: number, cOrF: number, h: number, format?: 'number'): number;
export function oklch(l: number | string, cOrF?: number | FormatType, h?: number, format: FormatType = 'hex'): string | number {
    let L: number, C: number, H: number, F: FormatType;
    if (typeof cOrF === 'string') {
        F = cOrF;
    } else {
        F = format;
    }
    if (typeof l === 'string') {
        // "oklch(0.7493 0.1281 264.052)"
        // "0.7493 0.1281 264.052"
        const parts = l.replace('oklch(', '').replace(')', '').trim().split(/\s+/);
        if (parts.length !== 3) {
            throw new Error('Invalid oklch string format');
        }
        L = parseFloat(parts[0]);
        C = parseFloat(parts[1]);
        H = parseFloat(parts[2]);
    } else {
        L = l;
        C = cOrF as number;
        H = h as number;
    }

    let rgb = oklch2rgb([L, C, H]);
    // Clamp and convert to [0, 255]
    const R = Math.min(255, Math.max(0, Math.round(rgb[0] * 255)));
    const G = Math.min(255, Math.max(0, Math.round(rgb[1] * 255)));
    const B = Math.min(255, Math.max(0, Math.round(rgb[2] * 255)));

    if (F === 'hex') {
        return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1).toUpperCase()}`;
    } else {
        return (R << 16) + (G << 8) + B;
    }
}


// =================================================================
// https://gist.github.com/dkaraush/65d19d61396f5f3cd8ba7d1b4b3c9432

type Array3 = [number, number, number];

const multiplyMatrices = (A: number[], B: Array3): Array3 => {
    return [
        A[0] * B[0] + A[1] * B[1] + A[2] * B[2],
        A[3] * B[0] + A[4] * B[1] + A[5] * B[2],
        A[6] * B[0] + A[7] * B[1] + A[8] * B[2]
    ];
};

const oklch2oklab = ([l, c, h]: Array3): Array3 => [
    l,
    isNaN(h) ? 0 : c * Math.cos(h * Math.PI / 180),
    isNaN(h) ? 0 : c * Math.sin(h * Math.PI / 180)
];
const oklab2oklch = ([l, a, b]: Array3): Array3 => [
    l,
    Math.sqrt(a ** 2 + b ** 2),
    Math.abs(a) < 0.0002 && Math.abs(b) < 0.0002 ? NaN : (((Math.atan2(b, a) * 180) / Math.PI % 360) + 360) % 360
];

const rgb2srgbLinear = (rgb: Array3) => rgb.map(c =>
    Math.abs(c) <= 0.04045 ?
        c / 12.92 :
        (c < 0 ? -1 : 1) * (((Math.abs(c) + 0.055) / 1.055) ** 2.4)
) as Array3;
const srgbLinear2rgb = (rgb: Array3) => rgb.map(c =>
    Math.abs(c) > 0.0031308 ?
        (c < 0 ? -1 : 1) * (1.055 * (Math.abs(c) ** (1 / 2.4)) - 0.055) :
        12.92 * c
) as Array3;

const oklab2xyz = (lab: Array3) => {
    const LMSg = multiplyMatrices([
        1, 0.3963377773761749, 0.2158037573099136,
        1, -0.1055613458156586, -0.0638541728258133,
        1, -0.0894841775298119, -1.2914855480194092,
    ], lab);
    const LMS = LMSg.map(val => val ** 3) as Array3;
    return multiplyMatrices([
        1.2268798758459243, -0.5578149944602171, 0.2813910456659647,
        -0.0405757452148008, 1.1122868032803170, -0.0717110580655164,
        -0.0763729366746601, -0.4214933324022432, 1.5869240198367816
    ], LMS);
};
const xyz2oklab = (xyz: Array3) => {
    const LMS = multiplyMatrices([
        0.8190224379967030, 0.3619062600528904, -0.1288737815209879,
        0.0329836539323885, 0.9292868615863434, 0.0361446663506424,
        0.0481771893596242, 0.2642395317527308, 0.6335478284694309
    ], xyz);
    const LMSg = LMS.map(val => Math.cbrt(val)) as Array3;
    return multiplyMatrices([
        0.2104542683093140, 0.7936177747023054, -0.0040720430116193,
        1.9779985324311684, -2.4285922420485799, 0.4505937096174110,
        0.0259040424655478, 0.7827717124575296, -0.8086757549230774
    ], LMSg);
};
const xyz2rgbLinear = (xyz: Array3) => {
    return multiplyMatrices([
        3.2409699419045226, -1.537383177570094, -0.4986107602930034,
        -0.9692436362808796, 1.8759675015077202, 0.04155505740717559,
        0.05563007969699366, -0.20397695888897652, 1.0569715142428786
    ], xyz);
};
const rgbLinear2xyz = (rgb: Array3) => {
    return multiplyMatrices([
        0.41239079926595934, 0.357584339383878, 0.1804807884018343,
        0.21263900587151027, 0.715168678767756, 0.07219231536073371,
        0.01933081871559182, 0.11919477979462598, 0.9505321522496607
    ], rgb);
};

const clampArray3 = (arr: Array3, min: number, max: number): Array3 => [
    Math.min(max, Math.max(min, arr[0])),
    Math.min(max, Math.max(min, arr[1])),
    Math.min(max, Math.max(min, arr[2])),
];

const oklch2rgb = (lch: Array3) => {
    let r = srgbLinear2rgb(xyz2rgbLinear(oklab2xyz(oklch2oklab(lch))));
    // clamp r
    r = clampArray3(r, 0, 1);
    return r;
};
const rgb2oklch = (rgb: Array3) => {
    return oklab2oklch(xyz2oklab(rgbLinear2xyz(rgb2srgbLinear(rgb))));
};

// taken from https://github.com/color-js/color.js/blob/main/src/spaces/oklch.js
// be aware, that oklch2rgb might return values out of bounds. I believe you should clamp them?
// also for gray colors, hue would be NaN
