$(document).ready(function() {

  var apiKey = "AIzaSyAOC8f5-222ECFM8bdCQM05VzZX1G43t9c";

  var video = '';

  $("#team-form").submit(function(event) {
    event.preventDefault();

    var team = $('#team-search option:selected').text();
    var year = $('#season option:selected').text();
    var search = "NBA " + team + " " + year;
    console.log('search item: ' + search);

    videoSearch(apiKey,search,3);
  })

  function videoSearch(key,search,maxResults) {
    $('#videos').empty();
    $.get('https://www.googleapis.com/youtube/v3/search?key=' + key + '&type=video&part=snippet&maxResults=' + maxResults + '&q=' + search + '&videoEmbeddable=true&videoSyndicated=true&order=relevance&privacyStatus=public&uploadStatus=processed$publicStatsViewable=true',function(data){
      console.log(data);

  
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
var  teamSearchInputVal;
var chosenSeason;
var imageContainer = document.querySelector('.image-container');
var gameStatsSection = document.querySelector('.game-stats');
var gamesList = document.querySelector('#games-list');


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

      //console.log(data);

  
      teamTitle.textContent = data.full_name;
      conference.textContent = 'Conference: ' + data.conference;
      division.textContent = 'Division: ' + data.division;
      getGames();
      //getRoster();
});
      
  }

/*
function getRoster() {
    var RosterUrl = `https://www.balldontlie.io/api/v1/players?team_ids[]=${teamSearchInputVal}&seasons[]=${chosenSeason}&per_page=82`;

    fetch(RosterUrl)
    .then(function (response) {
     return response.json();
    })
    .then(function (data){
        console.log(data);
        
            
        
    })
}
*/

  function getGames(){
    var gamesUrl = `https://www.balldontlie.io/api/v1/games
?seasons[]=${chosenSeason}&team_ids[]=${teamSearchInputVal}&per_page=82`;
//console.log(gamesUrl);
    fetch(gamesUrl)
    .then(function (response) {
     return response.json();
    })
    .then(function (data){
        //console.log(data);
        displayScore(data);
        gameStatsSection.classList.remove('hide');      
        
    })
  }


  var recordDisplayWins = document.querySelector('#recordwins');
  var recordDisplayLosses = document.querySelector('#recordlosses');
  var winPercentage = document.querySelector('#winpercentage');
  var teamNameDisplay = document.querySelector('#team-name-record');
  var seasonDisplay = document.querySelector('#team-record-year');

  function displayScore(data){
    let teamSearchInputVal = teamSearchInput.value;

   

    
    for (let i = 0; i < data.data.length; i++) {
    

      if (teamSearchInputVal == data.data[i].home_team.id) {
        selectedTeamScore = data.data[i].home_team_score;
        opponentScore = data.data[i].visitor_team_score;
        selectedTeamName = data.data[i].home_team.full_name;
        oponentName = data.data[i].visitor_team.full_name;
    } else  {
     
      selectedTeamScore = data.data[i].visitor_team_score;
      opponentScore = data.data[i].home_team_score;
      oponentName = data.data[i].home_team.full_name;
      selectedTeamName = data.data[i].visitor_team.full_name;
    }



      var li = document.createElement('li');
      var homeTeam = document.createElement('div');
      var awayTeam = document.createElement('div');
      var awayTeamName = document.createElement('div');
      homeTeam.innerText = selectedTeamScore;
      awayTeam.innerText = opponentScore;
      awayTeamName.innerText = "vs" + " " + oponentName;
      //li.innerText = data.data[i].home_team_score;
      li.appendChild(homeTeam);
      li.appendChild(awayTeamName);
      li.appendChild(awayTeam);
     // console.log(data);
    
     // let selectedTeamScore;
      //let opponentScore;
      //home team isnt always the selected team so it requires another conditional to determine that
    
     
     if (selectedTeamScore > opponentScore) {
      li.setAttribute("style", "background-color: #2bd670;");
      wins = wins +1;
    } else {
      li.setAttribute("style", "background-color: #cc3b3b;");
      losses = losses+1;
    }
    
      let winPercentageVal = wins / 82;
      recordDisplayWins.textContent = "W" + " " + wins;
      recordDisplayLosses.textContent = "L" + " " + losses;
      winPercentage.textContent = "W-L:" + " " + Math.round((winPercentageVal + Number.EPSILON) * 100)  + "%";
      teamNameDisplay.textContent = selectedTeamName + " ";
      seasonDisplay.textContent = chosenSeason + " " + "Season:";
      //document.body.appendChild(li);
      gamesList.appendChild(li);
      
      
  }
  }

  submitButton.addEventListener("click", handleSearch);