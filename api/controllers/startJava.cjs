const { exec } = require("child_process");

exec(
	'java -cp "D:\\it106_activity\\server" server/RMIServer displayInfo',
	(error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			return;
		}
		console.log(stdout);
		console.error(stderr);
	}
);

console.log("Hello world");
