function sendNewLocation() {
  var newHHCounter = 1;
  $("#NewHHName").keyup(function(){
    console.log(this.value);
  });
  $('#newHHTime').on('click', function() {
    newHHCounter++;
    $('#newHappyTimes').append('<form id="TaD'+newHHCounter+'" class="timeAndDay"><p><u>Choose days and the times for those days.</u></p><div class="CheckBoxDays"><div class="checkDaysBox"><input id="everyDayBox" class="checkBox" type="checkbox" name="everyday" value=""><h4 class="checkDay">Every Day</h4></div><div class="checkDaysBox"><input id="mondayBox" class="checkBox" type="checkbox" name="Monday" value=""><h4 class="checkDay">Monday</h4></div><div class="checkDaysBox"><input id="tuesdayBox" class="checkBox" type="checkbox" name="Tuesday" value=""><h4 class="checkDay">Tuesday</h4></div><div class="checkDaysBox"><input id="wednesdayBox" class="checkBox" type="checkbox" name="Wednesday" value=""><h4 class="checkDay">Wednesday</h4></div><div class="checkDaysBox"><input id="thursdayBox" class="checkBox" type="checkbox" name="Thursday" value=""><h4 class="checkDay">Thursday</h4></div><div class="checkDaysBox"><input id="fridayBox" class="checkBox" type="checkbox" name="Friday" value=""><h4 class="checkDay">Friday</h4></div><div class="checkDaysBox"><input id="saturdayBox" class="checkBox" type="checkbox" name="Saturday" value=""><h4 class="checkDay">Saturday</h4></div><div class="checkDaysBox"><input id="SundayBox" class="checkBox" type="checkbox" name="Sunday" value=""><h4 class="checkDay">Sunday</h4></div></div><div id="openToCloseTime"><select name="openHourTime" id="openHourTime"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select>:<select name="openMinTime" id="openMinTime"><option value="00">00</option><option value="30">30</option></select><select name="openAmPm" id="openAmPm"><option value="PM">PM</option><option value="AM">AM</option></select>-<select name="closeHourTime" id="openHourTime"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select>:<select name="closeMinTime" id="openMinTime"><option value="00">00</option><option value="30">30</option></select><select name="closeAmPm" id="openAmPm"><option value="PM">PM</option><option value="AM">AM</option></select></div></form>');
    everydayClick();
  });

var everydayClick = function() {
  $('.checkBox').off();
  $('.checkBox').on('click', function(event) {
    console.log($(this).attr('name'));
    if ($(this).attr('name') === 'everyday') {
      console.log($(this).parent().parent().children().children('.checkBox'));
      console.log($(this).prop('checked'));
      if ($(this).prop('checked') === true) {
        $(this).parent().parent().children().children('.checkBox').prop("checked", true);
      }
      else {
        $(this).parent().parent().children().children('.checkBox').prop("checked", false);
      }
    }
  });
};
everydayClick();

  $('#sendHHData').on('click', function(event) {
    event.preventDefault();
    var newName = $('#NewHHName').val();
    var times = document.forms.length;
    var elements = document.forms;
    // console.log(elements);
    var happyHour = [];
    var hhtime ={
      name: newName,
      hours:{
          Sunday: '',
          Monday: '',
          Tuesday: '',
          Wednesday: '',
          Thursday: '',
          Friday: '',
          Saturday: '',
      }
    };
    for (var i = 0, element; element = elements[i++];) {
      // console.log(element.id);
      var id = element.id;
      var dayString = $('#'+id).serialize();
      // console.log(dayString);
      var dayArray = dayString.split('&');
      var days = [];
      var openingHour;
      var openingMin;
      var openingAMPM;
      var closingHour;
      var closingMin;
      var closingAMPM;
      dayArray.forEach(function(each) {
        // console.log(each);
        each = each.split('=');
        // console.log(each);
        if (each[1]==='') {
          // console.log('a day');
          days.push(each[0]);
        }
        if (each[0]=== 'openHourTime') {
          openingHour = each[1];
        }
        if (each[0]=== 'openMinTime') {
          openingMin = each[1];
        }
        if (each[0]=== 'openAmPm') {
          openingAMPM = each[1];
          if ((openingAMPM === 'AM') && (Number(openingHour) ===12)) {
            openingHour = 24;
          }
          if (openingAMPM === 'PM') {
            openingHour = Number(openingHour)+12;
          }
        }
        if (each[0]=== 'closeHourTime') {
          closingHour = each[1];
        }
        if (each[0]=== 'closeMinTime') {
          closingMin = each[1];
        }
        if (each[0]=== 'closeAmPm') {
          closingAMPM = each[1];
          if ((closingAMPM === 'AM') && (Number(closingHour) ===12)) {
            closingHour = 24;
          }
          else if ((closingAMPM === 'AM') && (openingAMPM === 'PM')) {
            closingHour = Number(closingHour)+24;
          }
          if (closingAMPM === 'PM') {
            closingHour = Number(closingHour)+12;
          }
        }
      });
      days.forEach(function(each) {
        if (each!== 'everyday') {
          if (hhtime.hours[each]!== '') {
            console.log(hhtime.hours[each][0].length);
            if (hhtime.hours[each][0].length === 1) {
              var newHours = [[hhtime.hours[each][0][0], openingHour+':'+openingMin], [hhtime.hours[each][1][0], closingHour+':'+closingMin]];
              hhtime.hours[each] = newHours;
            }
            else if (hhtime.hours[each][0].length === 2) {
              console.log(hhtime.hours[each][0][0]);
              console.log(hhtime.hours[each][0][1]);
              console.log(openingHour);
              var newHours = [[hhtime.hours[each][0][0], hhtime.hours[each][0][1], openingHour+':'+openingMin], [hhtime.hours[each][1][0], hhtime.hours[each][1][1], closingHour+':'+closingMin]];
              hhtime.hours[each] = newHours;
            }
          }
          else{
            hhtime.hours[each] = [[openingHour+':'+openingMin],[closingHour+':'+closingMin]];
          }
        }
      });
    }
    console.log(hhtime);

    $.post('/locationUpdate', {update: hhtime}, function(data) {
    }).done(function(data) {
      console.log(data.message);
      $('#addEdit').empty();
      $('#addEdit').append("<h2 class='finishedMessage'>"+data.message+"</h2>");
    });
  });
}
