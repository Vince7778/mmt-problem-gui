
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
        btn.classList.add("btn", `btn-${this.colorClass}`, "me-1", "d-inline");
        btn.type = "button";
        btn.addEventListener("click", () => this.clickHandler(this));
        btn.addEventListener("mousedown", e => e.preventDefault()); // prevent taking focus
        btn.innerText = this.displayText;
        return btn;
    }
}

class EditorCategory {
    // btns should be an array of arrays of 3 strings representing the buttons
    constructor(txt, btns) {
        this.text = txt;
        this.buttons = btns.map(x => new EditorButton(...x));
    }

    createElement() {
        const cdiv = document.createElement("div");
        cdiv.classList.add("mb-2")

        const cpar = document.createElement("div");
        cpar.classList.add("align-middle", "h-100", "d-inline-block", "m-1");
        cpar.innerText = this.text;
        cdiv.appendChild(cpar);

        for (const btn of this.buttons) {
            cdiv.appendChild(btn.createElement());
        }
        return cdiv;
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
    new EditorCategory("General: ", [
        ["\\frac{", "}{}", "frac"],
        ["\\sum_{", "}^{}", "sum"],
        ["$", "$", "$$"],
        ["^{", "}", "^"],
        ["_{", "}", "_"],
        ["\\ans{", "}", "ans"]
    ]),
    new EditorCategory("Operators: ", [
        ["\\cdot", "", "•"],
        ["\\times", "", "⨯"],
        ["\\pm", "", "±"],
        ["\\sqrt{", "}", "√x"],
        ["\\sqrt[", "]{}", "n√x"]
    ]),
    new EditorCategory("Equivalences: ", [
        ["\\approx", "", "≈"],
        ["\\equiv", "", "≡"],
        ["\\propto", "", "∝"]
    ]),
    new EditorCategory("Inequalities: ", [
        ["\\leq", "", "≤"],
        ["\\geq", "", "≥"],
        ["\\neq", "", "≠"],
    ]),
    new EditorCategory("Geometry: ", [
        ["\\sim", "", "~"],
        ["\\cong", "", "≅"],
        ["\\angle", "", "∠"],
        ["^{\\circ}", "", "°"],
        ["\\triangle", "", "△"],
        ["\\|", "", "∥"],
        ["\\perp", "", "⟂"],
        ["\\overline{", "}", "overline"]
    ]),
    new EditorCategory("Sets: ", [
        ["\\in", "", "∈"],
        ["\\ni", "", "∋"],
        ["\\subset", "", "⊂"],
        ["\\subseteq", "", "⊆"],
        ["\\supset", "", "⊃"],
        ["\\supseteq", "", "⊇"],
        ["\\cup", "", "∪"],
        ["\\cap", "", "∩"],
        ["\\setminus", "", "\\"]
    ]),
    new EditorCategory("Arrows: ", [
        ["\\to", "", "→"],
        ["\\gets", "", "←"],
        ["\\mapsto", "" ,"↦"],
        ["\\Rightarrow", "", "⇒"],
        ["\\Leftarrow", "", "⇐"]
    ])
];

function buildEditor(par) {
    for (const btnCategory of buttonList) {
        par.appendChild(btnCategory.createElement());
    }
}

function activate(el) {
    activeTextarea = el;

    const ndiv = document.createElement("div");
    ndiv.id = `editor-${el.id}`;
    ndiv.classList.add("editor", "bg-body", "border", "border-secondary", "rounded", "p-2");
    ndiv.addEventListener("mousedown", e => e.preventDefault()); // prevent losing focus
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
