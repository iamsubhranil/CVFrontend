import { PROJECTS } from "./projects.js";
import { USER } from "./userdetails.js";

const LATEX_BEGIN = `
%-------------------------
% Resume in Latex
% Author : Subhranil Mukherjee
% Based off of: Jake's Resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}


%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}


\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

`;

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
		(isproject ? "}" : "");
	if (isproject && additional) {
		name +=
			" $|$ \\emph{" +
			additional.toString().replaceAll(",", ", ") +
			"}} {";
	}
	name += "}";
	if (!isproject && additional) {
		name += "{" + additional + "}";
	}
	name += "\n";
	return name;
}

function generateProjectContent(project) {
	var name = createHeading(project["name"], project["keywords"], true);
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
			desigAdd = "(Notice Period: " + diffDays + " days remaining)";
		}
	}

	return desigAdd;
}

function generateWorkExperience(work_exp) {
	var company = createHeading(work_exp["company"], work_exp["duration"]);
	var notice_period = work_exp["notice_period"];
	var desig = createTextNode(
		work_exp["designation"],
		generateNoticePeriodText(notice_period)
	);
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
	var name = createHeading(project["name"], project["keywords"], true);
	if (project["link"]) {
		// name.href = project["link"];
	}
	var details = createUList([project["desc"]], "");
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

	console.log(LATEX_BEGIN);

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
			user["work_experience"].reverse(),
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
