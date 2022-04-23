
// Constants
const color_input_01_id = "color-input-01";
const color_input_02_id = "color-input-02";
const gamma_checkbox_id = "gamma-checkbox";
const use_lab_checkbox_id = "lab-checkbox";
const canvas_id = "canvas";
const width = 400;
const height = 50;

// Global variables
let canvas = null;
let ctx = null;

// State
const state = {
    color_01: { r: 1, g: 0, b: 0 },
    color_02: { r: 0, g: 0, b: 1 },
    correct_gamma: false,
    use_lab: false,
};

function draw_gradient() {
    let image_data = ctx.createImageData(width, height);
    let data = image_data.data;

    for (let i = 0; i < width; i++)
    {
        let t = i / width;
        let color;

        if (state.use_lab) {
            color = Lab_to_rgb(
                colorInterpolate(
                    rgb_to_Lab(state.color_01),
                    rgb_to_Lab(state.color_02),
                    t
                )
            );
        } else {
            color = colorInterpolate(state.color_01, state.color_02, t);
        }

        // let color = XYZ_to_rgb(colorInterpolate(
        // rgb_to_XYZ(state.color_01), 
        // rgb_to_XYZ(state.color_02), 
        // t));
        //

        if (state.correct_gamma)
        {
            color = linar_to_srgb(color);
        }


        for (let j = 0; j < height; j++)
        {
            data[(j * width + i) * 4] = color.r * 255;
            data[(j * width + i) * 4 + 1] = color.g * 255;
            data[(j * width + i) * 4 + 2] = color.b * 255;
            data[(j * width + i) * 4 + 3] = 255;
        }
    }

    ctx.putImageData(image_data, 0, 0);
}

function color_diff(a, b) {
    var dr = Math.abs(a.r - b.r);
    var dg = Math.abs(a.g - b.g);
    var db = Math.abs(a.b - b.b);

    return { r: Math.min(Math.max(dr+dg+db, 0), 1)}
}

function colorInterpolate(start, end, t) {
    
    var r = start.r * (1 - t) + end.r * t;
    var g = start.g * (1 - t) + end.g * t;
    var b = start.b * (1 - t) + end.b * t;

    return { r, g, b};
}

function rgb_to_Lab(c) {
    return XYZ_to_Lab(rgb_to_XYZ(c));
}

function Lab_to_rgb(c) {
    return XYZ_to_rgb(Lab_to_XYZ(c));
}

function XYZ_to_Lab(c) {
    let xn = 95.0489;
    let yn = 100;
    let zn = 108.8840;

    const f = (t) => {
        let delta = 6/29;
        let delta3 = delta * delta * delta;

        if (t > delta3) {
            return Math.pow(t, 1/3);
        } else {
            return t/(3*delta*delta) + 4/29;
        }
    }

    let X = c.r;
    let Y = c.g;
    let Z = c.b;
    
    let L = 116 * f(Y/yn) - 16;
    let a = 500 * (f(X/xn) - f(Y/yn)); 
    let b = 200 * (f(Y/yn) - f(Z/zn));

    return { r: L, g: a, b: b, space: "Lab"};
}

function Lab_to_XYZ(c) {
    let xn = 95.0489;
    let yn = 100;
    let zn = 108.8840;

    const f = (t) => {
        let delta = 6/29;

        if (t > delta) {
            return t*t*t;
        } else {
            return 3*delta*delta*(t - 4/29);
        }
    }

    let L = c.r;
    let a = c.g;
    let b = c.b;
    
    let X = xn * f((L+16)/116 + a/500);
    let Y = yn * f((L+16)/116);
    let Z = zn * f((L+16)/116 - b/200);

    return { r: X, g: Y, b: Z, space: "XYZ"};
}

function rgb_to_XYZ(c) {
    
    var X = 0.4124 * c.r + 0.3576 * c.g + 0.1805 * c.b;
    var Y = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
    var Z = 0.0193 * c.r + 0.1192 * c.g + 0.9505 * c.b;

    return { 
        r: X,
        g: Y,
        b: Z,
        space: "XYZ"
    };
}

function XYZ_to_rgb(c) {
    let r = c.r *  3.2406 + c.g * -1.5372 + c.b * -0.4986
    let g = c.r * -0.9689 + c.g *  1.8758 + c.b *  0.0415
    let b = c.r *  0.0557 + c.g * -0.2040 + c.b *  1.0570

    return {
        r, g, b, space: "RGB"
    }
}


function linar_to_srgb(color) {
    
    let gamma = 1 / 2.4;
    let f = 0.055;
    let s = 12.92;
    let t = 0.0031308;

    let rr, gg, bb;
    
    rr = color.r <= t ? s * color.r : 1.055 * Math.pow(color.r, gamma) - f;
    gg = color.g <= t ? s * color.g : 1.055 * Math.pow(color.g, gamma) - f;
    bb = color.b <= t ? s * color.b : 1.055 * Math.pow(color.b, gamma) - f;

    return { r: rr, g: gg, b: bb };
}

function colorPow(color, value) {
    return {
        r: Math.pow(color.r, value),
        g: Math.pow(color.g, value),
        b: Math.pow(color.b, value),
    };
}

function colorFromHex(str) {
    
    const r = parseInt(str.substr(1,2), 16) / 255;
    const g = parseInt(str.substr(3,2), 16) / 255;
    const b = parseInt(str.substr(5,2), 16) / 255;

    return { r, g, b};
}

function toHex(num) {
    let s = Math.trunc(num).toString(16);

    if (s.length == 1) {
        s = "0" + s;
    }

    return s;
}

function colorToHex(color) {

    const r = toHex(color.r * 255);
    const g = toHex(color.g * 255);
    const b = toHex(color.b * 255);
    
    return `#${r}${g}${b}`;
}

function main() {
    console.log("main");
    
    let color_input_01 = document.getElementById(color_input_01_id);
    let color_input_02 = document.getElementById(color_input_02_id);
    let gamma_checkbox = document.getElementById(gamma_checkbox_id);
    let use_lab_checkbox = document.getElementById(use_lab_checkbox_id);
    
    canvas = document.getElementById(canvas_id);
    canvas.width = width;
    canvas.height = height;
    
    ctx = canvas.getContext("2d", { 
        colorSpace: "srgb"
        // colorSpace: "display-p3"
    });

    color_input_01.value = colorToHex(state.color_01);
    color_input_02.value = colorToHex(state.color_02);
    gamma_checkbox.checked = state.correct_gamma;
    use_lab_checkbox.checked = state.use_lab;

    color_input_01.addEventListener("change", e => {
        state.color_01 = colorFromHex(e.target.value);
        draw_gradient();
    });

    color_input_02.addEventListener("change", e => {
        state.color_02 = colorFromHex(e.target.value);
        draw_gradient();
    });

    gamma_checkbox.addEventListener("change", e => {
        state.correct_gamma = e.target.checked;
        draw_gradient();
    });


    use_lab_checkbox.addEventListener("change", e => {
        state.use_lab = e.target.checked;
        draw_gradient();
    });

    
    draw_gradient();
}


main();

