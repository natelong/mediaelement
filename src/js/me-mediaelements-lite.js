
/*
extension methods to <video> or <audio> object to bring it into parity with PluginMediaElement (see below)
*/
mejs.HtmlMediaElement = {
	pluginType: 'native'
};

/*
Mimics the <video/audio> element by calling Flash's External Interface
*/
mejs.PluginMediaElement = function( pluginid, pluginType, mediaUrl, oldMediaElement ){
	this.id = pluginid;
	this.pluginType = pluginType;
	this.src = mediaUrl;
	this.events = {};
	this.oldMediaElement = oldMediaElement
};

// JavaScript values and ExternalInterface methods that match HTML5 video properties methods
// http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/fl/video/FLVPlayback.html
// http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html
mejs.PluginMediaElement.prototype = {

	// special
	pluginElement: null,
	pluginType: '',
	isFullScreen: false,

	// not implemented :(
	playbackRate: -1,
	defaultPlaybackRate: -1,
	seekable: [],
	played: [],

	// HTML5 read-only properties
	paused: true,
	ended: false,
	seeking: false,
	duration: 0,
	error: null,
	tagName: '',

	// HTML5 get/set properties, but only set (updated by event handlers)
	muted: false,
	volume: 1,
	currentTime: 0,

	canPlayType: function( type ){
		return $.inArray( type, mejs.flashInfo.types ) > 0;
	},
	positionFullscreenButton: function( x, y, visibleAndAbove ){
		if( this.pluginApi != null && this.pluginApi.positionFullscreenButton ){
			this.pluginApi.positionFullscreenButton( x, y, visibleAndAbove );
		}
	},
	hideFullscreenButton: function(){
		if( this.pluginApi != null && this.pluginApi.hideFullscreenButton ){
			this.pluginApi.hideFullscreenButton();
		}
	},

	dispatchEvent: function( eventName ){
		$( this.oldMediaElement ).trigger( eventName );
	},
	
	// fake DOM attribute methods
	attributes: {},
	hasAttribute: function(name){
		return (name in this.attributes);  
	},
	removeAttribute: function(name){
		delete this.attributes[name];
	},
	getAttribute: function(name){
		if (this.hasAttribute(name)) {
			return this.attributes[name];
		}
		return '';
	},
	setAttribute: function(name, value){
		this.attributes[name] = value;
	}
};
