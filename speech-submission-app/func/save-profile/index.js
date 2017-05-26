module.exports = function (context, req) {
	context.bindings.speakerProfile = req.body;

	context.done();
};