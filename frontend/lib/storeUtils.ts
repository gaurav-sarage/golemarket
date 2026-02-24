export const isStoreCurrentlyOpen = (shop: any) => {
    if (!shop) return { isOpen: false, message: 'Store not found' };

    const now = new Date();
    // Use Indian Standard Time if possible, but for local browser it's fine
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[now.getDay()];

    const schedule = shop.businessHours?.find((s: any) => s.day === currentDay);

    if (!schedule || schedule.isClosed) {
        return { isOpen: false, message: `Closed today (${currentDay})` };
    }

    const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    const openTimeMinutes = parseTime(schedule.open);
    const closeTimeMinutes = parseTime(schedule.close);

    if (currentTimeMinutes >= openTimeMinutes && currentTimeMinutes <= closeTimeMinutes) {
        return { isOpen: true, message: 'Open now' };
    }

    return {
        isOpen: false,
        message: `Closed. Opens at ${schedule.open}`,
        nextOpen: schedule.open
    };
};
