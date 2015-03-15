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
