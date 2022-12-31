import React from 'react';
import { Racer } from 'interfaces/Database';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridSortCellParams, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'bibNumber', headerName: 'Bib #', width: 130},
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'teamName', headerName: 'Team Name', width: 300 },
  { field: 'cardNumber', headerName: 'Si Card #', width: 200 },
  { 
    field: 'checkedIn', 
    headerName: 'Checked In', 
    width: 175,
    renderCell: getCheckedInIcon,
    valueGetter: ((params: GridValueGetterParams) => { return params.row.checkedIn })
  },
];

function getCheckedInIcon(params: GridRenderCellParams) {
  const baseStyle = {
    height: '20px',
    width: '20px',
    borderRadius: '25%',
  }
  if (params.row.checkedIn) {
    return <Box style={{...baseStyle, backgroundColor: 'rgb(0, 200, 0)'}} />
  } else {
    return <Box style={{...baseStyle, backgroundColor: 'rgb(200, 0, 0)'}} />
  }
}

interface CatDetailProps {
    raceId: string;
    racerList: Racer[];
}

const CategoryDetail = ({ raceId, racerList }: CatDetailProps) : JSX.Element => {
  return (
    <div
      style={{
        // height: 460,
        width: '100%'
      }}
    >
      {
        <DataGrid 
          density='compact'
          disableSelectionOnClick
          autoHeight
          rows={racerList.filter(racer => racer.categoryId == raceId)}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15]}
        />
      }
    </div>
  );
}

export default CategoryDetail;