
let activeTextarea = null;

class EditorButton {
    constructor(bf, af, disp, handler) {
        this.beforeText = bf;
        this.afterText = af;
        this.displayText = disp;
        this.colorClass = "primary";
        this.clickHandler = handler ?? insertText;
    }

    createElement() {
        const btn = document.createElement("button");
        btn.classList.add("btn", `btn-${this.colorClass}`, "mt-2", "me-1", "d-inline");
        btn.type = "button";
        btn.addEventListener("click", () => this.clickHandler(this));
        btn.addEventListener("mousedown", e => e.preventDefault()); // prevent taking focus
        btn.innerText = this.displayText;
        return btn;
    }
}

function insertText(btn) {
    if (!activeTextarea) return;
    const el = activeTextarea;
    const bf = btn.beforeText, af = btn.afterText;

    if (el.selectionStart || el.selectionStart == '0') {
        const sp = el.selectionStart;
        const ep = el.selectionEnd;
        el.value = el.value.substring(0, sp) + bf + el.value.substring(sp, ep) + af + el.value.substring(ep);
        el.selectionStart = sp + bf.length;
        el.selectionEnd = ep + bf.length;
    }
}

const buttonList = [
    new EditorButton("\\frac{", "}{}", "frac"),
    new EditorButton("$", "$", "$$"),
    new EditorButton("^{", "}", "^"),
    new EditorButton("_{", "}", "_"),
    new EditorButton("\\cdot", "", "•"),
    new EditorButton("\\times", "", "⨯"),
    new EditorButton("^{\circ}", "", "°"),
    new EditorButton("\\sqrt{", "}", "√x")
];

function buildEditor(par) {
    for (const btn of buttonList) {
        par.appendChild(btn.createElement());
    }
}

function activate(el) {
    activeTextarea = el;

    const ndiv = document.createElement("div");
    ndiv.id = `editor-${el.id}`;
    ndiv.classList.add("editor");
    buildEditor(ndiv);
    el.after(ndiv);
}

function deactivate(el) {
    if (activeTextarea.id === el.id) activeTextarea = null;
    document.getElementById(`editor-${el.id}`)?.remove();
}

document.querySelectorAll("textarea").forEach(el => {
    el.addEventListener("focus", ev => {
        activate(el);
    })

    el.addEventListener("blur", ev => {
        deactivate(el);
    })
});
