
var app = (function() {

	var addTrainToDB = function(event) {
		var name = $('#name').val(), destination = $('#destination').val(),
				first_time = $('#first_time').val(), frequency = $('#frequency').val()
				hours = first_time[0], minutes = first_time[1];

		// If any input values are empty, we stop and return
		if ( !name || !destination || !first_time || !frequency ) return;

		event.preventDefault();

		var db = firebase.database().ref('trains'),
				train = {};

		train.name = name;
		train.destination = destination;
		train.first_time = first_time;
		train.frequency = frequency;

		db.push(train);
		$('form').find('input').val('');

	};

	var getTrains = function() {
		var db = firebase.database().ref('/trains');
		db.once('value')
		.then(function(trains) {
			console.log(trains.numChildren());
		});
		db.on('child_added', function(train) {
			var train = train.val(),
					hour = moment().format('H'), minute = moment().format('mm'),
					firstValues = train.first_time.split(':'),
					firstHour = firstValues[0], firstMin = firstValues[1],
					first = (firstHour * 60) + firstMin % 10,
					current = (hour * 60) + minute % 10,
					diff = current - first, trains = Math.floor(diff / train.frequency) + 1,
					arrival = trains * train.frequency + first,
					minutes = first < current ? arrival - current : first - current,
					arrivalTime = first < current ? moment().add(minutes, 'minutes').format('HH:mm') :
												train.first_time;

			$('table tbody').append(
				'<tr>' +
					'<td>' + train.name + '</td>' +
					'<td>' + train.destination + '</td>' +
					'<td>' + train.frequency + '</td>' +
					'<td>' + arrivalTime + '</td>' +
					'<td>' + minutes + '</td>' +
				'</tr>'
			);
		});

	};

	var init = function() {

		$('#submit').on('click', addTrainToDB);
		getTrains();

	};

	return { init: init };
})();

app.init();
