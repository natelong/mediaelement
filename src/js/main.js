#include "me-header.js"
#include "me-namespace.js"
#include "me-plugindetector.js"
#include "me-featuredetection.js"
#include "me-mediaelements-lite.js"
#include "me-shim.js"

$('video').each(function(){
	new mejs.MediaElement( this, {
		// remove or reorder to change plugin priority
		plugins: ['flash'],
		pluginVars: [ 'autohide=false','preload=auto' ],
		// name of flash file
		flashName: 'flashmediaelement.swf'
	});
});