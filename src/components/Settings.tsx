import React, { useState, useEffect } from 'react';
import {
  Paper, 
  TextField, 
  Typography 
} from '@mui/material';
import {
  LoadingButton
} from '@mui/lab'
import { Save } from '@mui/icons-material';
import { SettingsState } from 'interfaces/State';

const Settings = () : JSX.Element => {
  const [settingsState, setSettingsState] = useState<SettingsState>({
    settings: window.api.settingsAPI.getSettings(),
    isSubmitting: false
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSettingsState({...settingsState, isSubmitting: true});

    // TODO: validation logic here
    // TODO: better storing of server credentials

    window.api.settingsAPI.saveSettings(settingsState.settings);
    
    setSettingsState({...settingsState, isSubmitting: false});
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
          name='address'
          label='Server IP Address'
          margin='dense'
          value={settingsState.settings.address}
          onChange={(e) => {
            setSettingsState({
              ...settingsState,
              settings: { ...settingsState.settings, address: e.target.value }
            }) 
          }}
        />
        <TextField 
          name='port'
          label='Server Port'
          margin='dense'
          value={settingsState.settings.port}
          onChange={(e) => { 
            setSettingsState({
              ...settingsState,
              settings: { ...settingsState.settings, port: e.target.value }
            }) 
          }}
        />
        <TextField 
          name='database'
          label='Database'
          margin='dense'
          value={settingsState.settings.database}
          onChange={(e) => { 
            setSettingsState({
              ...settingsState,
              settings: { ...settingsState.settings, database: e.target.value }
            }) 
          }}
        />
        <TextField 
          name='username'
          label='Username'
          margin='dense'
          value={settingsState.settings.username}
          onChange={(e) => { 
            setSettingsState({
              ...settingsState,
              settings: { ...settingsState.settings, username: e.target.value }
            }) 
          }}
        />
        <TextField
          name='password'
          label='Password'
          margin='dense'
          value={settingsState.settings.password}
          onChange={(e) => { 
            setSettingsState({
              ...settingsState,
              settings: { ...settingsState.settings, password: e.target.value }
            }) 
          }}
        />
        <LoadingButton 
          type='submit'
          variant='contained'
          startIcon={<Save />}
          loading={settingsState.isSubmitting}
          style={{
            marginTop: '10px'
          }}
        >
          Save
        </LoadingButton>
      </Paper>
    </form>
  )
}

export default Settings;
