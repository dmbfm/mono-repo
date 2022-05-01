const Views = {
    Image: "Image",
    Threshold: "Threshold",
    RandomDither: "Randomized Dithering",
    OrderedBayer: "Ordered",
    RandomMatrixSelection: "Random Matrix Selection",
    SquaredCross: "Squared Cross",
    Diffusion: "Diffusion",
};

const DiffusionType = {
    Dumb: "Dumb",
    FloydSteinberg: "Floyd-Steinberg",
    JaJuNi: "JaJuNi",
    Atkinson: "Atkinson",
    Burkes: "Burkes",
    Sierra: "Sierra",
};

let state = {
    ctx: null,
    width: 0,
    height: 0,
    img: null,
    view: Views.Image,
    view_ui_container: null,
    use_linear_color_space: true,

    num_levels: 1,
    levels: [0, 255],
    
    threshold: {
        value: 50
    },

    [Views.RandomDither]: {
        bias: 0
    },

    [Views.OrderedBayer]: {
        size: 2,
        cluster: false,
        randomize: false,
    },

    [Views.Diffusion]: {
        type: DiffusionType.Dumb
    }
};

const build_select_from_object = (parent_el, label, obj, value, callback) => {
    let id = `select__${label}`;
    let html = `<label for="${id}">${label}</label>`;
    html += `<select id="${id}">`;

    Object.values(obj).forEach(v => {
        html += `<option value="${v}" ${v == value ? "selected" : "" }>${v}</option>`;
    });

    html += "</select>";

    let div = document.createElement("div");
    div.innerHTML = html;

    parent_el.appendChild(div);

    let sel = document.getElementById(id);
    sel.addEventListener("change", (e) => { callback(e.target.value); });
}

const create_levels = (n) => {
    let d = Math.trunc(256 / n);
    let levels = [];
    for (let i = 0; i <= n; i++) {
        levels[i] = i * d;
    }
    levels[levels.length - 1] -= 1;
    return levels;
}


const get_range = (number) => {
    let levels = state.levels;
    var d = levels[levels.length-1]+1;
    let k = -1;
    let  p = -1;
    for (let i = 0; i < levels.length; i+=1) {
        let current = levels[i];
        let distance = Math.abs(current - number);
        if (distance < d) {
            d = distance;
            k = i;
        }
    }

    if (number <= levels[k]) {
        return [levels[k-1], levels[k] ];
    } else {
        return [levels[k], levels[k+1] ];
    }
}

const normal = (mu, sigma) => {
    eps = 0.00001;
    two_pi = Math.PI * 2;

    let u1 = 0; 
    let u2 = 0;
    while (u1 <= eps)
    {
        u1 = Math.random();
    }

    u2 = Math.random();

    let mag = sigma * Math.sqrt(-2.0 * Math.log(u1));
    let z0  = mag * Math.cos(two_pi * u2) + mu;

    return z0;
}

const random_int = (min, max) => Math.floor(Math.random()*(max - min + 1));

const srgb_to_linear = v => {
    if (v <= 0.04045) {
        return v/12.92;
    } else {
        return Math.pow((v + 0.055)/(1.055), 2.4);
    }
}

const linear_to_srgb = v => {
    if (v <= 0.0031308) {
        return 12.92 * v;
    } else {
        return Math.pow(1.055*v , 1/2.4);
    }
}

const drawImage = () => {
    state.ctx.drawImage(state.img, 0, 0);

    var im = new ImageData(100, state.img.naturalHeight);
    
    for (let y = 0; y < state.img.naturalHeight; y++) {
        let t = 1- y / state.img.naturalHeight;

        t = linear_to_srgb(t);
        t *= 255;
        
        for (let x = 0; x < 100; x++) {
            let i = 4 *(100 * y + x);
            let val = x < 40 ? 255 : t;
            im.data[i] = val; 
            im.data[i+1] = val; 
            im.data[i+2] = val; 
            im.data[i+3] = 255; 
        }
    }

    state.ctx.putImageData(im, state.img.naturalWidth, 0);
};

const get_value = (data, x_or_index, y) => {
    let value;
    
    if (y == undefined || y == null) {
        value = data[x_or_index];
    } else {
        value = data[4 * (state.width * y + x_or_index)]
    }

    if (state.use_linear_color_space) {
        value = srgb_to_linear(value/255) * 255;
    }

    return value;
}

