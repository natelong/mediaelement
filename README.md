# `<video>` made easy. One file. Any browser. Light as hell.
_A fork of John Dyer's awesome MediaElement, but with more lightness._

## MediaElement Stats
* Author: John Dyer [http://j.hn/](http://j.hn/)
* Website: [http://mediaelementjs.com/](http://mediaelementjs.com/)
* GitHub Repo: [http://github.com/johndyer/mediaelement](http://github.com/johndyer/mediaelement)
* License: GPLv2/MIT
* Meaning: Please use this everywhere and it'd be swell if you'd link back here.

## Installation and Usage

### 1. Add Script anywhere in the page (preferably last)

	<script src="jquery.js"></script>
	<script src="mediaelement.min.js"></script>

### 2. Option A: Single H.264 file

If your users have JavaScript and Flash, this is the easist route for all browsers and mobile devices.
	
	<video src="myvideo.mp4" width="320" height="240"></video>

### 2. Option B: Multiple codecs with Flash fall-through when JavaScript is disabled

This includes multiple codecs for various browsers (H.264 for IE and Safari, WebM for Chrome, Firefox 4, and Opera, Ogg for Firefox 3) as well as a Flash fallback for non HTML5 browsers with JavaScript disabled.

	<video width="320" height="240" poster="poster.jpg" controls="controls" preload="none">
		<source type="video/mp4" src="myvideo.mp4" />
		<source type="video/webm" src="myvideo.webm" />
		<source type="video/ogg" src="myvideo.ogv" />
		<object width="320" height="240" type="application/x-shockwave-flash" data="flashmediaelement.swf">
			<param name="movie" value="flashmediaelement.swf" />
			<param name="flashvars" value="controls=true&amp;poster=myvideo.jpg&amp;file=myvideo.mp4" /> 
			<img src="myvideo.jpg" width="320" height="240" title="No video playback capabilities" />
		</object>
	</video>

### 3. Kick back and enjoy the show!

## Advanced Techniques

### Asynchronous Script Loading

	<script src="jquery.js"></script>
	<script>
		if( $('video').length > 0 ){
			$('<script>')
				.attr('src', 'mediaelement.min.js')
				.appendTo( 'body' )
		}
	</script>

With this method, the video script won't load unless there are videos on the page, and it will mark up those videos with a flash player if necessary. If the browser supports videos natively, then the script will leave them untouched so you can enjoy them in their default chrome. You can always add your own style and whatnot, but why?

### Analytics Tracking

	<script>
		$( 'video' ).on( 'play',function(){
			// track the event with your tracker of choice here
		});
	</script>

The events are bound to the original element, so you only have to look in one place for events to be raised. It's that simple!

_Events that the flash player calls:_
loadeddata
progress
timeupdate
seeked
play
playing
pause
loadedmetadata
ended
volumechange
stop
loadstart
canplay
loadeddata
seeking
fullscreenchange
	

## How it Works: 

`MediaElement.js` is an HTML5 `<video>` shim&mdash;a set of custom Flash plugins that mimic the HTML5 MediaElement API for browsers that don't support HTML5 or don't support the media codecs you're using. Instead of using Flash as a _fallback_, Flash is used to make the browser seem HTML5 compliant and enable codecs like H.264 (via Flash) on all browsers.