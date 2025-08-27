export const formatCurrency = (value, currency = "INR") => {
    if (!value) return "₹0";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};
