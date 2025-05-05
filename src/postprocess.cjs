const fs = require("fs");
const path = require("path");
const axios = require("axios");
const jsdom = require("jsdom");
const subsetFont = require("subset-font");
const Beasties = require("beasties");
const { minify } = require("html-minifier-terser");
const { log } = require("console");
const { JSDOM } = jsdom;

// Input file paths
const htmlPath = "./index2.html";

function extractFontUrlFromStyle(html) {
	const dom = new JSDOM(html);
	const styleTags = dom.window.document.querySelectorAll("style");

	for (const style of styleTags) {
		const matches = [
			...style.textContent.matchAll(
				/@font-face\s*{[^}]*?src:\s*url\(["']?([^"')]+\.woff2)["']?\)/g
			),
		];
		if (matches.length > 0) {
			return matches[0][1]; // return the first matching .woff2 URL
		}
	}

	return null;
}

function extractUsedText(html) {
	const dom = new JSDOM(html);
	return dom.window.document.body.textContent;
}

async function downloadFont(url) {
	if (fs.existsSync(url)) {
		return url;
	}
	const res = await axios.get(url, { responseType: "arraybuffer" });
	const filename = path.basename(url.split("?")[0]);
	const fullPath = path.join(__dirname, filename);
	fs.writeFileSync(fullPath, Buffer.from(res.data));
	return fullPath;
}

async function embedSubsetFont(html, fontPath, usedText) {
	const dom = new JSDOM(html);
	const document = dom.window.document;

	// Find the first <style> with @font-face
	const styleTags = [...document.querySelectorAll("style")];
	let originalFontFace = null;
	let fontStyleTag = null;

	for (const style of styleTags) {
		const match = style.textContent.match(/@font-face\s*{[^}]+}/s);
		if (match) {
			fontStyleTag = style;
			originalFontFace = match[0];
			break;
		}
	}

	if (!originalFontFace) {
		throw new Error("❌ No @font-face block found.");
	}

	// Subset font
	const fontBuffer = fs.readFileSync(fontPath);
	const subsetBuffer = await subsetFont(fontBuffer, usedText, {
		targetFormat: "woff2",
		features: ["liga"],
	});

	const base64 = subsetBuffer.toString("base64");

	// Create new @font-face block with embedded font
	const newFontFace = originalFontFace.replace(
		/src:\s*url\(([^)]+)\)[^;]*;/,
		`src: url(data:font/woff2;base64,${base64}) format("woff2");`
	);

	// Replace the original @font-face with the new one
	fontStyleTag.textContent = newFontFace;

	return dom.serialize();
}

// Function to inline CSS using Beasties
const inlineCSS = async (htmlContent) => {
	const beasties = new Beasties({
		path: ".",
		reduceInlineStyles: false,
		logLevel: "silent",
	});
	const htmlWithInlineCSS = await beasties.process(htmlContent);
	return htmlWithInlineCSS;
};

function inlineBackground0(html) {
	var dom = new JSDOM(html);
	var document = dom.window.document;
	const background0Element = document.getElementById("background_0");
	if (!background0Element) {
		return html;
	}
	const background0Path = background0Element.src;
	const fs = require("fs");
	if (!background0Path || !fs.existsSync(background0Path)) {
		return html;
	}
	// Check if the size is < 50KB
	const stats = fs.statSync(background0Path);
	if (stats.size < 50 * 1024) {
		const background0 = fs.readFileSync(background0Path, {
			encoding: "base64",
		});
		const extension = path.extname(background0Path).slice(1);
		document.body.style.backgroundImage =
			"url(data:image/" + extension + ";base64," + background0 + ")";
		document.body.removeChild(background0Element);
		fs.rmSync(background0Path, { force: true });
		return dom.serialize();
	} else {
		return html;
	}
}

// Function to remove external stylesheet links
function removeExternalStylesheetLinks(html) {
	const dom = new JSDOM(html);
	const document = dom.window.document;

	const links = [
		...document.querySelectorAll('link[rel="stylesheet"][href]'),
		...document.querySelectorAll('link[as="style"][href]'),
	];
	links.forEach((link) => link.remove());

	return dom.serialize();
}

// Main function to handle the entire process
(async () => {
	const html = fs.readFileSync(htmlPath, "utf8");

	// Step 1: Extract Font links from the HTML
	const fontUrl = extractFontUrlFromStyle(html);
	if (!fontUrl) {
		console.error("No font URL found in the HTML.");
		return;
	}

	// Step 2: Inline the font
	const fontPath = await downloadFont(fontUrl);
	const usedText = extractUsedText(html);
	const htmlWithEmbeddedFont = await embedSubsetFont(
		html,
		fontPath,
		usedText + "0123456789" // Subset all numbers due to the counter
	);

	// Step 3: Inline background image
	const htmlWithInlineBackground = inlineBackground0(htmlWithEmbeddedFont);

	// Step 4: Inline the CSS
	const htmlWithInlineCSS = await inlineCSS(htmlWithInlineBackground);

	// Step 5: Remove external stylesheet links
	const htmlWithoutExternalStyles =
		removeExternalStylesheetLinks(htmlWithInlineCSS);

	// Step 6: Minify the final HTML
	const minifiedHtml = await minify(htmlWithoutExternalStyles, {
		collapseWhitespace: true,
		removeComments: true,
		removeRedundantAttributes: true,
		minifyCSS: true,
		minifyJS: true,
	});

	// Step 7: Write the final output HTML file
	console.log(minifiedHtml);
})();
