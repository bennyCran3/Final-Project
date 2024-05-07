import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import logo from './League2.webp';

function App() {
  const [searchText, setSearchText] = useState("");
  const [tagText, setTagText] = useState("");
  const [gameList, setGameList] = useState([]);
  const [masteryScore, setMasteryScore] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [headingText, setHeadingText] = useState("");

  useEffect(() => {
    const headingText = "LoL PLAYER SEARCH";
    let index = 0;
    const intervalId = setInterval(() => {
      if (index <= headingText.length) {
        setHeadingText(headingText.slice(0, index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);


  function getPlayerGames() {
    axios.get("http://localhost:4000/past5Games", { params: { username: searchText, tag: tagText} })
        .then(function (response) {
          if (response.data.matchDataArray.length === 0) {
            setError(true);
            setGameList([]);
            setMasteryScore(null);
            setPlayerData(null);
          } else {
            setError(false);
            setGameList(response.data.matchDataArray);
            setMasteryScore(response.data.championMasteryScore);
            setPlayerData(response.data.playerData);
          }
        }).catch(function (error) {
      console.log(error);
      setError(true);
      setGameList([]);
      setMasteryScore(null);
      setPlayerData(null);
    });
  }

  function displayMasteryScore() {
    if (masteryScore !== null) {
      return <p>Player's Mastery Score: {masteryScore}</p>;
    }
    return null;
  }

  function handleGameSelect(event) {
    setSelectedGame(event.target.value);
  }


  return (
      <div className="App">
        <a href="https://www.leagueoflegends.com/en-us/" target="_blank" rel="noopener noreferrer">
          <img src={logo} alt="Logo" className="logo"/>
        </a>
        <h2 className="animated-heading">{headingText}</h2>
        <div className="search-box">
          <label htmlFor="fieldName">enter summoner's name:</label>
          <input type="text" id="fieldName" name="fieldName" onChange={e => setSearchText(e.target.value)}></input>
          <input type="text" id="fieldTag" name="fieldTag" onChange={e => setTagText(e.target.value)}></input>
          <button onClick={getPlayerGames}>Search</button>
        </div>
        {error ? (
            <p>No Data</p>
        ) : gameList.length !== 0 ? (
            <>
              <p>Looking at Results for {searchText}</p>
              {displayMasteryScore()}
              {playerData && (
                  <div>
                    <h2>Player Data</h2>
                    <p>Summoner Name: {playerData.summonerName}</p>
                    {playerData.rank} {playerData.tier} {playerData.rankPoints}
                  </div>
              )}
              <select onChange={handleGameSelect}>
                <option value="">Select a Game</option>
                {gameList.map((index) => (
                    <option key={index} value={index}>Game {index + 1}</option>
                ))}
              </select>
              {selectedGame !== null && (
                  <div>
                    <h2>Selected Game</h2>
                    <div>
                      {gameList[selectedGame].info.participants.map((data, participantIndex) => (
                          <p key={participantIndex}>Player {participantIndex + 1}: {data.summonerName}, KDA: {data.kills} / {data.deaths} / {data.assists}</p>
                      ))}
                    </div>
                  </div>
              )}
            </>
        ) : (
            <p>No Data</p>
        )}
      </div>
  );
}

export default App;














// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [searchText, setSearchText] = useState("");
//   const [gameList, setGameList] = useState([]);
//   const [masteryScore, setMasteryScore] = useState(null);
//   const [error, setError] = useState(false);
//   const [selectedGame, setSelectedGame] = useState(null);

//   function getPlayerGames() {
//     axios.get("http://localhost:4000/past5Games", { params: { username: searchText } })
//       .then(function (response) {
//         if (response.data.matchDataArray.length === 0) {
//           setError(true);
//           setGameList([]);
//           setMasteryScore(null);
//         } else {
//           setError(false);
//           setGameList(response.data.matchDataArray);
//           setMasteryScore(response.data.championMasteryScore);
//         }
//       }).catch(function (error) {
//         console.log(error);
//         setError(true);
//         setGameList([]);
//         setMasteryScore(null);
//       });
//   }

//   function displayMasteryScore() {
//     if (masteryScore !== null) {
//       return <p>Player's Mastery Score: {masteryScore}</p>;
//     }
//     return null;
//   }

//   function handleGameSelect(event) {
//     setSelectedGame(event.target.value);
//   }

//   return (
//     <div className="App">
//       <h2>League of Legends Player Search</h2>
//       <input type="text" onChange={e => setSearchText(e.target.value)}></input>
//       <button onClick={getPlayerGames}>Search</button>
//       {error ? (
//         <p>No Data</p>
//       ) : gameList.length !== 0 ? (
//         <>
//           <p>We have Data!</p>
//           {displayMasteryScore()}
//           <select onChange={handleGameSelect}>
//             <option value="">Select a Game</option>
//             {gameList.map((gameData, index) => (
//               <option key={index} value={index}>Game {index + 1}</option>
//             ))}
//           </select>
//           {selectedGame !== null && (
//             <div>
//               <h2>Selected Game</h2>
//               <div>
//                 {gameList[selectedGame].info.participants.map((data, participantIndex) => (
//                   <p key={participantIndex}>Player {participantIndex + 1}: {data.summonerName}, KDA: {data.kills} / {data.deaths} / {data.assists}</p>
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <p>No Data</p>
//       )}
//     </div>
//   );
// }

// export default App;






// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [searchText, setSearchText] = useState("");
//   const [gameList, setGameList] = useState([]);
//   const [masteryScore, setMasteryScore] = useState(null);
//   const [error, setError] = useState(false);

//   function getPlayerGames() {
//     axios.get("http://localhost:4000/past5Games", { params: { username: searchText } })
//       .then(function (response) {
//         if (response.data.matchDataArray.length === 0) {
//           setError(true); // Set error to true when no data is returned
//           setGameList([]);
//           setMasteryScore(null);
//         } else {
//           setError(false);
//           setGameList(response.data.matchDataArray);
//           setMasteryScore(response.data.championMasteryScore);
//         }
//       }).catch(function (error) {
//         console.log(error);
//         setError(true);
//         setGameList([]);
//         setMasteryScore(null);
//       });
//   }

//   function displayMasteryScore() {
//     if (masteryScore !== null) {
//       return <p>Player's Mastery Score: {masteryScore}</p>;
//     }
//     return null;
//   }

//   console.log(gameList);

//   return (
//     <div className="App">
//       <h2>League of Legends Player Search</h2>
//       <input type="text" onChange={e => setSearchText(e.target.value)}></input>
//       <button onClick={getPlayerGames}>Search</button>
//       {error ? ( // Display "No Data" when error is true
//         <p>No Data</p>
//       ) : gameList.length !== 0 ? (
//         <>
//           <p>We have Data!</p>
//           {displayMasteryScore()}
//           {gameList.map((gameData, index) => (
//             <div key={index}>
//               <h2>Game {index + 1}</h2>
//               <div>
//                 {gameData.info.participants.map((data, participantIndex) => (
//                   <p key={participantIndex}>Player {participantIndex + 1}: {data.summonerName}, KDA: {data.kills} / {data.deaths} / {data.assists}</p>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </>
//       ) : (
//         <p>No Data</p>
//       )}
//     </div>
//   );
// }

// export default App;













// import { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [searchText, setSearchText] = useState("");
//   const [gameList, setGameList] = useState([]);
//   const [masteryScore, setMasteryScore] = useState(null);

//   function getPlayerGames(event) {
//     axios.get("http://localhost:4000/past5Games", {params: {username: searchText}})
//     .then(function (response) {
//       setGameList(response.data.matchDataArray);
//       setMasteryScore(response.data.championMasteryScore);
//     }).catch(function (error) {
//       console.log(error);
//     });
//   }

//    function displayMasteryScore() {
//      if (masteryScore !== null) {
//        return <p>Player's Mastery Score: {masteryScore}</p>;
//      }
//      return null;
//    }

//   console.log(gameList);

//   return (
//     <div className="App">
//       <h2>League of Legends Player Search</h2>
//       <input type="text" onChange={e => setSearchText(e.target.value)}></input>
//       <button onClick={getPlayerGames}>Search</button>
//       {gameList.length !== 0 ?
//         <>
//           <p>We have Data!</p>
//             {displayMasteryScore()}
//           {
//             gameList.map((gameData, index) =>
//               <>
//               <h2>Game {index + 1}</h2>
//               <div>
//                 {gameData.info.participants.map((data, participantIndex) =>
//                   <p>Player {participantIndex + 1}: {data.summonerName}, KDA: {data.kills} / {data.deaths} / {data.assists}</p>
//                 )
//                 }
//               </div>
//             </>
//           )
//         }
//       </>
//         :
//         <>
//           <p> No Data </p>
//         </>
//       }
//   </div>
// )};

// export default App;
