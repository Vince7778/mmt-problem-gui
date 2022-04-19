import "./textEditor.js";

let lastOutput = "";

// Severities: "err", "warn", "info"
function showError(str, sev) {
    let sevClass, errTypeText;
    switch (sev) {
        case "err":
            sevClass = "danger";
            errTypeText = "Error";
            break;
        case "warn":
            sevClass = "warning";
            errTypeText = "Warning";
            break;
        case "info":
            sevClass = "info";
            errTypeText = "Info";
            break;
        default:
            console.error("Invalid severity");
            return;
    }

    const elem = document.createElement("div");
    elem.classList.add("alert", `alert-${sevClass}`);
    elem.innerText = `${errTypeText}: ${str}`;
    document.getElementById("errors").appendChild(elem);

    document.getElementById("errors").classList.remove("d-none");
}

function clearErrors() {
    document.getElementById("errors").innerHTML = "";
    document.getElementById("errors").classList.add("d-none");
}

function showResult(str) {
    lastOutput = str;
    document.getElementById("compiledOutput").innerText = str;
    document.getElementById("outputSpace").classList.remove("d-none");
}

document.getElementById("copyButton").addEventListener("click", ev => {
    navigator.clipboard.writeText(lastOutput);
});

function resetDisplays() {
    document.getElementById("outputSpace").classList.add("d-none");
    clearErrors();
}

const formElement = document.getElementById("problemForm");

function getFormValues() {
    return {
        type: document.getElementById("problemType").value,
        question: document.getElementById("questionText").value,
        comment: document.getElementById("commentText").value,
        answer: document.getElementById("answerText").value,
        solution: document.getElementById("solutionText").value
    };
}

// needs to open with c1 and close with c2
// returns 0 if no mismatch, 1 if left open, -1 if premature close
function checkMismatch(str, c1, c2, ignoreBackslash) {
    let depth = 0, skip = false, lastC1 = 0;
    for (let i = 0; i < str.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }

        if (str[i] === '\\' && ignoreBackslash) {
            skip = true;
        } else if (str[i] === c2) {
            depth--;
        } else if (str[i] === c1) {
            depth++;
            lastC1 = i;
        }

        if (depth < 0) {
            return {
                err: -1,
                ind: i
            };
        }
    }

    return {
        err: depth > 0 ? 1 : 0,
        ind: depth > 0 ? lastC1 : -1,
    }
}

function checkLatex(str, field) {
    let errorList = [];

    // check mismatching $
    let dollarCount = 0, skip = false;
    for (let i = 0; i < str.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }
        if (str[i] === '\\') skip = true;
        else if (str[i] === '$') dollarCount++;
    }
    if (dollarCount % 2 === 1) {
        errorList.push({
            error: "Mismatching $ signs",
            sev: "err"
        });
    }

    // check for \ans in solution
    if (field === "solution" && str !== "") {
        if (!str.match("\\ans")) {
            errorList.push({
                error: "Missing \\ans in solution",
                sev: "err"
            })
        }
    }

    // check between $$
    const dollarList = str.match(/[^$]*(\$|.$)/gm) || [];
    let curInd = 0; // current index in actual string
    let curLine = 1;
    let inDollars = false;
    for (const istr of dollarList) {
        // check mismatching brackets
        const bracketList = [
            ['{', '}', "err"],
            ['[', ']', "err"],
            ['(', ')', "warn"]
        ];
        for (const [c1, c2, sev] of bracketList) {
            const res = checkMismatch(istr, c1, c2, true);
            if (res.err !== 0) {
                let retErr = {
                    error: "",
                    sev: sev
                }
                if (res.err === 1) {
                    const linesBetween = (istr.substring(0, res.ind).match(/\n/g) || []).length;
                    const subStr = str.substring(curInd+res.ind-5, curInd+res.ind+6);
                    retErr.error = `Mismatched ${c1} around "${subStr}" (line ${curLine+linesBetween})`;
                } else if (res.err === -1) {
                    const linesBetween = (istr.substring(0, res.ind).match(/\n/g) || []).length;
                    const subStr = str.substring(curInd+res.ind-10, curInd+res.ind);
                    retErr.error = `Mismatched ${c2} after "${subStr}" (line ${curLine+linesBetween})`;
                }
                errorList.push(retErr);
            }
        }

        // check control sequences
        if (!inDollars) {
            const controlMatch = istr.match(/\\\w+/g) || [];
            for (const cc of controlMatch) {
                errorList.push({
                    error: `Control sequence ${cc} is outside of $$. Make sure this is intentional!`,
                    sev: "info"
                });
            }
        }

        curInd += istr.length;
        curLine += (istr.match("\n") || []).length;
        inDollars = !inDollars;
    }

    return errorList;
}

function compileTemplate(vals) {
    let failed = false;
    if (vals.type === "") {
        showError("Missing problem type", "err");
        failed = true;
    }

    // check latex of all fields
    for (const field of ["question", "comment", "answer", "solution"]) {
        const respList = checkLatex(vals[field], field);
        for (const resp of respList) {
            showError(`In ${field}: ${resp.error}`, resp.sev);
            if (resp.sev === "err") failed = true;
        }
    }
    if (failed) return false;

    const template = `\
\\input{../other/problem-preamble.tex}
\\ques[${vals.type}]
\\begin{question}
${vals.question}
\\end{question}

\\begin{comment}
${vals.comment}
\\end{comment}

\\begin{answer}
${vals.answer}
\\end{answer}

\\begin{solution}
${vals.solution}
\\end{solution}

% This code was generated by Conor's program. If something goes wrong, blame him
\\problemend`;

    showResult(template);
    return true;
}

formElement.addEventListener("submit", ev => {
    ev.preventDefault();

    resetDisplays();
    const vals = getFormValues();
    compileTemplate(vals);
});
