export const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "" };
    if (password.length < 4)
        return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (password.length < 8)
        return { strength: 50, label: "Fair", color: "bg-yellow-500" };
    if (password.length < 12)
        return { strength: 75, label: "Good", color: "bg-blue-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
};