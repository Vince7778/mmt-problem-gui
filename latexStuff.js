
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

export function checkLatex(str, field) {
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
