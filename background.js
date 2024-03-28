// Create an alarm to trigger the reminder
chrome.alarms.create({ delayInMinutes: 1, periodInMinutes: 1 });

// Listen for the alarm trigger
chrome.alarms.onAlarm.addListener(async () => {
  try {
    // Fetch the data from 'Salawat.json'
    const response = await fetch('Salawat.json');
    const data = await response.json();

    // Get the current time and format day and month
    const currentTime = new Date();
    const currentDay = currentTime.getDate().toString().padStart(2, '0');
    const currentMonth = (currentTime.getMonth() + 1).toString().padStart(2, '0');
    const currentTimeString = `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

    // Filter the data for the current day and month
    const filteredItems = data.filter(item => parseInt(item.day) === parseInt(currentDay) && parseInt(item.month) === parseInt(currentMonth));

    // Iterate over the filtered items
    filteredItems.forEach(item => {
      Object.entries(item)
        .filter(([key]) => key !== 'day' && key !== 'month')
        .forEach(([key, value]) => {
          const prayerTime = new Date(currentTime.toDateString() + ' ' + value);
          let formattedPrayerTime = `${prayerTime.getHours()}:${prayerTime.getMinutes().toString().padStart(2, '0')}`;

          if (key !== 'fajer' && key !== 'sunrise') {
            formattedPrayerTime = `${prayerTime.getHours() + 12}:${prayerTime.getMinutes().toString().padStart(2, '0')}`;
          }

          if (formattedPrayerTime === currentTimeString) {
            showNotification(key);
          }
        });
    });
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
});

// Function to show a notification
function showNotification(prayerName) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Salawat Reminder',
    message: `It's time for ${prayerName}!`
  });
}
