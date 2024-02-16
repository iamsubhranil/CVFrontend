import { PROJECTS } from "./projects.js";
import { USER } from "./userdetails.js";

function addSection(name, children) {
	let text = "\\section{" + name + "}\n";
	text += "\\resumeSubHeadingListStart\n";
	text += children;

	text += "\\resumeSubHeadingListEnd\n";
	return text;
}

function createUList(vals) {
	let details = "\\resumeItemListStart\n";
	for (var v of vals) {
		v = v.replace("%", "\\%");
		details += "\t\\resumeItem{" + v + "}\n";
	}
	details += "\\resumeItemListEnd\n";
	return details;
}

function createHeading(val, additional = null, isproject = false) {
	var name =
		"\\" +
		(isproject ? "resumeProjectHeading" : "resumeSubheading") +
		"\n" +
		"\t{" +
		(isproject ? "\\textbf{" : "") +
		val +
		(isproject ? "}" : "") +
		"}";
	if (additional) {
		name += "{" + additional + "}";
	}
	name += "\n";
	return name;
}

function generateProjectContent(project) {
	var name = createHeading(project["name"], " ", true);
	if (project["link"]) {
		// name.href = project["link"];
	}
	var details = createUList(project["details"]);
	return [name, details];
}

function generateList(name, projects, func) {
	var elements = "";
	if (name == "Skills \\& Interests") {
		elements = "\\small{\\item{\n";
	}
	for (var p of projects) {
		for (var v of func(p)) {
			elements += v;
		}
	}
	if (name == "Skills \\& Interests") {
		elements += "}}\n";
	}
	return elements;
}

function createTextNode(val1, val2) {
	return "{" + val1 + "}{" + val2 + "}\n";
}

function generateWorkExperience(work_exp) {
	var company = createHeading(work_exp["company"], work_exp["duration"]);
	var desig = createTextNode(work_exp["designation"], "");
	var highlights = createUList(work_exp["highlights"]);
	return [company, desig, highlights];
}

function generateEducation(education) {
	var school = createHeading(education["school"], education["duration"]);
	var degree = createTextNode(
		education["degree"],
		"GPA: " + education["gpa"]
	);
	return [school, degree];
}

function generateOtherProject(project) {
	var name = createHeading(project["name"], " ");
	if (project["link"]) {
		// name.href = project["link"];
	}
	var details = createTextNode(project["desc"], "");
	return [name, details];
}

function generateSkillsAndInterests(part) {
	var name =
		"\\textbf{" +
		part["name"] +
		"}{: " +
		part["values"].toString().replaceAll(",", ", ") +
		"} \\\\\n";
	return [name];
}

function generateSection(name, data, renderer) {
	return addSection(name, generateList(name, data, renderer));
}

function generateHeading(name, phone, email, github, linkedin) {
	return (
		" \
    \\begin{center} \n\
        \\textbf{\\Huge \\scshape " +
		name +
		"} \\\\ \\vspace{1pt} \n\
        \\small " +
		phone +
		" $|$ \\href{mailto:" +
		email +
		"}{\\underline{" +
		email +
		"}} $|$\n \
        \\href{https://linkedin.com/in/" +
		linkedin +
		"}{\\underline{linkedin.com/in/" +
		linkedin +
		"}} $|$\n \
        \\href{https://github.com/" +
		github +
		"}{\\underline{github.com/" +
		github +
		"}} \n\
    \\end{center}"
	);
}

function populateContent() {
	var projects = PROJECTS[0];
	var user = USER;

	console.log("\\begin{document}\n\n");

	console.log(
		generateHeading(
			user["name"],
			user["phone"],
			user["email"],
			user["github"],
			user["linkedin"]
		)
	);
	console.log(
		generateSection(
			"Projects",
			projects["showcase"],
			generateProjectContent
		)
	);
	console.log(
		generateSection(
			"Work Experience",
			user["work_experience"],
			generateWorkExperience
		)
	);
	console.log(
		generateSection("Education", user["education"], generateEducation)
	);
	console.log(
		generateSection(
			"Other Projects",
			projects["others"],
			generateOtherProject
		)
	);
	console.log(
		generateSection(
			"Skills \\& Interests",
			user["skills_and_interests"],
			generateSkillsAndInterests
		)
	);

	console.log("\n\n\\end{document}\n");
}

populateContent();
// window.onload = populateContent;
