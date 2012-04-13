mejs.flashVersion = (function(){
	var nav = window.navigator;
	var ua = window.navigator.userAgent.toLowerCase();

	pluginName = 'Shockwave Flash';
	mimeType = 'application/x-shockwave-flash';
	activeX = 'ShockwaveFlash.ShockwaveFlash';

	var version = [ 0, 0, 0 ],
		description,
		i,
		ax;

	// Firefox, Webkit, Opera
	if (typeof(nav.plugins) != 'undefined' && typeof nav.plugins[pluginName] == 'object') {
		description = nav.plugins[pluginName].description;
		if (description && !(typeof nav.mimeTypes != 'undefined' && nav.mimeTypes[mimeType] && !nav.mimeTypes[mimeType].enabledPlugin)) {
			version = description.replace(pluginName, '').replace(/^\s+/,'').replace(/\sr/gi,'.').split('.');
			for (i=0; i<version.length; i++) {
				version[i] = parseInt(version[i].match(/\d+/), 10);
			}
		}
	// Internet Explorer / ActiveX
	} else if (typeof(window.ActiveXObject) != 'undefined') {
		try {
			ax = new ActiveXObject(activeX);
			if (ax) {
				// adapted from SWFObject
				var version = [],
					d = ax.GetVariable("$version");
				if (d) {
					d = d.split(" ")[1].split(",");
					version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
				}
			}
		}
		catch (e) { }
	}
	return version;
}());

mejs.hasFlashVersion = function( v ){
	var pv = flashVersion;
	v[1] = v[1] || 0;
	v[2] = v[2] || 0;
	return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
};