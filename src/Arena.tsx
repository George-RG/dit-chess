import React, { useState, useEffect } from 'react'
import { Chessboard } from "react-chessboard";
import Box from '@mui/material/Box'
import { Container, FormControl, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useTheme } from '@mui/material/styles';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
                    <Typography variant="h5">Mathboy</Typography>
                    <Typography variant="h2">8</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ bgcolor: theme.palette.background.paper, color: 'primary.contrastText', paddingX: 10, paddingY: 5, borderRadius: 5 }}>
                <Grid container spacing={2}>
                  <Grid size={{xs: 6}}>
                    <FormControl>
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
                        <MenuItem value={"11"}>Mathboy</MenuItem>
                      </Select>
                    </FormControl>
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
