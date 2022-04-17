
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
    document.getElementById("compiledOutput").innerText = str;
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

function checkLatex(str, field) {
    // implement later
    return {
        valid: false,
        error: "Test error",
        sev: "err"
    }
}

function compileTemplate(vals) {
    let failed = false;
    if (vals.type === "") {
        showError("Missing problem type", "err");
        failed = true;
    }

    // check latex of all fields
    for (const field of ["question", "comment", "answer", "solution"]) {
        const resp = checkLatex(vals[field], field);
        if (!resp.valid) {
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

\\problemend`;

    showResult(template);
    return true;
}

formElement.addEventListener("submit", ev => {
    ev.preventDefault();

    const vals = getFormValues();
    compileTemplate(vals);
});
