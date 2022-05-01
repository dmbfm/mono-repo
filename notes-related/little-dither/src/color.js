import { log, assert } from "./common.js";

export const ColorSpace = {
    linearRgb: "linear_rgb",
    sRgb: "srgb",
    cielab: "CIELab",
    cie1931: "CIE1931",
    oklab: "OKLab",
};

function clamp(a, b, v) {
    return Math.min(b, Math.max(a, v));
}

const Constants = {
    Xn: 0.950489,
    Yn: 1,
    Zn: 1.088840,
};

export class Color {
    data = [0, 0, 0];
    space = ColorSpace.sRgb;

    constructor(a = 0, b = 0, c = 0, space = ColorSpace.sRgb) {
        this.data = [a, b, c];
        this.space = space;
    }

    setData(data) {
        this.data = data;
        return this;
    }

    setSpace(space) {
        this.space = space;
        return this;
    }

    get r() {
        return this.data[0];
    }

    get g() {
        return this.data[1];
    }

    get b() {
        return this.data[2];
    }

    set r(v) {
        this.data[0] = clamp(0, 1, v);
    }

    set g(v) {
        this.data[1] = clamp(0, 1, v);
    }

    set b(v) {
        this.data[2] = clamp(0, 1, v);
    }

    get r255() {
        return Math.round(this.data[0] * 255);
    }

    get g255() {
        return Math.round(this.data[1] * 255);
    }

    get b255() {
        return Math.round(this.data[2] * 255);
    }

    set r255(v) {
        this.data[0] = v / 255;
    }

    set g255(v) {
        this.data[1] = v / 255;
    }

    set b255(v) {
        this.data[2] = v / 255;
    }

    get x() {
        return this.data[0];
    }

    get y() {
        return this.data[1];
    }

    get z() {
        return this.data[2];
    }

    set x(v) {
        this.data[0] = clamp(0, 1, v);
    }

    set y(v) {
        this.data[1] = clamp(0, 1, v);
    }

    set z(v) {
        this.data[2] = clamp(0, 1, v);
    }

    get L() {
        return this.data[0];
    }

    get a() {
        return this.data[1];
    }

    set L(v) {
        this.data[0] = clamp(0, 1, v);
    }

    set a(v) {
        this.data[1] = clamp(0, 1, v);
    }

    getCssString() {
        let c = this.asSrgb();
        return `rgb(${c.r255}, ${c.g255}, ${c.b255})`;
    }

    clone() {
        let c = new Color();
        c.data = [...this.data];
        c.space = this.space;
        return c;
    }

    convert(space) {
        switch (space) {
            case ColorSpace.linearRgb:
                this.linearRgb();
                break;

            case ColorSpace.sRgb:
                this.sRgb();
                break;

            case ColorSpace.cie1931:
                this.cie1931();
                break;

            case ColorSpace.cielab:
                this.cieLab();
                break;

            case ColorSpace.oklab:
                this.oklab();
                break;
        }
    }

    lerp(c, t) {

        if (c.space != this.space) {
            throw "[lerp] mismatched color spaces!";
        }

        let r = this.clone();

        r.data[0] = this.data[0] * t + c.data[0] * (1 - t);
        r.data[1] = this.data[1] * t + c.data[1] * (1 - t);
        r.data[2] = this.data[2] * t + c.data[2] * (1 - t);

        return r;
    }

    linearRgb() {
        switch (this.space) {
            case ColorSpace.sRgb:
                this._sRgbToLinear();
                this.space = ColorSpace.linearRgb;
                break;
        }
    }

    sRgb = () => {
        switch (this.space) {
            case ColorSpace.linearRgb:
                this._linearToSrgb();
                this.space = ColorSpace.sRgb;
                break;

            case ColorSpace.cie1931:
                {
                    let x = this.data[0];
                    let y = this.data[1];
                    let z = this.data[2];

                    let r = 3.2406 * x - 1.5372 * y - 0.4986 * z;
                    let g = -0.9689 * x + 1.8758 * y + 0.0415 * z;
                    let b = 0.0557 * x - 0.2040 * y + 1.0570 * z;

                    this.data[0] = r;
                    this.data[1] = g;
                    this.data[2] = b;

                    this.space = ColorSpace.linearRgb;
                    this.sRgb();
                }
                break;

            case ColorSpace.cielab:
                {
                    this.cie1931();
                    this.sRgb();
                } break;

            case ColorSpace.oklab:
                {
                    this.cie1931();
                    this.sRgb();
                } break;
        }
    }

