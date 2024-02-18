import { PROJECTS } from "./projects.js";
import { USER } from "./userdetails.js";

const CLASSNAMES = {
	section: "mb-8 bg-background bg-fixed bg-cover",
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

function setValue(id, val) {
	document.getElementById(id).innerText = val;
}

function setLink(id, val) {
	document.getElementById(id).href = val;
}

// children will contain an array of elements per tile
// children[0] = elements of tile 0
// children[0][0] = first vertical element of tile 0
function addSection(name, children = [], lgcols = 3, smcols = 2) {
	var sec = document.createElement("section");
	sec.className = CLASSNAMES["section"];
	var container = document.createElement("div");
	container.className = CLASSNAMES["section_container"];
	var heading = document.createElement("h2");
	heading.className = CLASSNAMES["section_heading"];
	heading.innerHTML = name;
	container.appendChild(heading);

	var contentGrid = document.createElement("div");
	var gridClass = CLASSNAMES["grid"] + lgcols;
	if (smcols != 2) {
		gridClass = gridClass.replace(
			"sm:grid-cols-2",
			"sm:grid-cols-" + smcols
		);
	}
	contentGrid.className = gridClass;

	for (var tile of children) {
		var gridTile = document.createElement("div");
		gridTile.className = CLASSNAMES["grid_tile"];

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
	var details = document.createElement("ul");
	details.className = CLASSNAMES["ul"];
	for (var d of vals) {
		var line = document.createElement("li");
		line.className = CLASSNAMES["text"];
		line.innerHTML = d;
		details.appendChild(line);
	}
	return details;
}

function createHeading(val) {
	var name = document.createElement("a");
	name.className = CLASSNAMES["grid_heading"];
	name.innerHTML = val;
	return name;
}

function generateProjectContent(project) {
	var img = document.createElement("img");
	img.className = CLASSNAMES["img"];
	img.loading = "lazy";
	img.src = project["img"];
	img.alt = project["img_alt"];
	var name = createHeading(project["name"]);
	if (project["link"]) {
		name.href = project["link"];
	}
	var details = createUList(project["details"]);
	if (project["img"]) return [name, img, details];
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
	var node = document.createElement("h3");
	node.className = CLASSNAMES["text"];
	node.innerHTML = val;
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
	var name = createHeading(project["name"]);
	if (project["link"]) {
		name.href = project["link"];
	}
	var desc = createTextNode(project["desc"]);
	return [name, desc];
}

function generateSkillsAndInterests(part) {
	var name = createHeading(part["name"]);
	var values = createUList(part["values"]);
	return [name, values];
}

function generateSection(name, data, renderer, lgcols = 3, smcols = 2) {
	document
		.getElementById("populate")
		.appendChild(
			addSection(name, generateList(data, renderer), lgcols, smcols)
		);
}

function populateContent() {
	var projects = PROJECTS[0];
	var user = USER;

	setValue("val_name", user["name"]);
	setValue("val_oneliner", projects["oneliner"]);
	setValue("val_summary", projects["summary"]);

	setLink("val_link_github", "https://github.com/" + user["github"]);
	setLink("val_link_linkedin", "https://linkedin.com/in/" + user["linkedin"]);
	setLink("val_link_mail", "mailto:" + user["email"]);
	setLink("val_link_resume", user["cv"]);

	generateSection("Projects", projects["showcase"], generateProjectContent);
	generateSection(
		"Work Experience",
		user["work_experience"],
		generateWorkExperience,
		1,
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
	var visitorCountElement = document.getElementById("val_view_count");

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
	hit();
	populateContent();
}

window.onload = prepare;
