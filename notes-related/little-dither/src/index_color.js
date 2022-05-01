import { el, mount, addChildren } from "./d.js";
import { Color, ColorSpace } from "./color.js";
import { Cvs } from "./cvs.js";


window["Color"] = Color;
window["ColorSpace"] = ColorSpace;


class sRgbColorPicler {
    constructor(color) {
        this.color = color || new Color(1, 0, 0);

        this.state = {
            sliderMax: 255,
            r: this.color.r255,
            g: this.color.g255,
            b: this.color.b255,
        }

        console.log("PICKER", this.state, this.color);

        this.el = el("div", [
            el("div", [
                el("label", "R: ", { for: "input-r" }),
                this.slider01 = el("input.inpur-r", { type: "range", max: this.state.sliderMax, style: { width: "120px" } }),
                this.label01 = el("span", "23"),
            ]),
            el("div", [
                el("label", "G: ", { for: "input-r" }),
                this.slider02 = el("input.inpur-g", { type: "range", max: this.state.sliderMax, style: { width: "120px" } }),
                this.label02 = el("span", "23"),
            ]),
            el("div", [
                el("label", "B: ", { for: "input-r" }),
                this.slider03 = el("input.inpur-b", { type: "range", max: this.state.sliderMax, style: { width: "120px" } }),
                this.label03 = el("span", "23"),
            ]),
            this.colorPreview = el("div", { style: { width: "120px", height: "80px" } }),
        ])

        this.slider01.value = this.state.r;
        this.slider02.value = this.state.g;
        this.slider03.value = this.state.b;

        this.slider01.oninput = e => this.setColor(e.target.value, 0);
        this.slider02.oninput = e => this.setColor(e.target.value, 1);
        this.slider03.oninput = e => this.setColor(e.target.value, 2);

        this.update();
    }

    setColor(value, axis) {
        this.color.data[axis] = value / 255;

        switch (axis) {
            case 0:
                this.state.r = value;
                break;

            case 1:
                this.state.g = value;
                break;

            case 2:
                this.state.b = value;
                break;
        }

        this.update();
    }

    update() {
        this.label01.textContent = `${this.state.r}`;
        this.label02.textContent = `${this.state.g}`;
        this.label03.textContent = `${this.state.b}`;

        let c = this.color;
        this.colorPreview.style.backgroundColor = `rgb(${c.r255}, ${c.g255}, ${c.b255})`;

        if (this.onUpdate) {
            this.onUpdate(this.color.clone());
        }
    }

    getColor() {
        return this.color.clone();
    }
}

class ColorSection {
    constructor() {
        this.state = {
            r: 0,
            g: 0,
            b: 0,
        }

        this.color = new Color();

        this.el = el("div",
            [
                el("div", [
                    el("label", "R ", { for: "input-r" }),
                    this.ri = el("input.input-r", { type: "number", value: this.state.r, min: 0, max: 255 })
                ]),
                el("div", [
                    el("label", "G ", { for: "input-g" }),
                    this.gi = el("input.input-g", { type: "number", value: this.state.g, min: 0, max: 255 })
                ]),
                el("div", [
                    el("label", "B ", { for: "input-b" }),
                    this.bi = el("input.input-b", { type: "number", value: this.state.b, min: 0, max: 255 })
                ]),

                this.output1 = el("p", ""),
                this.output2 = el("p", ""),
                this.output3 = el("p", ""),
                this.output4 = el("p", ""),
                this.output5 = el("p", ""),
            ]);

        this.ri.oninput = e => { this.state.r = parseInt(e.target.value); this.update(); }
        this.gi.oninput = e => { this.state.g = parseInt(e.target.value); this.update(); }
        this.bi.oninput = e => { this.state.b = parseInt(e.target.value); this.update(); }

        this.update();
    }

    update() {
        console.log(this.state);

        this.color.r255 = this.state.r;
        this.color.g255 = this.state.g;
        this.color.b255 = this.state.b;

        this.output1.textContent = `${this.color.toString()}`;
        this.output2.textContent = `${this.color.asLinearRgb().toString()}`;
        this.output3.textContent = `${this.color.asCie1931().toString()}`;
        this.output4.textContent = `${this.color.asCieLab().toString()}`;
        this.output5.textContent = `${this.color.asOkLab().toString()}`;
    }
}

