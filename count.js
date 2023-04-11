function hit() {
  // Set the ID of the HTML element that will display the visitor count
  var visitorCountElement = document.getElementById("visitor-count");

  // Get the current visitor count from your server
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://resume-visitor-count.azurewebsites.net/api/hit",
    true
  );
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Display the visitor count on the web page
      visitorCountElement.textContent = "Visitor count: " + xhr.responseText;
    }
  };
  xhr.send();
}

window.onload = hit;
