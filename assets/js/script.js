// Set the date, time, and time entry variables.

var currentDate = "";
var currentDateDisplay = "";
var currentHour = 9;
var timeEnrty = [];

// Save name for local storage, disply the time blocks, and create a time map array written in military time.

const timeEntryName = "schedulrList";
const firstEntry = 9;
const lastEntry = 17;
const timeMapHr = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM",
    "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

// Build out rest of html page, set surrent date and time, display in the hearder 

setCurrentDateAndTime();
timeBlocks();
gettTimeEntry();

$(".saveBtn").click(saveClick);

// Determine current hour set date in header.

function setCurrentDateAndTime() {
    var today = new Date();
    var day = today.getDate();
    var endDay = "th";

    currentHour = today.getHours();

    // add zero if less than 10

    if (day < 10) {
        currentDate = today.getFullYear() + months[today.getMonth()] + "0" + day;
    }
    else {
        currentDate = today.getFullYear() + months[today. getMonth()] + day;
    }

    if ((day === 1) || (day === 21) || (day === 31)) {
        endDay = "st";
    }

    else if ((day === 2) || (day === 22)) {
        endDay = "nd";
    }

    else if ((day === 3) || day === 23) {
        endDay = "rd";
    }


    currentDateDisplay = daysOfWeek[today.getDay()] + ", " + months[today.getMonth()] + " " +
        day + endDay + ", " + today.getFullYear();

    $("#currentDay").text(currentDateDisplay);

}

function timeBlocks() {
    var containerDiv = $(".container");


    for (let blockHr = firstEntry; blockHr <= lastEntry; blockHr++) {
        var htmlNew = '<div class= "row time-block"> ' +
            '<div class= "col-md-1 hour">' + timeMapHr[blockHr] + '</div>';

        if (blockHr < currentHour) {
            htmlNew = htmlNew + '<textarea class="col-md 10 description past" id= "text' +
                timeMapHr[blockHr] + '"></textarea>';
        }
        else if (blockHr === currentHour) {
            htmlNew = htmlNew + '<textarea class="col-md 10 description present" id= "text' +
                timeMapHr[blockHr] + '"></textarea>';
        }
        else {
            htmlNew = htmlNew + '<textarea class="col-md 10 description future" id= "text' +
                timeMapHr[blockHr] + '"></textarea>';
        };


        htmlNew = `${htmlNew}<button class= "btn saveBtn col-md-1" value= "${timeMapHr[blockHr]}"><i class="far fa-save"></i></button></div>`;

        containerDiv.append(htmlNew);

    }

}

function gettTimeEntry() {
    var entryList = JSON.parse(localStorage.getItem(timeEntryName));

    if (entryList) {
        timeEnrty = entryList;
    }

    for (let i = 0; i < timeEnrty.length; i++) {

        if (timeEnrty[i].day == currentDate) {
            $("#text" + timeEnrty[i].time).val(timeEnrty[i].text);
        }

    }
}

function saveClick() {
    var blockHr = $(this).val();
    var foundEntry = false;
    var indexEntryNew = timeEnrty.length;
    var entryNew = { day: currentDate, time: blockHr, text: $("#text" + blockHr).val() };

    function timeCompare(time1, time2) {
        var numeric1 = parseInt(time1.substring(0, time1.length - 2));
        var numeric2 = parseInt(time2.substring(0, time2.length - 2));
        var period1 = time1.substr(-2, 2);
        var period2 = time2.substr(-2, 2);

        if (numeric1 === 12) {
            numeric1 = 0;
        }

        if (numeric2 === 12) {
            numeric2 = 0;
        }

        if (period1 < period2) {
            return false;
        }

        else if (period1 > period2) {
            return true;
        }

        else {
            return (numeric1 > numeric2);
        }
    }

    for (let i = 0; i < timeEnrty.length; i++) {
        if (timeEnrty[i].day == currentDate) {
            if (timeEnrty[i].time == blockHr) {
                timeEnrty[i].text = entryNew.text;
                foundEntry = true;
                break;
            }

            else if (timeCompare(timeEnrty[i].time, blockHr)) {
                indexEntryNew = i;
                break
            }
        }

        else if (timeEnrty[i].day > currentDate) {
            indexEntryNew = i;
            break;
        }

    }
    if (!foundEntry) {
        timeEnrty.splice(indexEntryNew, 0, entryNew);
    }
    localStorage.setItem(timeEntryName, JSON.stringify(timeEnrty));
}


