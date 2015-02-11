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
 *        visibleAfterClick: flag to decide if coordinates must be shown only after the first click
 */
L.Control.Coordinates = L.Control.extend({
	options: {
		position: 'bottomleft',
		latitudeText: 'lat.',
		longitudeText: 'lon.',
		promptText: 'Press Ctrl+C to copy coordinates',
		precision: 4,
		visibleAfterClick: true
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
		
		if (this.options.visibleAfterClick) {
			this.visible = false;
			L.DomUtil.addClass(container, 'hidden');
		} else {
			this.visible = true;
		}

		L.DomEvent.disableClickPropagation(container);

		this._addText(container, map);

		L.DomEvent.addListener(container, 'click', function() {
			var lat = L.DomUtil.get(that._lat),
				lng = L.DomUtil.get(that._lng),
				latTextLen = this.options.latitudeText.length + 1,
				lngTextLen = this.options.longitudeText.length + 1,
				latTextIndex = lat.textContent.indexOf(this.options.latitudeText) + latTextLen,
				lngTextIndex = lng.textContent.indexOf(this.options.longitudeText) + lngTextLen,
				latCoordinate = lat.textContent.substr(latTextIndex),
				lngCoordinate = lng.textContent.substr(lngTextIndex);

			window.prompt(this.options.promptText, latCoordinate + ' ' + lngCoordinate);
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
		this.latlng = latlng;
		this.updateText();
	},
	getLatLng: function()
	{
		return this.latlng;
	},
	updateText: function() {
		if (!this.visible) {
			L.DomUtil.removeClass(this._container, 'hidden');
		}
		L.DomUtil.get(this._lat).innerHTML = '<strong>' + this.options.latitudeText + ':</strong> ' + this.latlng.lat.toFixed(this.options.precision).toString();
		L.DomUtil.get(this._lng).innerHTML = '<strong>' + this.options.longitudeText + ':</strong> ' + this.latlng.lng.toFixed(this.options.precision).toString();
	}
});
