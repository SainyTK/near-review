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

export const nsToMs = (ns) => {
    return ns / 1000000;
}