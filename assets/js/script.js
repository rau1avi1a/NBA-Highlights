//API Key: AIzaSyCg3NJtdbPsGlws9kB0R1GbJsNJdTaYMNQ

$(document).ready(function () {

  var apiKey = "AIzaSyCg3NJtdbPsGlws9kB0R1GbJsNJdTaYMNQ";

  var video = '';

  $("#team-form").submit(function (event) {
    event.preventDefault();

    var team = $('#team-search option:selected').text();
    var year = $('#season option:selected').text();
    var search = "NBA " + team + " " + year;
    //console.log('search item: ' + search);

    videoSearch(apiKey, search, 3);
  })

  function videoSearch(key, search, maxResults) {
    $('#videos').empty();
    $.get('https://www.googleapis.com/youtube/v3/search?key=' + key + '&type=video&part=snippet&maxResults=' + maxResults + '&q=' + search + '&videoEmbeddable=true&videoSyndicated=true&order=relevance&privacyStatus=public&uploadStatus=processed$publicStatsViewable=true', function (data) {
      //console.log(data);


      data.items.forEach(item => {
        video = `
        <iframe id="video" width="420" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
        `
        $('#videos').append(video);
      });
    })
  }
})

var teamSearchInput = document.querySelector('#team-search');
var submitButton = document.querySelector('#searchButton');
var searchResultSection = document.querySelector('.team-serch-results');
var season = document.querySelector('#season');
var teamSearchInputVal;
var chosenSeason;
var imageContainer = document.querySelector('.image-container');
var gameStatsSection = document.querySelector('.game-stats');
var gamesList = document.querySelector('#games-list');

var gamesStatsSection = document.querySelector('#game-stats-section');

var topScorersList = document.querySelector('#top-scorers');
var oponentScorersList = document.querySelector('#oponent-player-stats');

function handleSearch(event) {

  var teamTitle = document.querySelector('#teamtitle');
  var conference = document.querySelector('#conference');
  var division = document.querySelector('#division');
  var teamsUrl = 'https://www.balldontlie.io/api/v1/teams/';
  gamesList.innerText = "";
  teamNameDisplay.textContent = " ";
  seasonDisplay.textContent = "";
  wins = 0;
  losses = 0;
  topScorersList.textContent = "";
  oponentScorersList.textContent = "";
  gameTitle.textContent = "";
finalScoreTitle.textContent = "";
chosenTeamTitle.textContent = "";
oponentTeamTitle.textContent = "";
  teamSearchInputVal = teamSearchInput.value;
  chosenSeason = season.value;
  let requestUrl = teamsUrl + teamSearchInputVal;

  if (!teamSearchInputVal) {
    return;
  }

  searchResultSection.classList.remove('hide');
  gameStatsSection.classList.remove('hide');


  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      var teamid = data.id
      teamTitle.textContent = data.full_name;
      conference.textContent = 'Conference: ' + data.conference;
      division.textContent = 'Division: ' + data.division;
      getGames();
      //getRoster();
      //getRoster(teamid);
    });

}




function getGames() {
  var gamesUrl = `https://www.balldontlie.io/api/v1/games
?seasons[]=${chosenSeason}&team_ids[]=${teamSearchInputVal}&per_page=82`;
  fetch(gamesUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayScore(data);
      gameStatsSection.classList.remove('hide');
      //console.log(data);
    })
}





var recordDisplayWins = document.querySelector('#recordwins');
var recordDisplayLosses = document.querySelector('#recordlosses');
var winPercentage = document.querySelector('#winpercentage');
var teamNameDisplay = document.querySelector('#team-name-record');
var seasonDisplay = document.querySelector('#team-record-year');
var pickedTeamId;



