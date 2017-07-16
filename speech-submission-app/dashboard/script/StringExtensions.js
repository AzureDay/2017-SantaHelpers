String.prototype.replaceAll = function(search, replacement) {
	let target = this;
	return target.split(search).join(replacement);
};

String.prototype.htmlLineBreak = function() {
	let target = this;
	return target
		.replaceAll('\r\n', '<br/>')
		.replaceAll('\r', '<br/>')
		.replaceAll('\n', '<br/>');
};