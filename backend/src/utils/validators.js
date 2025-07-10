export const emailValidator = (email) => {
    /**
     * This regex checks for a string that:
     * - Starts with one or more word characters (letters, digits, or underscores), hyphens, or dots.
     * - Contains an '@' symbol.
     * - Followed by one or more groups of word characters or hyphens, each followed by a dot.
     * - Ends with 2 to 4 word characters or hyphens (the domain TLD).
     *
     * Note: This regex covers most common email formats but may not match all valid email addresses as per RFC standards.
     */
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
};

export const usernameValidator = (username) => {
    /**
     * This regex checks for a string that:
     * - Contains only letters (uppercase or lowercase), digits, or underscores.
     * - Has a length between 3 and 50 characters.
     */
    const regex = /^[a-zA-Z0-9_]{3,50}$/;
    return regex.test(username);
};

export const passwordValidator = (password) => {
    // At least one lowercase, one uppercase, one digit, one special character, and minimum 8 chars
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
};

export const avatarValidator = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5 MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!file) return true; // If no file uploaded, that's okay

    return file.size <= maxSize && allowedTypes.includes(file.mimetype);
};
