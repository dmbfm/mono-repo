import { el, mount } from "./d.js";
import { LittleDither } from "./little-dither.js";

const bwImageUrl = "data/bw01.jpg";

const style = {
    App: {
        marginBottom: "80px"
    }
}

class LocalAverageThreshold {
    constructor() {
        this.state = {
            threshold: 50,
            avgSize: 2,
            gamma: true,
            factor: 0,
        };

        this.el = el("div", [
            this.canvas = el("canvas"),
            el("div", [
                el("label", "Bias", { for: "bias-range" }),
                this.sel = el("input.bias-range", { type: "range", value: this.state.threshold }),
                this.label = el("span", ""),
            ]),
            el("div", [
                el("label", "Contrast Factor", { for: "lat-factor-range" }),
                this.factorRange = el("input.lat-factor-range", { type: "range", value: this.state.factor }),
                this.factorlabel = el("span", ""),
            ]),

            el("div", [
                el("label", "Average Size"),
                this.sizeInput = el("input", { type: "number", value: this.state.avgSize, max: 10, step: 2 }),
            ]),
            el("div", [
                el("label", "Gamma Correction", { for: "lat-gamma-ch" }),
                this.cb = el("input.lat-gamma-ch", { type: "checkbox", checked: this.state.gamma }),
            ]),
        ]);

        
        this.factorRange.oninput = e => this.onRangeFactorInput(e);
        this.factorRange.onchange = () => this.update();

        this.image = new Image();
        this.image.onload = () => this.onImageLoaded();
        this.image.src = bwImageUrl;

        this.dither = new LittleDither(this.image, this.canvas);

        this.sel.onchange = (e) => this.onRangeChange(e);
        this.sel.oninput = (e) => this.onRangeInput(e);
        this.sizeInput.onchange = e => this.onSizeInputChange(parseInt(e.target.value));

        this.cb.onchange = (e) => this.onCheckboxChange(e);

        this.updateLabel();
    }

    onSizeInputChange(v) {
        this.state.avgSize = v;
        this.update();
    }

    calcBias() {
        return (this.state.threshold - 50) / 10000;
    }

    calcFactor() {
        return this.state.factor/ 1000;
    }

    onRangeFactorInput(e) {
        this.state.factor = e.target.value;
        this.updateLabel();
    }

    onCheckboxChange(e) {
        this.state.gamma = e.target.checked;
        this.update();
    }

    onRangeChange() {
        this.update();
    }

    onRangeInput(e) {
        this.state.threshold = e.target.value;
        this.updateLabel();
    }

    onImageLoaded() {
        this.update();
    }

    updateLabel() {
        this.label.textContent = `${this.calcBias()}`;
        this.factorlabel.textContent = `${this.calcFactor()}`;
    }

    update() {
        this.dither.localAverageThreshold(this.calcBias(), this.state.avgSize, this.calcFactor(), this.state.gamma);
        // this.dither.localAverageThreshold(this.state.threshold / 100);
        this.updateLabel();
    }


}
class ThresholdDithering {
    constructor() {
        this.state = {
            threshold: 50,
            gamma: true,
        };

        this.el = el("div", [
            this.canvas = el("canvas"),
            el("label", "Threshold Level", { for: "th-range" }),
            this.sel = el("input.th-range", { type: "range", value: this.state.threshold }),
            this.label = el("span", ""),
            el("div", [
                el("label", "Gamma Correction", { for: "gamma-ch" }),
                this.cb = el("input.gamma-ch", { type: "checkbox", checked: this.state.gamma }),
            ]),
        ]);

        this.image = new Image();
        this.image.onload = () => this.onImageLoaded();
        this.image.src = bwImageUrl;

        this.dither = new LittleDither(this.image, this.canvas);

        this.sel.onchange = (e) => this.onRangeChange(e);
        this.sel.oninput = (e) => this.onRangeInput(e);

        this.cb.onchange = (e) => this.onCheckboxChange(e);

        this.updateLabel();
    }

    onCheckboxChange(e) {
        this.state.gamma = e.target.checked;
        this.update();
    }

    onRangeChange() {
        this.update();
    }

    onRangeInput(e) {
        this.state.threshold = e.target.value;
        this.updateLabel();
    }

    onImageLoaded() {
        this.update();
    }

    updateLabel() {
        this.label.textContent = `${this.state.threshold}`;
    }

    update() {
        this.dither.threshold(this.state.threshold / 100, this.state.gamma);
        // this.dither.localAverageThreshold(this.state.threshold / 100);
        this.updateLabel();
    }


}

const App = el("div", [
    el("h1", "Dithering"),
    el("h2", "Grayscale Dithering"),
    el("img", { src: bwImageUrl }),
    el("p", "Original image"),
    el("h3", "Threshold Dithering"),
    new ThresholdDithering(),
    el("h3", "Local Average Threshold"),
    new LocalAverageThreshold(),
], { style: style.App });

mount(App);