    cie1931() {
        switch (this.space) {
            case ColorSpace.sRgb:
                this.linearRgb();
                this.cie1931();
                break;

            case ColorSpace.linearRgb:
                {
                    let r = this.data[0];
                    let g = this.data[1];
                    let b = this.data[2];

                    let x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
                    let y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
                    let z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;

                    this.data[0] = x;
                    this.data[1] = y;
                    this.data[2] = z;
                    this.space = ColorSpace.cie1931;
                }
                break;

            case ColorSpace.cielab:
                {
                    let L = this.data[0];
                    let a = this.data[1];
                    let b = this.data[2];
                    let xn = Constants.Xn; //95.0489;
                    let yn = Constants.Yn;//100;
                    let zn = Constants.Zn;//108.8840;
                    let delta = 6 / 29;
                    let delta2 = delta * delta;

                    let f = t => {
                        if (t > delta) {
                            return t * t * t;
                        } else {
                            return 3 * delta2 * (t - (4 / 29));
                        }
                    };

                    let x = xn * f((L + 16) / 116 + a / 500);
                    let y = yn * f((L + 16) / 116);
                    let z = zn * f((L + 16) / 116 - b / 200);

                    this.data[0] = x;
                    this.data[1] = y;
                    this.data[2] = z;
                    this.space = ColorSpace.cie1931;

                } break;

            case ColorSpace.oklab:
                {
                    let m1 = [
                        [1.22701385, -0.55779998, 0.28125615],
                        [-0.04058018, 1.11225687, -0.07167668],
                        [-0.07638128, -0.42148198, 1.58616322],];

                    let m2 = [
                        [0.99192169, 0.39706067, 0.22623677],
                        [0.99192171, -0.10483846, -0.05342116],
                        [0.99192175, -0.0887613, -1.28105253],
                    ];

                    let L = this.data[0];
                    let a = this.data[1];
                    let b = this.data[2];

                    let l = m2[0][0] * L + m2[0][1] * a + m2[0][2] * b;
                    let m = m2[1][0] * L + m2[1][1] * a + m2[1][2] * b;
                    let s = m2[2][0] * L + m2[2][1] * a + m2[2][2] * b;

                    l = l ** 3;
                    m = m ** 3;
                    s = s ** 3;

                    let x = m1[0][0] * l + m1[0][1] * m + m1[0][2] * s;
                    let y = m1[1][0] * l + m1[1][1] * m + m1[1][2] * s;
                    let z = m1[2][0] * l + m1[2][1] * m + m1[2][2] * s;

                    this.data[0] = x;
                    this.data[1] = y;
                    this.data[2] = z;

                    this.space = ColorSpace.cie1931;
                } break;
        }
    }

    cieLab() {
        switch (this.space) {
            case ColorSpace.sRgb:
            case ColorSpace.linearRgb:
                {
                    this.cie1931();
                    this.cieLab();
                } break;

            case ColorSpace.cie1931:
                {
                    let x = this.data[0];
                    let y = this.data[1];
                    let z = this.data[2];

                    let xn = Constants.Xn;
                    let yn = Constants.Yn;
                    let zn = Constants.Zn;

                    let delta = 6 / 29;
                    let delta2 = delta * delta;
                    let delta3 = delta2 * delta;

                    let f = t => {
                        if (t > delta3) {
                            return Math.pow(t, 1 / 3);
                        } else {
                            return t / (3 * delta2) + 4 / 29;
                        }
                    };

                    let L = 116 * f(y / yn) - 16;
                    let a = 500 * (f(x / xn) - f(y / yn));
                    let b = 200 * (f(y / yn) - f(z / zn));

                    this.data[0] = L;
                    this.data[1] = a;
                    this.data[2] = b;
                    this.space = ColorSpace.cielab;
                } break;
        }
    }

    oklab() {
        switch (this.space) {
            case ColorSpace.sRgb:
            case ColorSpace.linearRgb:
            case ColorSpace.cielab:
                this.cie1931();
                this.oklab();
                break;

            case ColorSpace.cie1931:
                let M1 = [
                    [0.8189330101, 0.3618667424, -0.1288597137],
                    [0.0329845436, 0.9293118715, 0.0361456387],
                    [0.0482003018, 0.2643662691, 0.6338517070]
                ];

                let M2 = [
                    [0.2104542553, 0.7936177850, 0.0040720468],
                    [1.9779984951, -2.4285922050, 0.4505937099],
                    [0.0259040371, 0.7827717662, -0.8086757660],
                ];

                let x = this.data[0];
                let y = this.data[1];
                let z = this.data[2];

                let l = M1[0][0] * x + M1[0][1] * y + M1[0][2] * z;
                let m = M1[1][0] * x + M1[1][1] * y + M1[1][2] * z;
                let s = M1[2][0] * x + M1[2][1] * y + M1[2][2] * z;

                l = Math.pow(l, 1 / 3);
                m = Math.pow(m, 1 / 3);
                s = Math.pow(s, 1 / 3);

                let L = M2[0][0] * l + M2[0][1] * m + M2[0][2] * s;
                let a = M2[1][0] * l + M2[1][1] * m + M2[1][2] * s;
                let b = M2[2][0] * l + M2[2][1] * m + M2[2][2] * s;

                this.data[0] = L;
                this.data[1] = a;
                this.data[2] = b;
                this.space = ColorSpace.oklab;

                break;

            default:
                break;
        }
    }


