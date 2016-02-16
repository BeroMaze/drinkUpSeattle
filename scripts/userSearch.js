function Places(obj) {
  this.id = obj.id,
  this.name = obj.name,
  this.rating = obj.rating_img_url_large,
  this.categories = obj.categories,
  this.display_phone = obj.display_phone,
  this.coordinate = obj.location.coordinate,
  this.address = obj.location.display_address.join(' '),
  this.neighborhood = obj.location.neighborhoods[0],
  this.happyHour = obj.happyHour,
  this.img = obj.image_url
}


yelpSearchResults=[];
reducedArray = [];
happyHourArray=[
  {id: 'radiator-whiskey-seattle', happyHour: '4PM TO 6PM 10PM TO CLOSE'},
  {id: 'list-seattle', happyHour: 'Sunday & Monday:  All Day Tuesday - Thursday: 4:00 - 6:30pm & 9pm - Midnight Friday & Saturday:  4:00 - 6:30pm'},
  {id: 'the-zig-zag-café-seattle-2', happyHour: '5-7 Monday-Friday'},
  {id: 'witness-seattle', happyHour: '4-6pm every day'},
  {id: 'bottlehouse-seattle', happyHour: 'Daily 3-6pm'},
  {id: 'the-forge-lounge-seattle',  happyHour: 'Daily 3-7'},
  {id: 'toulouse-petit-seattle', happyHour: 'daily 4 pm to 6 pm nightly 10 pm to 1 am'},
  {id: 'taylor-shellfish-oyster-bar-seattle', happyHour: 'Monday - Friday 4pm - 6pm'},
  {id: 'damn-the-weather-seattle', happyHour: 'M-F 4-6:30pm'},
  {id: 'suika-seattle-seattle', happyHour: 'TUE-FRI 5PM-6:30 SAT, SUN 4PM-6:30'},
  {id: 'triumph-bar-seattle', happyHour: '3 and 6pm, late night from 10 to close Tuesday–Saturday and 9 to close Sunday and Monday'},
  {id: 'quinns-seattle', happyHour: '3-6pm'},
  {id: 'sun-liquor-seattle', happyHour: '4pm - 7pm'},
  {id: 'betty-seattle', happyHour: '4:30pm-6:00pm'},
  {id: 'the-octopus-bar-seattle', happyHour: '3:30-6:30pm'},
  {id: 'the-sixgill-seattle', happyHour: '4pm - 6pm!'},
  {id: 'russells-seattle', happyHour: 'DAILY:  4PM - 6PM'},
  {id:'the-noble-fir-seattle', happyHour: '4pm - 6:30pm'},
  {id:'latona-pub-seattle', happyHour: '4:30 - 6:30 Wed - Sun! and 4:00 - 6:30 Mon & Tues!!'},
  {id:'brouwers-cafe-seattle', happyHour: '3pm - 6pm'},
  {id:'witness-seattle', happyHour: '4-6pm'},
  {id:'über-tavern-seattle-2', happyHour: '4-6PM -- TUES-FRI'},
  {id:'yoroshiku-seattle-4', happyHour: 'Tuesday through Saturday 5-6:30pm'}
];

resultsArray=[];


$('#searchBox').keypress(function(event) {
  /* Act on the event */
  if(event.which===13){
    // console.log('success');

    searchCrit=$('#searchBox').val();
    $.post( "/search",{searchCrit: searchCrit}, function(data) {
      console.log( "success" );
    })
      .done(function(data) {
        console.log("Server Success" );
        // console.log(data)
        data.forEach(function(x){
            happyHourArray.forEach(function(y) {
              if (x.id === y.id) {
                x.happyHour=y.happyHour;
                var place = new Places(x);
                resultsArray.push(place);
              }
            });
          });
          // reducedArray=[];
          for (i=0;i<=resultsArray.length-1;i++){
            // console.log(re);
            if(Object.is(resultsArray[i],resultsArray[i+1])===false){
              reducedArray.push(resultsArray[i+1]);
            }
          }
          console.log(reducedArray);

          // console.log(resultsArray);
          var template = $('#restTemplate').html();
          var compileTemplate = Handlebars.compile(template);
          reducedArray.forEach(function(each) {
          var html = compileTemplate(each);
          $('#results').append(html);
          console.log(each);

      });
    })
      .fail(function() {
        alert("Error Communicating With Server");
      })
      .always(function() {
        console.log("finished");
    });
  }
});