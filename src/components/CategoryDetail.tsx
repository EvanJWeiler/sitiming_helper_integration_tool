import React from 'react';
import { Category, Racer } from 'interfaces/Database';
import { Box, Button, Modal } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';

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

interface CategoryDetailProps {
  categoryId: string;
  racerList: Racer[];
  includeCat?: boolean;
  includeTeam?: boolean;
  categoryList?: Category[];
}

const CategoryDetail = ({categoryId, racerList, includeCat = false, includeTeam = false, categoryList = []} : CategoryDetailProps) : JSX.Element => {
  const columns: GridColDef[] = [
    { field: 'bibNumber', headerName: 'Bib #', width: 110, hideable: false},
    { field: 'name', headerName: 'Name', width: 200, hideable: false },
    { field: 'cardNumber', headerName: 'Si Card #', width: 125, hideable: false },
    { field: 'teamName', headerName: 'Team Name', width: 300, hideable: false },
    { 
      field: 'checkedIn', 
      headerName: 'Checked In', 
      width: 150,
      hideable: false,
      renderCell: getCheckedInIcon,
      valueGetter: ((params: GridValueGetterParams) => { return params.row.checkedIn })
    },
    { 
      field: 'categoryName', headerName: 'Category', width: 300, hideable: false,
      valueGetter: ((params: GridValueGetterParams) => { 
        return categoryList.filter(category => category.id.includes(params.row.categoryId)).at(0)?.name
      })
    }
  ];

  return (
    <div
      style={{
        width: '100%'
      }}
    >
      {
        <DataGrid 
          density='compact'
          disableSelectionOnClick
          autoHeight
          rows={racerList.filter(racer => racer.categoryId.includes(categoryId))}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15]}
          columnVisibilityModel={{
            teamName: includeTeam,
            categoryName: includeCat
          }}
        />
      }
    </div>
  );
}

export default CategoryDetail;