const set_value = (data, value, x_or_index, y) => {
    if (state.use_linear_color_space) {
        value = linear_to_srgb(value/255)*255;
    }

    if (y == undefined || y == null) {

        if (x_or_index < 0 || x_or_index >= data.length) return;
        
        data[x_or_index] = value;
        data[x_or_index+1] = value;
        data[x_or_index+2] = value;
        data[x_or_index+3] = 255;
    } else {
        let i = 4 * (y * state.width + x_or_index) 

        if (i < 0 || i >= data.length) return;
        
        data[i] = value;
        data[i+1] = value;
        data[i+2] = value;
        data[i+3] = 255;
    }
}

const apply_threshold = (value, th) => {
    let range = get_range(value);
    let rel = (value - range[0])/(range[1] - range[0]);
    return rel < th ? range[0] : range[1];
}

const threshold = (th = 0.1) => {
    let ctx = state.ctx;
    let im = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    let data = im.data;

    for (let i = 0; i < data.length; i+=4) {
        // let val = get_value(data, i) < 255 * th ? 0 : 255;
        let val = apply_threshold(get_value(data, i), th);
        set_value(data, val, i);
    }

    ctx.putImageData(im, 0, 0);
}

const bayer = (size = 4) => {
    let m
    switch (size) {
        case 2:
            m = [[0, 2/4], [3/4, 1/4]]
            break;

        case 4:
              m = state[Views.OrderedBayer].cluster ?  
                [
                 [12/16,     4/16,   11/16,   15/16],
                 [5/16,  0/16,  3/16,  10/16],
                 [6/16,  1/16,  2/16,   9/16],
                 [13/16, 7/16,   8/16,  14/16],
             ]
            :
             [
                [0/16,     8/16,   2/16,   10/16],
                [12/16,  4/16,  14/16,  6/16],
                [3/16,  11/16,  1/16,   9/16],
                [15/16, 7/16,   13/16,  5/16],
            ];
            

            break;

        case 8:
            m = state[Views.OrderedBayer].cluster ?  
                [
                    [24, 8, 22, 30, 34, 44, 42, 32], 
                    [10, 0, 6, 20, 46, 58, 56, 40],
                    [12, 2, 4, 18, 48, 60, 62, 54],
                    [26, 14, 16, 28, 36, 50, 52, 38],
                    [35, 45, 43, 33, 25, 9, 23, 31],
                    [47, 59, 57, 41, 11, 1, 7, 21],
                    [49, 61, 63, 55, 13, 3, 5, 19],
                    [37, 51, 53, 39, 27, 15, 17, 29],
                ]
                :
            [
                [ 0, 32, 8, 40, 2, 34, 10, 42], 
                [48, 16, 56, 24, 50, 18, 58, 26],
                [12, 44, 4, 36, 14, 46, 6, 38], 
                [60, 28, 52, 20, 62, 30, 54, 22],
                [ 3, 35, 11, 43, 1, 33, 9, 41], 
                [51, 19, 59, 27, 49, 17, 57, 25],
                [15, 47, 7, 39, 13, 45, 5, 37],
                [63, 31, 55, 23, 61, 29, 53, 21],
            ]; 
            for (i = 0; i < 8;i++) {
                for (j =0 ; j < 8; j++) {
                    m[i][j] /= 64;
                }
            }
            break;
            
        default:
            throw "Invalid size for bayer matrix!";
    }

    ordered_dither(m, size);
}



const ordered_dither = (m, size) => {
    let ctx = state.ctx;
    let im = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    let data = im.data;

    let levels = [0, 64, 128, 255];
    for (let x = 0; x < ctx.canvas.width; x++) {
        for (let y = 0; y < ctx.canvas.height; y++) {
            let th = m[y % size][x % size];

            if (state[Views.OrderedBayer].randomize) {
                th += normal(0, 0.08);
            }
            
            let val = get_value(data, x, y);

            let range = get_range(val);
            let rel = (val - range[0])/(range[1] - range[0]);
            val = rel < th ? range[0] : range[1];
            
            // val = val < (255 * th) ? 0 : 255;
            // 
            set_value(data, val, x, y);
        }
    }

    ctx.putImageData(im, 0, 0);
}

