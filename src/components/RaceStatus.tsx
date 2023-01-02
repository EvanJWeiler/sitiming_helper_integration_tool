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
  Box, 
  Chip
} from '@mui/material';
import { LoadingButton } from '@mui/lab'
import { RaceStatusState, ListState } from 'interfaces/State';
import { Racer, Category } from 'interfaces/Database';
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
        let categoryList = (data[0] as Category[]).sort((a, b) => {
          if (a.numRacers === 0 && b.numRacers === 0) return 0;
          if (a.numRacers === 0) return 1;
          if (b.numRacers === 0) return -1;

          return 0;
        });

        let newState = {
          categoryList: categoryList,
          racerList: data[1] as Racer[],
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

    const racersInCat = raceInfoState.racerList.filter(racer => racer.categoryId.includes(categoryId)).length;
    const racersCheckedIn = raceInfoState.racerList.filter(racer => racer.categoryId.includes(categoryId) && racer.checkedIn).length;

    if (racersInCat === 0) {
      return {...baseStyle, backgroundColor: 'rgb(150, 150, 150)'}
    }

    if (racersCheckedIn === racersInCat) {
      return {...baseStyle, backgroundColor: 'rgb(0, 200, 0)'};
    } else if (racersCheckedIn == 0 && racersInCat > 0) {
      return {...baseStyle, backgroundColor: 'rgb(200, 0, 0)'};
    } else {
      return {...baseStyle, backgroundColor: 'rgb(220, 220, 0)'};
    }
  }

  function getCategoryStatusString(categoryId: string) {
    const racersInCat = raceInfoState.racerList.filter(racer => racer.categoryId.includes(categoryId)).length;
    const racersCheckedIn = raceInfoState.racerList.filter(racer => racer.categoryId.includes(categoryId) && racer.checkedIn).length;

    if (racersInCat === 0) {
      return 'N/A';
    } else {
      return racersCheckedIn + ' / ' +  racersInCat;
    }
  }

  // TODO: emergency contact info getter?
  // TODO: do not reload page every time route is loaded
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
      { raceInfoState.categoryList.length != 0 &&
      <List>
        <Accordion
          disableGutters 
          square
        >
          <AccordionSummary
            expandIcon={<ExpandMoreSharp />}
          >
            <Box
              style={getCategoryStatus('')}
            />
            <Typography>{listState.raceList.filter(race => race.id === listState.selectedRace).at(0)?.name}</Typography>
            <Chip
              variant='outlined'
              label={getCategoryStatusString('')}
              style={{
                height: '25px',
                marginLeft: '10px'
              }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <CategoryDetail 
              categoryId={''} 
              racerList={raceInfoState.racerList}
              categoryList={raceInfoState.categoryList}
              includeTeam
              includeCat
            />
          </AccordionDetails>
        </Accordion>
        <Divider light />
        {raceInfoState.categoryList.map(({ id, name }) => (
          <div key={id}>
            <Accordion 
              disableGutters 
              square
              disabled={raceInfoState.racerList.filter(racer => racer.categoryId === id).length === 0}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreSharp />}
              >
                <Box
                  style={getCategoryStatus(id)}
                />
                <Typography>{name}</Typography>
                <Chip
                  variant='outlined'
                  label={getCategoryStatusString(id)}
                  style={{
                    height: '25px',
                    marginLeft: '10px'
                  }}
                />
              </AccordionSummary>
              <AccordionDetails>
                <CategoryDetail
                  categoryId={id} 
                  racerList={raceInfoState.racerList}
                  includeTeam
                />
              </AccordionDetails>
            </Accordion>
            <Divider light />
          </div>
        ))}
      </List>
      }
    </div>
  );
}

export default RaceStatus;
