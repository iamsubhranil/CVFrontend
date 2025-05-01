import { PROJECTS } from "./projects.js";
import { USER } from "./userdetails.js";
import { IMAGEMAP } from "./resources.js";

const CLASSNAMES = {
	section: "mb-8",
	section_container: "container mx-auto",
	section_heading:
		"mb-8 text-3xl font-bold text-slate-200 bg-frosted-glass w-max p-3 rounded-lg shadow-2xl",
	grid: "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-",
	grid_tile: "bg-frosted-glass rounded-lg p-8 shadow-2xl flex flex-col",
	ul: "ml-6 list-disc",
	grid_heading: "mb-4 text-xl font-bold text-slate-200",
	text: "text-gray-200",
	img: "rounded-lg mb-4",
};

function inNodeJs() {
	if (typeof window !== "undefined") {
		return false;
	} else {
		return true;
	}
}

var DOM = null;

async function initDOM() {
	try {
		const { JSDOM } = await import("jsdom");
		const fs = await import("fs");
		// Create a new DOM
		DOM = new JSDOM(fs.readFileSync("src/index.html"));
	} catch (error) {}
}

function getDocument() {
	if (inNodeJs()) {
		return DOM.window.document;
	}
	return document;
}

function createElement(name, className = null, value = null, href = null) {
	var el = getDocument().createElement(name);
	if (className) {
		el.className = className;
	}
	if (value) {
		el.textContent = value;
	}
	if (href) {
		el.href = href;
	}
	return el;
}

function getElement(id) {
	return getDocument().getElementById(id);
}

function getImageURL(img) {
	if (img in IMAGEMAP) {
		return IMAGEMAP[img].file;
	}
	return img;
}

function createImg(src, lazy = false, alt = null, onload = null) {
	var el = createElement("img", CLASSNAMES["img"]);
	if (lazy) {
		el.loading = "lazy";
	}
	if (alt) {
		el.alt = alt;
	}
	if (onload) {
		el.onload = onload;
	}
	const url = getImageURL(src);
	el.src = url;
	if (url != src) {
		el.id = url;
	}
	return el;
}

function removeElement(id) {
	var el = getElement(id);
	el.parentNode.removeChild(el);
}

function setValue(id, val) {
	getElement(id).textContent = val;
}

function setLink(id, val) {
	getElement(id).href = val;
}

// children will contain an array of elements per tile
// children[0] = elements of tile 0
// children[0][0] = first vertical element of tile 0
function addSection(name, children = [], lgcols = 3, smcols = 2) {
	var sec = createElement("section", CLASSNAMES["section"]);
	var container = createElement("div", CLASSNAMES["section_container"]);
	var heading = createElement("h2", CLASSNAMES["section_heading"], name);
	container.appendChild(heading);

	var gridClass = CLASSNAMES["grid"] + lgcols;
	if (smcols != 2) {
		gridClass = gridClass.replace(
			"sm:grid-cols-2",
			"sm:grid-cols-" + smcols
		);
	}
	var contentGrid = createElement("div", gridClass);

	for (var tile of children) {
		var gridTile = createElement("div", CLASSNAMES["grid_tile"]);

		for (var c of tile) {
			gridTile.appendChild(c);
		}

		contentGrid.appendChild(gridTile);
	}

	container.appendChild(contentGrid);

	sec.appendChild(container);

	return sec;
}

function createUList(vals) {
	var details = createElement("ul", CLASSNAMES["ul"]);
	for (var d of vals) {
		var line = createElement("li", CLASSNAMES["text"], d);
		details.appendChild(line);
	}
	return details;
}

function createHeading(val, href = null) {
	var name = createElement("a", CLASSNAMES["grid_heading"], val, href);
	return name;
}

function generateProjectContent(project) {
	var name = createHeading(project["name"], project["link"]);
	var details = createUList(project["details"]);
	if (project["img"]) {
		var img = createImg(project["img"], true, project["img_alt"]);
		return [name, img, details];
	}
	return [name, details];
}

function generateList(projects, func) {
	var elements = [];
	for (var p of projects) {
		elements.push(func(p));
	}
	return elements;
}

function createTextNode(val) {
	var node = createElement("h3", CLASSNAMES["text"], val);
	return node;
}

function generateNoticePeriodText(notice_period) {
	var desigAdd = "";
	if (notice_period) {
		var noticePeriodEnd = new Date(notice_period["started"]);
		noticePeriodEnd.setDate(
			noticePeriodEnd.getDate() + parseInt(notice_period["duration"])
		);
		var today = new Date();

		if (today < noticePeriodEnd) {
			const diffInMills = noticePeriodEnd - today;
			const diffDays = Math.ceil(diffInMills / (1000 * 60 * 60 * 24));
			desigAdd = " (Notice Period: " + diffDays + " days remaining)";
		}
	}
	return desigAdd;
}

function generateWorkExperience(work_exp) {
	var company = createHeading(work_exp["company"]);
	var desig = createTextNode(work_exp["designation"]);
	var duration = createTextNode(
		work_exp["duration"] +
			generateNoticePeriodText(work_exp["notice_period"])
	);
	var highlights = createUList(work_exp["highlights"]);
	return [company, desig, duration, highlights];
}

