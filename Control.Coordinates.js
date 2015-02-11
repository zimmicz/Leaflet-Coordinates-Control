"use strict";

/**
 * author Michal Zimmermann <zimmicz@gmail.com>
 * contributors: {
 *     Marco Guernieri <mark.gue@hotmail.it> [@guernyesterday]
 * }
 * Displays coordinates of mouseclick.
 * @param object options:
 *        position: bottomleft, bottomright etc. (just as you are used to it with Leaflet)
 *        latitudeText: description of latitude value (defaults to lat.)
 *        longitudeText: description of latitude value (defaults to lon.)
 *        promptText: text displayed when user clicks the control
 *        precision: number of decimals to be displayed
 *        startVisible: flag to decide whether coordinates and marker are shown on startup
 */
L.Control.Coordinates = L.Control.extend({
	options: {
		position: 'bottomleft',
		latitudeText: 'lat.',
		longitudeText: 'lon.',
		promptText: 'Press Ctrl+C to copy coordinates',
		precision: 4,
		startInvisible: true
	},

	initialize: function(options)
	{
		L.Control.prototype.initialize.call(this, options);
	},

	onAdd: function(map)
	{
		var className = 'leaflet-control-coordinates',
			that = this,
			container = this._container = L.DomUtil.create('div', className);
		this._addText(container, map);

		this.setLatLng(map.getCenter());
		this.marker = L.marker(map.getCenter(),{draggable:true});
		L.DomEvent.addListener(this.marker, 'dragend', function() {
			that.setLatLng(that.marker.getLatLng());
		});

		this.visible = this.options.startVisible;
		if (this.options.startVisible) {
			this.marker.addTo(map);
		}else{
			L.DomUtil.addClass(this._container, 'hidden');
		}

		L.DomEvent.disableClickPropagation(container);


		L.DomEvent.addListener(container, 'click', function() {
			window.prompt(this.options.promptText, this.latlng.lat + ' ' + this.latlng.lng);
    	}, this);

		return container;
	},

	_addText: function(container, context)
	{
		this._lat = L.DomUtil.create('span', 'leaflet-control-coordinates-lat' , container),
		this._lng = L.DomUtil.create('span', 'leaflet-control-coordinates-lng' , container);

		return container;
	},

	/**
	 * This method should be called when user clicks the map.
	 * @param event object
	 */
	setCoordinates: function(obj)
	{
		if (obj.latlng) {
			this.setLatLng(obj.latlng);
			this.updateText();
		}
	},
	/**
	 * stores latlng internaly with the configured precision
	 * @param latLng object
	 */
	setLatLng: function(latlng)
	{
		var lat = latlng.lat.toFixed(this.options.precision);
		var lng = latlng.lng.toFixed(this.options.precision);
		this.latlng = L.latLng(lat,lng);
		this.updateText();
	},
	getLatLng: function()
	{
		return this.latlng;
	},
	updateText: function() {
		L.DomUtil.get(this._lat).innerHTML = '<strong>' + this.options.latitudeText + ':</strong> ' + this.latlng.lat.toString();
		L.DomUtil.get(this._lng).innerHTML = '<strong>' + this.options.longitudeText + ':</strong> ' + this.latlng.lng.toString();
	},
	/**
	 * toggles between visible marker + coordinates and an empty map
	 * @param latlng object optional
	 */
	toggleView: function(latLng) {
		if (!this.visible) {
			L.DomUtil.removeClass(this._container, 'hidden');
			if (!latLng) {
				latLng = map.getCenter();
			}
			this.marker.setLatLng(latLng);
			this.setLatLng(latLng);
			this.marker.addTo(map);
		}else{
			L.DomUtil.addClass(this._container, 'hidden');
			map.removeLayer(this.marker);
		}
		this.visible = !this.visible;
	}
});
