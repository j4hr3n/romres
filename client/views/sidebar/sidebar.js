Template.sidebar.rendered = function() {
    console.log(Session.get('selectedBuilding'));
};

Template.sidebar.helpers ({
    buildings: function() {
        return Buildings.find();
    },
    rooms: function() {
        var b = Session.get('selectedBuilding');
        if (b === 'all') {
            return Rooms.find();
        }
        return Rooms.find({ bnr: b });
    }
});

Template.sidebar.events({
    'click .building': function (event, template) {
        event.preventDefault();

        if (event.target.id != Session.get('selectedBuilding')) {
            console.log(event.target.id);
            Session.set('selectedBuilding', event.target.id);

        }
        $('#sidebar-main>li>.active').removeClass('active');
        $('#'+event.target.id).addClass('active');
    },
    'click .room': function (event, template) {
        event.preventDefault();

        if (event.target.id != Session.get('selectedRoom')) {
            var rnr = event.target.id;
            var bnr = Rooms.findOne({'rnr': rnr }).bnr;
            var week = 10;

            Session.set('selectedRoom', rnr);
            $('#sidebar-second>li>.active').removeClass('active');
            $('#'+event.target.id).addClass('active');

            $('.loading').show();

            Meteor.call('scrapeRoomData', bnr, rnr, week, function(err, result) {
                if (err) {
                    Session.set('error', err);
                }
                Session.set('content', result);
                $('.loading').hide();
            });
        }
    },
    'mousewheel .sidebar-wrapper': function(event, template) {
        var prevent = function() {
            event.stopPropagation();
            event.preventDefault();
            event.returnValue = false;
            return false;
        };
        var $this = $(this),
        scrollTop = this.scrollTop,
        scrollHeight = this.scrollHeight,
        height = $this.height,
        delta = (event.type == 'DOMMouseScroll' ?
            event.originalEvent.detail * -40 :
            event.originalEvent.wheelDelta),
        up = delta > 0;
    }
});
