import { DumbImGui, Color } from "./dumb-imgui.js";

const palettes = {
    matriax8c: [
        new Color("#f0f0dc"),
        new Color("#fac800"),
        new Color("#10c840"),
        new Color("#00a0c8"),
        new Color("#d24040"),
        new Color("#a0694b"),
        new Color("#736464"),
        new Color("#101820"),
    ],
    aap_splendor128: [
        new Color("050403"),
        new Color("0e0c0c"),
        new Color("2d1b1e"),
        new Color("612721"),
        new Color("b9451d"),
        new Color("f1641f"),
        new Color("fca570"),
        new Color("ffe0b7"),
        new Color("ffffff"),
        new Color("fff089"),
        new Color("f8c53a"),
        new Color("e88a36"),
        new Color("b05b2c"),
        new Color("673931"),
        new Color("271f1b"),
        new Color("4c3d2e"),
        new Color("855f39"),
        new Color("d39741"),
        new Color("f8f644"),
        new Color("d5dc1d"),
        new Color("adb834"),
        new Color("7f8e44"),
        new Color("586335"),
        new Color("333c24"),
        new Color("181c19"),
        new Color("293f21"),
        new Color("477238"),
        new Color("61a53f"),
        new Color("8fd032"),
        new Color("c4f129"),
        new Color("d0ffea"),
        new Color("97edca"),
        new Color("59cf93"),
        new Color("42a459"),
        new Color("3d6f43"),
        new Color("27412d"),
        new Color("14121d"),
        new Color("1b2447"),
        new Color("2b4e95"),
        new Color("2789cd"),
        new Color("42bfe8"),
        new Color("73efe8"),
        new Color("f1f2ff"),
        new Color("c9d4fd"),
        new Color("8aa1f6"),
        new Color("4572e3"),
        new Color("494182"),
        new Color("7864c6"),
        new Color("9c8bdb"),
        new Color("ceaaed"),
        new Color("fad6ff"),
        new Color("eeb59c"),
        new Color("d480bb"),
        new Color("9052bc"),
        new Color("171516"),
        new Color("373334"),
        new Color("695b59"),
        new Color("b28b78"),
        new Color("e2b27e"),
        new Color("f6d896"),
        new Color("fcf7be"),
        new Color("ecebe7"),
        new Color("cbc6c1"),
        new Color("a69e9a"),
        new Color("807b7a"),
        new Color("595757"),
        new Color("323232"),
        new Color("4f342f"),
        new Color("8c5b3e"),
        new Color("c68556"),
        new Color("d6a851"),
        new Color("b47538"),
        new Color("724b2c"),
        new Color("452a1b"),
        new Color("61683a"),
        new Color("939446"),
        new Color("c6b858"),
        new Color("efdd91"),
        new Color("b5e7cb"),
        new Color("86c69a"),
        new Color("5d9b79"),
        new Color("486859"),
        new Color("2c3b39"),
        new Color("171819"),
        new Color("2c3438"),
        new Color("465456"),
        new Color("64878c"),
        new Color("8ac4c3"),
        new Color("afe9df"),
        new Color("dceaee"),
        new Color("b8ccd8"),
        new Color("88a3bc"),
        new Color("5e718e"),
        new Color("485262"),
        new Color("282c3c"),
        new Color("464762"),
        new Color("696682"),
        new Color("9a97b9"),
        new Color("c5c7dd"),
        new Color("e6e7f0"),
        new Color("eee6ea"),
        new Color("e3cddf"),
        new Color("bfa5c9"),
        new Color("87738f"),
        new Color("564f5b"),
        new Color("322f35"),
        new Color("36282b"),
        new Color("654956"),
        new Color("966888"),
        new Color("c090a9"),
        new Color("d4b8b8"),
        new Color("eae0dd"),
        new Color("f1ebdb"),
        new Color("ddcebf"),
        new Color("bda499"),
        new Color("886e6a"),
        new Color("594d4d"),
        new Color("33272a"),
        new Color("b29476"),
        new Color("e1bf89"),
        new Color("f8e398"),
        new Color("ffe9e3"),
        new Color("fdc9c9"),
        new Color("f6a2a8"),
        new Color("e27285"),
        new Color("b25266"),
        new Color("64364b"),
        new Color("2a1e23"),

    ],
    resurrec64: [
        new Color("#2e222f"),
        new Color("#3e3546"),
        new Color("#625565"),
        new Color("#966c6c"),
        new Color("#ab947a"),
        new Color("#694f62"),
        new Color("#7f708a"),
        new Color("#9babb2"),
        new Color("#c7dcd0"),
        new Color("#ffffff"),
        new Color("#6e2727"),
        new Color("#b33831"),
        new Color("#ea4f36"),
        new Color("#f57d4a"),
        new Color("#ae2334"),
        new Color("#e83b3b"),
        new Color("#fb6b1d"),
        new Color("#f79617"),
        new Color("#f9c22b"),
        new Color("#7a3045"),
        new Color("#9e4539"),
        new Color("#cd683d"),
        new Color("#e6904e"),
        new Color("#fbb954"),
        new Color("#4c3e24"),
        new Color("#676633"),
        new Color("#a2a947"),
        new Color("#d5e04b"),
        new Color("#fbff86"),
        new Color("#165a4c"),
        new Color("#239063"),
        new Color("#1ebc73"),
        new Color("#91db69"),
        new Color("#cddf6c"),
        new Color("#313638"),
        new Color("#374e4a"),
        new Color("#547e64"),
        new Color("#92a984"),
        new Color("#b2ba90"),
        new Color("#0b5e65"),
        new Color("#0b8a8f"),
        new Color("#0eaf9b"),
        new Color("#30e1b9"),
        new Color("#8ff8e2"),
        new Color("#323353"),
        new Color("#484a77"),
        new Color("#4d65b4"),
        new Color("#4d9be6"),
        new Color("#8fd3ff"),
        new Color("#45293f"),
        new Color("#6b3e75"),
        new Color("#905ea9"),
        new Color("#a884f3"),
        new Color("#eaaded"),
        new Color("#753c54"),
        new Color("#a24b6f"),
        new Color("#cf657f"),
        new Color("#ed8099"),
        new Color("#831c5d"),
        new Color("#c32454"),
        new Color("#f04f78"),
        new Color("#f68181"),
        new Color("#fca790"),
        new Color("#fdcbb0"),
    ],
    duel: [
        new Color("000000"),
        new Color("222323"),
        new Color("434549"),
        new Color("626871"),
        new Color("828b98"),
        new Color("a6aeba"),
        new Color("cdd2da"),
        new Color("f5f7fa"),
        new Color("625d54"),
        new Color("857565"),
        new Color("9e8c79"),
        new Color("aea189"),
        new Color("bbafa4"),
        new Color("ccc3b1"),
        new Color("eadbc9"),
        new Color("fff3d6"),
        new Color("583126"),
        new Color("733d3b"),
        new Color("885041"),
        new Color("9a624c"),
        new Color("ad6e51"),
        new Color("d58d6b"),
        new Color("fbaa84"),
        new Color("ffce7f"),
        new Color("002735"),
        new Color("003850"),
        new Color("004d5e"),
        new Color("0b667f"),
        new Color("006f89"),
        new Color("328ca7"),
        new Color("24aed6"),
        new Color("88d6ff"),
        new Color("662b29"),
        new Color("94363a"),
        new Color("b64d46"),
        new Color("cd5e46"),
        new Color("e37840"),
        new Color("f99b4e"),
        new Color("ffbc4e"),
        new Color("ffe949"),
        new Color("282b4a"),
        new Color("3a4568"),
        new Color("615f84"),
        new Color("7a7799"),
        new Color("8690b2"),
        new Color("96b2d9"),
        new Color("c7d6ff"),
        new Color("c6ecff"),
        new Color("002219"),
        new Color("003221"),
        new Color("174a1b"),
        new Color("225918"),
        new Color("2f690c"),
        new Color("518822"),
        new Color("7da42d"),
        new Color("a6cc34"),
        new Color("181f2f"),
        new Color("23324d"),
        new Color("25466b"),
        new Color("366b8a"),
        new Color("318eb8"),
        new Color("41b2e3"),
        new Color("52d2ff"),
        new Color("74f5fd"),
        new Color("1a332c"),
        new Color("2f3f38"),
        new Color("385140"),
        new Color("325c40"),
        new Color("417455"),
        new Color("498960"),
        new Color("55b67d"),
        new Color("91daa1"),
        new Color("5e0711"),
        new Color("82211d"),
        new Color("b63c35"),
        new Color("e45c5f"),
        new Color("ff7676"),
        new Color("ff9ba8"),
        new Color("ffbbc7"),
        new Color("ffdbff"),
        new Color("2d3136"),
        new Color("48474d"),
        new Color("5b5c69"),
        new Color("73737f"),
        new Color("848795"),
        new Color("abaebe"),
        new Color("bac7db"),
        new Color("ebf0f6"),
        new Color("3b303c"),
        new Color("5a3c45"),
        new Color("8a5258"),
        new Color("ae6b60"),
        new Color("c7826c"),
        new Color("d89f75"),
        new Color("ecc581"),
        new Color("fffaab"),
        new Color("31222a"),
        new Color("4a353c"),
        new Color("5e4646"),
        new Color("725a51"),
        new Color("7e6c54"),
        new Color("9e8a6e"),
        new Color("c0a588"),
        new Color("ddbf9a"),
        new Color("2e1026"),
        new Color("49283d"),
        new Color("663659"),
        new Color("975475"),
        new Color("b96d91"),
        new Color("c178aa"),
        new Color("db99bf"),
        new Color("f8c6da"),
        new Color("002e49"),
        new Color("004051"),
        new Color("005162"),
        new Color("006b6d"),
        new Color("008279"),
        new Color("00a087"),
        new Color("00bfa3"),
        new Color("00deda"),
        new Color("453125"),
        new Color("614a3c"),
        new Color("7e6144"),
        new Color("997951"),
        new Color("b29062"),
        new Color("cca96e"),
        new Color("e8cb82"),
        new Color("fbeaa3"),
        new Color("5f0926"),
        new Color("6e2434"),
        new Color("904647"),
        new Color("a76057"),
        new Color("bd7d64"),
        new Color("ce9770"),
        new Color("edb67c"),
        new Color("edd493"),
        new Color("323558"),
        new Color("4a5280"),
        new Color("64659d"),
        new Color("7877c1"),
        new Color("8e8ce2"),
        new Color("9c9bef"),
        new Color("b8aeff"),
        new Color("dcd4ff"),
        new Color("431729"),
        new Color("712b3b"),
        new Color("9f3b52"),
        new Color("d94a69"),
        new Color("f85d80"),
        new Color("ff7daf"),
        new Color("ffa6c5"),
        new Color("ffcdff"),
        new Color("49251c"),
        new Color("633432"),
        new Color("7c4b47"),
        new Color("98595a"),
        new Color("ac6f6e"),
        new Color("c17e7a"),
        new Color("d28d7a"),
        new Color("e59a7c"),
        new Color("202900"),
        new Color("2f4f08"),
        new Color("495d00"),
        new Color("617308"),
        new Color("7c831e"),
        new Color("969a26"),
        new Color("b4aa33"),
        new Color("d0cc32"),
        new Color("622a00"),
        new Color("753b09"),
        new Color("854f12"),
        new Color("9e6520"),
        new Color("ba882e"),
        new Color("d1aa39"),
        new Color("e8d24b"),
        new Color("fff64f"),
        new Color("26233d"),
        new Color("3b3855"),
        new Color("56506f"),
        new Color("75686e"),
        new Color("917a7b"),
        new Color("b39783"),
        new Color("cfaf8e"),
        new Color("fedfb1"),
        new Color("1d2c43"),
        new Color("2e3d47"),
        new Color("394d3c"),
        new Color("4c5f33"),
        new Color("58712c"),
        new Color("6b842d"),
        new Color("789e24"),
        new Color("7fbd39"),
        new Color("372423"),
        new Color("53393a"),
        new Color("784c49"),
        new Color("945d4f"),
        new Color("a96d58"),
        new Color("bf7e63"),
        new Color("d79374"),
        new Color("f4a380"),
        new Color("2d4b47"),
        new Color("47655a"),
        new Color("5b7b69"),
        new Color("71957d"),
        new Color("87ae8e"),
        new Color("8ac196"),
        new Color("a9d1c1"),
        new Color("e0faeb"),
        new Color("001b40"),
        new Color("03315f"),
        new Color("07487c"),
        new Color("105da2"),
        new Color("1476c0"),
        new Color("4097ea"),
        new Color("55b1f1"),
        new Color("6dccff"),
        new Color("554769"),
        new Color("765d73"),
        new Color("977488"),
        new Color("b98c93"),
        new Color("d5a39a"),
        new Color("ebbd9d"),
        new Color("ffd59b"),
        new Color("fdf786"),
        new Color("1d1d21"),
        new Color("3c3151"),
        new Color("584a7f"),
        new Color("7964ba"),
        new Color("9585f1"),
        new Color("a996ec"),
        new Color("baabf7"),
        new Color("d1bdfe"),
        new Color("262450"),
        new Color("28335d"),
        new Color("2d3d72"),
        new Color("3d5083"),
        new Color("5165ae"),
        new Color("5274c5"),
        new Color("6c82c4"),
        new Color("8393c3"),
        new Color("492129"),
        new Color("5e414a"),
        new Color("77535b"),
        new Color("91606a"),
        new Color("ad7984"),
        new Color("b58b94"),
        new Color("d4aeaa"),
        new Color("ffe2cf"),
        new Color("721c03"),
        new Color("9c3327"),
        new Color("bf5a3e"),
        new Color("e98627"),
        new Color("ffb108"),
        new Color("ffcf05"),
        new Color("fff02b"),
        new Color("f7f4bf"),

    ],
    windows95: [
        new Color("000000"),
        new Color("800000"),
        new Color("008000"),
        new Color("808000"),
        new Color("000080"),
        new Color("800080"),
        new Color("008080"),
        new Color("c0c0c0"),
        new Color("c0dcc0"),
        new Color("a6caf0"),
        new Color("2a3faa"),
        new Color("2a3fff"),
        new Color("2a5f00"),
        new Color("2a5f55"),
        new Color("2a5faa"),
        new Color("2a5fff"),
        new Color("2a7f00"),
        new Color("2a7f55"),
        new Color("2a7faa"),
        new Color("2a7fff"),
        new Color("2a9f00"),
        new Color("2a9f55"),
        new Color("2a9faa"),
        new Color("2a9fff"),
        new Color("2abf00"),
        new Color("2abf55"),
        new Color("2abfaa"),
        new Color("2abfff"),
        new Color("2adf00"),
        new Color("2adf55"),
        new Color("2adfaa"),
        new Color("2adfff"),
        new Color("2aff00"),
        new Color("2aff55"),
        new Color("2affaa"),
        new Color("2affff"),
        new Color("550000"),
        new Color("550055"),
        new Color("5500aa"),
        new Color("5500ff"),
        new Color("551f00"),
        new Color("551f55"),
        new Color("551faa"),
        new Color("551fff"),
        new Color("553f00"),
        new Color("553f55"),
        new Color("553faa"),
        new Color("553fff"),
        new Color("555f00"),
        new Color("555f55"),
        new Color("555faa"),
        new Color("555fff"),
        new Color("557f00"),
        new Color("557f55"),
        new Color("557faa"),
        new Color("557fff"),
        new Color("559f00"),
        new Color("559f55"),
        new Color("559faa"),
        new Color("559fff"),
        new Color("55bf00"),
        new Color("55bf55"),
        new Color("55bfaa"),
        new Color("55bfff"),
        new Color("55df00"),
        new Color("55df55"),
        new Color("55dfaa"),
        new Color("55dfff"),
        new Color("55ff00"),
        new Color("55ff55"),
        new Color("55ffaa"),
        new Color("55ffff"),
        new Color("7f0000"),
        new Color("7f0055"),
        new Color("7f00aa"),
        new Color("7f00ff"),
        new Color("7f1f00"),
        new Color("7f1f55"),
        new Color("7f1faa"),
        new Color("7f1fff"),
        new Color("7f3f00"),
        new Color("7f3f55"),
        new Color("7f3faa"),
        new Color("7f3fff"),
        new Color("7f5f00"),
        new Color("7f5f55"),
        new Color("7f5faa"),
        new Color("7f5fff"),
        new Color("7f7f00"),
        new Color("7f7f55"),
        new Color("7f7faa"),
        new Color("7f7fff"),
        new Color("7f9f00"),
        new Color("7f9f55"),
        new Color("7f9faa"),
        new Color("7f9fff"),
        new Color("7fbf00"),
        new Color("7fbf55"),
        new Color("7fbfaa"),
        new Color("7fbfff"),
        new Color("7fdf00"),
        new Color("7fdf55"),
        new Color("7fdfaa"),
        new Color("7fdfff"),
        new Color("7fff00"),
        new Color("7fff55"),
        new Color("7fffaa"),
        new Color("7fffff"),
        new Color("aa0000"),
        new Color("aa0055"),
        new Color("aa00aa"),
        new Color("aa00ff"),
        new Color("aa1f00"),
        new Color("aa1f55"),
        new Color("aa1faa"),
        new Color("aa1fff"),
        new Color("aa3f00"),
        new Color("aa3f55"),
        new Color("aa3faa"),
        new Color("aa3fff"),
        new Color("aa5f00"),
        new Color("aa5f55"),
        new Color("aa5faa"),
        new Color("aa5fff"),
        new Color("aa7f00"),
        new Color("aa7f55"),
        new Color("aa7faa"),
        new Color("aa7fff"),
        new Color("aa9f00"),
        new Color("aa9f55"),
        new Color("aa9faa"),
        new Color("aa9fff"),
        new Color("aabf00"),
        new Color("aabf55"),
        new Color("aabfaa"),
        new Color("aabfff"),
        new Color("aadf00"),
        new Color("aadf55"),
        new Color("aadfaa"),
        new Color("aadfff"),
        new Color("aaff00"),
        new Color("aaff55"),
        new Color("aaffaa"),
        new Color("aaffff"),
        new Color("d40000"),
        new Color("d40055"),
        new Color("d400aa"),
        new Color("d400ff"),
        new Color("d41f00"),
        new Color("d41f55"),
        new Color("d41faa"),
        new Color("d41fff"),
        new Color("d43f00"),
        new Color("d43f55"),
        new Color("d43faa"),
        new Color("d43fff"),
        new Color("d45f00"),
        new Color("d45f55"),
        new Color("d45faa"),
        new Color("d45fff"),
        new Color("d47f00"),
        new Color("d47f55"),
        new Color("d47faa"),
        new Color("d47fff"),
        new Color("d49f00"),
        new Color("d49f55"),
        new Color("d49faa"),
        new Color("d49fff"),
        new Color("d4bf00"),
        new Color("d4bf55"),
        new Color("d4bfaa"),
        new Color("d4bfff"),
        new Color("d4df00"),
        new Color("d4df55"),
        new Color("d4dfaa"),
        new Color("d4dfff"),
        new Color("d4ff00"),
        new Color("d4ff55"),
        new Color("d4ffaa"),
        new Color("d4ffff"),
        new Color("ff0055"),
        new Color("ff00aa"),
        new Color("ff1f00"),
        new Color("ff1f55"),
        new Color("ff1faa"),
        new Color("ff1fff"),
        new Color("ff3f00"),
        new Color("ff3f55"),
        new Color("ff3faa"),
        new Color("ff3fff"),
        new Color("ff5f00"),
        new Color("ff5f55"),
        new Color("ff5faa"),
        new Color("ff5fff"),
        new Color("ff7f00"),
        new Color("ff7f55"),
        new Color("ff7faa"),
        new Color("ff7fff"),
        new Color("ff9f00"),
        new Color("ff9f55"),
        new Color("ff9faa"),
        new Color("ff9fff"),
        new Color("ffbf00"),
        new Color("ffbf55"),
        new Color("ffbfaa"),
        new Color("ffbfff"),
        new Color("ffdf00"),
        new Color("ffdf55"),
        new Color("ffdfaa"),
        new Color("ffdfff"),
        new Color("ffff55"),
        new Color("ffffaa"),
        new Color("ccccff"),
        new Color("ffccff"),
        new Color("33ffff"),
        new Color("66ffff"),
        new Color("99ffff"),
        new Color("ccffff"),
        new Color("007f00"),
        new Color("007f55"),
        new Color("007faa"),
        new Color("007fff"),
        new Color("009f00"),
        new Color("009f55"),
        new Color("009faa"),
        new Color("009fff"),
        new Color("00bf00"),
        new Color("00bf55"),
        new Color("00bfaa"),
        new Color("00bfff"),
        new Color("00df00"),
        new Color("00df55"),
        new Color("00dfaa"),
        new Color("00dfff"),
        new Color("00ff55"),
        new Color("00ffaa"),
        new Color("2a0000"),
        new Color("2a0055"),
        new Color("2a00aa"),
        new Color("2a00ff"),
        new Color("2a1f00"),
        new Color("2a1f55"),
        new Color("2a1faa"),
        new Color("2a1fff"),
        new Color("2a3f00"),
        new Color("2a3f55"),
        new Color("fffbf0"),
        new Color("a0a0a4"),
        new Color("808080"),
        new Color("ff0000"),
        new Color("00ff00"),
        new Color("ffff00"),
        new Color("0000ff"),
        new Color("ff00ff"),
        new Color("00ffff"),
        new Color("ffffff"),

    ]

};

