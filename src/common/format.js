export const formatDate = (ms) => {
    return ms ? new Date(ms).toLocaleDateString('en-EN', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }) : '';
}