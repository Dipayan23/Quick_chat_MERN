export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
});
}