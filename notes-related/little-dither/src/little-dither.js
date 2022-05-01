import { assert } from "./common.js";
import { Color } from "./color.js";
import { Cvs } from "./cvs.js";

export class LittleDither {
    constructor(image, canvas) {
        this.image = image;
        this.canvas = canvas;
        this.cvs = new Cvs(this.canvas);
    }

    threshold(t = 0.5, gamma = false) {
        this.cvs.image(this.image);
        this.cvs.shader((_, __, c) => {
            
            if (gamma) {
                c.linearRgb();
            }
            
            let val = c.r;

            if (val > t) {
                return new Color(1, 1, 1);
            } else {
                return new Color(0, 0, 0);
            }
        });
    }

    localAverageThreshold(bias = 0, size = 2, factor = 0.01, gamma = false) {
        this.cvs.image(this.image);
        let im = new ImageData(this.cvs.width, this.cvs.height);

        if ((size % 2) != 0) {
            size += 1;
        }

        this.cvs.pixel(ctx => {
            for (let x = 0; x < this.cvs.width; x++) {
                for (let y = 0; y < this.cvs.height; y++) {
                    let av = 0;
                    let count = 0;
                    for (let i = -size / 2; i < (size / 2) + 1; i++) {
                        for (let j = -size / 2; j < (size / 2) + 1; j++) {
                            let xx = (x + i) % this.cvs.width;
                            let yy = (y + j) % this.cvs.width;
                            let cc = ctx.getPixel(xx, yy);
                            if (gamma) cc.linearRgb();
                            count += 1;
                            av += cc.r;
                        }
                    }
                    av/=count;

                    let c = ctx.getPixel(x, y);
                    if (gamma) c.linearRgb();
                    let v = c.r;

                    // let b = av;
                    let b = factor + (1 - 2*factor) * av;

                    if (v + bias > b) {
                        Cvs.SetImageDataPixel(im, x, y, new Color(1, 1, 1));
                    } else {
                        Cvs.SetImageDataPixel(im, x, y, new Color(0, 0, 0));
                    }
                }
            }
        });
        this.cvs.putData(im);
    }
}