function generateEducation(education) {
	var school = createHeading(education["school"]);
	var degree = createTextNode(education["degree"]);
	var duration = createTextNode(education["duration"]);
	var gpa = createTextNode("GPA: " + education["gpa"]);
	return [school, degree, duration, gpa];
}

function generateOtherProject(project) {
	var name = createHeading(project["name"], project["link"]);
	var desc = createTextNode(project["desc"]);
	return [name, desc];
}

function generateSkillsAndInterests(part) {
	var name = createHeading(part["name"]);
	var values = createUList(part["values"]);
	return [name, values];
}

function generateSection(name, data, renderer, lgcols = 3, smcols = 2) {
	getElement("populate").appendChild(
		addSection(name, generateList(data, renderer), lgcols, smcols)
	);
}

function generateRichResult(name, alt_name, desc, github, linkedin, image) {
	var content = `
	{
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		"mainEntity": {
		  "@type": "Person",
		  "name": "${name}",
		  "alternateName": "${alt_name}",
		  "description": "${desc}",
		  "image": "${image}",
		  "sameAs": [
			"https://github.com/${github}",
			"https://linkedin.com/in/${linkedin}"
		  ]
		}
	}
	`;
	setValue("google_rich_result", content);
}

function populateContent() {
	var projects = PROJECTS[0];
	var user = USER;

	const backgrounds = user["backgrounds"];
	var script = createElement("script");
	script.innerHTML = `
			window.cvAppliedBackgrounds = new Array(${backgrounds.length}).fill(false);
			window.cvApplyBackground = function(idx, link) {
				if(!this.cvAppliedBackgrounds[idx] ||
						idx == window.cvAppliedBackgrounds.length - 1) {
					document.body.style.backgroundImage = "url(" + link + ")";
					for (var j = 0; j <= idx; j++) {
						this.cvAppliedBackgrounds[j] = true;
					}
				}
			}
		`;
	getDocument().head.appendChild(script);
	var idx = 0;
	for (var image of backgrounds) {
		var img = createImg(image, false, null, null);
		img.setAttribute(
			"onload",
			`window.cvApplyBackground(${idx}, this.src);`
		);
		img.style.display = "none";
		getDocument().body.appendChild(img);
		idx += 1;
	}

	if (Object.keys(IMAGEMAP).length > 0) {
		var lazyImageUpdate = createElement("script");
		lazyImageUpdate.innerHTML = `
			window.cvMaybeRefreshImage = function(id, link, lastModified, etag) {
				fetch(link, {method: 'HEAD'})
					.then(response => {
						const headers = response.headers;
						const currentLastModified = headers.get("last-modified") || "";
						const currentEtag = headers.get("etag") || "";
						if(currentLastModified != lastModified || currentEtag != etag) {
							console.log("Updating image ", id, " to ", link);
							var img = document.createElement("img");
							img.style.display = "none";
							img.setAttribute("onload", "document.getElementById('" + id + "').src=this.src");
							img.src = link;
							document.body.appendChild(img);
						}
					})
					.catch(err => console.error('Error making HEAD request to', link, ':', err));
			};
			window.cvImageMap = ${JSON.stringify(IMAGEMAP)};
			for(const imageLink in window.cvImageMap) {
				const obj = window.cvImageMap[imageLink];
				setTimeout(() => {
					window.cvMaybeRefreshImage(obj.file, imageLink, obj.lastModified, obj.etag);
				});
			}
		`;
		getDocument().head.appendChild(lazyImageUpdate);
	}

	setValue("val_name", user["name"]);
	setValue("val_oneliner", projects["oneliner"]);
	setValue("val_summary", projects["summary"]);

	setLink("val_link_github", "https://github.com/" + user["github"]);
	setLink("val_link_linkedin", "https://linkedin.com/in/" + user["linkedin"]);
	setLink("val_link_mail", "mailto:" + user["email"]);
	setLink("val_link_resume", user["cv"]);

	generateRichResult(
		user["name"],
		user["alt_name"],
		user["desc"],
		user["github"],
		user["linkedin"],
		user["image"]
	);

	generateSection("Projects", projects["showcase"], generateProjectContent);
	generateSection(
		"Work Experience",
		user["work_experience"].reverse(),
		generateWorkExperience,
		2,
		1
	);
	generateSection("Education", user["education"], generateEducation, 2);
	generateSection("Other Projects", projects["others"], generateOtherProject);
	generateSection(
		"Skills & Interests",
		user["skills_and_interests"],
		generateSkillsAndInterests,
		4,
		2
	);
}

function hit() {
	// Set the ID of the HTML element that will display the visitor count
	var visitorCountElement = getElement("val_view_count");

	// Get the current visitor count from your server
	var xhr = new XMLHttpRequest();
	xhr.open(
		"GET",
		"https://resume-visitor-count.azurewebsites.net/api/",
		true
	);
	xhr.onload = function () {
		if (xhr.status === 200) {
			// Display the visitor count on the web page
			visitorCountElement.textContent = "Page Views: " + xhr.responseText;
		}
	};
	xhr.send();
}

function prepare() {
	if (inNodeJs()) {
		initDOM().then((_) => {
			populateContent();
			removeElement("js_fillContent");
			removeElement("js_projects");
			removeElement("js_userdetails");
			removeElement("js_resources");
			console.log(DOM.serialize());
		});
	} else {
		hit();
		populateContent();
	}
}

prepare();
