export type PasswordOptions = {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
};

export const generatePassword = (options: PasswordOptions): string => {
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

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * validChars.length);
        generatedPassword += validChars[randomIndex];
    }

    return generatedPassword;
};

export const generateSecurePassword = (manualPassword: string, options: PasswordOptions): string => {
    const {
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

    // Strict 1-to-1 mapping: Loop exactly the length of the manual password
    for (let i = 0; i < manualPassword.length; i++) {
        const originalChar = manualPassword[i];
        const isOriginalValid = validChars.includes(originalChar);

        // 50% chance to keep original character if it's valid according to current options
        if (isOriginalValid && Math.random() > 0.5) {
            result += originalChar;
        } else {
            // Otherwise replace with a random valid character
            result += validChars[Math.floor(Math.random() * validChars.length)];
        }
    }

    return result;
};

export const calculateStrength = (password: string): number => {
    let score = 0;
    if (!password) return 0;

    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;

    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return Math.min(score, 4); // 0-4 scale
};

export const getStrengthLabel = (score: number): string => {
    switch (score) {
        case 0:
        case 1:
            return "Weak";
        case 2:
        case 3:
            return "Medium";
        case 4:
            return "Strong";
        default:
            return "Weak";
    }
};