class ColorSlider {
    constructor() {

        this.state = {
            space: ColorSpace.cie1931,
            color: new Color(0, 0, 0, ColorSpace.cie1931),
            sliderMax: 200,
        };

        this.ranges = {
            [ColorSpace.cie1931]:
                [
                    [0, 1],
                    [0, 1],
                    [0, 1],
                ],
            [ColorSpace.linearRgb]:
                [
                    [0, 1],
                    [0, 1],
                    [0, 1]
                ],
            [ColorSpace.sRgb]:
                [
                    [0, 1],
                    [0, 1],
                    [0, 1]
                ],
            [ColorSpace.cielab]:
                [
                    [0, 10],
                    [-14, 4],
                    [-14, 4],
                ],
            [ColorSpace.oklab]:
                [
                    [0, 1.1],
                    [-0.1, 0.3],
                    [-0.1, 0.3],
                ]
        };

        this.el = el("div",
            [
                el("div",
                    this.sel = el("select", Object.keys(ColorSpace).map(k => el("option", ColorSpace[k])))
                ),
                el("div", [
                    el("div", [
                        this.slider01 = el("input", { type: "range", max: this.state.sliderMax, style: { width: "120px" } }),
                        this.canvas01 = el("canvas", { width: 120, height: 40, style: { display: "block" } }),
                    ]),
                    el("div", [
                        this.slider02 = el("input", { type: "range", max: this.state.sliderMax }),
                        this.canvas02 = el("canvas", { width: 120, height: 40, style: { display: "block" } }),
                    ]),
                    el("div", [
                        this.slider03 = el("input", { type: "range", max: this.state.sliderMax }),
                        this.canvas03 = el("canvas", { width: 120, height: 40, style: { display: "block" } }),
                    ]),
                ]),
                el("div", [
                    this.output = el("p", ""),
                    this.outputsRgb = el("p", "")
                ]),
                this.colorPreview = el("div", { style: { width: "200px", height: "80px", backgroundColor: "black" } })
            ]);

        this.sel.value = this.state.space;
        this.sel.oninput = e => this.selectHandler(e);
        this.slider01.oninput = e => this.setColorAxisValue(0, e.target.value);
        this.slider02.oninput = e => this.setColorAxisValue(1, e.target.value);
        this.slider03.oninput = e => this.setColorAxisValue(2, e.target.value);

        this.ctx01 = this.canvas01.getContext("2d");
        this.ctx02 = this.canvas02.getContext("2d");
        this.ctx03 = this.canvas03.getContext("2d");

        this.update();
    }

    sliderHandler01(e) {
        this.setColorAxisValue(0, e.target.value);
    }

    setColorAxisValue(axis, sliderValue) {
        let range = this.ranges[this.state.space];
        let min = range[axis][0];
        let max = range[axis][1];
        let value = min + (sliderValue) * (max - min) / this.state.sliderMax;

        this.state.color.data[axis] = value;

        this.update();
    }

    selectHandler(e) {
        this.state.space = e.target.value;
        this.state.color.space = this.state.space;
        this.update();
    }

    isColorValid(srgb) {
        if (
            srgb.r255 < 0 || srgb.r255 > 255 ||
            srgb.g255 < 0 || srgb.g255 > 255 ||
            srgb.b255 < 0 || srgb.b255 > 255
        ) {
            return false;
        }
        return true;

    }

    updateCanvas(canvas, ctx, axis) {
        let w = canvas.width;
        let range = this.ranges[this.state.space];
        let min = range[axis][0];
        let max = range[axis][1];
        let im = new ImageData(canvas.width, canvas.height);
        for (let x = 0; x < canvas.width; x++) {
            let t = x / w;
            let value = min + t * (max - min);
            let c = this.state.color.clone();
            c.data[axis] = value;
            c.sRgb();
            let r, g, b;

            if (this.isColorValid(c)) {
                r = c.r255;
                g = c.g255;
                b = c.b255;
            } else {
                r = 255;
                g = 255;
                b = 255;
            }

            for (let y = 0; y < canvas.height; y++) {
                im.data[4 * (w * y + x)] = r;
                im.data[4 * (w * y + x) + 1] = g;
                im.data[4 * (w * y + x) + 2] = b;
                im.data[4 * (w * y + x) + 3] = 255;
            }
        }
        ctx.putImageData(im, 0, 0);
    }

