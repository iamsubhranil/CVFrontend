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

function checkAndReformat() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const printable = urlParams.has("printable");
  if (printable) {
    document.getElementById("body").style.lineHeight = 1.2;
    document.getElementById("body").style.backgroundColor = "white";
    document.getElementById("main").style.maxWidth = "100%";
    document.getElementById("main").style.margin = "0";
    document.getElementById("heading").style.display = "grid";
    document.getElementById("heading").style.color = "black";
    document.getElementById("heading").style.backgroundColor = "white";
    document.getElementById("heading").style.justifyContent = "left";
    document.getElementById("heading").style.paddingBottom = "0.5rem";
    document.getElementById("one-liner").style.display = "none";
    document.getElementById("fullname").style.fontFamily = "Open Sans";
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
        " | " + urlParams.get("phone");
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
  checkAndReformat();
}

window.onload = prepare;
