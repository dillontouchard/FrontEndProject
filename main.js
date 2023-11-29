var playerID;
let page = 1;
let allStats = [];
$('.btn.btn-outline-success').on('click', function(event){
    event.preventDefault()
    let input = $('input').val()
    

    $.get(`https://www.balldontlie.io/api/v1/players?search=${input}`, function(data){
        console.log(data)
        $('#results').empty()
        
        const players = data.data
        const $results = $("#results")
        
        for (let i = 0; i < players.length; i++) {
            playerID = players[i].id
            
            const playerFName = players[i].first_name
            const playerLName = players[i].last_name
            const playerTeam = players[i].team.full_name
            const playerHeightAndPosition = players[i].height_feet + "' " + players[i].height_inches + '" ' + players[i].position
            
            var $playerCard = $('<span></span>').addClass('player-card');
            $results.append($playerCard)
            const $playerName = $('<h3></h3>').addClass('player-name').text(playerFName + " " + playerLName)
            $playerCard.append($playerName)
            const $playerTeamName = $('<h2></h2>').addClass('player-team').text(playerTeam)
            $playerCard.append($playerTeamName)
            const $playerHAndP = $('<div></div>').addClass('player-HAndP').text(playerHeightAndPosition)
            $playerCard.append($playerHAndP)           
        }
        function fetchStats() {
            $.get(`https://www.balldontlie.io/api/v1/stats?player_ids[]=${playerID}&page=${page}&per_page=100`, function(data) {
                console.log(data);
        
                const playerStats = data.data;

                if (playerStats.length > 0) {
                    // If there are stats on this page, add them to the allStats array
                    allStats = allStats.concat(playerStats);

                    // Increment the page number for the next request
                    page++;

                    // Make the next request recursively
                    fetchStats();
                } else {
                    console.log("All stats fetched:", allStats);
                }
            });
        }
        fetchStats();
        
        var playerPoints = 0
        var playerAssists = 0
        var playerRebounds = 0
        var playerSteals = 0
        
        setTimeout(function() { 
            for(let i = 0; i < allStats.length; i++) {
                playerPoints += allStats[i].pts
                playerAssists += allStats[i].ast
                playerRebounds += allStats[i].reb
                playerSteals += allStats[i].stl
            }
            const $playerStatOverview = $('<p></p>').addClass('stat-summary').html(`Career Points: ${playerPoints}<br>Career Assists: ${playerAssists}<br>Career Rebounds: ${playerRebounds}<br>Career Steals: ${playerSteals}`)
                $playerCard.append($playerStatOverview)
        }, 7000)    
    })
})