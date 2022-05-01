export class Color {
    r = 0
    g = 0
    b = 0 

    constructor(r = 0, g = 0, b = 0) {
        if (typeof(r) === "string") {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r);
            if (result)
            {
                this.r = parseInt(result[1], 16);
                this.g = parseInt(result[2], 16);
                this.b = parseInt(result[3], 16);
            }
            else
            {
                throw "Invalid hex string!";
            }
        } else {
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }

    toLinear() {
        let r = Math.trunc(Math.pow(this.r/255, 2.4) * 255);
        let g = Math.trunc(Math.pow(this.g/255, 2.4) * 255);
        let b = Math.trunc(Math.pow(this.b/255, 2.4) * 255);

        return new Color(r, g, b);
    }

    distance(c) {
        let dr = this.r - c.r;
        let dg = this.g - c.g;
        let db = this.b - c.b;
        
        return Math.sqrt(dr*dr + dg*dg + db*db);
    }

    distance2(c) {
        let dr = this.r - c.r;
        let dg = this.g - c.g;
        let db = this.b - c.b;
        
        return dr*dr + dg*dg + db*db;
    }
}


export class V2 {
    x = 0;
    y = 0;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

export class DumbImGui {
    elementIds = new Map();
    visibleIds = new Set();
    hiddenIds = new Map();
    elementStates = new Map();
    elementIdCount = 0;
    rootNode = document.body;
    currentNode = null;
    mousePos = new V2();
    
    constructor(container) {
        if (container) {
            this.rootNode = container;
        }

        this.currentNode = this.rootNode;
        document.body.addEventListener("mousemove", e => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });
    }

    nextId() {
        this.elementIdCount++;
        return this.elementIdCount;
    }
    
    getId(name) {
        let id;

        if (!this.elementIds.has(name)) {
            id = this.nextId();
            this.elementIds.set(name, id);
        } else {
            id = this.elementIds.get(name);
        }

        this.visibleIds.add(id);
        
        if (this.hiddenIds.has(id)) {
            let state = this.elementStates.get(id);
            state.el.style.display = this.hiddenIds.get(id);
            this.hiddenIds.delete(id);
        }

        return id;
    }

    bootstrapElement(name, defaultState) {
        let id, state;

        id = this.getId(name);

        if (!this.elementStates.has(id)) {
            state = defaultState;
            state.el = null;
            this.elementStates.set(id, state);
        } else {
            state = this.elementStates.get(id);
        }

        return { state, id };
    }

    invokeChildren(el, children) {
        if (children) {
            let old = this.currentNode;
            
            if (typeof(children) === "function") {
                children();
            } else if (Array.isArary(children)) {
                children.forEach(c => { c(); });
            }
            
            this.currentNode = old;
        }
    }

    applyOpts(el, opts) {
        if (!opts) return;
        
        if (opts.className) {
            el.className = opts.className;
        }

        if (opts.style) {
            Object.keys(style).forEach(k => { el.style[k] = opts.style[k]; });
        }
    }

    createEl(state, tag) {
        if (state.el == null) {
            state.el = document.createElement(tag);
            this.currentNode.appendChild(state.el);

            return true;
        }

        return false;
    }
    

    button(name, label, children, opts) {
        let { state, id } = this.bootstrapElement(name, { label, click: false });

        if (state.el == null) {
            let btn = document.createElement("button");
            btn.textContent = state.label;
            this.currentNode.appendChild(btn);
            state.el = btn;
            state.el.addEventListener("click", () => {
                state.click = true;
            });
        }

        this.applyOpts(state.el, opts);

        if (label != state.label) {
            state.el.textContent = label;
            state.label = label;
        }

        this.elementStates.set(id, state);
        this.invokeChildren(children);

        if (state.click) {
            state.click = false;
            return true;
        }

        return false;
    }
    
    _H(name, n, text, opts) {
        let { state, id } = this.bootstrapElement(name, { text });

        if (this.createEl(state, `h${n}`)) {
            state.el.textContent = text;
        }

        this.applyOpts(state.el, opts);

        if (state.text != text) {
            state.el.textContent = text;
        }

        this.elementStates.set(id, state);
    }

    h1(name, text) {
        this._H(name, 1, text);
    }

    h2(name, text) {
        this._H(name, 2, text);
    }

    p(name, text, opts) {
        let { state, id } = this.bootstrapElement(name, { text, el: null });

        if (state.el == null) {
            let el = document.createElement("p");
            el.textContent = state.text;
            this.currentNode.appendChild(el);
            state.el = el;
        }

        this.applyOpts(state.el, opts);

        if (text != state.text) {
            state.el.textContent = text;
            state.text = text;
        }

        this.elementStates.set(id, state);
    }

    div(name, childrenFn, opts) {
        let { state, id } = this.bootstrapElement(name, { });

        if (state.el == null) {
            state.el = document.createElement("div");
            this.currentNode.appendChild(state.el);
        }

        this.applyOpts(state.el, opts);
        this.callChildFn(state.el, childrenFn);
        this.elementStates.set(id, state);
    }

    img(name, url, opts) {
        let { id, state } = this.bootstrapElement(name, { url });

        if (state.el == null) {
            state.el = new Image();
            state.el.src = url;
            this.currentNode.appendChild(state.el);
        }

        this.applyOpts(state.el, opts);

        if (url != state.url) {
            state.el.src = url;
            state.url = url;
        }

        this.elementStates.set(id, state);
    }

