const puppeteer = require("puppeteer");
const fs = require("fs");
const crypto = require("crypto");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SOURCE_PATH = "src/";
const RELATIVE_RESOURCE_PATH = "dist/";
const RESOURCE_PATH = SOURCE_PATH + RELATIVE_RESOURCE_PATH;
let NOCACHE = false;
if (process.argv.length > 2) {
	NOCACHE = process.argv[2] == "nocache";
}

function createHashFromURL(url) {
	const hash = crypto.createHash("sha256");
	hash.update(url);

	return hash.digest("hex");
}

(async () => {
	if (!NOCACHE) {
		fs.rmSync(RESOURCE_PATH, { recursive: true, force: true });
		fs.mkdirSync(RESOURCE_PATH);
		fs.writeFileSync(
			SOURCE_PATH + "resources.js",
			"export const IMAGEMAP = {};"
		);
	}

	const browser = await puppeteer.launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});
	const page = await browser.newPage();

	var imageMap = {};

	if (!NOCACHE) {
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
				const extension = contentType.split("/")[1];

				// Save the image
				const fileName = createHashFromURL(url) + "." + extension;
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
	}

	// Replace with the actual URL of your Tailwind page
	const url = "http://localhost:8000";
	await page.goto(url, { waitUntil: "load" });

	await page.setViewport({ width: 2100, height: 1440 });
	await page.waitForNetworkIdle();
	await sleep(1000);

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

	if (!NOCACHE) {
		// Find out the element corresponding to each image in the imageMap
		for (const [url, data] of Object.entries(imageMap)) {
			const element = await page.evaluateHandle((url) => {
				return document.querySelector(`img[src="${url}"]`);
			}, url);

			if (element) {
				const boundingBox = await element.boundingBox();
				console.log(
					`Element found for ${url} in bounding box:`,
					boundingBox
				);
				if (boundingBox) {
					const height = Math.ceil(boundingBox.height);
					const width = Math.ceil(boundingBox.width);

					// Resize the original image to fit the bounding box
					const fileName = data.file;
					const convertedFile = fileName.split(".")[0] + ".avif";
					const originalImage = fs.readFileSync(
						SOURCE_PATH + fileName
					);

					const sharp = require("sharp");
					await sharp(originalImage)
						.resize(width, height)
						.toFile(SOURCE_PATH + convertedFile);

					data.file = convertedFile;
					console.log("Saved resized image:", data.file);
					fs.rmSync(SOURCE_PATH + fileName, { force: true });
				}
			}
		}
	}

	// Close the browser
	await browser.close();

	// Do something with the screenshots, e.g., save them to files
	screenshots.forEach((screenshot, index) => {
		fs.writeFileSync(`part${index}.png`, screenshot);
	});

	if (!NOCACHE) {
		console.log(JSON.stringify(imageMap));
		fs.writeFileSync(
			SOURCE_PATH + "resources.js",
			"export const IMAGEMAP = " + JSON.stringify(imageMap, null, 4) + ";"
		);
	}
})();
