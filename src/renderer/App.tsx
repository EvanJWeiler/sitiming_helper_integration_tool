import './App.css';

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import RaceStatus from 'components/RaceStatus';
import RaceData from 'components/RaceData';
import Settings from 'components/Settings';
import Sidebar from 'components/Sidebar';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#606060'
    }
  },
  typography: {
    fontFamily: [
      '"Segoe UI"'
    ].join(',')
  }
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app">
          <Sidebar />
          <div id="content">
            <Routes>
              <Route path="/racestatus" element={<RaceStatus />} />
              <Route path="/racedata" element={<RaceData />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}
