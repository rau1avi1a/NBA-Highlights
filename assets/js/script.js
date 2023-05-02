//API Key: AIzaSyCg3NJtdbPsGlws9kB0R1GbJsNJdTaYMNQ

$(document).ready(function() {

  var apiKey = "AIzaSyCg3NJtdbPsGlws9kB0R1GbJsNJdTaYMNQ";

  var video = '';

  $("#team-form").submit(function(event) {
    event.preventDefault();

    var team = $('#team-search option:selected').text();
    var year = $('#season option:selected').text();
    var search = "NBA " + team + " " + year;
    //console.log('search item: ' + search);

    videoSearch(apiKey,search,3);
  })

  function videoSearch(key,search,maxResults) {
    $('#videos').empty();
    $.get('https://www.googleapis.com/youtube/v3/search?key=' + key + '&type=video&part=snippet&maxResults=' + maxResults + '&q=' + search + '&videoEmbeddable=true&videoSyndicated=true&order=relevance&privacyStatus=public&uploadStatus=processed$publicStatsViewable=true',function(data){
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
      var teamid = data.id
      teamTitle.textContent = data.full_name;
      conference.textContent = 'Conference: ' + data.conference;
      division.textContent = 'Division: ' + data.division;
      getGames();
      //getRoster();
      //getRoster(teamid);
});
      
  }

  


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
        console.log(data);
        

        
       
        
    })
  }




  var recordDisplayWins = document.querySelector('#recordwins');
  var recordDisplayLosses = document.querySelector('#recordlosses');
  var winPercentage = document.querySelector('#winpercentage');
  var teamNameDisplay = document.querySelector('#team-name-record');
  var seasonDisplay = document.querySelector('#team-record-year');
  var pickedTeamId;
  function displayScore(data){
    let teamSearchInputVal = teamSearchInput.value;
    for (let i = 0; i < data.data.length; i++) {
    
      //the cosen team isn't always the hometeam so this determines if they are home or away
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

    
     //console.log(pickedTeamId);
      var li = document.createElement('li');
      var homeTeam = document.createElement('div');
      var awayTeam = document.createElement('div');
      var awayTeamName = document.createElement('div');
      var statsBtn = document.createElement('button');
      //statsBtn.classList.add('')
      statsBtn.innerText = 'view stats'
      homeTeam.innerText = selectedTeamScore;
      awayTeam.innerText = opponentScore;
      awayTeamName.innerText = "vs" + " " + oponentName;

      //create section for game stats

      li.appendChild(homeTeam);
      li.appendChild(awayTeamName);
      li.appendChild(awayTeam);
      li.appendChild(statsBtn);

      statsBtn.addEventListener("click", getGamesStats);

      pickedTeamId = data.data[i].id;
      

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
      gamesList.appendChild(li);
      
      
  }

  
  }

  
  //

  function getGamesStats(){
    
    var statsUrl = 'https://www.balldontlie.io/api/v1/stats?game_ids[]=';
    let teamId = pickedTeamId;
    console.log
    var specificGameStats = statsUrl + teamId;
    console.log(specificGameStats);
//console.log(gamesUrl);
var topScorersList = document.querySelector('#top-scorers');
    fetch(specificGameStats)
    .then(function (response) {
     return response.json();
    })
    .then(function (data){
  
      console.log(data);

      for (i = 0; i < data.data.length; i++){
        if (data.data[i].pts == 0 || data.data[i].ast == 0 || data.data[i].reb == 0) {
          console.log(data);
        } else {
          var playerName = document.createElement('li');
          playerName.innerText = data.data[i].player.first_name + " " + data.data[i].player.last_name + " " +  data.data[i].pts + "pts" + " " +  data.data[i].ast + "ast" + " " +  data.data[i].reb + "reb";
          console.log(playerName);
          topScorersList.appendChild(playerName);
        }
      
      }
      
      
      
      

      //topScorers.innerText = "";
      
            
    })
  }

  


  submitButton.addEventListener("click", handleSearch);
  


