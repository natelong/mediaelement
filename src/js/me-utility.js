mejs.utility = {
	absolutizeUrl: function( url ){
		var el = document.createElement( 'div' );
		el.innerHTML = '<a href="' + encodeURI( url ) + '">x</a>';
		return el.firstChild.href;
	}
};