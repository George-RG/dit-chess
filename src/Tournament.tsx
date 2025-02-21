import { useState, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Engines from './modules/engines';
import { Referee } from './modules/referee';

interface Match {
  wasmEngine: string;
  randomEngine: string;
  wins: number;
  losses: number;
}

function Tournament() {
  const [engines, _setEngines] = useState(new Engines());
  const [_wasmEngines, setWasmEngines] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [boardPositions, setBoardPositions] = useState<{ [key: string]: string }>({});
  const [referees, setReferees] = useState<{ [key: string]: Referee }>({});

  useEffect(() => {
    // Load available engines
    engines.fetchEngines().then(() => {
      const allEngines = engines.getEngineNames();

      const wasmOnlyEngines = allEngines.filter(name => !["human", "random"].includes(name)).slice(0, 4);
      setWasmEngines(wasmOnlyEngines);

      // Initialize matches
      const initialMatches = wasmOnlyEngines.map(engine => ({
        wasmEngine: engine + ".wasm",
        randomEngine: "random",
        wins: 0,
        losses: 0
      }));
      setMatches(initialMatches);

      // Create referees and board positions for each match
      const newReferees: { [key: string]: Referee } = {};
      const newBoardPositions: { [key: string]: string } = {};

      initialMatches.forEach(match => {
        const matchKey = match.wasmEngine;
        newBoardPositions[matchKey] = "start";

        newReferees[matchKey] = new Referee(
          match.wasmEngine,
          match.randomEngine,
          (_: string, fen: string) => updateBoard(matchKey, fen),
          0.1,
          undefined,
          (winner: string) => onGameEnd(matchKey, winner)
        );

        newReferees[matchKey].initGame(match.wasmEngine, match.randomEngine)
          .then(() => newReferees[matchKey].startGame())
          .catch(error => console.error(`Error initializing game for ${matchKey}:`, error));
      });

      setReferees(newReferees);
      setBoardPositions(newBoardPositions);
    });
  }, []);

  const updateBoard = (matchKey: string, fen: string) => {
    setBoardPositions(prev => ({ ...prev, [matchKey]: fen }));
  };

  const onGameEnd = (matchKey: string, winner: string) => {
    setMatches(prevMatches => {
      const updatedMatches = prevMatches.map(match => {
        if (match.wasmEngine === matchKey) {
          if (winner === "white") return { ...match, wins: match.wins + 1 };
          if (winner === "black") return { ...match, losses: match.losses + 1 };
        }
        return match;
      });
      return [...updatedMatches].sort((a, b) => b.wins - a.wins);
    });

    // Restart the game for continuous play
    setTimeout(() => {
      referees[matchKey].initGame()
        .then(() => referees[matchKey].startGame())
        .catch(error => console.error(`Error restarting game for ${matchKey}:`, error));
    }, 30000);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" align="center">Tournament vs Random</Typography>
      <Grid2 container spacing={3}>
        {matches.map(match => (
          <Grid2 key={match.wasmEngine} component="div">
            <Box sx={{ textAlign: "center", border: "1px solid gray", padding: 2, borderRadius: 3 }}>
              <Typography width={160} variant="h6" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{match.wasmEngine.split(".wasm")[0]}</Typography>
              <Chessboard position={boardPositions[match.wasmEngine]} arePiecesDraggable={false} boardWidth={160} />
              <Typography>Wins: {match.wins} | Losses: {match.losses}</Typography>
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}

export default Tournament;