const random_dither_matrix_selection_6x3x3 = () => {
    let matrices = [
        [
            [1, 6, 3],
            [4, 0, 8],
            [7, 2, 5],
        ],
        [
            [4, 8, 0],
            [6, 1, 3],
            [3, 5, 7],
        ],
        [
            [5, 2, 7],
            [0, 8, 4],
            [3, 6, 1],
        ],
        [
            [8, 6, 1], 
            [2, 4, 7],
            [5, 0, 3],
        ],
        [
            [2, 0, 4],
            [5, 7, 1], 
            [8, 3, 6],
        ],
        [
            [7, 3, 2],
            [4, 6, 0],
            [1, 8, 5],
        ],
    ];

    for (let i = 0; i < matrices.length; i++) {
        let m = matrices[i];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                m[x][y] /= 9;
            }
        }
    }

    random_dither_matrix_selection(matrices, 3);
}

const random_dither_matrix_selection = (matrices, size) => {
    let ctx = state.ctx;
    let im = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    let data = im.data;

    for (let x = 0; x < ctx.canvas.width; x++) {
        for (let y = 0; y < ctx.canvas.height; y++) {
            let m = matrices[random_int(0, matrices.length-1)];
            let th = m[y % size][x % size];
            
            val = apply_threshold(get_value(data, x, y), th);
            set_value(data, val, x, y);
        }
    }

    ctx.putImageData(im, 0, 0);
}

const randomized_dithering = (bias = 0) => {
    let ctx = state.ctx;
    let im = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    let data = im.data;

    for (let i = 0; i < data.length; i+=4) {
        let th = Math.random();
        th += bias;
        let val = apply_threshold(data[i], th);
        // let val = data[i] < 255 * th ? 0 : 255;
        
        data[i] = val;
        data[i+1] = val;
        data[i+2] = val;
        data[i+3] = 255;
    }

    ctx.putImageData(im, 0, 0);

}

const draw_slanted_square_pattern = () => {
    let m = [
        [0, 1, 2, 4, 3],
        [2, 4, 3, 0, 1],
        [3, 0, 1, 2, 4],
        [1, 2, 4, 3, 0],
        [4, 3, 0, 1, 2],
    ]

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            m[i][j] /= 5;
        }
    }

    ordered_dither(m, 5);
};

const error_diffusion = () => {
    switch (state[Views.Diffusion].type) {
        case DiffusionType.Dumb:
            dumb_error_diffusion();
            break;

        case DiffusionType.FloydSteinberg:
            fs_error_diffustion();
            break;

        case DiffusionType.JaJuNi:
            jajuni_error_diffusion();
            break;

        case DiffusionType.Atkinson:
            atkinson_error_diffusion();
            break;

        case DiffusionType.Burkes: 
            apply_error_diffusion([
                [1, 0, 1/4],
                [2, 0, 1/8],
                [-2, 1, 1/16],
                [-1, 1, 1/8],
                [0, 1, 1/4],
                [1, 1, 1/8],
                [2, 1, 1/16],
            ]);
            break;

        case DiffusionType.Sierra:
            apply_error_diffusion([
                [1, 0, 5/32],
                [2, 0, 3/32],
                [-2, 1, 1/16],
                [-1, 1, 1/8],
                [0, 1, 5/32],
                [1, 1, 1/8],
                [2, 1, 1/16],
                [-1, 2, 1/16],
                [0, 2, 3/32],
                [1, 2, 1/16],
            ]);
    }
}


const apply_error_diffusion = (m) => {
    let ctx = state.ctx;
    let im = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    let data = im.data;

    for (let x = 0; x < ctx.canvas.width; x++) {
        for (let y = 0; y < ctx.canvas.height; y++) {
            let old = get_value(data, x, y);
            let val = apply_threshold(old, 0.5);

            let err = old - val;

            let xx;
            let yy;

            for (let i = 0; i < m.length; i++) {
                let xx = x + m[i][0];
                let yy = y + m[i][1];
                let v = err * m[i][2];

                if (xx < ctx.canvas.width && yy < ctx.canvas.height) {
                    data[4 * (yy * ctx.canvas.width + xx)] += v;
                    data[4 * (yy * ctx.canvas.width + xx)+1] += v;
                    data[4 * (yy * ctx.canvas.width + xx)+2] += v;
                }

            }

            set_value(data, val, x, y);
        }
    }

    ctx.putImageData(im, 0, 0);
}