let show = true;

const findClosesColorInPalette = c => {
    let pal = palettes[state.currentPalette];
    let current = -1;
    let result = null;
    for (let i = 0; i < pal.length; i++) {
        
        let dist = c.distance(pal[i].toLinear());

        if (current < 0 || dist < current) {
            result = pal[i];
            current = dist;
        }
    }

    return result;
};

const filter = (im) => {
    for (let x = 0; x < im.width; x++) {
        for (let y = 0; y < im.height; y++) {
            let i = 4 * (im.width * y + x);
            let r = im.data[i];
            let g = im.data[i+1];
            let b = im.data[i+2];

            r = Math.trunc(Math.pow(r/255, 2.4) * 255);
            g = Math.trunc(Math.pow(g/255, 2.4) * 255);
            b = Math.trunc(Math.pow(b/255, 2.4) * 255);

            let c = findClosesColorInPalette(new Color(r, g, b));

            im.data[i] = c.r;
            im.data[i+1] = c.g;
            im.data[i+2] = c.b;
        } 
    }
};

palettes["standard64"] = [];
for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
        for (let k = 0; k <= 3; k++) {
            let r = i * (Math.trunc(256/3));
            let g = j * (Math.trunc(256/3));
            let b = k * (Math.trunc(256/3));
            palettes["standard64"].push(new Color(r, g, b));
        }
    }
}
console.log(palettes["standard64"].length);

