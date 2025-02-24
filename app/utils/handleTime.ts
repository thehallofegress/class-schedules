export const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/^(\d+):(\d+) (AM|PM|am|pm)$/);
    if (!match) return Infinity; // Handle invalid time format

    const [, hourStr, minuteStr, period] = match;
    const hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);
    const normalizedPeriod = period.toUpperCase(); // Normalize AM/PM to uppercase

    let adjustedHours = hours;
    if (normalizedPeriod === "PM" && adjustedHours !== 12) adjustedHours += 12;
    if (normalizedPeriod === "AM" && adjustedHours === 12) adjustedHours = 0;

    return adjustedHours * 60 + minutes; // Convert to minutes since midnight
};
