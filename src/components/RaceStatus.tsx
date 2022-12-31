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
import CategoryDetail from './CategoryDetail';

const RaceStatus = () : JSX.Element => {
  const [raceInfoState, setRaceInfoState] = useState<RaceStatusState>({
    categoryList: [],
    racerList: []
  });

  const [listState, setListState] = useState<ListState>({
    raceList: [],
    selectedRace: ''
  });

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // on component mount
  useEffect(() => {
    let raceInfoStateString = window.localStorage.getItem('raceInfoState') as string;
    let listStateString = window.localStorage.getItem('listState') as string;
 
    if (!raceInfoStateString) {
      raceInfoStateString = JSON.stringify({
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

    let raceInfoState = JSON.parse(raceInfoStateString);
    let listState = JSON.parse(listStateString);

    if (listState.raceList.length === 0) {
      getRaces();
    }

    setRaceInfoState(raceInfoState);
    setListState(listState);
    setIsRefreshing(false);
  }, []);

  // whenever race state is updated
  useEffect(() => {
    window.localStorage.setItem('raceInfoState', JSON.stringify(raceInfoState));
  }, [raceInfoState]);

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
        };

        setRaceInfoState(newState);
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

  function getCategoryStatus(categoryId: string) {
    const baseStyle = {
      height: '25px',
      width: '25px',
      borderRadius: '25%',
      marginRight: '10px'
    }

    const racersInCategory = raceInfoState.racerList.filter(racer => racer.categoryId === categoryId);

    if (racersInCategory.length === 0) {
      return {...baseStyle, backgroundColor: 'rgb(180, 180, 180)'}
    }  

    let checkedInCount = 0;
    racersInCategory
      .forEach(racer => {
        if (racer.checkedIn) {
          checkedInCount++;
        }
      });

    if (checkedInCount === racersInCategory.length) {
      return {...baseStyle, backgroundColor: 'rgb(0, 200, 0)'};
    } else if (checkedInCount == 0 && racersInCategory.length > 0) {
      return {...baseStyle, backgroundColor: 'rgb(200, 0, 0)'};
    } else {
      return {...baseStyle, backgroundColor: 'rgb(220, 220, 0)'};
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
        {raceInfoState.categoryList.map(({ id, name }) => (
          <div key={id}>
            <Accordion 
              disableGutters 
              square
            >
              <AccordionSummary
                expandIcon={<ExpandMoreSharp />}
              >
              <Box
                style={getCategoryStatus(id)}
              />
              <Typography>{name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CategoryDetail raceId={id} racerList={raceInfoState.racerList}></CategoryDetail>
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
