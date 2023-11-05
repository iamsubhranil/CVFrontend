import { data } from "./projects.js";

function hit() {
  // Set the ID of the HTML element that will display the visitor count
  var visitorCountElement = document.getElementById("visitor-count");

  // Get the current visitor count from your server
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://resume-visitor-count.azurewebsites.net/api/", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Display the visitor count on the web page
      visitorCountElement.textContent = xhr.responseText;
    }
  };
  xhr.send();
}

function designBody() {
	var version = "cpp";

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has("ver")) {
		version = urlParams.get("ver");
	}

	var content = data[0];

	data.forEach(element => {
		if(element.version == version) {
			content = element;
		}
	});

	document.getElementById('pagetitle').innerHTML += " - " + content.oneliner;
	document.getElementById('oneliner').innerHTML = content.oneliner;

	var summary = document.getElementById("summary");
	summary.innerHTML = content.summary;

	var showcaseList = document.getElementById("showcase");
	content.showcase.forEach(element => {
		var name = document.createElement("h3");
		name.className = "fit-item";
		name.innerHTML = "<b>" + element.name + "</b>";
		var points = document.createElement("ul");
		element.details.forEach(point => {
			var p = document.createElement("li");
			p.innerHTML = point;
			points.appendChild(p);
		});

		var show = document.createElement("li");
		show.appendChild(name);
		if (element.link != null) {
			var link = document.createElement("h5");
			link.className = "fit-item";
			link.innerHTML = "<a href=" + element.link + ">" + element.link + "</a>";
			show.appendChild(link);
		}
		show.appendChild(points);

		showcaseList.appendChild(show);
	});

	var othersList = document.getElementById("others");
	content.others.forEach(other => {
		var o = document.createElement("li");
		o.innerHTML = "<a href=" + other.link + "><b>" + other.name + "</b></a> - " + other.desc;
		othersList.appendChild(o);
	});
}

function changeFontForAll(cls) {
	var h1s = document.querySelectorAll(cls);
	h1s.forEach(element => {
		element.style.fontFamily = "Computer Modern Bold";
	});
}

function checkAndReformat() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const printable = urlParams.has("print");
  if (printable) {
	changeFontForAll("h1");
	changeFontForAll("h2");
	changeFontForAll("b");

    document.getElementById("body").style.lineHeight = 1.2;
    document.getElementById("body").style.backgroundColor = "white";
    document.getElementById("body").style.color = "black";
	document.getElementById("body").style.fontFamily = 'Computer Modern';
    document.getElementById("main").style.maxWidth = "100%";
    document.getElementById("main").style.margin = "0";
    document.getElementById("heading").style.display = "grid";
    document.getElementById("heading").style.color = "black";
    document.getElementById("heading").style.backgroundColor = "white";
    document.getElementById("heading").style.justifyContent = "left";
    document.getElementById("heading").style.paddingBottom = "0.5rem";
    document.getElementById("oneliner").style.display = "none";
    const links = document.getElementById("links");
    var emailId = null;
    for (let i = 0; i < links.children.length; i++) {
      if (links.children[i].href.includes("mailto:")) {
        links.children[i].style.display = "none";
        emailId = links.children[i].href.replace("mailto:", "");
        continue;
      }
      links.children[i].innerHTML = links.children[i].href;
      links.children[i].img = null;
      links.children[i].style.color = "black";
    }
    document.getElementById("location").innerHTML += " | " + emailId;
    if (urlParams.has("phone")) {
      document.getElementById("location").innerHTML +=
        " | +91" + urlParams.get("phone");
    }

    const skillSection = document.getElementById("skillsection");
    skillSection.style.display = "grid";

    for (let i = 0; i < skillSection.children.length; i++) {
      var section = skillSection.children[i];
      var allSkills = "";
      var ulist = section.children[1];
      for (let j = 0; j < ulist.children.length; j++) {
        allSkills += ulist.children[j].textContent + ", ";
      }
      allSkills = allSkills.substring(0, allSkills.length - 2);
      section.children[1].innerHTML = allSkills;
    }

    document.getElementById("footer").style.display = "none";
  }
}

function prepare() {
  hit();
  designBody();
  checkAndReformat();
}

window.onload = prepare;
