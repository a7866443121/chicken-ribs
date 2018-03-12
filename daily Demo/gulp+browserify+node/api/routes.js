module.exports = {
	to:function(s){
		console.log(s);
		history.pushState(null, null,s);
		console.log(history.length);
	}
}
