const colors = {
    bg: "#282828",
    sphere: "#D5C4A1",
    ray: "#FA7F19",
    rayDim: "#B25304",
    sphereDim: "#736852",
    t1: "#83A598",
    t2: "#B8BB26",
}

const state = {
    spherePosX: 200,
    spherePosY: 200,
    sphereRadius: 100,
    sphereMinRadius: 20,
    sphereHandleRadius: 10,
    draggingSphere: false,
    draggingRadius: false,
    draggingRayPos: false,
    draggingRayDir: false,
    dragLock: false,

    rayX: 400,
    rayY: 300,
    rayRadius: 8,

    rayDirX: 1,
    rayDirY: 0,

    mouseX: 0,
    mouseY: 0,
    mouseDown: false,
    isMouseOverSphereHandle: false,
    isMouseOverRadiusHandle: false,
    isMouseOverRayPosHandle: false,
    isMouseOverRayDirHandle: false,

    angle: 0,

    intersectionCount: 0,
    t1: 0,
    t2: 0,
    p1x: 0,
    p1y: 0,
    p2x: 0,
    p2y: 0,
};

let canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d");

ctx.fillStyle = "#282828";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let infoDiv = document.createElement("div");
document.body.appendChild(infoDiv);

infoDiv.innerHTML = 
`
<p>Sphere Position = <span id="sphere-pos">(0, 0)</span></p>
<p>Sphere Radius = <span id="sphere-radius">0</span></p>
<p>Ray Origin = <span id="ray-origin">0</span></p>
<p>Angle = <span id=ray-angle>0</span></p>
<input id="draw-graph" type="checkbox">Draw Graph</input>
`;

let infoSpherePos = document.getElementById("sphere-pos");
let infoSphereRadius = document.getElementById("sphere-radius");
let infoRayOrigin = document.getElementById("ray-origin");
let infoRayAngle = document.getElementById("ray-angle");
let infoDrawGraphInput = document.getElementById("draw-graph");

infoDrawGraphInput.addEventListener("change", e => {
    state.drawGraph = e.target.checked;
});