const fs_error_diffustion = () => {
    apply_error_diffusion([
        [1, 0, 7/16], 
        [-1, 1, 3 /16],
        [0, 1, 5/16],
        [1, 1, 1/16],
    ]);
}

const jajuni_error_diffusion = () => {
    apply_error_diffusion([
        [1, 0, 7/48], 
        [2, 0, 5/48],
        [-2, 1, 1/16],
        [-1, 1, 5/48],
        [0, 1, 7/48],
        [1, 1, 5/48],
        [2, 1, 1/16],
        [-2, 2, 1/48],
        [-1, 2, 1/16],
        [0, 2, 5/48],
        [1, 2, 1/16],
        [2, 2, 1/48],
    ]);
}

const atkinson_error_diffusion = () => {
    apply_error_diffusion([
        [1, 0, 1/8],
        [2, 0, 1/8],
        [-1, 1, 1/8],
        [0, 1, 1/8],
        [1, 1, 1/8],
        [0, 2, 1/8],
    ]);
};

const dumb_error_diffusion = () => {
    let ctx = state.ctx;
    let im = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    let data = im.data;

    for (let i = 0; i < data.length; i+=4) {
        let val = apply_threshold(get_value(data, i), 0.5);
        let error = data[i] - val;

        if (i < data.length-3) {
            data[i+4] += error;
        }

        set_value(data, val, i);
    }

    ctx.putImageData(im, 0, 0);
}

const setView = (view) => {
    if (state.view == view) return;

    build_view(view);
    state.view = view;
}

const draw = (view) => {
    if (view == null) view = state.view;
    switch (view) {
        case Views.Image:
            drawImage();
            break;

        case Views.Threshold:
            drawImage();
            threshold(state.threshold.value/100);
            break;

        case Views.RandomDither:
            drawImage();
            randomized_dithering(state[Views.RandomDither].bias/100);
            break;

        case Views.OrderedBayer:
            drawImage();
            bayer(state[Views.OrderedBayer].size);
            break;

        case Views.RandomMatrixSelection:
            drawImage();
            random_dither_matrix_selection_6x3x3();
            // draw_slanted_square_pattern();
            break;

        case Views.SquaredCross:
            drawImage();
            draw_slanted_square_pattern();
            break;

        case Views.Diffusion:
            drawImage();
            error_diffusion();
            break;

        default:
            drawImage();
            break;
    }

    state.ctx.fillStyle = "white";
    state.ctx.fillRect(state.img.naturalWidth, 0, 40, state.img.naturalHeight);
}

