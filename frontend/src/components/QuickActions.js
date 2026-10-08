import React from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PaidIcon from '@mui/icons-material/Paid';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();
  const actions = [
    { icon: <AutoAwesomeIcon sx={{ color: '#ff9800' }} />, name: 'AI Smart Onboard', onClick: () => navigate('/smart-onboard') },
    { icon: <PaidIcon sx={{ color: '#10B981' }} />, name: 'Payroll & Slips', onClick: () => navigate('/payroll') },
    { icon: <EventAvailableIcon sx={{ color: '#3B82F6' }} />, name: 'Attendance & Leaves', onClick: () => navigate('/attendance') },
    { icon: <GroupAddIcon />, name: 'Add Employee', onClick: () => navigate('/add-employee') },
    { icon: <DashboardIcon />, name: 'Dashboard', onClick: () => navigate('/dashboard') },
  ];

  return (
    <SpeedDial
      ariaLabel="Quick actions"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1500,
        '& .MuiSpeedDial-fab': {
          background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
          boxShadow: '0 6px 20px rgba(30, 60, 114, 0.4)',
        },
      }}
      icon={<SpeedDialIcon openIcon={<AddIcon />} />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
          tooltipOpen
        />
      ))}
    </SpeedDial>
  );
};

export default QuickActions;
