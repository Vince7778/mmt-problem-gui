
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
        btn.addEventListener("click", () => this.clickHandler(this.bf, this.af));
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

function insertText(bf, af) {
    if (!activeTextarea) return;
    const el = activeTextarea;

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
        ["$", "$", "$$"],
        ["\\frac{", "}{}", "frac"],
        ["\\sum_{", "}^{}", "sum"],
        ["^{", "}", "^"],
        ["_{", "}", "_"],
        ["\\dots", "", "..."],
        ["\\ans{", "}", "ans"]
    ]),
    new EditorCategory("Operators: ", [
        ["\\cdot", "", "•"],
        ["\\cdots", "", "⋯"],
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
        ["\\nmid", "", "∤"]
    ]),
    new EditorCategory("Geometry: ", [
        ["\\sim", "", "~"],
        ["\\cong", "", "≅"],
        ["\\angle", "", "∠"],
        ["^{\\circ}", "", "°"],
        ["\\triangle", "", "△"],
        ["\\|", "", "∥"],
        ["\\nparallel", "", "∦"],
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
    buildGreek(par);
}

//greek

class GreekButton extends EditorButton {
    constructor(name, lower, upper, alt) {
        super("\\"+name, "", lower);
        this.name = name;
        this.lower = lower;
        this.upper = upper;
        this.alt = alt;
        this.colorClass = "secondary";
    }

    createElement(version) {
        version = version ?? "lower";

        const btn = document.createElement("button");
        btn.classList.add("btn", `btn-${this.colorClass}`, "m-1", "d-inline");
        btn.type = "button";
        btn.addEventListener("mousedown", e => e.preventDefault()); // prevent taking focus

        switch(version) {
            case "lower":
                btn.addEventListener("click", () => this.clickHandler("\\"+this.name, ""));
                btn.innerText = `${this.name} (${this.lower})`;
                break;
            case "upper":
                const upperName = "\\"+this.name.charAt(0).toUpperCase() + this.name.substring(1);
                btn.addEventListener("click", () => this.clickHandler(upperName, ""));
                btn.innerText = `${this.name} (${this.upper})`;
                break;
            case "alt":
                btn.addEventListener("click", () => this.clickHandler("\\var"+this.name, ""));
                btn.innerText = `${this.name} (${this.alt})`;
                break;
            default:
                throw new Error("Invalid case");
        }

        return btn;
    }
}

const greekLower = "αβγδεζηθικλμνξοπρστυφχψω";
const greekUpper = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
const greekAlts =  "    ϵ  ϑ ϰ     ϖϱς  ϕ   ";
const greekList = ["alpha","beta","gamma","delta","epsilon","zeta","eta","theta","iota","kappa","lambda","mu","nu","xi","omicron","pi","rho","sigma","tau","upsilon","phi","chi","psi","omega"]
    .map((v, i) => new GreekButton(v, greekLower[i], greekUpper[i], greekAlts[i] === " " ? "" : greekAlts[i]));

function buildGreek(par) {
    // custom category
    const cdiv = document.createElement("div");
    cdiv.classList.add("mb-2", "dropup")

    const cpar = document.createElement("div");
    cpar.classList.add("align-middle", "h-100", "d-inline-block", "m-1");
    cpar.innerText = "Greek: ";
    cdiv.appendChild(cpar);

    for (const variant of ["lower", "upper", "alt"]) {
        const dd = document.createElement("div");
        dd.classList.add("btn", "btn-primary", "dropdown-toggle", "hover-dropdown", "me-1");
        dd.innerText = variant;

        const ddi = document.createElement("div");
        ddi.classList.add("hover-dropdown-content", "bg-body", "border", "rounded");
        for (const [i, btn] of greekList.entries()) {
            if (variant === "alt" && !btn.alt) continue;
            ddi.appendChild(btn.createElement(variant));
            if (i%4 === 3) ddi.appendChild(document.createElement("br"));
        }
        dd.appendChild(ddi);
        cdiv.appendChild(dd);
    }

    par.appendChild(cdiv);
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
