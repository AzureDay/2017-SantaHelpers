module.exports = function (context, req, speakerProfile) {
	context.res = speakerProfile;

	context.done();
};