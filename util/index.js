var util = {};

util.sanitize = function(text){
	return text.replace(/</g,'&gt').replace(/\n/g,'<br>');
}

module.exports = util;