    update() {
        let srgb = this.state.color.asSrgb();
        this.output.textContent = `${this.state.color.toString()}`;
        // this.outputsRgb.textContent = `${srgb.toString()}`;
        this.outputsRgb.textContent = `rgb(${srgb.r255}, ${srgb.g255}, ${srgb.b255})`;

        if (
            srgb.r255 < 0 || srgb.r255 > 255 ||
            srgb.g255 < 0 || srgb.g255 > 255 ||
            srgb.b255 < 0 || srgb.b255 > 255
        ) {
            this.colorPreview.style.backgroundColor = `rgba(0, 0, 0, 0)`;
        } else {
            this.colorPreview.style.backgroundColor = `rgb(${srgb.r255}, ${srgb.g255}, ${srgb.b255})`;
        }

        this.updateCanvas(this.canvas01, this.ctx01, 0);
        this.updateCanvas(this.canvas02, this.ctx02, 1);
        this.updateCanvas(this.canvas03, this.ctx03, 2);

        console.log(this.colorPreview.style.backgroundColor);
    }
}

class GradientSection {
    constructor() {

        this.canvass = {
            [ColorSpace.sRgb]: null,
            [ColorSpace.linearRgb]: null,
            [ColorSpace.cie1931]: null,
            [ColorSpace.cielab]: null,
            [ColorSpace.oklab]: null,
        };

        this.contexts = {
            [ColorSpace.sRgb]: null,
            [ColorSpace.linearRgb]: null,
            [ColorSpace.cie1931]: null,
            [ColorSpace.cielab]: null,
            [ColorSpace.oklab]: null,
        };

        this.cvss = {
            [ColorSpace.sRgb]: null,
            [ColorSpace.linearRgb]: null,
            [ColorSpace.cie1931]: null,
            [ColorSpace.cielab]: null,
            [ColorSpace.oklab]: null,
        };

        this.comparisonCanvas = null;

        this.el = el("div", [
            el("div", [
                el("p", "sRGB"),
                this.canvass[ColorSpace.sRgb] = el("canvas", { width: 400, height: 80 }),
                // this.divs[ColorSpace.sRgb] = el("div", { style: { width: "400px", height: "12px", backgroundColor: "black", marginTop: "-8px" } })
            ]),
            el("div", [
                el("p", "Linear RGB"),
                this.canvass[ColorSpace.linearRgb] = el("canvas", { width: 400, height: 80 }),
                // this.divs[ColorSpace.linearRgb] = el("div", { style: { width: "400px", height: "12px", backgroundColor: "black", marginTop: "-8px" } })
            ]),
            el("div", [
                el("p", "CIE 1931 XYZ"),
                this.canvass[ColorSpace.cie1931] = el("canvas", { width: 400, height: 80 }),
                // this.divs[ColorSpace.cie1931] = el("div", { style: { width: "400px", height: "12px", backgroundColor: "black", marginTop: "-8px" } })
            ]),
            el("div", [
                el("p", "CIE Lab"),
                this.canvass[ColorSpace.cielab] = el("canvas", { width: 400, height: 80 }),
                // this.divs[ColorSpace.cielab] = el("div", { style: { width: "400px", height: "12px", backgroundColor: "black", marginTop: "-8px" } })
            ]),
            el("div", [
                el("p", "OKLab"),
                this.canvass[ColorSpace.oklab] = el("canvas", { width: 400, height: 80 }),
                // this.divs[ColorSpace.oklab] = el("div", { style: { width: "400px", height: "12px", backgroundColor: "black", marginTop: "-8px" } })
            ]),

            el("div", [
                el("p", "Comparison"),
                this.comparisonCanvas = el("canvas", { width: 400, height: 80 }),
                // this.divs[ColorSpace.oklab] = el("div", { style: { width: "400px", height: "12px", backgroundColor: "black", marginTop: "-8px" } })
            ]),


            el("div", [
                this.left = new sRgbColorPicler(new Color(1, 0, 0)),
            ], { style: { width: "200px", float: "left", } }),
            el("div", [
                this.right = new sRgbColorPicler(new Color(0, 1, 0)),
            ], { style: { marginLeft: "240px" } })
        ]);

        this.left.onUpdate = c => this.onLeftHandler(c);
        this.right.onUpdate = c => this.onRightHandler(c);

        Object.keys(this.canvass).forEach(k => {
            this.contexts[k] = this.canvass[k].getContext("2d");
            this.cvss[k] = new Cvs(this.canvass[k]);
            // this.cvss[k].run((cvs, dt) => this.frame(k, cvs, dt));
        });

        this.leftColor = this.left.getColor();
        this.rightColor = this.right.getColor();

        this.update();
    }

