const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// Replace with the actual URL of your Tailwind page
	const url = "http://localhost:8000";
	await page.goto(url, {waitUntil: "load"});

	await page.setViewport({width: 2100, height: 1440});
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
		await page.setViewport({ width: page.viewport().width , height: partHeight });

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
})();
