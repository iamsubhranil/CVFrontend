const puppeteer = require("puppeteer");
const fs = require("fs");
const crypto = require("crypto");

const SOURCE_PATH = "src/";
const RELATIVE_RESOURCE_PATH = "dist/";
const RESOURCE_PATH = SOURCE_PATH + RELATIVE_RESOURCE_PATH;

function createHashFromURL(url) {
	const hash = crypto.createHash("sha256");
	hash.update(url);

	return hash.digest("hex");
}

(async () => {
	fs.rmSync(RESOURCE_PATH, { recursive: true, force: true });
	fs.mkdirSync(RESOURCE_PATH);
	fs.writeFileSync(
		SOURCE_PATH + "resources.js",
		"export const IMAGEMAP = {};"
	);

	const browser = await puppeteer.launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});
	const page = await browser.newPage();

	var imageMap = {};

	// Event listener for response to capture resources
	page.on("response", async (response) => {
		const headers = response.headers();
		const contentType = headers["content-type"];
		if (contentType && contentType.startsWith("image")) {
			const addr = response.remoteAddress();
			if (addr.ip == "127.0.0.1" && addr.port == 8000) {
				return;
			}
			const url = response.url();
			const content = await response.buffer();

			// Save the image
			const fileName = createHashFromURL(url);
			fs.writeFileSync(RESOURCE_PATH + fileName, content);
			imageMap[url] = {
				file: RELATIVE_RESOURCE_PATH + fileName,
				lastModified: headers["last-modified"] || "",
				etag: headers["etag"] || "",
			};

			console.log(
				`Image saved: ${fileName}: ${url} ${headers["last-modified"]} ${headers["etag"]}`
			);
		}
	});

	// Replace with the actual URL of your Tailwind page
	const url = "http://localhost:8000";
	await page.goto(url, { waitUntil: "load" });

	await page.setViewport({ width: 2100, height: 1440 });
	await page.waitForNetworkIdle();

	// Get the page height
	const pageHeight = await page.evaluate(() => document.body.scrollHeight);

	// Define the number of parts to split the page into
	const numParts = 3;

	// Calculate the height of each part
	const partHeight = Math.ceil(pageHeight / numParts);

	// Array to store the part screenshots
	const screenshots = [];

	// Loop through each part
	for (let i = 0; i < numParts; i++) {
		// Set the viewport height to the current part height
		await page.setViewport({
			width: page.viewport().width,
			height: partHeight,
		});

		// Scroll the page to the top of the current part
		await page.evaluate(
			(partHeight, partIndex) => {
				window.scrollTo(0, partIndex * partHeight);
			},
			partHeight,
			i
		);

		await page.waitForNetworkIdle();

		// Capture screenshot of the current part
		const screenshot = await page.screenshot({ fullPage: false });
		screenshots.push(screenshot);
	}

	// Close the browser
	await browser.close();

	// Do something with the screenshots, e.g., save them to files
	screenshots.forEach((screenshot, index) => {
		fs.writeFileSync(`part${index}.png`, screenshot);
	});
	console.log(JSON.stringify(imageMap));
	fs.writeFileSync(
		SOURCE_PATH + "resources.js",
		"export const IMAGEMAP = " + JSON.stringify(imageMap) + ";"
	);
})();
