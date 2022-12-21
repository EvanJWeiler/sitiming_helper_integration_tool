import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RaceStatus from 'components/RaceStatus';
import RaceData from 'components/RaceData';
import Settings from 'components/Settings';
import Sidebar from 'components/Sidebar';

export default function App() {
  return (
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
  );
}
