import React, { useState, useEffect } from "react";
import Aux from "../hoc/Aux";
import RoundGenerator from "./RoundGenerator";
import "./Teams.css";

const Teams = () => {
  const shuffleArray = require("../functions/ShuffleArray");
  const Teams = require("../functions/InitialTeams");
  const startingTeams = shuffleArray.shuffleArray(Teams.TEAMS16);
  const maxLegNumber = Math.floor(Math.log2(startingTeams.length));
  const legSize = new Array(maxLegNumber + 1).fill("");

  const [teams, setTeams] = useState([]);
  const [laps, setLaps] = useState(0);
  const [isScoreButton, setIsScore] = useState(true);

  // Chunk teams into 4 or 2 (if only there are 2 teams)
  const chunkHandler = (teamList) => {
    let perChunk = 4; // items per chunk
    teamList.length === 2 ? (perChunk = 2) : (perChunk = 4);
    const teams = teamList.slice();
    let result = teams.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / perChunk);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    }, []);
    return result;
  };

  useEffect(() => {
    let arr = [];
    // Create empty arrays and initiliaze state
    let n = startingTeams.length;
    legSize.forEach((leg) => {
      leg = new Array(n).fill("");
      n /= 2;
      arr.push(leg);
    });
    setTeams(arr);
    setLaps((lap) => lap + 1);
    let newState = [...arr];
    newState[0] = startingTeams;
    setTeams(newState);
  }, []);

  // Randomly assigns scores to each team
  const handleScore = (lap) => {
    let tour = [];
    let scores = [];
    if (laps > 0) {
      tour = teams[laps - 1];
      tour.forEach((t) => scores.push(t.score));
    }
    let newArray = [...teams];
    let allTeams = [];
    for (let value of Object.values(newArray)) {
      allTeams.push(value);
    }
    const allScores = [];
    Object.values(allTeams[laps - 1]).map((t, i) =>
      t ? (allScores[i] = Math.ceil(Math.random() * 100)) : null
    );
    allTeams[laps - 1].forEach((t, i) => (t.score = allScores[i]));
    setTeams((prevState) => (prevState = allTeams));
    setIsScore((prevState) => !prevState);
  };

  // Check the scores and decide the winners
  const handleWinners = (i) => {
    let newState = teams.slice();
    let allScores = newState[i - 1].map((t) => t.score);
    let odds = allScores.filter((item, index) => index % 2 !== 0);
    let evens = allScores.filter((item, index) => index % 2 === 0);
    let result = [];
    for (let j = 0; j < odds.length; j++) {
      evens[j] > odds[j]
        ? result.push(newState[i - 1][j * 2])
        : result.push(newState[i - 1][j * 2 + 1]);
    }
    let winners = [];
    for (let j = 0; j < odds.length; j++) {
      evens[j] > odds[j]
        ? winners.push((newState[i - 1][j * 2].status = "winner"))
        : winners.push((newState[i - 1][j * 2 + 1].status = "winner"));
    }

    // Set qualified teams with new score and status
    const qualifiedTeams = JSON.parse(JSON.stringify(result));
    qualifiedTeams.length > 1
      ? qualifiedTeams.forEach((t) => {
          t.score = 0;
          t.status = "loser";
          t.lap = t.lap + 1;
        })
      : qualifiedTeams.forEach((t) => {
          t.score = null;
          t.status = null;
        });
    newState[i] = qualifiedTeams;
    setTeams(newState);
    setLaps((laps) => laps + 1);
    setIsScore((prevState) => !prevState);
  };

  const setWinners = () => {
    let tour = [];
    let winners = [];
    if (laps > 0) {
      tour = teams[laps - 1];
      tour.forEach((t) => winners.push(t.team));
    }
    return winners;
  };

  let allTeams = [];
  for (let value of Object.values(teams)) {
    allTeams.push(value);
  }

  let nextWinners = [];
  const qualified = [];
  nextWinners = setWinners();
  qualified.push(nextWinners);

  const nextLeg = [];
  const winners = [];
  const scores = [];
  for (let i = 0; i < maxLegNumber + 1; i++) {
    nextLeg.push([]);
    winners.push([]);
    scores.push([]);
  }

  teams.map((team, i) =>
    team
      ? Object.values(team).map((t) =>
          t.team
            ? (nextLeg[i].push(t.team),
              winners[i].push(t.status),
              scores[i].push(t.score))
            : (nextLeg[i].push(t), winners[i].push(t), scores[i].push(t))
        )
      : null
  );

  return (
    <Aux>
      <div className="playoff-table">
        <button
          className="button is-success is-medium button-margin "
          disabled={laps >= maxLegNumber + 1 || !isScoreButton}
          onClick={() => handleScore(laps)}
        >
          PLAY
        </button>
        <button
          className="button is-warning is-medium button-margin "
          disabled={laps >= maxLegNumber + 1 || isScoreButton}
          onClick={() => handleWinners(laps)}
        >
          QUALIFY
        </button>

        <div className="playoff-table-content board ">
          {nextLeg.map((nextLegTeams, i) => (
            <div className="playoff-table-tour" key={Math.random() * 1000}>
              <RoundGenerator
                teams={chunkHandler(nextLegTeams)}
                scores={chunkHandler(scores[i])}
                laps={laps}
                winners={chunkHandler(winners[i])}
              />
            </div>
          ))}
        </div>
      </div>
    </Aux>
  );
};

export default Teams;
