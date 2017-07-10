const fs = require("fs");
const chokidar = require("chokidar");

class Earthly {
	constructor() {
		this._tasks = {};
	}

	task(name, inputs, handler) {
		this._tasks[name] = { inputs, handler };
	}

	async run(name) {
		console.log(`[${name}] Started`);

		let timeTaken;

		try {
			const startTime = Date.now();
			await this._tasks[name].handler();
			const endTime = Date.now();

			timeTaken = (endTime - startTime) / 1000;
		} catch(error) {
			console.log(`[${name}] Error: ${error.message}`);
			return;
		}

		console.log(`[${name}] Finished (${timeTaken}s)`);
	}

	watch(name) {
		chokidar.watch(this._tasks[name].inputs, {
			ignoreInitial: true,
			alwaysStat: true
		}).on('all', (event, path) => {
			this.run(name);
		});
	}

	go() {
		for(let name in this._tasks) {
			this.run(name);
		}

		let dev = false;

		process.argv.forEach(a => {
			if(a == "--dev") {
				dev = true;
			}
		});

		if(dev) {
			for(let name in this._tasks) {
				this.watch(name);
			}
		}
	}

	// utility

	stream(stream) {
		let buffer = "";

		stream.on("data", data => buffer += data);

		return new Promise((resolve, reject) => {
			stream.on("error", reject);
			stream.on("end", () => resolve(buffer));
		});
	}

	writeFile(file, data) {
		return new Promise((resolve, reject) => {
			fs.writeFile(file, data, err => {
				err ? reject(err) : resolve();
			});
		});
	}
}

Earthly.prototype.Earthly = Earthly;

module.exports = Earthly;
