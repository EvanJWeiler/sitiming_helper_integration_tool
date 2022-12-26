import React from 'react';
import { Button, Card, FormControl, InputLabel, Paper, TextField, Typography } from '@mui/material';

const Settings = () => {
  function handleSubmit() {

  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: '50vw'
      }}
    >
      <Paper
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '10px'
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom
        >
          SiTiming Server Settings
        </Typography>
        <TextField 
          label='SiTiming Server IP Address'
          margin='dense'
        />
        <TextField 
          label='SiTiming Server Port'
          margin='dense' 
        />
        <TextField 
          label='Database'
          margin='dense' 
        />
        <TextField 
          label='Username'
          margin='dense' 
        />
        <TextField 
          label='Password'
          margin='dense'
        />
        <Button 
          variant='contained'
          style={{
            marginTop: '10px'
          }}
        >
          Save
        </Button>
      </Paper>
    </form>
  )
}

export default Settings;
