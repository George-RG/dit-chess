import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard } from "react-chessboard";
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Engines from './modules/engines';
import { Referee } from './modules/referee';
import { Container, useTheme } from '@mui/material';

interface Team {
  name: string;
  won: number;
  lost: number;
  failed: boolean;
}

interface RandomGameProps {
  key: string;
  teamName: string;
  onScoreChange: (teamName: string, won: number, lost: number, failed: boolean) => void;
}

function RandomGame(props: RandomGameProps) {
  const { teamName, onScoreChange } = props;
  const engine = teamName + ".wasm";
  const [boardPosition, setBoardPosition] = useState("start");
  const [pointsWon, setPointsWon] = useState(0);
  const [pointsLost, setPointsLost] = useState(0);
  const [failed, setFailed] = useState(false);
  const delay = 0.3;

  useEffect(() => {
    onScoreChange(teamName, pointsWon, pointsLost, failed);
  }, [pointsWon, pointsLost, failed, onScoreChange]);

  const onGameEnd = (winner: string) => {
    console.log(`Game ${teamName} ended. Winner: ${winner}`);
    if (winner === "white") {
      setPointsWon((pointsWon) => pointsWon + 1);
    } else if (winner === "black") {
      setPointsLost((pointsLost) => pointsLost + 1);
    } else if (winner == "draw") {
      setPointsLost((pointsLost) => pointsLost + 0.5);
      setPointsWon((pointsWon) => pointsWon + 0.5);
    } else {
      console.error(`Unknown winner: ${winner}, no more games.`);
      setFailed(true);
      return;
    }
    referee.resetGame();
    referee.initGame(engine, "random", (_: string, fen: string) => setBoardPosition(fen), delay, undefined, onGameEnd)
      .then(() => referee.startGame())
      .catch(error => console.error(`Error initializing game for ${teamName}:`, error));
  }

  const referee = new Referee(
    engine,
    "random",
    (_: string, fen: string) => setBoardPosition(fen),
    delay,
    undefined,
    onGameEnd,
  );

  useEffect(() => {
    referee.initGame(engine, "random", (_: string, fen: string) => setBoardPosition(fen), delay, undefined, onGameEnd)
      .then(() => referee.startGame())
      .catch(error => console.error(`Error initializing game for ${teamName}:`, error));
  }, []);

  return (
    <Grid2 key={teamName} component="div">
      <Box sx={{
        textAlign: "center",
        border: "1px solid gray",
        padding: 2,
        borderRadius: 3,
        ...(failed && { opacity: 0.5, backgroundColor: "lightgray" }),
       }}>
        <Typography width={160} variant="h6" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{teamName}</Typography>
        <Chessboard position={boardPosition} arePiecesDraggable={false} boardWidth={160} />
        <Typography>Wins: {pointsWon} | Losses: {pointsLost}</Typography>
      </Box>
    </Grid2>
  )
}

function Tournament() {
  const engines = new Engines();
  const [teams, setTeams] = useState<Team[]>([]);
  const theme = useTheme();

  // Fetch only wasm engines (team names) and set them as teams
  useEffect(() => {
    engines.fetchEngines().then(() => {
      console.log(engines.getEngineNames());
      const wasmEngines = engines.getEngineNames().filter(name => !["human", "random"].includes(name));
      const newTeams = wasmEngines.map((engine) => {return {name: engine, won: 0, lost: 0, failed: false}});
      setTeams(newTeams);
    });
  }, []);

  // Callback to update a team’s score.
  const handleScoreChange = useCallback((teamName: string, won: number, lost: number, failed: boolean) => {
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team.name === teamName ? { ...team, won, lost, failed } : team
      )
    );
  }, []);

  // Sort teams using useMemo so sorting only recalculates when teams change.
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const diff = (b.won - b.lost) - (a.won - a.lost);
      if (diff !== 0) {
        return diff;
      }
      if (a.failed && !b.failed) {
        return 1;
      }
      if (!a.failed && b.failed) {
        return -1;
      }
      return (b.won + b.lost) - (a.won + a.lost);
    });
  }, [teams]);

  return (
    <Container maxWidth={false} sx={{ backgroundColor: theme.palette.background.default }}>
    <Box padding={{ xs: 2, sm: 3, md: 4 }}>
      <Typography variant="h4" align="center">Tournament vs Random</Typography>
      <Grid2 container spacing={3}>
        {sortedTeams.map((team) => (
          <RandomGame key={team.name} teamName={team.name} onScoreChange={handleScoreChange} />
        ))}
      </Grid2>
    </Box>
    </Container>
  );
}

export default Tournament;
