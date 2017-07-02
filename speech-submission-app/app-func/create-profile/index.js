module.exports = function (context, req, speakerProfile) {
	if (!speakerProfile) {
		context.bindings.speakerProfileTable = [{}];
		context.bindings.speakerProfileBlob = "{}";
	}

	context.done();
};