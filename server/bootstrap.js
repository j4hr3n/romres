Meteor.startup(function() {
    Meteor.methods({

        // function for retrieving all names and numbers of the buildings
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

    });
});
