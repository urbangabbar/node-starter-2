import { a, b } from "./abc.mjs";
import { add, subtract } from "./maths.mjs";
// in default export you dont need brackets to import
// in regualr export you woul need curly braces

console.log(subtract(a, b));
console.log(add(a, b));
