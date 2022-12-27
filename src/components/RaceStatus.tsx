import React, { useState, useEffect } from 'react';
import {
  ExpandMoreSharp, 
  Refresh
} from '@mui/icons-material'
import { 
  Accordion, 
  AccordionDetails, 
  AccordionSummary, 
  Button, 
  CircularProgress, 
  Divider, 
  FormControl, 
  InputLabel, 
  List, 
  MenuItem, 
  Select, 
  SelectChangeEvent, 
  Typography 
} from '@mui/material';
import {
  LoadingButton
} from '@mui/lab'
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/system';

// function testSqlGetRacers() {
//   window.api.sqlAPI.getRacersByCategory('TEAM ENDURO | FIRE MEN')
//     .then((res) => {
//       console.log(res);
//     })
// }

interface Category {
  id: string;
  name: string;
  courseId: string;
}

interface Race {
  id: string;
  name: string;
}

interface RaceStatusState {
  categoryList: Category[];
  raceList: Race[];
  selectedRace: string;
  isRefreshing: boolean;
}

const RaceStatus = () => {
  const [raceStatusState, setRaceStatus] = useState<RaceStatusState>({
    categoryList: [],
    raceList: [],
    selectedRace: '',
    isRefreshing: false
  });

  // on component mount
  useEffect(() => {
    let stateString = window.localStorage.getItem('raceStatus');
    let newState = stateString != null ? JSON.parse(stateString) : {
      categoryList: [],
      raceList: [],
      selectedRace: '',
      isRefreshing: false
    }

    if (newState.raceList.length === 0) {
      getRaces();
    }

    setRaceStatus(newState);
  }, []);

  // whenever race state is updated
  useEffect(() => {
    window.localStorage.setItem('raceStatus', JSON.stringify(raceStatusState));
  }, [raceStatusState]);

  function getRaceCats(raceId: string) {
    window.api.sqlAPI.getAllCategories(raceId)
      .then((res) => {
        setRaceStatus({...raceStatusState, categoryList: res, selectedRace: raceId});
      })
  }

  function getRaces() {
    window.api.sqlAPI.getAllRaces()
      .then((res) => {
        setRaceStatus({...raceStatusState, raceList: res});
      })
  }

  function handleRaceSelect(event: SelectChangeEvent) {
    getRaceCats(event.target.value);
  }

  function handleRefresh() {
    setRaceStatus({...raceStatusState, isRefreshing: true});

    setTimeout(() => {
      setRaceStatus({...raceStatusState, isRefreshing: false});
    }, 1000);
  }

  return (
    <div>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <FormControl variant="filled" fullWidth>
          <InputLabel id="raceInputLabel">Select Race</InputLabel>
          <Select
            value={raceStatusState.selectedRace}
            onChange={handleRaceSelect}
            labelId="raceInputLabel"
            label="Select Race"
            style={{
              height: '50px',
              width: '100%',
              backgroundColor: 'white'
            }}
          >
            {raceStatusState.raceList.map(({ id, name }) => (
              <MenuItem key={id} value={id}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <LoadingButton
          variant='contained'
          onClick={handleRefresh}
          startIcon={<Refresh />}
          loading={raceStatusState.isRefreshing}
          style={{
            backgroundColor: 'gray',
            marginLeft: '10px'
          }}
        >
          Refresh
        </LoadingButton>
      </Box>
      <List>
        {raceStatusState.categoryList.map(({ id, name, courseId }) => (
          <div key={id}>
            <Accordion disableGutters square>
              <AccordionSummary
                expandIcon={<ExpandMoreSharp />}
              >
                <Typography>{name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                Placeholder text for category '{name}'.
              </AccordionDetails>
            </Accordion>
            <Divider light />
          </div>
        ))}
      </List>
    </div>
  );
}

export default RaceStatus;
