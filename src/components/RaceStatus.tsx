import React, { useState, useEffect } from 'react';
import {
  ExpandMoreSharp,
  Refresh
} from '@mui/icons-material'
import { 
  Accordion, 
  AccordionDetails, 
  AccordionSummary, 
  Divider, 
  FormControl, 
  InputLabel, 
  List, 
  MenuItem, 
  Select, 
  SelectChangeEvent, 
  Typography,
  Box 
} from '@mui/material';
import { LoadingButton } from '@mui/lab'
import { RaceStatusState, ListState } from 'interfaces/State';
import { Racer } from 'interfaces/Database';

const RaceStatus = () => {
  const [raceStatusState, setRaceStatus] = useState<RaceStatusState>({
    categoryList: [],
    racerList: []
  });

  const [listState, setListState] = useState<ListState>({
    raceList: [],
    selectedRace: ''
  });

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // TODO: rename raceStatusState and listState to better names

  // on component mount
  useEffect(() => {
    let raceStateString = window.localStorage.getItem('raceStatus') as string;
    let listStateString = window.localStorage.getItem('listState') as string;
 
    if (!raceStateString) {
      raceStateString = JSON.stringify({
        categoryList: [],
        racerMap: new Map<string, Racer[]>()
      });
    }

    if (!listStateString) {
      listStateString = JSON.stringify({
        raceList: [],
        selectedRace: ''
      });
    }

    let raceState = JSON.parse(raceStateString);
    let listState = JSON.parse(listStateString);

    if (listState.raceList.length === 0) {
      getRaces();
    }

    setRaceStatus(raceState);
    setListState(listState);
    setIsRefreshing(false);
  }, []);

  // whenever race state is updated
  useEffect(() => {
    window.localStorage.setItem('raceStatus', JSON.stringify(raceStatusState));
  }, [raceStatusState]);

  useEffect(() => {
    window.localStorage.setItem('listState', JSON.stringify(listState));
  }, [listState]);

  function getRaces() {
    window.api.sqlAPI.getAllRaces()
      .then((res) => {
        setListState({...listState, raceList: res});
        setIsRefreshing(false);
      })
      .catch((err) => {
        throw err;
      });
  }

  function generateCatList(raceId: string) {
    const promises = [
      window.api.sqlAPI.getAllCategories(raceId),
      window.api.sqlAPI.getRacersByRaceId(raceId)
    ];

    Promise.all(promises)
      .then((data) => {
        let newState = {
          categoryList: data[0],
          racerList: data[1] as Racer[]
        }

        setRaceStatus(newState);
      })
      .catch((err) => {
        console.error(err);
      })
  }

  function handleRaceSelect(event: SelectChangeEvent) {
    const selectedRace = event.target.value;

    setListState({...listState, selectedRace: selectedRace});

    generateCatList(selectedRace);
  }

  function handleRefresh() {
    const selectedRace = listState.selectedRace;

    setIsRefreshing(true);
    getRaces();

    if (selectedRace != '') {
      generateCatList(selectedRace);
    }
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
            value={listState.selectedRace}
            onChange={handleRaceSelect}
            labelId="raceInputLabel"
            label="Select Race"
            style={{
              height: '50px',
              width: '100%',
              backgroundColor: 'white'
            }}
          >
            {listState.raceList.map(({ id, name }) => (
              <MenuItem key={id} value={id}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <LoadingButton
          variant='contained'
          onClick={handleRefresh}
          startIcon={<Refresh />}
          loading={isRefreshing}
          style={{
            marginLeft: '10px'
          }}
        >
          Refresh
        </LoadingButton>
      </Box>
      <List>
        {raceStatusState.categoryList.map(({ id, name }) => (
          <div key={id}>
            <Accordion disableGutters square>
              <AccordionSummary
                expandIcon={<ExpandMoreSharp />}
              >
                <Typography>{name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {raceStatusState.racerList
                  .filter(racer => racer.categoryId == id)
                  .map(({ id, name, checkedIn }) => (
                    <Typography key={id}>Name: {name}, Checked In? {checkedIn.toString()}</Typography>
                ))}
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
