const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
const API_KEY = "RGAPI-27d41a81-1893-4597-a495-e20502d8fc13";

function getPlayerPUUID(playerName, tag) {
    return axios.get("https://americas.api.riotgames.com" + "/riot/account/v1/accounts/by-riot-id/" + playerName + "/" + tag + "?api_key=" + API_KEY)
        .then(response => {
            return response.data.puuid;
        }).catch(err => err);
}

function getPlayerData(encryptedPUUID) {
    return axios.get("https://na1.api.riotgames.com" + "/lol/challenges/v1/player-data/" + encryptedPUUID + "?api_key=" + API_KEY)
        .then(response => {
            return response.data;
        }).catch(err => err);
}

// Function to fetch player's total champion mastery score
function getPlayerChampionMasteryScore(encryptedPUUID) {
    return axios.get("https:/na1.api.riotgames.com" + "/lol/champion-mastery/v4/scores/by-puuid/" + encryptedPUUID + "?api_key=" + API_KEY)
        .then(response => {
            return response.data;
        }).catch(err => err);
}

app.get('/past5Games', async (req, res) => {
    const playerName = req.query.username;
    const playerTag = req.query.tag;

    try {
        const PUUID = await getPlayerPUUID(playerName, playerTag);

        if (!PUUID) {
            // Player name not found, send response with empty data
            return res.status(404).json({ message: 'Player not found', matchDataArray: [], championMasteryScore: null });
        }

        // Fetching player's data from the new API
        const playerData = await getPlayerData(PUUID);

        if (!playerData) {
            // No player data found, send response with empty data
            return res.json({ message: 'No player data found', matchDataArray: [], championMasteryScore: null });
        }

        const API_CALL = "https://americas.api.riotgames.com" + "/lol/match/v5/matches/by-puuid/" + PUUID + "/ids" + "?api_key=" + API_KEY;

        // Fetching game IDs
        const gameIDs = await axios.get(API_CALL)
            .then(response => response.data)
            .catch(err => {
                console.error(err);
                throw new Error('Error fetching game IDs');
            });

        if (!gameIDs || gameIDs.length === 0) {
            // No game IDs found, send response with empty data
            return res.json({ message: 'No games found', matchDataArray: [], championMasteryScore: null });
        }

        // Fetching game data for past 5 games
        const matchDataArray = [];
        for (let i = 0; i < Math.min(gameIDs.length, 5); i++) {
            const matchID = gameIDs[i];
            const matchData = await axios.get("https://americas.api.riotgames.com/" + "lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY)
                .then(response => response.data)
                .catch(err => {
                    console.error(err);
                    return null;
                });
            if (matchData) {
                matchDataArray.push(matchData);
            }
        }

        // Fetching player's champion mastery score
        const championMasteryScore = await getPlayerChampionMasteryScore(PUUID);

        // Sending response with game data, player data, and champion mastery score
        res.json({ message: 'Success', matchDataArray, playerData, championMasteryScore });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(4000, () => {
    console.log('Server started on port 4000');
});





















// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const app = express();

// app.use(cors());
// const API_KEY = "RGAPI-2235bef7-9f1e-4b7f-af15-a52291e4560d";
// function getPlayerPUUID(playerName) {
//     return axios.get("https://na1.api.riotgames.com" + "/lol/summoner/v4/summoners/by-name/" + playerName + "?api_key=" + API_KEY)
//         .then(response => {
//             return response.data.puuid;
//         }).catch(err => err);
// }
// // Function to fetch player's total champion mastery score
// function getPlayerChampionMasteryScore(encryptedPUUID) {
//     return axios.get("https://na1.api.riotgames.com" + "/lol/champion-mastery/v4/scores/by-puuid/" + encryptedPUUID + "?api_key=" + API_KEY)
//         .then(response => {
//             return response.data;
//         }).catch(err => err);
// }

// app.get('/past5Games', async (req, res) => {
//     const playerName = req.query.username;

//     try {
//         // PUUID
//         const PUUID = await getPlayerPUUID(playerName);

//         if (!PUUID) {
//             // Player name not found, send response with empty data
//             return res.status(404).json({ message: 'Player not found', matchDataArray: [], championMasteryScore: null });
//         }

//         const API_CALL = "https://americas.api.riotgames.com" + "/lol/match/v5/matches/by-puuid/" + PUUID + "/ids" + "?api_key=" + API_KEY;
        
//         // Fetching game IDs
//         const gameIDs = await axios.get(API_CALL)
//             .then(response => response.data)
//             .catch(err => {
//                 console.error(err);
//                 throw new Error('Error fetching game IDs');
//             });

//         if (!gameIDs || gameIDs.length === 0) {
//             // No game IDs found, send response with empty data
//             return res.json({ message: 'No games found', matchDataArray: [], championMasteryScore: null });
//         }

//         // Fetching game data for past 5 games
//         const matchDataArray = [];
//         for (let i = 0; i < Math.min(gameIDs.length, 5); i++) {
//             const matchID = gameIDs[i];
//             const matchData = await axios.get("https://americas.api.riotgames.com/" + "lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY)
//                 .then(response => response.data)
//                 .catch(err => {
//                     console.error(err);
//                     return null;
//                 });
//             if (matchData) {
//                 matchDataArray.push(matchData);
//             }
//         }

//         // Fetching player's champion mastery score
//         const championMasteryScore = await getPlayerChampionMasteryScore(PUUID);
//         // Sending response with game data and champion mastery score
//         res.json({ message: 'Success', matchDataArray, championMasteryScore });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// app.listen(4000, () => {
//     console.log('Server started on port 4000');
// });








//GET APP///
// app.get('/past5Games', async (req, res) => {
//    const playerName = req.query.username;
//     // PUUID
//     const PUUID = await getPlayerPUUID(playerName);
//     const API_CALL = "https://americas.api.riotgames.com" + "/lol/match/v5/matches/by-puuid/" + PUUID + "/ids" + "?api_key=" + API_KEY;
//     // Fetching game IDs
//     const gameIDs = await axios.get(API_CALL)
//     .then(response => response.data)
//         .catch(err => err);
//         // Fetching game data for past 5 games
//     const matchDataArray = [];
//     for (let i = 0; i < Math.min(gameIDs.length, 5); i++) {
//        const matchID = gameIDs[i];
//         const matchData = await axios.get("https://americas.api.riotgames.com/" + "lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY)
//         .then(response => response.data)
//             .catch(err => err);
//             matchDataArray.push(matchData);
//        }
//     // Fetching player's champion mastery score
//     const championMasteryScore = await getPlayerChampionMasteryScore(PUUID);
//     // Sending response with game data and champion mastery score
//     res.json({ matchDataArray, championMasteryScore });
// });






//  var express = require('express');
//  var cors = require('cors');
//  const axios = require('axios');
//  var app = express();
//  app.use(cors());
//  const API_KEY = "RGAPI-f4183d8a-a622-4486-8ca7-71f3f01a24b6";
//  function getPlayerPUUID(playerName) {
//      return axios.get("https://na1.api.riotgames.com" + "/lol/summoner/v4/summoners/by-name/" + playerName + "?api_key=" + API_KEY)
//          .then(response => {
//              console.log(response.data);
//              return response.data.puuid;
//          }).catch(err => err);
//  }
//  //GET past5Games
//  //GET localhost:8080/past5Games
//  app.get('/past5Games', async (req, res) => {
//      const playerName = req.query.username;
//      // PUUID
//      const PUUID = await getPlayerPUUID(playerName);
//      const API_CALL = "https://americas.api.riotgames.com" + "/lol/match/v5/matches/by-puuid/" + PUUID + "/ids" + "?api_key=" + API_KEY;
//      //get API_CALL
//      //ITS GOING TO GIVE US A LIST OF GAME IDS
//      const gameIDs = await axios.get(API_CALL)
//          .then(response => response.data)
//          .catch(err => err)
//      console.log(gameIDs);
//      //loop through game IDs
//      //at each loop, get the information based off ID (API CALL)
//      var matchDataArray = [];
//      for (var i = 0; i < gameIDs.length - 15; i++) {
//          const matchID = gameIDs[i];
//          const matchData = await axios.get("https://americas.api.riotgames.com/" + "lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY)
//              .then(response => response.data)
//              .catch(err => err)
//          matchDataArray.push(matchData);
//      }
//      //save information above in an array, give array as JSON response to user
//      // [Game1Object, Game2Object, Game3Object, ....]
//      res.json(matchDataArray);
//  });
//  app.listen(4000, function () {
//      console.log('Server started on port 4000');
//  });