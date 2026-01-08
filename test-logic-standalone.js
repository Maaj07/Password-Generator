
const generateSecurePassword = (manualPassword, options) => {
    const {
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
    } = options;

    if (
        !includeUppercase &&
        !includeLowercase &&
        !includeNumbers &&
        !includeSymbols
    ) {
        return "";
    }

    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+{}[]:;<>,.?/|";

    let validChars = "";
    if (includeUppercase) validChars += uppercaseChars;
    if (includeLowercase) validChars += lowercaseChars;
    if (includeNumbers) validChars += numberChars;
    if (includeSymbols) validChars += symbolChars;

    if (!validChars) return "";

    let result = "";
    // Target length is at least the manual password length, or the slider length if larger
    const targetLength = Math.max(length, manualPassword.length);

    for (let i = 0; i < targetLength; i++) {
        if (i < manualPassword.length) {
            const originalChar = manualPassword[i];
            const isOriginalValid = validChars.includes(originalChar);

            // 50% chance to keep original character if it's valid according to current options
            if (isOriginalValid && Math.random() > 0.5) {
                result += originalChar;
            } else {
                // Otherwise replace with a random valid character
                result += validChars[Math.floor(Math.random() * validChars.length)];
            }
        } else {
            // Padding with random valid characters
            result += validChars[Math.floor(Math.random() * validChars.length)];
        }
    }

    return result;
};

const options = {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
};

console.log("--- Test 1: Empty Input ---");
const out1 = generateSecurePassword("", options);
console.log("Result len:", out1.length); // Should be 16

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
// Check for symbols !@#$%^&*()_+{}[]:;<>,.?/|
const symbolChars = "!@#$%^&*()_+{}[]:;<>,.?/|";
let hasSymbol = false;
for (const char of out3) {
    if (symbolChars.includes(char)) hasSymbol = true;
}

if (hasSymbol) {
    console.error("FAIL: output contains symbols!");
} else {
    console.log("PASS: No symbols found.");
}

console.log("\n--- Test 4: Length Constraint ---");
const longOpt = { ...options, length: 32 };
const out4 = generateSecurePassword("short", longOpt);
console.log("Input: short, Length: 32");
console.log("Output Len:", out4.length);
if (out4.length !== 32) console.error("FAIL: Length mismatch");

const shortOpt = { ...options, length: 5 };
const out5 = generateSecurePassword("verylongpassword", shortOpt);
console.log("Input: verylongpassword, Length: 5 (should be ignored)");
console.log("Output Len:", out5.length);
if (out5.length < 16) console.error("FAIL: Should be at least input length (16)"); 
