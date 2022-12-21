import React from 'react';
import './Sidebar.css';

import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SettingsIcon from '@mui/icons-material/Settings';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
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
            <ListItem button>
              <div className="sidebarIcon">{icon}</div>
              <ListItemText>{label}</ListItemText>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </div>

    // <div className="Sidebar">
    //   <ul className="SidebarList">
    //     {SidebarData.map((item) => {
    //       return (
    //         <li
    //           role="presentation"
    //           className={
    //             window.location.pathname === item.link
    //               ? 'SidebarItem active'
    //               : 'SidebarItem'
    //           }
    //           key={item.id}
    //           onMouseDown={() => {
    //             window.location.pathname = item.link;
    //           }}
    //         >
    //           <div className="icon">{item.icon}</div>
    //           <div className="title">{item.title}</div>
    //         </li>
    //       );
    //     })}
    //   </ul>
    // </div>
  );
}

export default Sidebar;
