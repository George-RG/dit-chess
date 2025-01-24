import { useState, useEffect } from 'react'
import { Chessboard } from "react-chessboard";
import Box from '@mui/material/Box'
import { Button, Container, FormControl, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useTheme } from '@mui/material/styles';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Engines  from './engines';

const engines = new Engines();

function Arena() {
  const theme = useTheme();
  const [engine1, setEngine1] = useState<string>('Player 1');
  const [engine2, setEngine2] = useState<string>('Player 2');
  const [engineNames, setEngineNames] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [score, setScore] = useState({p1: 0, p2: 0, games: 1});
  const [delay, setDelay] = useState(0);


  const updateScore = (target: string, val: number ) => {
    if(target == 'p1')
      setScore({p1: score.p1 + 1, p2: score.p2, games: score.games})
    else if(target == 'p2')
      setScore({p1: score.p1, p2: score.p2 + 1, games: score.games})
    else if(target == 'games')
      setScore({p1: 0, p2: 0, games: val})
    else if(target == 'restart')
      setScore({p1: 0, p2: 0, games: score.games})
  }
1
  const changeEngine1 = (engine: string) => {
      setEngine1(engine);
      updateScore('reset', 0);
    }

  const changeEngine2 = (engine: string) => {
    setEngine2(engine);
    updateScore('reset', 0);
  }

  useEffect(() => {
    setEngineNames(engines.engineNames);
    setLoaded(engines.isReady);
  }, [engines]);

  
  return (
    <Container maxWidth={false} sx={{bgcolor: theme.palette.background.paper}}>
      <Box sx={{ flexGrow: 1, padding: 5, height: "100%"}}>
        <Grid container spacing={10} sx={{ padding: 2, }}>
          <Grid size={{xs: 12, lg: 6}}>
              <Box sx={{backgroundColor: theme.palette.primary.dark, padding: 1, borderRadius: 4}}>
                <Chessboard />
              </Box>
          </Grid>
          <Grid size={{xs: 12, lg: 6}}>
            <Stack spacing={2}>
              <Box sx={{ bgcolor: theme.palette.primary.main, color: 'primary.contrastText', paddingX: 10, paddingY: 5, borderRadius: 5 }}>
                <Stack direction="row" spacing={2} sx={{justifyContent: 'center', alignItems: 'center'}}>
                  <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h5">{engine1}</Typography>
                    <Typography variant="h2">{score.p1}</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h6">Best of {score.games} {score.games == 1 ? 'Game' : 'Games'}</Typography>
                    <Typography variant="h4">VS</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h5">{engine2}</Typography>
                    <Typography variant="h2">{score.p2}</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ bgcolor: theme.palette.background.paper, border: 'solid 2px' , borderColor:theme.palette.primary.main, color: 'primary.contrastText', paddingX: 10, paddingY: 5, borderRadius: 5, marginLeft:"10%"}}>
                <Grid container columnSpacing={1} rowSpacing={5}>
                  <Grid size={{xs: 6}}>
                    <FormControl sx={{width: "90%"}}>
                      <InputLabel id="Player1-id">Player 1</InputLabel>
                      <Select
                        labelId="Player1-id"
                        id="Player1-box"
                        value={engine1}
                        label="Player 1"
                        disabled={gameStarted || !loaded}
                        onChange={(event: SelectChangeEvent<string>) => { changeEngine1(event.target.value); }}
                      >
                        {loaded && engineNames.map((engineName) => (
                          <MenuItem key={engineName} value={engineName}>
                            {engineName}
                          </MenuItem>
                        ))}
                        {!loaded && <MenuItem value="Player 1">Loading...</MenuItem>}

                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{xs: 6}}>
                  <FormControl sx={{width: "90%"}}>
                      <InputLabel id="Player2">Player 2</InputLabel>
                      <Select
                        labelId="Player2"
                        id="Player2"
                        value={engine2}
                        label="Player 2"
                        disabled={gameStarted || !loaded}
                        onChange={(event: SelectChangeEvent<string>) => { changeEngine2(event.target.value); }}
                      >
                        {loaded && engineNames.map((engineName) => (
                          <MenuItem key={engineName} value={engineName}>
                            {engineName}
                          </MenuItem>
                        ))}
                        {!loaded && <MenuItem value="Player 2">Loading...</MenuItem>}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{xs: 6}}>
                    <FormControl sx={{width: "90%"}}>
                      <InputLabel id="MoveSpeed">Move Speed</InputLabel>
                      <Select
                        labelId="MoveSpeed"
                        id="MoveSpeed"
                        value={delay}
                        label="Time Control"
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

                  <Grid size={{xs: 6}}>
                    <FormControl sx={{width: "90%"}}>
                      <InputLabel id="GameNumber">Number of Games</InputLabel>
                      <Select
                        labelId="GameNumber"
                        id="GameNumber"
                        value={score.games}
                        label="Number of Games"
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


                  <Grid size={{xs: 12}}>
                    <Stack direction="column" spacing={1}>
                      <FormControlLabel disabled control={<Checkbox />} label="Log Results" />
                      {/* Play button */}
                      <Button 
                        variant="contained" 
                        size='large' 
                        sx={{borderRadius: 5}}
                        disabled={!loaded}
                      >
                        Play
                      </Button>
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