const build_view = view => {
    console.log("[build_view]: ", view);
    switch (view) {
        case Views.Image:
            {
                state.view_ui_container.innerHTML = "";
            } break;
        case Views.Threshold:
            {
                state.view_ui_container.innerHTML = `
                    <label for="th-slider">Threshold Value</label>
                    <input value=\"${state.threshold.value}\" id=\"th-slider\" type="range"></input>`;
                let slider = document.getElementById("th-slider");
                slider.addEventListener("change", e => {
                    state.threshold.value = e.target.value;
                    draw();
                });
            } break;

        case Views.RandomDither:
            {
                state.view_ui_container.innerHTML = `
                    <label for="rn-bias-slider">Bias</label>
                    <input value=\"${state[Views.RandomDither].bias}\" id=\"rn-bias-slider\" type="range" min="-100" max="100"></input>`;
                let slider = document.getElementById("rn-bias-slider");
                slider.addEventListener("change", e => {
                    state[Views.RandomDither].bias = e.target.value;
                    draw();
                });

            } break;
            
        case Views.OrderedBayer:
            {
                let size = state[Views.OrderedBayer].size;
                let cluster = state[Views.OrderedBayer].cluster;
                let randomize = state[Views.OrderedBayer].randomize;
                state.view_ui_container.innerHTML = `
                <label>Bayer Matrix Size</label>
                <select id="bayer-size-select">
                    <option value="2" ${size == 2 ? "selected" : ""}>2x2</option>
                    <option value="4" ${size == 4 ? "selected" : ""}>4x4</option>
                    <option value="8" ${size == 8 ? "selected" : ""}>8x8</option>
                </select>
                <label for="cluster">Cluster Dot</labe>
                <input type="checkbox" id="cluster" ${cluster ? "checked" : ""}></input>
                
                <label for="randomize">Randomize</labe>
                <input type="checkbox" id="randomize" ${randomize ? "checked" : ""}></input>
                `;
                let sel = document.getElementById("bayer-size-select");
                let cluster_cb = document.getElementById("cluster");
                let randomize_cb = document.getElementById("randomize");
                
                sel.addEventListener("change", e => {
                    state[Views.OrderedBayer].size = parseInt(e.target.value);
                    draw();
                });

                cluster_cb.addEventListener("change", e => {
                    state[Views.OrderedBayer].cluster = e.target.checked;
                    draw();
                });

                randomize_cb.addEventListener("change", e => {
                    state[Views.OrderedBayer].randomize = e.target.checked;
                    draw();
                });
                
            }break;

        case Views.SquaredCross:
            
                let randomize = state[Views.OrderedBayer].randomize;
            
                state.view_ui_container.innerHTML = `
                <label for="randomize">Randomize</labe>
                <input type="checkbox" id="randomize" ${randomize ? "checked" : ""}></input>
                `;
            
                let randomize_cb = document.getElementById("randomize");
            randomize_cb.addEventListener("change", e => {
                    state[Views.OrderedBayer].randomize = e.target.checked;
                    draw();
                });
                

            break;

        case Views.Diffusion:
            state.view_ui_container.innerHTML = ``;
            build_select_from_object(state.view_ui_container, "Method", DiffusionType, state[Views.Diffusion].type, v => {
                state[Views.Diffusion].type = v;
                draw();
            });
            break;
            
        default:
            {
                state.view_ui_container.innerHTML = "";
            } break;
    }
    
    draw(view);
}

const init_ui = () => {
    let d = document.createElement("div");
    let html = "";
    html += "<label for=\"view-select\">Dithering Method</label>";
    html += "<select id=\"view-select\">\n";

    Object.values(Views).forEach(v => {
        html += `<option value="${v}" ${v == Views.Image ? "selected" : "" }>${v}</option>`;
    });
    
    html += "</select>";

    html += `
    <label for="num-levels">Bits</label>
    <select id="num-levels">
        <option value="1" ${state.num_levels == 1}>1</option>
        <option value="2" ${state.num_levels == 2}>2</option>
        <option value="4" ${state.num_levels == 4}>4</option>
        <option value="8" ${state.num_levels == 8}>8</option>
        <option value="16" ${state.num_levels == 16}>16</option>
        <option value="32" ${state.num_levels == 32}>32</option>
        <option value="64" ${state.num_levels == 64}>64</option>
    </select>
    `;
    
    html += "<label for=\"linear-color-space\">Use Linear Color Space</label>";
    html += `<input id="linear-color-space" type="checkbox" ${state.use_linear_color_space ? "checked" : ""}></input>`;
    
    d.innerHTML = html;
    document.body.appendChild(d);

    let viewSelect = document.getElementById("view-select");
    let linear_col = document.getElementById("linear-color-space");
    let num_levels_sel = document.getElementById("num-levels");
    
    viewSelect.addEventListener("change", e => {
        setView(e.target.value);
    });

    linear_col.addEventListener("change", e => {
        state.use_linear_color_space = e.target.checked;
        draw();
    });

    num_levels_sel.addEventListener("change", e => {
        state.num_levels = parseInt(e.target.value);
        state.levels = create_levels(state.num_levels);
        draw();
    });

    state.view_ui_container = document.createElement("div");
    document.body.appendChild(state.view_ui_container);
}

const start = (image) => {
    state.img = image;
    let canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth + 100;
    canvas.height = image.naturalHeight;
    state.width = canvas.width;
    state.height = canvas.height;

    let ctx = canvas.getContext("2d");
    state.ctx = ctx;

    document.body.appendChild(canvas);

    drawImage();
    // ctx.drawImage(image, 0, 0);
    init_ui();
};


let img = new Image();
img.crossOrigin = "Anonymous";
img.onload = () => {
    // document.body.appendChild(img);
    start(img);
}


img.src = "./image.jpg";
