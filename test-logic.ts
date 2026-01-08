
import { generateSecurePassword } from './src/lib/password-utils';

const options = {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
};

console.log("--- Test 1: Empty Input ---");
console.log("Result:", generateSecurePassword("", options)); // Should be empty string based on logic? Wait, logic says "targetLength = max(length, manual.length)". loops targetLength. 
// If manual is empty, loop 16 times. for i < manual.length (0) -> false. Else padding.
// So it generates a random password of length 16.

console.log("\n--- Test 2: Standard Input 'password' ---");
const out2 = generateSecurePassword("password", options);
console.log("Input: password");
console.log("Output:", out2);
console.log("Length:", out2.length);

console.log("\n--- Test 3: No Symbols ---");
const noSymbols = { ...options, includeSymbols: false };
const out3 = generateSecurePassword("password!", noSymbols);
console.log("Input: password!");
console.log("Output:", out3);
// Check for symbols
if (/[!@#$%^&*()_+{}[\]:;<>,.?\/ |]/.test(out3)) {
    console.error("FAIL: output contains symbols!");
} else {
    console.log("PASS: No symbols found.");
}

console.log("\n--- Test 4: Length Constraint ---");
const longOpt = { ...options, length: 32 };
const out4 = generateSecurePassword("short", longOpt);
console.log("Input: short, Length: 32");
console.log("Output Len:", out4.length);

const shortOpt = { ...options, length: 5 };
const out5 = generateSecurePassword("verylongpassword", shortOpt);
console.log("Input: verylongpassword, Length: 5 (should be ignored)");
console.log("Output Len:", out5.length);
