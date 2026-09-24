const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const appPath = path.join(__dirname, "..", "app.js");
const source = fs.readFileSync(appPath, "utf8");
const start = source.indexOf("function mathAnswerOptions(q)");
const end = source.indexOf("\n\n  function answerOptions(q)", start);
assert(start >= 0 && end > start, "Could not locate mathAnswerOptions in app.js");

const functionSource = source.slice(start, end);
const shuffle = values => [...values].sort(() => Math.random() - 0.5);
const mathAnswerOptions = Function("shuffle", `${functionSource}; return mathAnswerOptions;`)(shuffle);

const prompts = new Set();
for (let a = 0; a <= 9; a++) {
  for (let b = 0; b <= 9; b++) {
    const expected = a * b;
    const question = {a, b, answer:String(expected)};
    prompts.add(`${a} × ${b}`);
    assert.equal(Array(a).fill(b).reduce((sum,value)=>sum+value,0), expected, `Feedback math failed for ${a} × ${b}`);

    for (let trial = 0; trial < 200; trial++) {
      const options = mathAnswerOptions(question);
      assert.equal(options.length, 4, `${a} × ${b} did not have four answers`);
      assert.equal(new Set(options).size, 4, `${a} × ${b} had duplicate answers`);
      assert(options.includes(String(expected)), `${a} × ${b} omitted the correct answer ${expected}`);
      assert(options.every(option => /^\d+$/.test(option)), `${a} × ${b} had an invalid answer`);
    }
  }
}

assert.equal(prompts.size, 100, "The full fluency bank must contain exactly 100 unique facts");
console.log("Validated 100 facts and 20,000 randomized answer sets: every product is correct and every set has four unique choices including the answer.");
