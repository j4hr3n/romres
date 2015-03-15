Template.content.helpers({
    'content': function() {
        return Session.get('content');
    },
    'room': function() {
        return Rooms.findOne({'rnr': Session.get('selectedRoom') });
    },
    'building': function() {
        var r = Rooms.findOne({'rnr': Session.get('selectedRoom')});
        return Buildings.findOne({'bnr': r.bnr});
    },
    'error': function() {
        return Session.get('error');
    }
});

Template.content.rendered = function() {
    $('.loading').hide();
};
