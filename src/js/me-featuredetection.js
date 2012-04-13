// necessary detection (fixes for <IE9)
mejs.MediaFeatures = (function(){
		var	nav = window.navigator,
			ua = window.navigator.userAgent.toLowerCase(),
			i,
			v,
			html5Elements = ['source','track','audio','video'];

		// detect browsers (only the ones that have some kind of quirk we need to work around)
		var isBustedAndroid = (ua.match(/android 2\.[12]/) !== null);
		var isIE = (nav.appName.toLowerCase().indexOf("microsoft") != -1);

		// create HTML5 media elements for IE before 9, get a <video> element for fullscreen detection
		for( i = 0; i < html5Elements.length; i++ ){
			v = document.createElement( html5Elements[ i ] );
		}
		
		var supportsMediaTag = ( typeof v.canPlayType !== 'undefined' || isBustedAndroid );

		return{
			isIE: isIE,
			isBustedAndroid: isBustedAndroid,
			supportsMediaTag: supportsMediaTag
		}
}());