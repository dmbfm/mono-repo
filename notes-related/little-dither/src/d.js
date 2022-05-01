import { log, assert } from "./common.js";

function parseTag(str) {
    let i = 0;

    let tag = null;
    let id = null;
    let className = null;

    // 0 -> tag, 1 -> id, 2 -> className
    let state = 0;

    // debugger;
    while (i < str.length) {
        let ch = str[i++];

        switch (state) {
            case 0:
                {
                    if (ch == ".") {
                        state = 1;
                        continue;
                    } else if (ch == "#") {
                        state = 2;
                        continue;
                    } else {
                        if (tag == null) {
                            tag = "";
                        }
                        tag += ch;
                    }
                }
                break;

            case 1:
                {
                    if (ch == "#") {
                        if (className != null) {
                            throw `Error parsing tag "${str}" at char ${i - 1}`;
                        }
                        state = 2;
                        continue;
                    } else {
                        if (id == null) {
                            id = "";
                        }
                        id += ch;
                    }
                }
                break;

            case 2:
                {
                    if (ch == ".") {
                        if (id != null) {
                            throw `Error parsing tag "${str}" at char ${i - 1}`;
                        }
                        state = 1;
                        continue;
                    } else {
                        if (className == null) {
                            className = "";
                        }
                        className += ch;
                    }
                }
                break;
        }
    }

    return { tag, id, className };
}

export function addChildren(el, children) {
    log("[_addChildren]", { el, children });
    if (typeof (children) === "function") {

        el.appendChild(children());

    } else if (typeof (children) === "string") {

        el.textContent = children;

    } else if (children instanceof HTMLElement) {

        el.appendChild(children);

    } else if (Array.isArray(children)) {

        for (let i = 0; i < children.length; i++) {
            addChildren(el, children[i]);
        }
    } else if (typeof (children) == "object" && children.hasOwnProperty("el")) {
        el.appendChild(children.el);
    } else {

        return false;

    }

    return true;
}


export function el(tagIdClass, childrenOrAttrs, attrs) {

    log("[el]", { tagIdClass, childrenOrAttrs, attrs });

    let { tag, id, className } = parseTag(tagIdClass);

    assert(tag);

    let _el = document.createElement(tag);

    if (id) {
        _el.id = id;
    }

    if (className) {
        _el.className = className;
    }

    if (childrenOrAttrs) {

        if (!addChildren(_el, childrenOrAttrs)) {

            if (typeof (childrenOrAttrs) == "object") {

                attrs = childrenOrAttrs;

            } else {

                console.log(childrenOrAttrs);

                throw "Invalid childrenOrAttrs argument!";

            }
        }
    }

    if (attrs) {
        let keys = Object.keys(attrs);

        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];

            if (k != "style") {
                _el[k] = attrs[k];
            }
        }

        if (attrs.style) {
            for (let i = 0; i < Object.keys(attrs.style).length; i++) {
                let k = Object.keys(attrs.style)[i];
                _el.style[k] = attrs.style[k];
            }
        }
    }

    return _el;
}

export function mount(el, container) {
    
    if (!container) {
        container = document.body;
    }

    assert(container);

    if (typeof(el) == "object" && el.hasOwnProperty("el")) {
        el = el.el;
    }

    container.appendChild(el);
}


