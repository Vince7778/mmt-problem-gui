
function showError(str) {
    // TODO: implement
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
        valid: true
    }
}

function compileTemplate(vals) {
    if (vals.type === "") {
        showError("Please choose a problem type");
        return false;
    }

    // check latex of all fields
    for (const field of ["question", "comment", "answer", "solution"]) {
        const resp = checkLatex(vals[field], field);
        if (!resp.valid) {
            showError(resp.error);
            return false;
        }
    }

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
