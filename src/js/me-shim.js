// Handles calls from Flash and reports them as native <video/audio> events and properties
mejs.MediaPluginBridge = {

	pluginMediaElements:{},
	htmlMediaElements:{},

	registerPluginElement: function( id, pluginMediaElement, htmlMediaElement ){
		this.pluginMediaElements[ id ] = pluginMediaElement;
		this.htmlMediaElements[ id ] = htmlMediaElement;
	},
	// when Flash is ready, it calls out to this method
	initPlugin: function( id ){
		var pluginMediaElement = this.pluginMediaElements[ id ],
			htmlMediaElement = this.htmlMediaElements[ id ];

		if( pluginMediaElement ){
			// find the javascript bridge
			var el = document.getElementById( id );
			pluginMediaElement.pluginElement = el;
			pluginMediaElement.pluginApi = el;

			if( pluginMediaElement.pluginApi != null && pluginMediaElement.success ){
				pluginMediaElement.success(pluginMediaElement, htmlMediaElement);
			}
		}
	},

	// receives events from Flash and sends them out as HTML5 media events
	// http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html
	fireEvent: function( id, eventName, values ){

		var e;
		var i;
		var bufferedTime;
		var pluginMediaElement = this.pluginMediaElements[id];

		pluginMediaElement.ended = false;
		pluginMediaElement.paused = true;

		// fake event object to mimic real HTML media event.
		e = {
			type: eventName,
			target: pluginMediaElement
		};

		// attach all values to element and event object
		for (i in values) {
			pluginMediaElement[i] = values[i];
			e[i] = values[i];
		}

		// fake the newer W3C buffered TimeRange (loaded and total have been removed)
		bufferedTime = values.bufferedTime || 0;

		e.target.buffered = e.buffered = {
			start: function(index) {
				return 0;
			},
			end: function (index) {
				return bufferedTime;
			},
			length: 1
		};

		pluginMediaElement.dispatchEvent(e.type, e);
	}
};

/*
Default options
*/
mejs.MediaElementDefaults = {
	// allows testing on HTML5, flash
	// auto: attempts to detect what the browser can do
	// native: forces HTML5 playback
	// shim: disallows HTML5, will attempt Flash
	// none: forces fallback view
	mode: 'auto',
	// remove or reorder to change plugin priority and availability
	plugins: ['flash'],
	// shows debug errors on screen
	enablePluginDebug: false,
	// path to Flash and plugins
	pluginPath: '',
	// name of flash file
	flashName: 'flashmediaelement.swf',
	// turns on the smoothing filter in Flash
	enablePluginSmoothing: false,
	// default if the <video width> is not specified
	defaultVideoWidth: 480,
	// default if the <video height> is not specified
	defaultVideoHeight: 270,
	// additional plugin variables in 'key=value' form
	pluginVars: [],	
	// rate in milliseconds for Flash and to fire the timeupdate event
	// larger number is less accurate, but less strain on plugin->JavaScript bridge
	timerRate: 250,
	// initial volume for player
	startVolume: 0.8,
	success: function () { },
	error: function () { }
};

/*
Determines if a browser supports the <video> or <audio> element
and returns either the native element or a Flash version that
mimics HTML5 MediaElement
*/
mejs.MediaElement = function( el, o ){
	return mejs.HtmlMediaElementShim.create( el, o );
};