    isMouseOverAnyCanvas() {
        return Object.keys(this.cvss).map(k => {
            if (this.cvss[k] == null) return false;
            return this.cvss[k].mouseInside;
        }).some(v => v);
    }

    drawGradient(space) {
        let cvs = this.cvss[space];
        let left = this.leftColor.clone();
        left.convert(space);
        let right = this.rightColor.clone();
        right.convert(space);

        cvs.horizontalGradient(left, right);
    }

    update() {
        Object.keys(this.contexts).forEach(k => this.drawGradient(k));
    }

    onLeftHandler(c) {
        this.leftColor = c;
        this.update();
    }

    onRightHandler(c) {
        this.rightColor = c;
        this.update();
    }
}

class DiffSection {
    constructor() {

        const src_01 = "/image.jpg";
        const src_02 = "/image_low.jpg";

        this.el = el("div", [
            el("div", [
                this.img01 = el("img", { src: src_01, style: { maxWidth: "none" } }),
            ]),
            el("div", [
                this.img02 = el("img", { src: src_02, style: { maxWidth: "none" } }),
            ]),
            el("div", [
                this.canvas = el("canvas"),
            ]),
        ]);


        this.cvs = new Cvs(this.canvas);
        let c = 0;
        this.img01.onload = this.img02.onload = () => {
            c += 1;
            this.onImageLoaded(c);
        };
    }

    diff() {
        this.cvs.image(this.img01);
        let d1 = this.cvs.getData();
        this.cvs.image(this.img02);
        let d2 = this.cvs.getData();

        const getColor=(data, x, y) => {
            let i = 4 * (y * this.cvs.width + x);
            let r = data[i];
            let g = data[i+1];
            let b = data[i+2];

            let c = new Color();
            c.r255 = r;
            c.g255 = g;
            c.b255 = b;

            return c;
        }

        this.cvs.pixel(ctx => {
            let maxDiff = 0;
            // let distFunc = Color.distanceCie76;
            // let distFunc = Color.distanceCie94;
            let distFunc = Color.distanceOkLab;
            for (let x = 0; x < this.cvs.width; x++) {
                for (let y = 0; y < this.cvs.height; y++) {
                    let c1 = getColor(d1, x, y);
                    let c2 = getColor(d2, x, y);
                    let diff = distFunc(c1, c2);
                    if (diff > maxDiff) maxDiff = diff;
                    // let c = new Color(5*diff, 0, 0);
                }
            }
            
            for (let x = 0; x < this.cvs.width; x++) {
                for (let y = 0; y < this.cvs.height; y++) {
                    let c1 = getColor(d1, x, y);
                    let c2 = getColor(d2, x, y);
                    let diff = distFunc(c1, c2)/maxDiff;
                    let c = new Color(diff, diff, diff);
                    // let c = new Color(5*diff, 0, 0);
                    ctx.setPixel(x, y, c);
                }
            }
        });
    }

    onImageLoaded(n) {
        console.log("onImageLoaded", n);
        if (n == 2) {
            this.diff();
            // console.log("image!");
            // this.cvs.image(this.img01);
        }
    }
}

class App {
    constructor() {
        this.el = el("div",
            [
                el("h1", "App"),
                el("h2", "Colors"),
                new ColorSection(),
                new ColorSlider(),
                el("h2", "Gradient"),
                new GradientSection(),
                el("h2", "Difference"),
                new DiffSection(),
            ], { style: { marginBottom: "20px" } }
        );
    }
}

mount(new App());