function drawSphere() {
    ctx.beginPath();
    ctx.strokeStyle = state.isMouseOverRadiusHandle ? colors.sphereDim : colors.sphere;
    ctx.fillStyle = state.isMouseOverSphereHandle ? colors.sphereDim : colors.sphere;
    ctx.arc(state.spherePosX, state.spherePosY, state.sphereRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(state.spherePosX , state.spherePosY , state.sphereHandleRadius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawRay() {
    ctx.beginPath();
    ctx.moveTo(state.rayX, state.rayY);

    let x = state.rayX + state.rayDirX * 10000;
    let y = state.rayY + state.rayDirY * 10000;

    ctx.save();

    ctx.strokeStyle = state.isMouseOverRayDirHandle ? colors.rayDim : colors.ray;
    ctx.lineWidth = 2;
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.restore();

    ctx.beginPath();
    ctx.fillStyle = state.isMouseOverRayPosHandle || state.draggingRayPos ? colors.rayDim : colors.ray;
    ctx.arc(state.rayX, state.rayY, state.rayRadius, 0, 2*Math.PI);
    ctx.fill();
}

function drawIntersections() {
    if (state.intersectionCount == 0) return;

    ctx.fillStyle = colors.t1;
    ctx.beginPath();
    ctx.arc(state.p1x, state.p1y, 4, 0, 2*Math.PI);
    ctx.fill();

    if (state.intersectionCount == 2) {
        ctx.fillStyle = colors.t2;
        ctx.beginPath();
        ctx.arc(state.p2x, state.p2y, 4, 0, 2*Math.PI);
        ctx.fill();
    }
}

function drawGraph() {
    let a0 = -Math.PI/2;
    let af = Math.PI/2;

    // let im = new ImageData(canvas.width, 200);
    // for (i = 0; i < im.data.length;i++) im.data[i] = 20;
    // let x = 0;

    let im = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let ux = state.spherePosX -state.rayX;
    let uy = state.spherePosX -state.rayX;
    let ulen = Math.sqrt(ux*ux + uy*uy);
    ux /= ulen;
    uy /= ulen;

    
    let x = 0;
    while (x < canvas.width) {
        let t = x / canvas.width;
        let a = a0 + (af - a0) * t;

        let dirX = ux * Math.cos(a) - uy * Math.sin(a);
        let dirY = ux * Math.sin(a) + uy * Math.cos(a);

        let result = raySphereIntersection(state.spherePosX, state.spherePosY, state.sphereRadius, state.rayX, state.rayY, dirX, dirY);

        if (result.intersectionCount > 0)
        {
            let t1 = result.t1 / state.sphereRadius * 10;
            
            for (y = 0; y < t1 && y < 200; y++) {
                im.data[4 *(y * canvas.width  + x)] = 255;
                im.data[4 *(y * canvas.width  + x)+1] = 0;
                im.data[4 *(y * canvas.width  + x)+2] = 0;
                im.data[4 *(y * canvas.width  + x)+3] = 255;
            }
        }

        if (result.intersectionCount > 1)
        {
            let t1 = result.t2 / 10;
            
            for (y = 0; y < t1 && y < 200; y++) {
                yy = canvas.height - y;
                im.data[4 *(yy * canvas.width  + x)] = 0;
                im.data[4 *(yy * canvas.width  + x)+1] = 0;
                im.data[4 *(yy * canvas.width  + x)+2] = 255;
                im.data[4 *(yy * canvas.width  + x)+3] = 255;
            }

        }
        
        x += 1;
    }

    ctx.putImageData(im, 0, 0);
}


function draw() {
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSphere();
    drawRay();
    drawIntersections();

    if (state.drawGraph)
        drawGraph();
}

function update() {
    let overLock = false;

    if (isMouseInsideRadius(state.spherePosX, state.spherePosY, state.sphereHandleRadius) && !state.dragLock && !overLock) {
        state.isMouseOverSphereHandle = true;
        overLock = true;

        if (state.mouseDown) {
            state.draggingSphere = true;
            state.dragLock = true;
        }

    } else {
        state.isMouseOverSphereHandle = false;
    }

    if (isMouseInsideDisc(state.spherePosX, state.spherePosY, state.sphereRadius - 4, state.sphereRadius + 4) && !state.dragLock && !overLock) {
        state.isMouseOverRadiusHandle = true;
        overLock = true;

        if (state.mouseDown) {
            state.draggingRadius = true;
            state.dragLock = true;
        }
    } else {
        state.isMouseOverRadiusHandle = false;
    }

    if (isMouseInsideRadius(state.rayX, state.rayY, state.rayRadius) && !state.dragLock && !overLock) {
        state.isMouseOverRayPosHandle = true;
        overLock = true;

        if (state.mouseDown) {
            state.draggingRayPos = true;
            state.dragLock = true;
        }
    } else {
        state.isMouseOverRayPosHandle = false;
    }


    let x = state.rayX + state.rayDirX * 10000;
    let y = state.rayY + state.rayDirY * 10000;
    if (isMouseOverLineSegment(state.rayX, state.rayY, x, y) && !state.dragLock && !overLock) {
        state.isMouseOverRayDirHandle = true;
        overLock = true;

        if (state.mouseDown) {
            state.draggingRayDir = true;
            state.dragLock = true;
        }
    } else {
        state.isMouseOverRayDirHandle = false;
    }



    if (state.draggingSphere) {
        state.spherePosX = state.mouseX;
        state.spherePosY = state.mouseY;
    }

    if (state.draggingRayPos) {
        state.rayX = state.mouseX;
        state.rayY = state.mouseY;
    }

    if (state.draggingRadius) {
        let dx = state.mouseX - state.spherePosX;
        let dy = state.mouseY - state.spherePosY;

        let r = Math.sqrt(dx*dx + dy*dy);

        if (r >= state.sphereMinRadius) {
            state.sphereRadius = r;
        }
    }

    if (state.draggingRayDir) {
        let dx = state.mouseX - state.rayX;
        let dy = state.mouseY - state.rayY;
        let r = Math.sqrt(dx*dx + dy*dy);

        state.rayDirX = dx/r;
        state.rayDirY = dy/r;
    }
}

function updateInfo() {
    infoSpherePos.textContent = `(${state.spherePosX}, ${state.spherePosY})`;
    infoSphereRadius.textContent = `${state.sphereRadius}`;
    infoRayOrigin.textContent = `(${state.rayX}, ${state.rayY})`;
    infoRayAngle.textContent = `${state.angle * 180 / Math.PI}`;
}

function calc() {
    // Calculate angle between ray direction and ray-sphere vectors.
    let rsx = state.spherePosX - state.rayX;
    let rsy = state.spherePosY - state.rayY;

    let perp_rsx = rsy;
    let perp_rsy = -rsx;

    let cosAngle = (rsx * state.rayDirX + rsy * state.rayDirY)/Math.sqrt(rsx*rsx + rsy*rsy);
    state.angle = Math.acos(cosAngle);

    let angleSign = Math.sign(perp_rsx * state.rayDirX + perp_rsy * state.rayDirY);
    state.angle *= angleSign;

    calcRaySphereIntersection();
}

function calcRay(t) {
    return {
        x: state.rayX + state.rayDirX * t,
        y: state.rayY + state.rayDirY * t,
    }
}

function raySphereIntersection(spherePosX, spherePosY, sphereRadius, rayX, rayY, rayDirX, rayDirY) {
    let result = {
        intersectionCount: 0,
        t1: 0,
        t2: 0,
        p1x: 0,
        p1y: 0,
        p2x: 0,
        p2y: 0,
    }
    
    let ax = spherePosX - rayX;
    let ay = spherePosY - rayY;
    let dx = rayDirX;
    let dy = rayDirY;
    let R = sphereRadius;

    // t = d*a +- sqrt{ (d*a)^2 - (a^2 + R^2)}
    // t = A +- sqrt{A^2 + R^2 - a^2}
    // t = A +- sqrt{D}
    let A = dx * ax + dy * ay;
    let D = A*A + R*R - (ax*ax + ay*ay);

    if (D == 0) {
        result.intersectionCount = 1;
        result.t1 = A;

        let r = calcRay(result.t1);
        result.p1x = r.x;
        result.p1y = r.y;
        
    } else if (D > 0) {
        result.intersectionCount = 2;
        result.t1 = A + Math.sqrt(D);
        result.t2 = A - Math.sqrt(D);

        
        let r = calcRay(result.t1);
        result.p1x = r.x;
        result.p1y = r.y;

        if (result.t2 < 0) {
            result.intersectionCount = 1;
        } else {
            r = calcRay(result.t2);
            result.p2x = r.x;
            result.p2y = r.y;
        }
    } else {
        result.intersectionCount = 0;
    }
   
    return result;
}

function calcRaySphereIntersection() {
    let result = raySphereIntersection(state.spherePosX, state.spherePosY, state.sphereRadius, state.rayX, state.rayY, state.rayDirX, state.rayDirY);

    state.intersectionCount = result.intersectionCount;
    state.t1 = result.t1;
    state.t2 = result.t2;
    state.p1x = result.p1x;
    state.p1y = result.p1y;
    state.p2x = result.p2x;
    state.p2y = result.p2y;
}

function frame() {
    update();
    calc();
    draw();
    updateInfo();
    requestAnimationFrame(frame);
}

function isMouseInsideRadius(x, y, r) {
    var dx = x - state.mouseX;
    var dy = y - state.mouseY;

    return dx*dx + dy*dy < r*r;
}

function isMouseInsideDisc(x, y, r1, r2) {
    var min = Math.min(r1, r2);
    var max = Math.max(r1, r2);

    return isMouseInsideRadius(x, y, max) && !isMouseInsideRadius(x, y, min);
}

function isMouseOverLineSegment(ax, ay, bx, by, d = 4) {
    let arx = state.mouseX - ax;
    let ary = state.mouseY - ay;
    let abx = bx - ax;
    let aby = by - ay;
    let len = Math.sqrt(abx*abx + aby*aby);
    let abDirX = abx / len;
    let abDirY = aby / len;

    let dot = abDirX * arx + abDirY * ary;

    let px = ax + abDirX * dot;
    let py = ay + abDirY * dot;

    // ctx.beginPath();
    // ctx.arc(px, py, 20, 0, 2*Math.PI);
    // ctx.fill();

    let vx = state.mouseX - px;
    let vy = state.mouseY - py;

    let vlenX = Math.sqrt(vx*vx + vy*vy);

    return dot >= 0 && dot <= len && vlenX <= d;
}

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    state.mouseX =  evt.clientX - rect.left;
    state.mouseY = evt.clientY - rect.top;
}

canvas.addEventListener("mousemove", e => {
    updateMousePos(e);
});

canvas.addEventListener("mousedown", e => {
    state.mouseDown = true;
});

canvas.addEventListener("mouseup", e => {
    state.mouseDown = false;
    state.draggingSphere = false;
    state.draggingRadius = false;
    state.draggingRayPos = false;
    state.draggingRayDir = false;
    state.dragLock = false;
});

requestAnimationFrame(frame);


