import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import SickIcon from '@mui/icons-material/Sick';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { toast } from 'react-toastify';

const AttendancePortal = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    return localStorage.getItem('ems_checked_in') === 'true';
  });
  const [checkInTime, setCheckInTime] = useState(() => {
    return localStorage.getItem('ems_checkin_time') || null;
  });
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  // Leave balance state
  const [leaveBalances] = useState({
    annual: { total: 24, used: 6, remaining: 18 },
    sick: { total: 10, used: 3, remaining: 7 },
    casual: { total: 8, used: 3, remaining: 5 },
  });

  // Leave requests state with localStorage persistence
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('ems_leave_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 1,
        employeeName: 'Sarah Jenkins',
        department: 'Engineering',
        type: 'Sick Leave',
        startDate: '2026-10-12',
        endDate: '2026-10-14',
        days: 3,
        reason: 'Viral fever and doctor consultation',
        status: 'Pending',
        submittedAt: 'Today, 09:30 AM',
      },
      {
        id: 2,
        employeeName: 'Michael Chang',
        department: 'Marketing',
        type: 'Annual Leave',
        startDate: '2026-10-20',
        endDate: '2026-10-25',
        days: 5,
        reason: 'Family vacation travel',
        status: 'Approved',
        submittedAt: 'Yesterday',
      },
      {
        id: 3,
        employeeName: 'Elena Rostova',
        department: 'Human Resources',
        type: 'Casual Leave',
        startDate: '2026-10-09',
        endDate: '2026-10-09',
        days: 1,
        reason: 'Personal family emergency',
        status: 'Approved',
        submittedAt: '2 days ago',
      },
    ];
  });

  // Attendance history records
  const [attendanceLogs, setAttendanceLogs] = useState(() => {
    const saved = localStorage.getItem('ems_attendance_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { date: 'Today (Oct 8)', inTime: '09:05 AM', outTime: '--', hours: 'Active', status: 'On Time' },
      { date: 'Oct 7, 2026', inTime: '08:58 AM', outTime: '05:32 PM', hours: '8h 34m', status: 'On Time' },
      { date: 'Oct 6, 2026', inTime: '09:22 AM', outTime: '05:40 PM', hours: '8h 18m', status: 'Late' },
      { date: 'Oct 5, 2026', inTime: '09:01 AM', outTime: '05:30 PM', hours: '8h 29m', status: 'On Time' },
      { date: 'Oct 4, 2026', inTime: '08:55 AM', outTime: '05:45 PM', hours: '8h 50m', status: 'On Time' },
    ];
  });

  // New leave form state
  const [newLeave, setNewLeave] = useState({
    employeeName: localStorage.getItem('EMSusername') || 'Ruban Admin',
    department: 'Engineering',
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Live Clock updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunchToggle = () => {
    if (!isCheckedIn) {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsCheckedIn(true);
      setCheckInTime(nowStr);
      localStorage.setItem('ems_checked_in', 'true');
      localStorage.setItem('ems_checkin_time', nowStr);
      toast.success(`Punch In Recorded at ${nowStr}! Have a productive day.`);
    } else {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsCheckedIn(false);
      setCheckInTime(null);
      localStorage.setItem('ems_checked_in', 'false');
      localStorage.removeItem('ems_checkin_time');
      toast.info(`Punch Out Recorded at ${nowStr}! Have a restful evening.`);
    }
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      toast.error('Please fill in all required leave details');
      return;
    }

    const start = new Date(newLeave.startDate);
    const end = new Date(newLeave.endDate);
    const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

    const created = {
      id: Date.now(),
      ...newLeave,
      days: diffDays,
      status: 'Pending',
      submittedAt: 'Just now',
    };

    const updated = [created, ...leaveRequests];
    setLeaveRequests(updated);
    localStorage.setItem('ems_leave_requests', JSON.stringify(updated));
    setLeaveModalOpen(false);
    toast.success(`Leave request for ${diffDays} day(s) submitted for approval!`);
    setNewLeave({
      employeeName: localStorage.getItem('EMSusername') || 'Ruban Admin',
      department: 'Engineering',
      type: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: '',
    });
  };

  const handleLeaveAction = (id, newStatus) => {
    const updated = leaveRequests.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req
    );
    setLeaveRequests(updated);
    localStorage.setItem('ems_leave_requests', JSON.stringify(updated));
    if (newStatus === 'Approved') {
      toast.success('Leave request approved successfully!');
    } else {
      toast.warn('Leave request has been rejected.');
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E3C72', display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventNoteIcon fontSize="large" sx={{ color: '#2A5298' }} />
            Attendance & Leave Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Live punch attendance tracking, leave requests workflow, and department timesheets.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setLeaveModalOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
            px: 3,
            py: 1.2,
            borderRadius: 2,
            boxShadow: '0 4px 14px rgba(30, 60, 114, 0.3)',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Request Leave
        </Button>
      </Box>

      {/* Row 1: Clock / Punch Card + Leave Balances */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Punch In Card */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              background: isCheckedIn
                ? 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
                : 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
              color: 'white',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              p: 1,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="overline" sx={{ letterSpacing: 1.5, opacity: 0.85 }}>
                  Real-Time Biometric Punch
                </Typography>
                <Chip
                  icon={isCheckedIn ? <CheckCircleOutlineIcon sx={{ color: '#10B981 !important' }} /> : <AccessTimeIcon sx={{ color: '#F59E0B !important' }} />}
                  label={isCheckedIn ? 'ON DUTY' : 'OUT OF OFFICE'}
                  sx={{
                    bgcolor: isCheckedIn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: isCheckedIn ? '#10B981' : '#F59E0B',
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: isCheckedIn ? '#10B981' : '#F59E0B',
                  }}
                />
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'monospace', my: 1, letterSpacing: 2 }}>
                {currentTime.toLocaleTimeString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>

              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 2, mb: 3 }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Punched In At</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{checkInTime || '--:--'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Scheduled Shift</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>09:00 AM - 05:30 PM</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handlePunchToggle}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  bgcolor: isCheckedIn ? '#EF4444' : '#10B981',
                  '&:hover': {
                    bgcolor: isCheckedIn ? '#DC2626' : '#059669',
                  },
                }}
              >
                {isCheckedIn ? 'Clock Out (End Shift)' : 'Clock In (Start Shift)'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Balances Grid */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            {/* Annual Leave */}
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#3B82F6' }}>
                    <FlightTakeoffIcon />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Annual Leave</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3C72', my: 1 }}>
                    {leaveBalances.annual.remaining}
                    <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
                      / {leaveBalances.annual.total} days
                    </Typography>
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(leaveBalances.annual.remaining / leaveBalances.annual.total) * 100}
                    sx={{ height: 8, borderRadius: 4, my: 1.5, bgcolor: '#DBEAFE', '& .MuiLinearProgress-bar': { bgcolor: '#3B82F6' } }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {leaveBalances.annual.used} days utilized this year
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Sick Leave */}
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#EF4444' }}>
                    <SickIcon />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Sick Leave</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3C72', my: 1 }}>
                    {leaveBalances.sick.remaining}
                    <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
                      / {leaveBalances.sick.total} days
                    </Typography>
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(leaveBalances.sick.remaining / leaveBalances.sick.total) * 100}
                    sx={{ height: 8, borderRadius: 4, my: 1.5, bgcolor: '#FEE2E2', '& .MuiLinearProgress-bar': { bgcolor: '#EF4444' } }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Medical certificate required &gt; 2 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Casual Leave */}
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#10B981' }}>
                    <WorkHistoryIcon />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Casual Leave</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3C72', my: 1 }}>
                    {leaveBalances.casual.remaining}
                    <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
                      / {leaveBalances.casual.total} days
                    </Typography>
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(leaveBalances.casual.remaining / leaveBalances.casual.total) * 100}
                    sx={{ height: 8, borderRadius: 4, my: 1.5, bgcolor: '#D1FAE5', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {leaveBalances.casual.used} days taken out of 8
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Attendance Efficiency Widget */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, p: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E3C72' }}>
                      Overall Attendance Score: 96.8%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      22 on-time check-ins recorded this month. Excellent adherence to corporate working hours.
                    </Typography>
                  </Box>
                  <Chip label="Top Performer" color="success" size="small" sx={{ fontWeight: 700 }} />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Row 2: Active Leave Requests Management */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E3C72' }}>
              Pending & Active Leave Requests
            </Typography>
            <Chip label={`${leaveRequests.length} Total Records`} size="small" />
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#F1F5F9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Leave Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Dates & Duration</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>HR Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((req) => (
                  <TableRow key={req.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{req.employeeName}</TableCell>
                    <TableCell>{req.department}</TableCell>
                    <TableCell>
                      <Chip label={req.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{req.startDate} to {req.endDate}</Typography>
                      <Typography variant="caption" color="text.secondary">({req.days} days)</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography variant="body2" noWrap title={req.reason}>{req.reason}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={req.status}
                        size="small"
                        color={
                          req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'error' : 'warning'
                        }
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {req.status === 'Pending' ? (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Approve Leave">
                            <IconButton color="success" size="small" onClick={() => handleLeaveAction(req.id, 'Approved')}>
                              <ThumbUpAltIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject Leave">
                            <IconButton color="error" size="small" onClick={() => handleLeaveAction(req.id, 'Rejected')}>
                              <ThumbDownAltIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">Resolved</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Row 3: Daily Attendance History Log */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E3C72', mb: 2 }}>
            Recent Attendance Log
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#F1F5F9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Clock In</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Clock Out</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Working Hours</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceLogs.map((log, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{log.date}</TableCell>
                    <TableCell>{log.inTime}</TableCell>
                    <TableCell>{log.outTime}</TableCell>
                    <TableCell>{log.hours}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.status}
                        size="small"
                        color={log.status === 'On Time' ? 'success' : 'warning'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Leave Application Modal Dialog */}
      <Dialog open={leaveModalOpen} onClose={() => setLeaveModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1E3C72' }}>
          Apply for Leave
        </DialogTitle>
        <form onSubmit={handleLeaveSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  value={newLeave.employeeName}
                  onChange={(e) => setNewLeave({ ...newLeave, employeeName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Leave Type"
                  value={newLeave.type}
                  onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
                >
                  <MenuItem value="Casual Leave">Casual Leave (Paid)</MenuItem>
                  <MenuItem value="Sick Leave">Sick Leave (Medical)</MenuItem>
                  <MenuItem value="Annual Leave">Annual Paid Vacation</MenuItem>
                  <MenuItem value="Emergency Leave">Emergency Leave</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="From Date"
                  InputLabelProps={{ shrink: true }}
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="To Date"
                  InputLabelProps={{ shrink: true }}
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Reason for Absence"
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="Describe reason for leave request..."
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setLeaveModalOpen(false)} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Submit Application
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AttendancePortal;