function displayScore(data) {
  let teamSearchInputVal = teamSearchInput.value;
  for (let i = 0; i < data.data.length; i++) {

    //the chosen team isn't always the hometeam so this determines if they are home or away
    if (teamSearchInputVal == data.data[i].home_team.id) {
      selectedTeamScore = data.data[i].home_team_score;
      opponentScore = data.data[i].visitor_team_score;
      selectedTeamName = data.data[i].home_team.full_name;
      oponentName = data.data[i].visitor_team.full_name;
      selectedTeamAbr = data.data[i].home_team.abbreviation;
      oponentTeamAbr = data.data[i].visitor_team.abbreviation;

    } else {
      selectedTeamScore = data.data[i].visitor_team_score;
      opponentScore = data.data[i].home_team_score;
      oponentName = data.data[i].home_team.full_name;
      selectedTeamName = data.data[i].visitor_team.full_name;
      selectedTeamAbr = data.data[i].visitor_team.abbreviation;
      oponentTeamAbr = data.data[i].home_team.abbreviation;
    }


    //console.log(pickedTeamId);
    var li = document.createElement('li');
    var homeTeam = document.createElement('div');
    var awayTeam = document.createElement('div');
    var awayTeamName = document.createElement('div');
    var statsBtn = document.createElement('button');
    statsBtn.classList.add('stats-button');
    statsBtn.innerText = 'view stats'
    homeTeam.innerText = selectedTeamAbr + ":" + selectedTeamScore;
    awayTeam.innerText = oponentTeamAbr + ":" + opponentScore;
    awayTeamName.innerText = "vs" + " " + oponentName;

  


    awayTeamName.classList.add('oponent-name');

    //creates section for game stats
    li.appendChild(homeTeam);
    li.appendChild(awayTeamName);
    li.appendChild(awayTeam);
    li.appendChild(statsBtn);

    // this grabs game id to be passed to data function
    gameId = data.data[i].id;
    li.setAttribute("gameidentifier", gameId);
    // li.setAttribute("game-id", data.data[i].id);

    //come back to this because this worked if all else fails
    //statsBtn.addEventListener("click", getGamesStats);

    // determines win vs loss
    if (selectedTeamScore > opponentScore) {
      li.setAttribute("style", "background-color: #2bd670;");
      wins = wins + 1;
    } else {
      li.setAttribute("style", "background-color: #cc3b3b;");
      losses = losses + 1;
    }

    // displays win vs loss data
    let winPercentageVal = wins / 82;
    recordDisplayWins.textContent = "W" + " " + wins;
    recordDisplayLosses.textContent = "L" + " " + losses;
    winPercentage.textContent = "W-L:" + " " + Math.round((winPercentageVal + Number.EPSILON) * 100) + "%";
    teamNameDisplay.textContent = selectedTeamName + " ";
    seasonDisplay.textContent = chosenSeason + " " + "Season:";
    gamesList.appendChild(li);


  }

}


gamesList.addEventListener("click", function(event) {
  var element = event.target;
  $('#games-stats-section').empty();

  // Checks if element is a button
  if (element.matches("button") === true) {
    // Get its data-index value and remove the todo element from the list
    var theGame = element.parentElement.getAttribute("gameidentifier");
    var getopponentName = element.parentElement.children;
    console.log (getopponentName);
    var abbreviationHome = getopponentName[0].textContent;
    var TheopponentName = getopponentName[1].textContent;
    var abbreviationAway = getopponentName[2].textContent;
    console.log (TheopponentName);
    
    getGamesStats(theGame, TheopponentName, abbreviationAway, abbreviationHome);
    
    
  }
});



/*
  let statsButton = document.querySelectorAll(".stats-button");
  
  for (let i = 0; i < statsButton.length; i++) {
    statsButton[i].addEventListener("click", getGamesStats);
}
    
 */



//
let gameTitle = document.querySelector('#game-title');
let finalScoreTitle = document.querySelector('#final-score');
let chosenTeamTitle = document.querySelector('#picked-team-title');
let oponentTeamTitle = document.querySelector('#oponent-team-title');

function getGamesStats(theGame, TheopponentName, abbreviationAway, abbreviationHome) {
  var statsUrl = 'https://www.balldontlie.io/api/v1/stats?game_ids[]=';
  //let currentGame = gameId;
  let currentGame = theGame;
  let opponentName = TheopponentName;
  let perPage = '&per_page=50';
  var specificGameStats = statsUrl + currentGame + perPage;
  
  


  $('#games-stats-section').empty();

  
  fetch(specificGameStats)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      console.log(data);

      
    

      for (i = 0; i < data.data.length; i++) {
        if (data.data[i].pts != 0 || data.data[i].ast != 0 || data.data[i].reb != 0) {
          var playerName = document.createElement('li');
          playerName.innerText = data.data[i].player.first_name + " " + data.data[i].player.last_name + " " + data.data[i].pts + "pts" + " " + data.data[i].ast + "ast" + " " + data.data[i].reb + "reb";
        }
        
        if (data.data[i].team.id == teamSearchInputVal) {
          topScorersList.appendChild(playerName);
        } else {
          oponentScorersList.appendChild(playerName);
        }

      }
    })

       
    gameTitle.innerText = selectedTeamName + " " + opponentName;
    finalScoreTitle.innerText = abbreviationHome + " " + abbreviationAway;
    
    chosenTeamTitle.textContent = selectedTeamName;
    oponentTeamTitle.textContent = opponentName;

    topScorersList.textContent = "";
    oponentScorersList.textContent = "";

}


submitButton.addEventListener("click", handleSearch);






