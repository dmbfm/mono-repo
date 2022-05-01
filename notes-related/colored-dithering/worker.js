import { Color } from "./dumb-imgui.js";

let averageColorDistance = 0;
let averageColorDistanceR = 0;
let averageColorDistanceG = 0;
let averageColorDistanceB = 0;
let useAverageColorDistance = true;


const findClosesColorInPalette = (r, g, b, pal, excludeSelf = false) => {
    let current = -1;
    let result = null;
    for (let i = 0; i < pal.length; i++) {
        let rr = tbl[pal[i].r];
        let gg = tbl[pal[i].g];
        let bb = tbl[pal[i].b];

        let dist = Math.sqrt((r - rr)*(r - rr) + (g - gg) * (g - gg) + (b - bb) * (b - bb));

        if (excludeSelf) {
            if (dist < 0.001) {
                continue;
            }
        }

        if (current < 0 || dist < current) {
            result = pal[i];
            current = dist;
        }
    }

    return {
        color: result,
        distance: current,
    };
};

const colorDistance = (c1, c2) => Math.sqrt((c1.r - c2.r)**2 + (c1.g - c2.g)**2 + (c1.b - c2.b)**2);

const findTwoClosestColorsInPalette = (r, g, b, pal) => {
    let current = -1;
    let result = null;
    let d2 = -1;
    let c2 = null;
    for (let i = 0; i < pal.length; i++) {
        let rr = tbl[pal[i].r];
        let gg = tbl[pal[i].g];
        let bb = tbl[pal[i].b];

        let dist = Math.sqrt((r - rr)*(r - rr) + (g - gg) * (g - gg) + (b - bb) * (b - bb));

        if (current < 0 || dist < current) {
            c2 = result;
            result = pal[i];
            d2 = current;
            current = dist;
        }
    }

    if (c2 == null) {
        for (let i = 0; i < pal.length; i++) {
            let rr = tbl[pal[i].r];
            let gg = tbl[pal[i].g];
            let bb = tbl[pal[i].b];

            let dist = Math.sqrt((r - rr)*(r - rr) + (g - gg) * (g - gg) + (b - bb) * (b - bb));

            if (d2 < 0 || dist < d2) {
                if (pal[i] != result) {
                    d2 = dist;
                    c2 = pal[i];
                }
            }
        }
    }

    return {
        firstColor: result,
        secondColor: c2,
        firstDistance: current,
        secondDistance: d2,
    };
   
}

const threshold = (data, width, height, pal) => {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let i = 4 * (width * y + x);
            let r = data[i];
            let g = data[i+1];
            let b = data[i+2];

            r = tbl[r];
            g = tbl[g];
            b = tbl[b];

            let c = findClosesColorInPalette(r, g, b, pal).color;

            data[i] = c.r;
            data[i+1] = c.g;
            data[i+2] = c.b;
            data[i+3] = 255;
        } 
    }
};

const ordered_dither = (data, width, height, pal, m, size) => {
    // let m = [[0, 2/4], [3/4, 1/4]];

    for (let x = 0; x < width; x++) {
        console.log(`[worker][bayer2x2]: ${x}/${width-1}`);
        for (let y = 0; y < height; y++) {
            let i = 4 * (width * y + x);
            let r = data[i];
            let g = data[i+1];
            let b = data[i+2];

            r = tbl[r];
            g = tbl[g];
            b = tbl[b];

            let th = m[y % size][x % size];
            let c;

            if (useAverageColorDistance) {
                // averageColorDistance = 0.5/pal.length;
                // averageColorDistance = 0.25;
                // averageColorDistance = 0;
                th-=0.5;
                // averageColorDistance = 0.5;
                let rr = Math.trunc(255 * (r/255 + averageColorDistance * th));
                let gg = Math.trunc(255 * (g/255 + averageColorDistance * th));
                let bb = Math.trunc(255 * (b/255 + averageColorDistance * th));

                c = findClosesColorInPalette(rr, gg, bb, pal).color;
            } else {
                let { firstColor, secondColor, firstDistance, secondDistance } = findTwoClosestColorsInPalette(r, g, b, pal);
                let d = 0.1 * colorDistance({ r, g, b}, secondColor);
                th -= 0.5;
                let rr = Math.trunc(r + 255 * d * th);
                let gg = Math.trunc(g + 255 * d * th);
                let bb = Math.trunc(b + 255 * d * th);
                
                c = findClosesColorInPalette(rr, gg, bb, pal).color;
            }

            data[i] = c.r;
            data[i+1] = c.g;
            data[i+2] = c.b;
            data[i+3] = 255;
            
        } 
    }

};

