if (Meteor.isClient) {

    Meteor.call('getBuildings', function(error, result) {
        if (error) {
            console.log("error", error);
        }
        console.log(result);
        Session.set('buildings', result);
    });


    Template.sidebar.helpers ({
        building: function() {
            return Session.get('buildings');
        }
    });

    Template.sidebar.events({
        'click .building': function (event, template) {
            event.preventDefault();
            console.log(event.target);
        }
    });
    
    Template.calendar.events({
        'click #sidebar-toggle': function (event) {
            event.preventDefault();
            $('#wrapper').toggleClass('toggled');
        }
    });

    Template.calendar.rendered = function() {
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'agendaWeek,agendaDay'
            },
            defaultView: 'agendaWeek',
            editable: false,
            firstDay: 1,
            theme: false,
            weekNumbers: true,
            allDaySlot: false,
            slotEventOverlap: false,
            timeFormat: 'H(:mm)',
            minTime: "07:00:00"
        });
    };
}

if (Meteor.isServer) {

    Meteor.methods({
        getBuildings: function() {
            var url = 'http://www.ntnu.no/studieinformasjon/rom/';
            var result = Meteor.http.get(url);
            $ = cheerio.load(result.content);
            
            var buildings = [];
            
            $('select[name="bygning"]').children("option").each(function() {
                //buildings[$(this).val()] = $(this).text();
                buildings.push({
                    number: $(this).val(),
                    name: $(this).text()
                });
            });
            return buildings;
        },
        getRooms: function(buildingNumb, week) {

            var url = 'http://www.ntnu.no/studieinformasjon/rom/?bygning=' + buildingNumb + '&a=Hent+liste..&romnr=&valg=&uke=' + week;

            var result = Meteor.http.get(url);
            $ = cheerio.load(result.content);

            var rooms = {};
            
            $('table tr th').filter(function() {
                return $(this).text() == 'Romnavn';
            }).parent().nextAll().each(function() {
                rooms[$(this).val()] = $(this).text();
            });
        },
    });

}
