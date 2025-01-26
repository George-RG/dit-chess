import { useState, useEffect } from 'react'
import { Chessboard } from "react-chessboard";
import Box from '@mui/material/Box'
import { Button, Container, FormControl, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Chess } from "chess.js";

import { useTheme } from '@mui/material/styles';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Engines from './modules/engines';
import { Referee } from './modules/referee';


function Arena() {
  const theme = useTheme();
  const engines = new Engines();

  const [engine1, setEngine1] = useState<string>('Loading');
  const [engine2, setEngine2] = useState<string>('Loading');
  const [engineNames, setEngineNames] = useState<string[]>([]);

  const [loaded, setLoaded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [selectErrors, setSelectErrors] = useState({ engine1: false, engine2: false });


  const [boardPosition, setBoardPosition] = useState("start");
  const [errorState, setErrorState] = useState("None");
  const [stopGame, setStopGame] = useState(false);

  const [score, setScore] = useState({ p1: 0, p2: 0, games: 1 });
  const [delay, setDelay] = useState(0);

  const [game, setGame] = useState(new Chess());
  const [referee, setReferee] = useState(new Referee());


  function makeAMove(move) {
    const gameCopy = game;
    const result = gameCopy.move(move);

    if (result === null) {
      console.log("Bro who made this trash?");
    }
    else {
      setGame(gameCopy);
    }
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // async function Referee() {
  //   setGameStarted(true);
  //   for (let i = 1; i <= score.games; i++) {
  //     let white_turn = true;
  //     setGame(new Chess());
  //     while (!game.isGameOver() && !game.isDraw()) {
  //       const moves = game.moves();
  //       white_turn ? console.log("Paizei o aspros") : console.log("Paizei o mauros");

  //       // Call the agent
  //       i = 0;
  //       //

  //       if (makeAMove(moves[i]) === null) {
  //         white_turn ? setErrorState("WhiteIllegal") : setErrorState("BlackIlligal");
  //       }
  //       else {
  //         setBoardPosition(game.fen())
  //         await wait(delay * 1000);
  //         white_turn = !white_turn;
  //       }
  //       // if(!gameStarted)
  //       //   return;
  //     }
  //     if (game.isDraw() || game.isThreefoldRepetition())
  //       updateScore('tie', 0.5);
  //     else
  //       white_turn ? updateScore('p1', 0) : updateScore('p2', 0);
  //   }
  //   setGameStarted(false);
  // }

  const updateScore = (target: string, val: number) => {
    if (target == 'p1')
      setScore({ p1: score.p1 + 1, p2: score.p2, games: score.games })
    else if (target == 'p2')
      setScore({ p1: score.p1, p2: score.p2 + 1, games: score.games })
    else if (target == 'tie')
      setScore({ p1: score.p1 + val, p2: score.p2 + val, games: score.games })
    else if (target == 'games')
      setScore({ p1: 0, p2: 0, games: val })
    else if (target == 'restart')
      setScore({ p1: 0, p2: 0, games: score.games })
    else if (target == 'reset')
      setScore({ p1: 0, p2: 0, games: 1 })
  }

  const changeEngine1 = (engine: string) => {
    setEngine1(engine);
    setSelectErrors({ engine1: false, engine2: selectErrors.engine2 });
    updateScore('reset', 0);
  }

  const changeEngine2 = (engine: string) => {
    setEngine2(engine);
    setSelectErrors({ engine1: selectErrors.engine1, engine2: false });
    updateScore('reset', 0);
  }

  const validateStart = () => {
    if (engine1 === "" || engine2 === "") {
      setSelectErrors({ engine1: engine1 === "", engine2: engine2 === "" });
      return false;
    }

    const newRef = new Referee(engine1, engine2, onMove, delay);
    newRef.initGame().then(() => {
      newRef.startGame()
    });

    setReferee(newRef)

    return true;
  }

  const onMove = (move: string, fen: string) => {
    setBoardPosition(fen);
  }

  useEffect(() => {
    // On load fetch the engines
    engines.fetchEngines().then(() => {
      setEngineNames(engines.getEngineNames());
      setEngine1('');
      setEngine2('');
      setLoaded(true);
    });
  }, []);


  return (
    <Container maxWidth={false} sx={{ bgcolor: theme.palette.background.paper }}>
      <Box sx={{ flexGrow: 1, padding: 5, height: "100%" }}>
        <Grid container spacing={10} sx={{ padding: 2, }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box sx={{ backgroundColor: theme.palette.primary.dark, padding: 1, borderRadius: 4 }}>
              <Chessboard position={boardPosition} isDraggablePiece={referee.onDragStart} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack spacing={2}>
              <Box sx={{ bgcolor: theme.palette.primary.main, color: 'primary.contrastText', paddingX: 10, paddingY: 5, borderRadius: 5 }}>
                <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h5">{engine1 === "" ? "Player 1" : engine1}</Typography>
                    <Typography variant="h2">{score.p1}</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h6">Best of {score.games} {score.games == 1 ? 'Game' : 'Games'}</Typography>
                    <Typography variant="h4">VS</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h5">{engine2 === "" ? "Player 2" : engine2}</Typography>
                    <Typography variant="h2">{score.p2}</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ bgcolor: theme.palette.primary.main, color: 'primary.contrastText', padding: 4, borderRadius: 5 }}>
                <Typography variant="h5">Game Status: {gameStarted ? "Game in Progress" : "Game Stopped"}</Typography>
              </Box> 

              <Box sx={{ bgcolor: theme.palette.background.paper, border: 'solid 2px', borderColor: theme.palette.primary.main, color: 'primary.contrastText', paddingX: 10, paddingY: 5, borderRadius: 5, marginLeft: "10%" }}>
                <Grid container columnSpacing={1} rowSpacing={5}>
                  <Grid size={{ xs: 6 }}>
                    <FormControl sx={{ width: "90%" }} error={selectErrors.engine1}>
                      <InputLabel id="Player1-id">Player 1</InputLabel>
                      <Select
                        labelId="Player1-id"
                        id="Player1-box"
                        label="Player 1"
                        value={engine1}
                        disabled={gameStarted || !loaded}
                        onChange={(event: SelectChangeEvent<string>) => { changeEngine1(event.target.value); }}
                      >
                        {loaded  && <MenuItem value="human">Human</MenuItem>}
                        {loaded  && <MenuItem value="random">Random</MenuItem>}
                        {loaded && engineNames.map((engineName) => (
                          <MenuItem key={engineName} value={engineName}>
                            {engineName}
                          </MenuItem>
                        ))}  
                        
                        {!loaded && <MenuItem value="Loading">Loading...</MenuItem>}

                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <FormControl sx={{ width: "90%" }} error={selectErrors.engine2}>
                      <InputLabel id="Player2">Player 2</InputLabel>
                      <Select
                        labelId="Player2"
                        id="Player2"
                        label="Player 2"
                        value={engine2}
                        disabled={gameStarted || !loaded}
                        onChange={(event: SelectChangeEvent<string>) => { changeEngine2(event.target.value); }}
                      >
                        {loaded  && <MenuItem value="human">Human</MenuItem>}
                        {loaded  && <MenuItem value="random">Random</MenuItem>}
                        {loaded && engineNames.map((engineName) => (
                          <MenuItem key={engineName} value={engineName}>
                            {engineName}
                          </MenuItem>
                        ))}  
                        
                        {!loaded && <MenuItem value="Loading">Loading...</MenuItem>}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <FormControl sx={{ width: "90%" }}>
                      <InputLabel id="MoveSpeed">Move Speed</InputLabel>
                      <Select
                        labelId="MoveSpeed"
                        id="MoveSpeed"
                        label="Time Control"
                        value={delay}
                        onChange={(event: SelectChangeEvent<number>) => {
                          setDelay(Number(event.target.value));
                        }}
                      >
                        <MenuItem value={0}>Max</MenuItem>
                        <MenuItem value={1}>1 extra second delay</MenuItem>
                        <MenuItem value={3}>3 extra seconds delay</MenuItem>
                        <MenuItem value={5}>5 extra seconds delay</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <FormControl sx={{ width: "90%" }}>
                      <InputLabel id="GameNumber">Number of Games</InputLabel>
                      <Select
                        labelId="GameNumber"
                        id="GameNumber"
                        label="Number of Games"
                        value={score.games}
                        onChange={(event: SelectChangeEvent<number>) => {
                          updateScore('games', event.target.value as number);
                        }}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={11}>11</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>


                  <Grid size={{ xs: 12 }}>
                    <Stack direction="column" spacing={1}>
                      <FormControlLabel disabled control={<Checkbox />} label="Log Results" />
                      {/* Play button */}
                      {
                        !gameStarted ?
                          <Button
                            variant="contained"
                            size='large'
                            sx={{ borderRadius: 5 }}
                            disabled={!loaded}
                            onClick={() => {validateStart()}}
                          >
                            Play
                          </Button>
                          :
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                              <Button
                                variant="contained"
                                size='large'
                                fullWidth
                                sx={{ borderRadius: 5, backgroundColor: theme.palette.warning.main }}
                                disabled={!loaded}
                                onClick={() => { setStopGame(true); }}
                              >
                                Pause Game
                              </Button>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Button
                                variant="contained"
                                size='large'
                                fullWidth
                                sx={{ borderRadius: 5, backgroundColor: theme.palette.error.main }}
                                disabled={!loaded}
                                onClick={() => { setGameStarted(false); }}
                              >
                                Stop Game
                              </Button>
                            </Grid>
                          </Grid>
                      }

                    </Stack>
                  </Grid>

                </Grid>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Arena;
