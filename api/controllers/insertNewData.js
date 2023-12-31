import express from "express";
import fs from "fs";
import { spawn, exec } from "child_process";

const router = express.Router();

//creating a api endpoint for inserting data in xml file
router.post("/insert", (req, res) => {
	//these are the parameters being extracted from the request body from frontend
	const { id, program, name, age, address, contact_number } = req.body;

	try {
		//defining the path of the xml file
		const path = "D:\\IT106_ACTIVITY\\student.xml";

		//going to open the file for inserting later
		fs.readFile(path, "utf-8", (err, data) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: "Error opening xml file" });
			}
			//creating a variable to store the data to be inserted in the xml file
			const insertData = data.replace(
				"</students>",
				`<student id="${id}">
     <programid>${program}</programid>
     <name>${name}</name>
					<age>${age}</age>
					<address>${address}</address>
					<contactnumber>${contact_number}</contactnumber>
     </student>
    </students>`
			);

			//for insertion, we need to write the data in the xml file
			fs.writeFile(path, insertData, "utf-8", (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: "Error writing to xml file" });
				}
				return res
					.status(200)
					.json({ message: "New data inserted in the xml file" });
			});
		});
	} catch (err) {
		console.log(err);
		res.status(500).send("Server error");
		return;
	}
});

//count the number of records in the xml file
router.get("/count", async (req, res) => {
	try {
		const path = "D:\\IT106_ACTIVITY\\student.xml";

		fs.readFile(path, "utf-8", (err, data) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: "Error opening xml file" });
			}
			const count = data.split("<student").length - 2;
			return res.status(200).json({ count });
		});
	} catch (err) {
		console.log(err);
		res.status(500).send("Server error");
		return;
	}
});

//extract the last node of the xml
router.get("/last", async (req, res) => {
	try {
		const path = "D:\\IT106_ACTIVITY\\student.xml";

		fs.readFile(path, "utf-8", (err, data) => {
			if (err) {
				return res.status(500).json({ message: "Error opening xml file" });
			}

			const lastNode =
				data.split("</student>")[data.split("</student>").length - 2];
			return res.status(200).json({ lastNode });
		});
	} catch (err) {
		console.log(err);
		res.status(500).send("Server error");
		return;
	}
});

//multi processing using child/fork processes

//executes the parser file
// router.get("/extractData", (req, res) => {
// 	//the spawn fuhnction is a subprocess in nodejs that will execute
// 	//another program in the nodejs run time environment

// 	/*

// 	The node:child_process module provides the ability to
// 	spawn subprocesses in a manner that is similar, but
// 	not identical, to popen(3). This capability is
// 	primarily provided by the child_process.spawn() function

// 	*/
// 	// const javaProcess = spawn("java", [
// 	// 	"D:\\it106_activity\\DOMParser\\Parser.java",
// 	// ]);

// 	// javaProcess.stdout.on("data", (data) => {
// 	// 	console.log(data.toString());
// 	// });

// 	// javaProcess.stderr.on("data", (data) => {
// 	// 	console.error(data.toString());
// 	// });

// 	// //closing the java process to avoid memory leaks
// 	// javaProcess.on("close", () => {
// 	// 	res.status(201).json({ message: "Data extraction completed" });
// 	// });

// 	exec("java Parser", (err, stdout, stderr) => {
// 		if (err) {
// 			console.error(err);
// 			return res.status(500).json({ message: "Error executing java file" });
// 		}

// 		console.log(stdout);
// 		console.log(stderr);
// 	});
// });

router.get("/extractData", (req, res) => {
	const javaFilePath = "D:\\it106_activity\\DOMParser\\Parser.java";
	const javaDirectoryName = "DOMParser";
	const javaFileName = "Parser";

	exec(`java ${javaFilePath}`, (err, stdout, stderr) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: "Error compiling Java file" });
		}

		// exec(
		// 	`java -cp ${javaDirectoryName} ${javaFileName}`,
		// 	(err, stdout, stderr) => {
		// 		if (err) {
		// 			console.error(err);
		// 			return res.status(500).json({ message: "Error executing Java file" });
		// 		}

		// 		console.log(stdout);
		// 		console.log(stderr);
		// 		res.status(201).json({ message: "Data extraction completed" });
		// 	}
		// );

		console.log(stdout);
		console.log(stderr);
	});
});

//the exec function is a child process in nodejs that will execute
//another program in the nodejs run time environment

//the difference between spawn and exec is that spawn is used for long running processes
//while exec is used for short running processes

router.get("/displayInfo", (req, res) => {
	//executing the java file
	//child_process.exec(command[, options][, callback])
	exec("node api\\controllers\\startJava.cjs", (err, stdout, stderr) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: "Error executing java file" });
		}

		console.log(stdout);
		console.log(stderr);

		return res.status(200).json({ message: "Data extraction completed" });
	});
});

export { router as insertNewDataRouter };
