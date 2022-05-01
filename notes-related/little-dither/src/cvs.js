import { V2 } from "./vector.js";
import { Color, ColorSpace } from "./color.js";

export class Cvs {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.mouse = new V2();
        this.mouseInside = false;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        window.addEventListener("mousemove", e => { this._mouseMoveHandler(e); });
    }

    _mouseMoveHandler(e) {
        let rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.x;
        this.mouse.y = e.clientY - rect.y;

        if (this.mouse.x >= 0 && this.mouse.x < this.width &&
            this.mouse.y >= 0 && this.mouse.y < this.height) {
            this.mouseInside = true;
        } else {
            this.mouseInside = false;
        }
    }


    clear(c) {
        this.ctx.save();
        this.ctx.fillStyle = c.getCssString();
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    image(img) {
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        this.canvas.width = w;
        this.canvas.height = h;
        this.width = w;
        this.height = h;

        this.ctx.drawImage(img, 0, 0);
    }

    getData() {
        return this.ctx.getImageData(0, 0, this.width, this.height).data;
    }

    putData(data) {
        if (data instanceof ImageData) {
            this.ctx.putImageData(data, 0, 0);
        } else {
            this.ctx.putImageData(new ImageData(data, this.width, this.height));
        }
    }

    imageDataContext(im) {
        // return {
        const setPixel = (x, y, c) => {
            x = Math.floor(x);
            y = Math.floor(y);

            let cc = c.asSrgb();
            let r = cc.r255;
            let g = cc.g255;
            let b = cc.b255;

            im.data[4 * (y * this.width + x)] = r;
            im.data[4 * (y * this.width + x) + 1] = g;
            im.data[4 * (y * this.width + x) + 2] = b;
            im.data[4 * (y * this.width + x) + 3] = 255;
        };

        const getPixel = (x, y) => {
            x = Math.floor(x);
            y = Math.floor(y);

            let i = 4 * (y * this.width + x);

            let r = im.data[i];
            let g = im.data[i + 1];
            let b = im.data[i + 2];

            let c = new Color();
            c.r255 = r;
            c.g255 = g;
            c.b255 = b;

            return c;
        };

        const hline = (x, c) => {
            for (let y = 0; y < this.height; y++) {
                setPixel(x, y, c);
            }
        }

        return { setPixel, getPixel, hline };
    }

    pixel(fn) {
        let im = this.ctx.getImageData(0, 0, this.width, this.height);
        fn(this.imageDataContext(im));
        this.ctx.putImageData(im, 0, 0);
    }

    shader(fn) {
        this.pixel(ctx => {
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    ctx.setPixel(x, y, fn(x, y, ctx.getPixel(x, y)));
                }
            }
        });
    }

    horizontalGradient(left, right) {
        this.pixel(ctx => {
            for (let x = 0; x < this.width; x++) {
                let t = x / this.width;
                let c = left.lerp(right, t);
                c.sRgb();
                for (let y = 0; y < this.height; y++) {
                    ctx.setPixel(x, y, c);
                }
            }
        });
    }

    _frame(dt, fn) {
        fn(this, dt);
        requestAnimationFrame(dt => { this._frame(dt, fn); });
    }

    run(fn) {
        this._frame(0, fn);
    }

    static SetImageDataPixel(im, x, y, c) {
        let i = 4 * (y * im.width + x);

        let cc = c.asSrgb();
        im.data[i] = cc.r255;
        im.data[i + 1] = cc.g255;
        im.data[i + 2] = cc.b255;
        im.data[i + 3] = 255;
    }

    static GetImageDataPixel(im, x, y) {
        let i = 4 * (y * im.width + x);

        let r = im.data[i];
        let g = im.data[i];
        let b = im.data[i];

        return new Color(r / 255, g / 255, b / 255);
    }
}

export default { Cvs };
