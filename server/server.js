Meteor.methods({

    // returns scheduling plan for a certain room in a certain week
    getRooms: function(buildingNumb, week) {

        var url = 'http://www.ntnu.no/studieinformasjon/rom/?bygning=' + buildingNumb + '&a=Hent+liste..&romnr=&valg=&uke=' + week;

        var result = Meteor.http.get(url);
        $ = cheerio.load(result.content);

        var rooms = [];
        
        $('table tr th').filter(function() {
            return $(this).text() == 'Romnavn';
        }).parent().nextAll().each(function() {
            var numb = $(this).children().attr("href");

            rooms.push({
                number: numb,
                name: $(this).text()
            });

        });
        console.log(rooms);

        return rooms;

    },

    scrapeRoomData: function(bnr, rnr, week) {
        var url = 'http://www.ntnu.no/studieinformasjon/rom/?bygning=' + bnr + '&romnr=' + rnr + '&a=Hent+rom..&valg=&uke=' + week;
        console.log(url);

        $ = cheerio.load(Meteor.http.get(url).content);
        var meta = $("p:contains('Romtype')").text();

        var data = [];


        // get map
        //url = $('a:contains("kart")').attr('href');
        //$ = cheerio.load(Meteor.http.get(url).content);
        //data.push({
            //test: $('.buildingimage img').attr('src')
        //});

        // get room schedule
        url = 'http://www.ntnu.no/studieinformasjon/rom/index.php?uke=10&romnr=' + rnr + '&a=Dag';
        $ = cheerio.load(Meteor.http.get(url).content);
        //var s = $('tr').children().text().trim();

        var rows = [];

        var mon, tue, wed, thu, fri, sat, sun;
        var time;
        var md, txt, rowspan;
        var skipping = false;
        var s;
        var tds;
        var cell;

        var skip = [1, 1, 1, 1, 1, 1, 1];

        $('table').eq(3).children('tr').slice(1).each(function(i, val) {
            $(this).children('td').each(function(j, val) {

                md = j % 8; 
                txt = $(this).text().trim();
                rowspan = $(this).attr('rowspan');

                var r = 1;
                if(!isNaN(parseInt(rowspan))) {
                    r = parseInt(rowspan);
                }

                if(skip[j] > 1) {
                    skip[j]--;
                }

                if(skip[j] == 1 && r > 1) {
                    skip[j] = r + 1;
                }


                console.log(skip);


                switch(md) {
                    case 0:
                        time = txt;
                        break;
                    case 1:
                        mon = (skip[j] > 1? null : { 'txt': txt, 'rowspan': rowspan });
                        break;
                    case 2:
                        tue = (skip[j] > 1? null : { 'txt': txt, 'rowspan': rowspan });
                        break;
                    case 3:
                        wed = (skip[j] > 1? null : { 'txt': txt, 'rowspan': rowspan });
                        break;
                    case 4:
                        thu = (skip[j] > 1? null : { 'txt': txt, 'rowspan': rowspan });
                        break;
                    case 5:
                        fri = (skip[j] > 1? null : { 'txt': txt, 'rowspan': rowspan });
                        break;
                    case 6:
                        sat = (skip[j] > 1? null : { 'txt': txt, 'rowspan': rowspan });
                        break;
                    case 7:
                        sun = (skip[j] > 1? null : { 'txt': txt, 'rowspan': rowspan });
                        break;
                    default:
                        break;
                }
            });

            rows.push({
                'i': i,
                'time': time,
                'mon': mon,
                'tue': tue,
                'wed': wed,
                'thu': thu,
                'fri': fri,
                'sat': sat,
                'sun': sun
            });

        });


        data.push({
            'test': meta,
            'rows': rows
        });


        //console.log(rows);
        return data;

    }

});
