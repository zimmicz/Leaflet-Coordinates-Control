Leaflet Coordinates Control
===========================
Captures mouseclick and displays its coordinates with easy way to copy them.

Demo
----

See demo [here](http://kartenkarsten.github.io/Leaflet-Coordinates-Control/demo/).

How to use
----------
	var c = new L.Control.Coordinates(); // you can send options to the constructor if you want to, otherwise default values are used

	c.addTo(map);

	map.on('click', function(e) {
		c.toggleView(e.latlng);
	});
