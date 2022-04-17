const k=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerpolicy&&(s.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?s.credentials="include":r.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}};k();let u=null;class y{constructor(e,t,o,r){this.beforeText=e,this.afterText=t,this.displayText=o,this.colorClass="primary",this.clickHandler=r!=null?r:x}createElement(){const e=document.createElement("button");return e.classList.add("btn",`btn-${this.colorClass}`,"me-1","d-inline"),e.type="button",e.addEventListener("click",()=>this.clickHandler(this.bf,this.af)),e.addEventListener("mousedown",t=>t.preventDefault()),e.innerText=this.displayText,e}}class d{constructor(e,t){this.text=e,this.buttons=t.map(o=>new y(...o))}createElement(){const e=document.createElement("div");e.classList.add("mb-2");const t=document.createElement("div");t.classList.add("align-middle","h-100","d-inline-block","m-1"),t.innerText=this.text,e.appendChild(t);for(const o of this.buttons)e.appendChild(o.createElement());return e}}function x(n,e){if(!u)return;const t=u;if(t.selectionStart||t.selectionStart=="0"){const o=t.selectionStart,r=t.selectionEnd;t.value=t.value.substring(0,o)+n+t.value.substring(o,r)+e+t.value.substring(r),t.selectionStart=o+n.length,t.selectionEnd=r+n.length}}const T=[new d("General: ",[["$","$","$$"],["\\frac{","}{}","frac"],["\\sum_{","}^{}","sum"],["^{","}","^"],["_{","}","_"],["\\dots","","..."],["\\ans{","}","ans"]]),new d("Operators: ",[["\\cdot","","\u2022"],["\\cdots","","\u22EF"],["\\times","","\u2A2F"],["\\pm","","\xB1"],["\\sqrt{","}","\u221Ax"],["\\sqrt[","]{}","n\u221Ax"]]),new d("Equivalences: ",[["\\approx","","\u2248"],["\\equiv","","\u2261"],["\\propto","","\u221D"]]),new d("Inequalities: ",[["\\leq","","\u2264"],["\\geq","","\u2265"],["\\neq","","\u2260"],["\\nmid","","\u2224"]]),new d("Geometry: ",[["\\sim","","~"],["\\cong","","\u2245"],["\\angle","","\u2220"],["^{\\circ}","","\xB0"],["\\triangle","","\u25B3"],["\\|","","\u2225"],["\\nparallel","","\u2226"],["\\perp","","\u27C2"],["\\overline{","}","overline"]]),new d("Sets: ",[["\\in","","\u2208"],["\\ni","","\u220B"],["\\subset","","\u2282"],["\\subseteq","","\u2286"],["\\supset","","\u2283"],["\\supseteq","","\u2287"],["\\cup","","\u222A"],["\\cap","","\u2229"],["\\setminus","","\\"]]),new d("Arrows: ",[["\\to","","\u2192"],["\\gets","","\u2190"],["\\mapsto","","\u21A6"],["\\Rightarrow","","\u21D2"],["\\Leftarrow","","\u21D0"]])];function I(n){for(const e of T)n.appendChild(e.createElement());M(n)}class C extends y{constructor(e,t,o,r){super("\\"+e,"",t),this.name=e,this.lower=t,this.upper=o,this.alt=r,this.colorClass="secondary"}createElement(e){e=e!=null?e:"lower";const t=document.createElement("button");switch(t.classList.add("btn",`btn-${this.colorClass}`,"m-1","d-inline"),t.type="button",t.addEventListener("mousedown",o=>o.preventDefault()),e){case"lower":t.addEventListener("click",()=>this.clickHandler("\\"+this.name,"")),t.innerText=`${this.name} (${this.lower})`;break;case"upper":const o="\\"+this.name.charAt(0).toUpperCase()+this.name.substring(1);t.addEventListener("click",()=>this.clickHandler(o,"")),t.innerText=`${this.name} (${this.upper})`;break;case"alt":t.addEventListener("click",()=>this.clickHandler("\\var"+this.name,"")),t.innerText=`${this.name} (${this.alt})`;break;default:throw new Error("Invalid case")}return t}}const q="\u03B1\u03B2\u03B3\u03B4\u03B5\u03B6\u03B7\u03B8\u03B9\u03BA\u03BB\u03BC\u03BD\u03BE\u03BF\u03C0\u03C1\u03C3\u03C4\u03C5\u03C6\u03C7\u03C8\u03C9",B="\u0391\u0392\u0393\u0394\u0395\u0396\u0397\u0398\u0399\u039A\u039B\u039C\u039D\u039E\u039F\u03A0\u03A1\u03A3\u03A4\u03A5\u03A6\u03A7\u03A8\u03A9",E="    \u03F5  \u03D1 \u03F0     \u03D6\u03F1\u03C2  \u03D5   ",S=["alpha","beta","gamma","delta","epsilon","zeta","eta","theta","iota","kappa","lambda","mu","nu","xi","omicron","pi","rho","sigma","tau","upsilon","phi","chi","psi","omega"].map((n,e)=>new C(n,q[e],B[e],E[e]===" "?"":E[e]));function M(n){const e=document.createElement("div");e.classList.add("mb-2","dropup");const t=document.createElement("div");t.classList.add("align-middle","h-100","d-inline-block","m-1"),t.innerText="Greek: ",e.appendChild(t);for(const o of["lower","upper","alt"]){const r=document.createElement("div");r.classList.add("btn","btn-primary","dropdown-toggle","hover-dropdown","me-1"),r.innerText=o;const s=document.createElement("div");s.classList.add("hover-dropdown-content","bg-body","border","rounded");for(const[i,c]of S.entries())o==="alt"&&!c.alt||(s.appendChild(c.createElement(o)),i%4===3&&s.appendChild(document.createElement("br")));r.appendChild(s),e.appendChild(r)}n.appendChild(e)}function O(n){u=n;const e=document.createElement("div");e.id=`editor-${n.id}`,e.classList.add("editor","bg-body","border","border-secondary","rounded","p-2"),e.addEventListener("mousedown",t=>t.preventDefault()),I(e),n.after(e)}function D(n){var e;u.id===n.id&&(u=null),(e=document.getElementById(`editor-${n.id}`))==null||e.remove()}document.querySelectorAll("textarea").forEach(n=>{n.addEventListener("focus",e=>{O(n)}),n.addEventListener("blur",e=>{D(n)})});let w="";function v(n,e){let t,o;switch(e){case"err":t="danger",o="Error";break;case"warn":t="warning",o="Warning";break;case"info":t="info",o="Info";break;default:console.error("Invalid severity");return}const r=document.createElement("div");r.classList.add("alert",`alert-${t}`),r.innerText=`${o}: ${n}`,document.getElementById("errors").appendChild(r),document.getElementById("errors").classList.remove("d-none")}function H(){document.getElementById("errors").innerHTML="",document.getElementById("errors").classList.add("d-none")}function A(n){w=n,document.getElementById("compiledOutput").innerText=n,document.getElementById("outputSpace").classList.remove("d-none")}document.getElementById("copyButton").addEventListener("click",n=>{navigator.clipboard.writeText(w)});function G(){document.getElementById("outputSpace").classList.add("d-none"),H()}const N=document.getElementById("problemForm");function F(){return{type:document.getElementById("problemType").value,question:document.getElementById("questionText").value,comment:document.getElementById("commentText").value,answer:document.getElementById("answerText").value,solution:document.getElementById("solutionText").value}}function _(n,e,t,o){let r=0,s=!1,i=0;for(let c=0;c<n.length;c++){if(s){s=!1;continue}if(n[c]==="\\"&&o?s=!0:n[c]===t?r--:n[c]===e&&(r++,i=c),r<0)return{err:-1,ind:c}}return{err:r>0?1:0,ind:r>0?i:-1}}function P(n,e){let t=[],o=0,r=!1;for(let a=0;a<n.length;a++){if(r){r=!1;continue}n[a]==="\\"?r=!0:n[a]==="$"&&o++}o%2===1&&t.push({error:"Mismatching $ signs",sev:"err"}),e==="solution"&&n!==""&&(n.match("\\ans")||t.push({error:"Missing \\ans in solution",sev:"err"}));const s=n.match(/[^$]*(\$|.$)/gm)||[];let i=0,c=1,f=!1;for(const a of s){const L=[["{","}","err"],["[","]","err"],["(",")","warn"]];for(const[m,p,$]of L){const l=_(a,m,p,!0);if(l.err!==0){let h={error:"",sev:$};if(l.err===1){const g=(a.substring(0,l.ind).match(/\n/g)||[]).length,b=n.substring(i+l.ind-5,i+l.ind+6);h.error=`Mismatched ${m} around "${b}" (line ${c+g})`}else if(l.err===-1){const g=(a.substring(0,l.ind).match(/\n/g)||[]).length,b=n.substring(i+l.ind-10,i+l.ind);h.error=`Mismatched ${p} after "${b}" (line ${c+g})`}t.push(h)}}if(!f){const m=a.match(/\\\w+/g)||[];for(const p of m)t.push({error:`Control sequence ${p} is outside of $$. Make sure this is intentional!`,sev:"info"})}i+=a.length,c+=(a.match(`
`)||[]).length,f=!f}return t}function R(n){let e=!1;n.type===""&&(v("Missing problem type","err"),e=!0);for(const o of["question","comment","answer","solution"]){const r=P(n[o],o);for(const s of r)v(`In ${o}: ${s.error}`,s.sev),s.sev==="err"&&(e=!0)}if(e)return!1;const t=`\\input{../other/problem-preamble.tex}
\\ques[${n.type}]
\\begin{question}
${n.question}
\\end{question}

\\begin{comment}
${n.comment}
\\end{comment}

\\begin{answer}
${n.answer}
\\end{answer}

\\begin{solution}
${n.solution}
\\end{solution}

\\problemend`;return A(t),!0}N.addEventListener("submit",n=>{n.preventDefault(),G();const e=F();R(e)});
