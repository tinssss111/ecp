export function convertUnixTimestamp(unixTime: number): { localTime: string; utcTime: string } {
    // Convert the Unix timestamp (in seconds) to milliseconds
    const date = new Date(unixTime * 1000);

    // Convert to local time format
    const localTime: string = date.toLocaleString('en-US', {
        timeZoneName: 'short', // Include time zone abbreviation
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    // Convert to UTC format
    const utcTime: string = date.toUTCString(); // UTC time without milliseconds

    return {
        localTime,
        utcTime,
    };
}