mejs.HtmlMediaElementShim = {

	create: function(el, o) {
		var
			options = mejs.MediaElementDefaults,
			htmlMediaElement = ( typeof( el ) == 'string' ) ? $( el )[ 0 ] : el,
			src = $( htmlMediaElement ).attr('src'),
			poster = htmlMediaElement.getAttribute('poster'),
			autoplay =  htmlMediaElement.getAttribute('autoplay'),
			preload =  htmlMediaElement.getAttribute('preload'),
			controls =  htmlMediaElement.getAttribute('controls'),
			playback,
			prop;

		$.extend( options, o )

		// clean up attributes
		src = 		(typeof src == 'undefined' 	|| src === null || src == '') ? null : src;		
		poster =	(typeof poster == 'undefined' 	|| poster === null) ? '' : poster;
		preload = 	(typeof preload == 'undefined' 	|| preload === null || preload === 'false') ? 'none' : preload;
		autoplay = 	!(typeof autoplay == 'undefined' || autoplay === null || autoplay === 'false');
		controls = 	!(typeof controls == 'undefined' || controls === null || controls === 'false');

		// test for HTML5 and plugin capabilities
		playback = this.determinePlayback( htmlMediaElement, options, mejs.MediaFeatures.supportsMediaTag, src );
		playback.url = ( playback.url !== null ) ? playback.url : '';

		if( playback.method == 'native' ){
			// second fix for android
			if( mejs.MediaFeatures.isBustedAndroid ){
				htmlMediaElement.src = playback.url;

				$( htmlMediaElement ).on( 'click', function() {
					htmlMediaElement.play();
				}, false );
			}

			// add methods to native HTMLMediaElement
			playback.htmlMediaElement.pluginType = 'native';
			return playback.htmlMediaElement;
		} else if( playback.method !== '') {
			// create plugin to mimic HTMLMediaElement
			return this.createPlugin( playback, options, poster, autoplay, preload, controls);
		} else {
			return this;
		}
	},
	
	determinePlayback: function(htmlMediaElement, options, supportsMediaTag, src) {
		var mediaFiles = [];
		var i;
		var j;
		var k;
		var l;
		var n;
		var type;
		var result = { method: '', url: '', htmlMediaElement: htmlMediaElement, isVideo: true };
		var pluginName;
		var pluginVersions;
		var pluginInfo;
		var dummy;
		var self = this;
			
		// STEP 1: Get URL and type from <video src> or <source src>

		if( src !== null ){
			type = this.formatType( src, $( htmlMediaElement ).attr( 'type' ) );
			mediaFiles.push({
				type: type,
				url: src
			});
		// then test for <source> elements
		} else {
			$( htmlMediaElement ).find( 'source' ).each(function(){
				var src = $( this ).attr( 'src' );
				mediaFiles.push({
					url: src,
					type: self.formatType( src, $( this ).attr( 'type' ) )
				});
			});
		}

		// STEP 2: Test for playback method
		
		// special case for Android which sadly doesn't implement the canPlayType function (always returns '')
		if( mejs.MediaFeatures.isBustedAndroid ){
			htmlMediaElement.canPlayType = function( type ){
				return ( type.match(/video\/(mp4|m4v)/gi) !== null ) ? 'maybe' : '';
			};
		}

		// test for native playback first
		if( supportsMediaTag && ( options.mode === 'auto' || options.mode === 'native' ) ) {

			for( i = 0; i < mediaFiles.length; i++ ){
				// normal check
				if( htmlMediaElement.canPlayType( mediaFiles[ i ].type ).replace( /no/, '' ) !== '' ) {
					result.method = 'native';
					result.url = mediaFiles[ i ].url;
					break;
				}
			}
			
			if (result.method === 'native') {
				return result;
			}
		}

		// if native playback didn't work, then test plugins
		if( options.mode === 'auto' || options.mode === 'shim' ){
			for( i = 0; i < mediaFiles.length; i++ ){
				type = mediaFiles[ i ].type;

				// test for plugin playback types
				for( l = 0; l < mejs.flashInfo.types.length; l++ ){
					// find plugin that can play the type
					if( type == mejs.flashInfo.types[ l ] ){
						result.method = 'flash';
						result.url = mediaFiles[ i ].url;
						return result;
					}
				}
			}
		}
		
		// what if there's nothing to play? just grab the first available
		if( result.method === '' && mediaFiles.length > 0 ){
			result.url = mediaFiles[0].url;
		}

		return result;
	},

	formatType: function(url, type) {
		var ext;

		// if no type is supplied, fake it with the extension
		if (url && !type) {		
			return this.getTypeFromFile(url);
		} else {
			// only return the mime part of the type in case the attribute contains the codec
			// see http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#the-source-element
			// `video/mp4; codecs="avc1.42E01E, mp4a.40.2"` becomes `video/mp4`
			
			if (type && ~type.indexOf(';')) {
				return type.substr(0, type.indexOf(';')); 
			} else {
				return type;
			}
		}
	},
	
	getTypeFromFile: function(url) {
		var ext = url.substring(url.lastIndexOf('.') + 1);
		return (/(mp4|m4v|ogg|ogv|webm|flv|wmv|mpeg|mov)/gi.test(ext) ? 'video' : 'audio') + '/' + ext;
	},

	createPlugin:function( playback, options, poster, autoplay, preload, controls ){
		var htmlMediaElement = playback.htmlMediaElement;
		var width = 1;
		var height = 1;
		var pluginid = 'me_' + playback.method + '_' + ( mejs.meIndex++ );
		var pluginMediaElement = new mejs.PluginMediaElement( pluginid, playback.method, playback.url, htmlMediaElement );
		var container = document.createElement('div');
		var specialIEContainer;
		var node;
		var initVars;

		htmlMediaElement.currentSrc = mejs.utility.absolutizeUrl( playback.url );

		// copy tagName from html media element
		pluginMediaElement.tagName = htmlMediaElement.tagName

		// copy attributes from html media element to plugin media element
		for( var i = 0; i < htmlMediaElement.attributes.length; i++ ){
			var attribute = htmlMediaElement.attributes[i];
			if( attribute.specified == true ){
				pluginMediaElement.setAttribute( attribute.name, attribute.value );
			}
		}

		width = (options.videoWidth > 0) ? options.videoWidth : (htmlMediaElement.getAttribute('width') !== null) ? htmlMediaElement.getAttribute('width') : options.defaultVideoWidth;
		height = (options.videoHeight > 0) ? options.videoHeight : (htmlMediaElement.getAttribute('height') !== null) ? htmlMediaElement.getAttribute('height') : options.defaultVideoHeight;

		// in case of '%' make sure it's encoded
		width = encodeURIComponent( width );
		height = encodeURIComponent( height );

		// register plugin
		pluginMediaElement.success = options.success;
		mejs.MediaPluginBridge.registerPluginElement( pluginid, pluginMediaElement, htmlMediaElement );

		// add container (must be added to DOM before inserting HTML for IE)
		container.className = 'me-plugin';
		container.id = pluginid + '_container';
		
		htmlMediaElement.parentNode.insertBefore( container, htmlMediaElement );

		// flash vars
		initVars = [
			'id=' + pluginid,
			'isvideo=' + ((playback.isVideo) ? "true" : "false"),
			'autoplay=' + ((autoplay) ? "true" : "false"),
			'preload=' + preload,
			'width=' + width,
			'startvolume=' + options.startVolume,
			'timerrate=' + options.timerRate,
			'height=' + height];

		if( playback.url !== null ){
			initVars.push( 'file=' + encodeURIComponent( playback.url ) );
		}
		if( options.enablePluginDebug ){
			initVars.push( 'debug=true' );
		}
		if( options.enablePluginSmoothing ){
			initVars.push( 'smoothing=true' );
		}
		if( controls ){
			initVars.push( 'controls=true' ); // shows controls in the plugin if desired
		}
		if( options.pluginVars ){
			initVars = initVars.concat( options.pluginVars );
		}

		if( mejs.MediaFeatures.isIE ){
			specialIEContainer = document.createElement('div');
			container.appendChild( specialIEContainer );
			
			var outerHTMLString =
				'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" ' +
				'id="' + pluginid + '" width="' + width + '" height="' + height + '">' +
				'<param name="movie" value="' + options.pluginPath + options.flashName + '?x=' + (new Date()).valueOf() + '" />' +
				'<param name="flashvars" value="' + initVars.join('&amp;') + '" />' +
				'<param name="quality" value="high" />' +
				'<param name="bgcolor" value="#000000" />' +
				'<param name="wmode" value="transparent" />' +
				'<param name="allowScriptAccess" value="always" />' +
				'<param name="allowFullScreen" value="true" />' +
				'</object>';
			specialIEContainer.outerHTML = outerHTMLString;
		} else {
			container.innerHTML =
				'<embed id="' + pluginid + '" name="' + pluginid + '" ' +
				'play="true" ' +
				'loop="false" ' +
				'quality="high" ' +
				'bgcolor="#000000" ' +
				'wmode="transparent" ' +
				'allowScriptAccess="always" ' +
				'allowFullScreen="true" ' +
				'type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" ' +
				'src="' + options.pluginPath + options.flashName + '" ' +
				'flashvars="' + initVars.join('&') + '" ' +
				'width="' + width + '" ' +
				'height="' + height + '"></embed>';
		}
		// hide original element
		//htmlMediaElement.style.display = 'none';

		// FYI: options.success will be fired by the MediaPluginBridge
		return pluginMediaElement;
	}
};