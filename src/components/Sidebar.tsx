import React from 'react';
import './Sidebar.css';

import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SettingsIcon from '@mui/icons-material/Settings';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { NavLink } from 'react-router-dom';

import sportident_logo from '../../assets/sportident_logo.png';

const SidebarData = [
  {
    key: 1,
    label: 'Race Status',
    path: '/racestatus',
    icon: <DirectionsBikeIcon />,
  },
  {
    key: 2,
    label: 'Race Data',
    path: '/racedata',
    icon: <ImportExportIcon />,
  },
  {
    key: 3,
    label: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
  },
];

function Sidebar(): JSX.Element {
  return (
    <div className="sidebar">
      <img
        src={sportident_logo}
        alt="Sport Ident Logo"
        className="sidebarLogo"
      />
      <List disablePadding>
        {SidebarData.map(({ key, label, path, icon }) => (
          <NavLink to={path} key={key} className="sidebarItem">
            <ListItemButton>
              <div className="sidebarIcon">{icon}</div>
              <ListItemText>{label}</ListItemText>
            </ListItemButton>
          </NavLink>
        ))}
      </List>
    </div>
  );
}

export default Sidebar;
