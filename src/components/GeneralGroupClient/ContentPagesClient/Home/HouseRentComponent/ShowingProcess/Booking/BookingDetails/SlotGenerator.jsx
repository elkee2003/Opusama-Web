// src/utils/generateSlots.js

/**
 * Generate available booking slots for a given day
 *
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} openingHour - e.g. "09:00"
 * @param {string} closingHour - e.g. "17:00"
 * @param {number} sessionDuration - Session length in minutes
 *  * @param {number} sessionGap - Gap between sessions in minutes
 * @param {Array} bookedSlots - Array of already booked slots with startTime
 * @returns {Array} slots - Array of slot objects
 */
export function generateSlots(
  date, 
  openingHour, 
  closingHour, 
  sessionDuration, 
  sessionGap = 0,
  bookedSlots
) {
  const slots = [];
  let start = new Date(`${date}T${openingHour}`);
  let end = new Date(`${date}T${closingHour}`);

  while (start < end) {
    let slotStart = new Date(start);
    let slotEnd = new Date(start.getTime() + sessionDuration * 60000);

    // Prevent overshooting closing hour
    if (slotEnd > end) break;

    const slotLabel = `${slotStart.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })} - ${slotEnd.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`;

    const isBooked = bookedSlots.some(b => b.startTime === slotStart.toISOString());

    slots.push({
      startTime: slotStart.toISOString(),
      endTime: slotEnd.toISOString(),
      label: slotLabel,
      available: !isBooked
    });

    // ⏱️ Advance by sessionDuration + sessionGap
    start = new Date(slotEnd.getTime() + sessionGap * 60000);
  }

  return slots;
}