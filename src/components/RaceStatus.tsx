import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ListItemButton from '@mui/material/ListItemButton';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

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
}

const RaceStatus = () => {
  const [raceStatusState, setRaceStatus] = useState<RaceStatusState>({
    categoryList: [],
    raceList: [],
    selectedRace: ''
  });

  // on component mount
  useEffect(() => {
    let stateString = window.localStorage.getItem('raceStatus');
    let newState = stateString != null ? JSON.parse(stateString) : {
      categoryList: [],
      raceList: [],
      selectedRace: ''
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

  return (
    <div className="list">
      <FormControl fullWidth
        variant='filled'
      >
        <InputLabel id="raceInputLabel">Select Race</InputLabel>
        <Select
          labelId="raceInputLabel"
          onChange={handleRaceSelect}
          value={raceStatusState.selectedRace}
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
      <List>
        {raceStatusState.categoryList.map(({ id, name, courseId }) => (
          <ListItemButton 
            key={id}
            style={{
              height: '50px', 
              fontSize: '1.2em',
              fontFamily: 'sans-serif',
            }}
          >
            {name}
          </ListItemButton>
        ))}
      </List>
    </div>
  );
}

export default RaceStatus;
