import React from "react";
import Aux from "../hoc/Aux";
import Winner from "../assets/winner.png";
import "./Teams.css";

const roundGenerator = (props) => {
  const games = [...props.teams];
  const scores = [...props.scores];
  let winners = new Array(16);
  winners = [...props.winners];

  let zip = (a1, a2) => a1.map((x, i) => [x, " - ", a2[i]]);
  let zipped = [];
  for (let i = 0; i < games.length; i++) {
    if (games[i].length > 1) {
      zipped[i] = zip(games[i], scores[i]);
    } else {
      zipped[i] = games[i];
    }
  }

  const result = zipped.map((team, i) =>
    team.length > 2 ? (
      <Aux key={Math.random() * 1000}>
        <div className="playoff-table-group ">
          <div className="playoff-table-pair playoff-table-pair-style">
            <div className={`playoff-table-left-player ${winners[i][0]}`}>
              {team[0]}
            </div>
            <div className={`playoff-table-right-player ${winners[i][1]}`}>
              {team[1]}
            </div>
          </div>
          <div className="playoff-table-pair playoff-table-pair-style">
            <div className={`playoff-table-left-player ${winners[i][2]}`}>
              {team[2]}
            </div>
            <div className={`playoff-table-right-player ${winners[i][3]}`}>
              {team[3]}
            </div>
          </div>
        </div>
      </Aux>
    ) : team.length === 2 ? (
      <Aux key={Math.random() * 1000}>
        <div className="playoff-table-group1">
          <div className="playoff-table-pair playoff-table-pair-style ">
            <div className={`playoff-table-left-player ${winners[i][0]}`}>
              {team[0]}
            </div>
            <div className={`playoff-table-right-player ${winners[i][1]}`}>
              {team[1]}
            </div>
          </div>
        </div>
      </Aux>
    ) : (
      <Aux key={Math.random() * 1000}>
        <div className="playoff-table-group1">
          <div className="playoff-table-pair playoff-table-pair-style playoff-table-final">
            <div className="playoff-table-left-player">
              {<img src={Winner} alt={"Placeholder"} width="18" height="18" />}
            </div>
            <div className="playoff-table-right-player">{team[0]}</div>
          </div>
        </div>
      </Aux>
    )
  );

  return result;
};

export default roundGenerator;