let sel = 0;

const WorkerState = {
    Idle: 0,
    Processing: 1,
}

let state = {
    selectedPaletteIndex: 0,
    currentPalette: Object.keys(palettes)[0], //"standard64",
    mouseOverColor: null,
    palCanvasHeight: 400,
    showPalleteCanvas: true,
    img: null,
    imageLoaded: false,
    redrawImageCanvas: true,
    imageWidth: -1,
    imageHeight: -1,

    worker: null,
    workerState: WorkerState.Idle,
};

let img = new Image();
img.src = "./image01.jpg"
// img.src = "./image02.webp"
// img.src = "./image03.jpg"
img.onload = () => { 
    state.imageLoaded = true; 
    state.redrawImageCanvas = true;
    state.imageWidth = img.naturalWidth;
    state.imageHeight = img.naturalHeight;
};
state.img = img;

new DumbImGui(document.getElementById("container")).run(ui => {

    
    ui.h1("Title", "D.U.M.B ImGUI!");
        let img = state.img;
    
    ui.canvas("image-canvas", img.naturalWidth, img.naturalHeight, ctx => {
        if (state.redrawImageCanvas && state.imageLoaded && state.workerState == WorkerState.Idle) {
            if (state.worker == null) {
                console.log("creating worker...");
                state.worker = new Worker("./worker.js", { type: "module" });
                state.worker.addEventListener("message", e => {
                    console.log("MESSAGE", e);
                    let im = new ImageData(new Uint8ClampedArray(e.data.bytes), state.imageWidth, state.imageHeight);
                    ctx.clear(new Color(255, 0, 0));
                    ctx._ctx.putImageData(im, 0, 0);
                    state.workerState = WorkerState.Idle;
                    state.redrawImageCanvas = false;
                });
            }
            
            ctx._ctx.drawImage(img, 0, 0);
            let im = ctx._ctx.getImageData(0, 0, state.imageWidth, state.imageHeight);
            
            console.log("postMessage");
            state.worker.postMessage({
                pixels: im.data.buffer,
                pal: palettes[state.currentPalette],
                width: state.imageWidth,
                height: state.imageHeight,
            }, [im.data.buffer]);
            
            state.workerState = WorkerState.Processing;
        }
        
        // } else if (state.imageLoaded && state.redrawImageCanvas && state.workerState == WorkerState.Idle) {
            //ctx._ctx.drawImage(img, 0, 0);
            //
            //let im = ctx._ctx.getImageData(0, 0, state.imageWidth, state.imageHeight); 
            //filter(im);
            //ctx._ctx.putImageData(im, 0, 0);
            //
            //
            //state.redrawImageCanvas = false;
    });

    ui.div("pal-container", ()=>{
        if (ui.button("toggle-btn", "Toggle Palette Preview")) {
        // show = !show;
        state.showPalleteCanvas = !state.showPalleteCanvas;
    }


        let old = state.selectedPaletteIndex;
        state.selectedPaletteIndex = ui.select("pal-select", "Palette", Object.keys(palettes), state.selectedPaletteIndex);
        state.currentPalette = Object.keys(palettes)[state.selectedPaletteIndex];

        if (old != state.selectedPaletteIndex) {
            state.redrawImageCanvas = true;

            if (state.workerState == WorkerState.Processing) {
                state.worker.terminate();
                state.worker = null;
                state.workerState = WorkerState.Idle;
            }
        }
    });


    if (state.showPalleteCanvas) {
        ui.canvas("palette-canvas", 800, state.palCanvasHeight, ctx => {
            let pal = palettes[state.currentPalette];
            let size = 28;
            let x = 2;
            let y = 2;
            let overX = -1;
            let overY = -1;
            let overColor = null;
            state.mouseOverColor = null;
            ctx.clear(255, 255, 255);

            for (let i = 0; i < pal.length; i++) {
                x+=size;
                if (x >= 700) {
                    x = 2;
                    y += size;
                }
            }

            state.palCanvasHeight = y + size + 2;

            x = 2;
            y = 2;
            for (let i = 0; i < pal.length; i++) {
                ctx.fill(x, y, size, size, pal[i]);
                // ctx.drawRect(x, y, size, size, new Color(80, 80, 80));

                if (ctx.mouseOver(x, y, size, size)) {
                    overX = x;
                    overY = y;
                    state.mouseOverColor = pal[i];
                    // overColor = pal[i];
                }

                x+=size;
                if (x >= 700) {
                    x = 2;
                    y += size;
                }
            }
            if (overX >= 0)
            {
                ctx.drawRect(overX, overY, size, size, new Color(255, 0, 0), 2);
            }
        });

        if (state.mouseOverColor != null) {
            let c = state.mouseOverColor;
            ui.p("color-info", `Color: (${c.r}, ${c.g}, ${c.b})`);
        }
    }
});

