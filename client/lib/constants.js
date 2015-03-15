// Define App Constants

if (Meteor.App) {
    throw new Meteor.Error('Meteor.App already defined? see client/lib/constants.js');
}

Meteor.App = {
    NAME: 'romres',
    DESCRIPTION: 'improving the room booking system @ NTNU'
};
