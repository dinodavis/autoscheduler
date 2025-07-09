const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const scheduleData = `
    Contract Number,Customer Mobile,Customer Location,No.Of vehicles,Schedule,Reporting Time
    1,97773097,Bank Muscat HO,1,Every Sunday,10:00 AM
    2,98233333,Shatti Qurum,12,Every Saturday,8:00 AM
    4,95225151,Ghala,1,Every Thursday,9:00 AM
    6,99495500,Azaiba,6,Every Monday,5:00 PM
    7,95972226,Mawalah,4,Every Saturday,1:00 PM
    8,99001052,Ghala,4,Every Staurday|Tuesday,8:30 AM
    10,97277778,Bosher,1,Two Fridays of a Month,9:00 AM
    14,99367071,Al Khuwair,3,Every Friday,4:00 PM
    20,99833910,Shatti Qurum,3,Every Saturday,11:00 AM
    21,99348079,Ansab,4,Every Friday,9:30 AM
    25,92179671,Al Khoud,1,Every Saturday,2:00 PM
    27,93217885,Al Khoud 6 ,3,Every Sunday,5:00 PM
    29,95177770,Madinat Al Lam,3,Every Sunday|Wednesday,10:00 AM
    30,94949466,Bosher,3,Every Thursday,3:00 PM
    31,92169469,Bosher,2,Every Sunday,5:00 PM
    34,95555009,Azaiba,3,Every Saturday,9:00 AM
    36,95112121,Madinat Qaboos,2,Every Sunday|Tuesday|Thursday,6:00 PM
    38,99070803,Al Hail,5,Every Wednesday,8:30 AM
    40,99244486,Bosher,2,Every Saturday,12:00 PM
    42,95330178,Bosher,3,Every Wednesday,5:00 PM
    43,95088666,Azaiba,3,Every Monday,3:00 PM
    45,97910088,Bosher,2,Every Monday,4:00 PM
    47,99474444,Bosher,2,Every Thursday,5:00 PM
    49,99060160,Bosher,1,Every Saturday,6:00 PM
    50,97009922,Al Khuwair,5,Every Saturday,5:00 PM
    54,91250618,Al Mouj,1,Every Wednesday,7:00 PM
    55,96101433,Bosher,2,Every Saturday,4:00 PM
    56,79831218,Al Ansab,2,Every Sunday,1:00 PM
    59,96936913,Al Khoud,2,Every Wednesday,3:00 PM
    58,77007730,Felaj Sham,2,Every Friday|Tuesday,8:30 AM
    61,95121214,Madinat Qaboos,2,Every Saturday|Tuesday,7:00 PM
  `;

  function isScheduledToday(schedule) {
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Muscat" }));

    const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });
    const dayOfMonth = today.getDate();

    if (schedule.toLowerCase().includes("daily")) {
      return true;
    }

    if (schedule.toLowerCase().includes("every")) {
      const scheduledDays = schedule.toLowerCase().split("every ")[1].split("|");
      const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const todayDay = weekdays[today.getDay()];

      return scheduledDays.includes(todayDay.toLowerCase());
    }

    if (schedule.toLowerCase().includes("every")) {
      const conditions = schedule.toLowerCase().split("every")[1].split(",");
      return conditions.some((condition) => {
        const trimmedCondition = condition.trim();
        return trimmedCondition.includes(dayOfWeek.toLowerCase()) || trimmedCondition.includes(dayOfMonth);
      });
    }

    return false;
  }

  const lines = scheduleData.trim().split("\n");
  const headers = lines[0].split(",");

  const todaySchedules = lines.slice(1).filter((line) => isScheduledToday(line.split(',')[4]));

  let outputMessage = "";

  if (todaySchedules.length > 0) {
    outputMessage = "*Today's Home Service Schedule*:<br><br>";

    // Sort schedules by reporting time
    todaySchedules.sort((a, b) => {
      const timeA = parseReportingTime(a.split(',')[5]);
      const timeB = parseReportingTime(b.split(',')[5]);
      return timeA - timeB;
    });

    todaySchedules.forEach((schedule) => {
      const values = schedule.split(",");
      outputMessage += `Contract Number: ${values[0]}<br>
      Customer Mobile: ${values[1]}<br>
      Customer Location: ${values[2]}<br>
      Number of Vehicles: ${values[3]}<br>
      Reporting Time: ${values[5]}<br><br>`;
    });
  } else {
    outputMessage = "No Home Service schedules assigned today.";
  }

  res.send(outputMessage);
});

function parseReportingTime(timeString) {
  const [time, meridiem] = timeString.split(' ');
  const [hours, minutes] = time.split(':');
  let parsedHours = parseInt(hours, 10);
  if (meridiem === 'PM' && parsedHours !== 12) {
    parsedHours += 12;
  } else if (meridiem === 'AM' && parsedHours === 12) {
    parsedHours = 0;
  }
  return parsedHours * 60 + parseInt(minutes, 10);
}

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
