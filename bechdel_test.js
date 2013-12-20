// Error codes


function tooltipText(results) {
  text = "";
  rating = results['rating'];

  if(rating == "3"){
    text = "Includes at least two named women talking about somthing other than a man.";
  }
  else if(rating == "2"){
    text = "Includes at least two named women talking about a man.";
  }
  else if(rating == "1"){
    text = "Includes at least two named women.";
  }
  else{
    text = "No two named women.";
  }

  return(rating + "/3 Bechdel criteria: " + text);
}

function parseAndDisplayResult(responseText){
  // Parse results
  var bechdelTestResults = JSON.parse(responseText);

  // Check for Error Cases
  if (bechdelTestResults['status'] == "403") {
    // 403  This movie has not had an approved rating yet.
  } else if (bechdelTestResults['status'] == "403") {
    // 404  This movie has not been rated yet.
  }

  // Replace waiting icon with Pass or Fail
  if (bechdelTestResults['rating'] == "3") {
    resultImage.setAttribute("src", chrome.extension.getURL("images/success.png"));
  } else {
    resultImage.setAttribute("src", chrome.extension.getURL("images/fail.png"));
  }

  resultImage.setAttribute("title", tooltipText(bechdelTestResults));

  bechdelTestMovieURL = document.createElement('a');
  bechdelTestMovieURL.setAttribute("href", "http://bechdeltest.com/view/" + bechdelTestResults["id"]+ "/");
  bechdelTestMovieURL.setAttribute("target", "_new");
  bechdelTestRatingDiv.insertBefore(bechdelTestMovieURL);

  bechdelTestMovieURL.insertBefore(resultImage);
}

// Build Bechdel Test Rating div
starBox = document.getElementsByClassName('star-box-details')[0];
bechdelTestRatingDiv = document.createElement('div');
starBox.parentElement.insertBefore(bechdelTestRatingDiv, starBox.nextElementSibling);
bechdelTestRatingDiv.setAttribute("class", "bechdel-test-rating");

bechdelTestLink = document.createElement('a');
bechdelTestLink.setAttribute("href", "http://en.wikipedia.org/wiki/Bechdel_test");
bechdelTestLink.innerHTML = "Bechdel Test";

bechdelTestRatingDiv.insertBefore(bechdelTestLink);

hack = document.createElement('span');
hack.innerHTML = " Results: ";
bechdelTestRatingDiv.insertBefore(hack);

// Adding waiting image
resultImage = document.createElement('img');
resultImage.setAttribute("src", chrome.extension.getURL("images/loading.gif"));
resultImage.setAttribute("height", "32px");
bechdelTestRatingDiv.insertBefore(resultImage);

// Decipher IMDB ID
canonical = document.querySelector("link[rel='canonical']");
imdbID = canonical.getAttribute('href').match(/tt(\d+)/)[1];

// Build Bechdel Test API URL
bechdelURL = 'http://bechdeltest.com/api/v1/getMovieByImdbId?imdbid=' + imdbID;

// Query Bechdel Test API
var xhr = new XMLHttpRequest();
xhr.open("GET", bechdelURL, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    parseAndDisplayResult(xhr.responseText);
  }
}
xhr.send();

// FOR TESTING!!!!
// exampleResult = "{\"visible\":\"1\",\"date\":\"2013-12-06 19:17:20\",\"submitterid\":\"8925\",\"rating\":\"1\",\"dubious\":\"0\",\"imdbid\":\"1170358\",\"id\":\"4921\",\"title\":\"Hobbit: The Desolation of Smaug, The\",\"year\":\"2013\"}";
// parseAndDisplayResult(exampleResult);