    checkbox(name, label, checked, checkboxOpts, labelOpts) {
        let { id, state } = this.bootstrapElement(name, { changed: false, newValue: false, labelEl: null });

        if (this.createEl(state, "input")) {
            state.el.type = "checkbox";
            state.el.id = `checkbox_${id}`;
            state.el.textContent = label;
            // state.el.style.verticalAlign = "middle";
            state.labelEl = document.createElement("label");
            state.labelEl.htmlFor = state.el.id;
            state.labelEl.textContent = label;
            // state.labelEl.style.verticalAlign = "middle";
            // state.labelEl.style.marginLeft = "4px";
            this.currentNode.appendChild(state.labelEl);

            state.el.addEventListener("change", e => {
                console.log("change", id);
                state.changed = true;
                state.newValue = e.target.checked;
            });
        }

        this.applyOpts(state.el, checkboxOpts);
        this.applyOpts(state.labelEl, labelOpts);

        state.el.checked = checked;

        if (state.changed) {
            state.changed = false;
            
            return state.newValue;
        }
        
        return checked;
    }

    select(name, label, options, selected, optsSelect, optsLabel) {
        
        let { id, state } = this.bootstrapElement(name, { changed: false, newValue: -1, options });
        let needsUpdate = false;
        
        if (this.createEl(state, "select")) {
            state.el.id = `selct_${id}`;
            // state.el.textContent = label;
            state.labelEl = document.createElement("label");
            state.labelEl.htmlFor = state.el.id;
            state.labelEl.textContent = label;

            this.currentNode.insertBefore(state.labelEl, state.el);

            state.el.addEventListener("change", e => {
                console.log("change", id);
                state.changed = true;
                state.newValue = e.target.value;
            });
            needsUpdate = true;
        }

        if (state.options.length != options.length) {
            needsUpdate = true;
        } else {
            for (let i = 0; i < options.length; i++) {
                if (options[i] != state.options[i]) {
                    needsUpdate = true;
                }
            }
        }

        if (needsUpdate) {
            let opts = state.el.options;
            for (let i = 0; i < opts.length; i++) {
                state.el.remove(i);
            }

            for (let i = 0; i < options.length; i++) {
                let o = document.createElement("option");
                o.value = options[i];
                o.textContent = options[i];
                state.el.appendChild(o);
            }
        }

        state.el.value = options[selected];

        if (state.changed) {
            state.changed = false;
            return options.indexOf(state.newValue);
        }

        return selected;
    }

    canvas(name, width, height, drawFn, opts) {
        let { id, state } = this.bootstrapElement(name, { ctx: null, width, height });

        if (state.el == null) {
            state.el = document.createElement("canvas");
            state.el.width = width;
            state.el.height = height;
            state.width = width;
            state.height = height;
            state.ctx = state.el.getContext("2d");
            this.currentNode.appendChild(state.el);
        }

        this.applyOpts(state.el, opts);

        if (state.width != width) {
            state.el.width = width;
            state.width = width;
        }

        if (state.height != height) {
            state.el.height = height;
            state.height = height;
        }

        let ctx = state.ctx;
        let rect = state.el.getBoundingClientRect();
        let mousePos = new V2(this.mousePos.x - rect.x, this.mousePos.y - rect.y);


        if (drawFn != null) {
            drawFn({
                _ctx: ctx,
                mousePos,
                width: state.width,
                height: state.height,
                mouseOver: (x, y, w, h) => {
                    return mousePos.x >= x && mousePos.x <= (x + w) &&
                            mousePos.y >= y && mousePos.y <= (y + h);
                },
                clear: (r, g, b) => {

                    if (r instanceof Color) {
                        g = r.g;
                        b = r.b;
                        r = r.r;
                    }

                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.fillRect(0, 0, state.width, state.height);
                },
                drawRect: (x, y, w, h, r, g = 1, b, lineWidth = 1) => {
                    if (r instanceof Color) {
                        lineWidth = g;
                        g = r.g;
                        b = r.b;
                        r = r.r;
                    }

                    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.lineWidth = lineWidth;
                    ctx.strokeRect(x, y, w, h);
                },
                fill: (x, y, w, h, r, g, b) => {
                    if (r instanceof Color) {
                        g = r.g;
                        b = r.b;
                        r = r.r;
                    }

                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.fillRect(x, y, w, h);
                },
                shader: fn => {
                    let im = ctx.getImageData(0, 0, state.width, state.height);
                    for (let x = 0; x < state.width; x++) {
                        for (let y = 0; y < state.height; y++) {

                            let r = im.data[4 * (state.width * y + x)];
                            let g = im.data[4 * (state.width * y + x) + 1];
                            let b = im.data[4 * (state.width * y + x) + 2];

                            let c = fn(x, y, new Color(r, g, b));

                            im.data[4 * (state.width * y + x)] = c.r;
                            im.data[4 * (state.width * y + x) + 1] = c.g;
                            im.data[4 * (state.width * y + x) + 2] = c.b;
                            im.data[4 * (state.width * y + x) + 3] = 255;
                        }
                    }
                    ctx.putImageData(im, 0, 0);
                }
            });
        }

       this.elementStates.set(id, state);
    }

    callChildFn(el, fn) {
        if (fn != null) {
            let old = this.currentNode;
            this.currentNode = el;
            fn();
            this.currentNode = old;
        }
    }

    endOfFrame() {
        this.elementIds.forEach(id => {
            if (!this.visibleIds.has(id)) {
                let state = this.elementStates.get(id);
                if (!this.hiddenIds.has(id)) {
                    this.hiddenIds.set(id, state.el.style.display);
                    state.el.style.display = "none";
                }
            }
        });
        
        this.visibleIds.clear();
    }

    run(fn) {
        fn(this);
        this.endOfFrame();
        
        requestAnimationFrame(() => {
            this.run(fn);
        });
    }
}