const bayer2x2 = (data, width, height, pal) => {
    let m = [[0, 2/4], [3/4, 1/4]]
    ordered_dither(data, width, height, pal, m, 2);
}

const bayer4x4 = (data, width, height, pal) => {
    let m = [
        [0/16,     8/16,   2/16,   10/16],
        [12/16,  4/16,  14/16,  6/16],
        [3/16,  11/16,  1/16,   9/16],
        [15/16, 7/16,   13/16,  5/16],
    ];
    ordered_dither(data, width, height, pal, m, 4);
}

const bayer8x8 = (data, width, height, pal) => {
    let m = [
        [ 0, 32, 8, 40, 2, 34, 10, 42], 
        [48, 16, 56, 24, 50, 18, 58, 26],
        [12, 44, 4, 36, 14, 46, 6, 38], 
        [60, 28, 52, 20, 62, 30, 54, 22],
        [ 3, 35, 11, 43, 1, 33, 9, 41], 
        [51, 19, 59, 27, 49, 17, 57, 25],
        [15, 47, 7, 39, 13, 45, 5, 37],
        [63, 31, 55, 23, 61, 29, 53, 21],
    ]; 
    for (let i = 0; i < 8;i++) {
        for (let j =0 ; j < 8; j++) {
            m[i][j] /= 64;
        }
    }

    ordered_dither(data, width, height, pal, m, 8);
}

const filter = (data, width, height, pal) => {
    console.log(width, height);
    // bayer2x2(data, width, height, pal);
    // bayer4x4(data, width, height, pal);
    bayer8x8(data, width, height, pal);
}

let tbl = null;
function init_table() {
    if (tbl != null) return;

    tbl = [];

    for (let i = 0; i < 256; i++) {
        tbl[i] = Math.trunc(Math.pow(i/255, 2.4) * 255);
    }
}

const calc_average_distance = pal => {
    let n = pal.length;
    let d = 0;

    for (let i = 0; i < (n-1); i++) {
        let c1 = pal[i];
        let c2 = pal[i+1];

        let c1r = tbl[c1.r]/255;
        let c1g = tbl[c1.g]/255;
        let c1b = tbl[c1.b]/255;
        
        let c2r = tbl[c2.r]/255;
        let c2g = tbl[c2.g]/255;
        let c2b = tbl[c2.b]/255;

        d += Math.sqrt(
            (c1r - c2r) *
            (c1r - c2r) +
            (c1g - c2g) *
            (c1g - c2g) +
            (c1b - c2b) *
            (c1b - c2b)
        )/(n-1);
        
        averageColorDistanceR += Math.abs(c1r - c2r) / (n-1);
        averageColorDistanceG += Math.abs(c1g - c2g) / (n-1);
        averageColorDistanceB += Math.abs(c1b - c2b) / (n-1);
        //d +=  Math.sqrt((c1.r/255 - c2.r/255) *
        //    (c1.r/255 - c2.r/255) *
        //    (c1.g/255 - c2.g/255) *
        //    (c1.g/255 - c2.g/255) *
        //    (c1.b/255 - c2.b/255) *
        //    (c1.b/255 - c2.b/255)) / n;
    }

    return d;
};


onmessage = function(e) {
    console.log("message!", e);
    let arr = new Uint8ClampedArray(e.data.pixels);
    init_table();
    averageColorDistance = calc_average_distance(e.data.pal);
    console.log(averageColorDistance);
    filter(arr, e.data.width, e.data.height, e.data.pal);

    postMessage({
        bytes: arr.buffer
    }, [arr.buffer]);
}
