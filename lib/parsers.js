
//TODO swap this for XRegExp
var startExp = /(?:\r\n|\r|\n){2}Available tasks(?:\r\n|\r|\n)/g;
var taskExp = /[ ]{2}[ ]*([\w_-]+)[ ]{2}([ \w_"'-]+?)[ ]\*[ ]*(?:\r\n|\r|\n)/g;

// without delimitng first and last quote
var aliasRegExp = / +([\w_:-]+)  Alias for "([\S \t]+(?:",\s+"[\S \t]+)*?)"\s+tasks?.+(?:\r\n|\r|\n)/g;

function parseHelp(output) {
	var result = {
		task: {},
		alias: {}
	};

	var elementMatch;
	var nextI = 0;

	startExp.lastIndex = 0;
	var startMatch = startExp.exec(output);

	if (startMatch) {
		nextI = startMatch.lastIndex + startMatch[0].length;

		// tasks
		taskExp.lastIndex = nextI;
		do {
			elementMatch = taskExp.exec(output);
			if (elementMatch) {
				nextI = taskExp.lastIndex + elementMatch[0].length;
				taskExp.lastIndex = nextI;
				//TODO add proper map object
				result.task[elementMatch[1]] = String(elementMatch[2]);
			}
		}
		while (elementMatch);

		// aliases
		aliasRegExp.lastIndex = nextI;
		do {
			elementMatch = aliasRegExp.exec(output);
			if (elementMatch) {
				nextI = aliasRegExp.lastIndex + elementMatch[0].length;
				taskExp.lastIndex = nextI;
				//TODO add proper map object
				// restore quotes and parse as JSON array
				result.alias[elementMatch[1]] = JSON.parse('["' + elementMatch[2] + '"]');
			}
		}
		while (elementMatch);
	}
	return result;
}

module.exports = {
	parseHelp: parseHelp
};