    asLinearRgb() {
        let c = this.clone();
        c.linearRgb();
        return c;
    }

    asSrgb() {
        let c = this.clone();
        c.sRgb();
        return c;
    }

    asCie1931() {
        let c = this.clone();
        c.cie1931();
        return c;
    }

    asCieLab() {
        let c = this.clone();
        c.cieLab();
        return c;
    }

    asOkLab() {
        let c = this.clone();
        c.oklab();
        return c;
    }

    _sRgbToLinear() {
        for (let i = 0; i < 3; i++) {
            let c0 = 0.04045;
            let c1 = 12.92;
            let c2 = 0.055;
            let c3 = 1.055;


            let v = this.data[i]

            if (v <= c0) {
                v = v / c1;
            } else {
                v = Math.pow((v + c2) / c3, 2.4);
            }

            this.data[i] = v;
        }

        this.space = ColorSpace.linearRgb;
    }


    _linearToSrgb() {
        for (let i = 0; i < 3; i++) {
            let c0 = 0.0031308;
            let c1 = 12.92;
            let c2 = 0.055;
            let c3 = 1.055;

            let v = this.data[i];

            if (v <= c0) {
                v = v * c1;
            } else {
                v = c3 * Math.pow(v, 1 / 2.4) - c2;
            }

            this.data[i] = v;
        }

        this.space = ColorSpace.sRgb;
    }

    toString() {
        return `(${this.data[0]}, ${this.data[1]}, ${this.data[2]}; ${this.space})`;
    }

    static distanceEuclidean(c1, c2) {

        assert(c1.space == c2.space);

        return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
    }

    static distanceEuclideanWeighted(c1, c2) {

        assert(c1.space == c2.space);

        if (c1.space != ColorSpace.sRgb) {
            c1 = c1.asSrgb();
            c2 = c2.asSrgb();
        }

        let avr = (c1.r + c2.r) / 2;
        let dr = c1.r - c2.r;
        let dg = c1.g - c2.g;
        let db = c1.b - c2.b;

        return Math.sqrt((2 + avr) * dr * dr + r * dg * dg + (2 + 1 - avr) * db * db);
    }

    static distanceCie76(c1, c2) {

        c1 = c1.asCieLab();
        c2 = c2.asCieLab();

        return Color.distanceEuclidean(c1, c2);
    }

    static distanceCie94(c1, c2) {
        c1 = c1.asCieLab();
        c2 = c2.asCieLab();

        let dL = c1.L - c2.L;
        let C1 = Math.sqrt(c1.a ** 2 + c1.b ** 2);
        let C2 = Math.sqrt(c2.a ** 2 + c2.b ** 2);
        let dC = C1 - C2;
        let da = c1.a - c2.a;
        let db = c1.b - c2.b;
        let dH = Math.sqrt(da ** 2 + db ** 2 - dC ** 2);
        let SL = 1;
        let K1 = 0.045;
        let K2 = 0.015;
        let kL = 1;
        let kC = 1;
        let kH = 1;
        let SC = 1 + K1 * C1;
        let SH = 1 + K2 * C1;

        let dE = Math.sqrt(
            (dL / (kL * SL)) ** 2 +
            (dC / (kC * SC)) ** 2 +
            (dH / (kH * SH)) ** 2
        );

        return dE;
    }

    static distanceOkLab(c1, c2) {
        // https://github.com/svgeesus/svgeesus.github.io/blob/master/Color/OKLab-notes.md 
        c1 = c1.asOkLab();
        c2 = c2.asOkLab();
        
        let dL = c1.L - c2.L;
        let C1 = Math.sqrt(c1.a ** 2 + c1.b ** 2);
        let C2 = Math.sqrt(c2.a ** 2 + c2.b ** 2);
        let dC = C1 - C2;
        let da = c1.a - c2.a;
        let db = c1.b - c2.b;
        let dH = Math.sqrt(da ** 2 + db ** 2 - dC ** 2);

        let dE = Math.sqrt(dL**2 + dC**2 + dH**2);

        return dE;
    }
}


