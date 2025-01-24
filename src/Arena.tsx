import React, { useState, useEffect } from 'react'
import { Chessboard } from "react-chessboard";
import Box from '@mui/material/Box'
import { Button, Container, FormControl, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useTheme } from '@mui/material/styles';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function Arena() {
  const theme = useTheme();
  
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
                    <Typography variant="h5">GeorgeRG</Typography>
                    <Typography variant="h2">0</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h4">Best of X games</Typography>
                    <Typography variant="h4">VS</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h5">Mathboi</Typography>
                    <Typography variant="h2">8</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ bgcolor: theme.palette.secondary.main, color: 'primary.contrastText', paddingX: 10, paddingY: 5, borderRadius: 5 }}>
                <Grid container columnSpacing={2} rowSpacing={7}>
                  <Grid size={{xs: 6}}>
                    <FormControl sx={{width: "80%"}}>
                      <InputLabel id="Player1">Player 1</InputLabel>
                      <Select
                        labelId="Player1"
                        id="Player1"
                        value={"10"}
                        label="Player 1"
                        onChange={(event: SelectChangeEvent) => {
                          console.log(event.target.value);
                        }}
                      >
                        <MenuItem value={"10"}>GeorgeRG</MenuItem>
                        <MenuItem value={"11"}>Mathboi</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{xs: 6}}>
                    <FormControl sx={{width: "80%"}}>
                      <InputLabel id="Player2">Player 2</InputLabel>
                      <Select
                        labelId="Player2"
                        id="Player2"
                        value={"11"}
                        label="Player 2"
                        onChange={(event: SelectChangeEvent) => {
                          console.log(event.target.value);
                        }}
                      >
                        <MenuItem value={"10"}>GeorgeRG</MenuItem>
                        <MenuItem value={"11"}>Mathboi</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{xs: 6}}>
                    <FormControl sx={{width: "80%"}}>
                      <InputLabel id="MoveSpeed">Move Speed</InputLabel>
                      <Select
                        labelId="MoveSpeed"
                        id="MoveSpeed"
                        value={"10"}
                        label="Time Control"
                        onChange={(event: SelectChangeEvent) => {
                          console.log(event.target.value);
                        }}
                      >
                        <MenuItem value={"10"}>Blitz 3+2</MenuItem>
                        <MenuItem value={"11"}>Rapid 10+0</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{xs: 6}}>
                    <FormControl sx={{width: "80%"}}>
                      <InputLabel id="GameNumber">Number of Games</InputLabel>
                      <Select
                        labelId="GameNumber"
                        id="GameNumber"
                        value={"11"}
                        label="Number of Games"
                        onChange={(event: SelectChangeEvent) => {
                          console.log(event.target.value);
                        }}
                      >
                        <MenuItem value={"10"}>1</MenuItem>
                        <MenuItem value={"11"}>3</MenuItem>
                        <MenuItem value={"12"}>5</MenuItem>
                        <MenuItem value={"13"}>7</MenuItem>
                        <MenuItem value={"14"}>9</MenuItem>
                        <MenuItem value={"15"}>11</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>


                  <Grid size={{xs: 12}}>
                    <Stack direction="column" spacing={2}>
                      <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
                      {/* Play button */}
                      <Button variant="contained" size='large' sx={{borderRadius: 5}}>
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
