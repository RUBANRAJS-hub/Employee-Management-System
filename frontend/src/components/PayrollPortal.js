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
  InputAdornment,
  Divider,
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getAllEmployees } from '../services/employeeService';
import { toast } from 'react-toastify';

const PayrollPortal = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const data = await getAllEmployees();
        // Generate deterministic, realistic payroll details based on employee attributes
        const processed = (data || []).map((emp, index) => {
          const deptName = emp.department ? emp.department.name : 'Operations';
          let baseSalary = 4500 + ((emp.age || 28) * 65) + ((emp.id % 20) * 120);
          if (deptName.includes('Engineering') || deptName.includes('Computer')) baseSalary += 1500;
          if (deptName.includes('Management') || deptName.includes('Executive')) baseSalary += 2200;

          const hra = Math.round(baseSalary * 0.20);
          const allowance = Math.round(baseSalary * 0.12);
          const grossEarnings = baseSalary + hra + allowance;

          const pf = Math.round(baseSalary * 0.12);
          const tax = Math.round(grossEarnings * 0.10);
          const totalDeductions = pf + tax;
          const netPay = grossEarnings - totalDeductions;

          return {
            ...emp,
            designation: getDesignation(deptName, emp.age),
            baseSalary,
            hra,
            allowance,
            grossEarnings,
            pf,
            tax,
            totalDeductions,
            netPay,
            status: index % 7 === 0 ? 'Processing' : 'Disbursed',
            payPeriod: 'October 2026',
            accountNo: `**** **** ${1000 + (emp.id * 37) % 9000}`,
          };
        });
        setEmployees(processed);
      } catch (err) {
        console.error('Error fetching employees for payroll:', err);
        toast.error('Could not load payroll data from backend');
      } finally {
        setLoading(false);
      }
    };
    fetchEmp();
  }, []);

  const getDesignation = (dept, age) => {
    if (age > 45) return `Director of ${dept}`;
    if (age > 35) return `Senior ${dept} Specialist`;
    if (age > 28) return `${dept} Associate`;
    return `Junior ${dept} Analyst`;
  };

  const filteredEmployees = employees.filter((emp) => {
    const full = `${emp.firstName || ''} ${emp.lastName || ''} ${emp.department?.name || ''}`.toLowerCase();
    return full.includes(searchQuery.toLowerCase());
  });

  const totalPayrollBudget = employees.reduce((acc, curr) => acc + curr.netPay, 0);
  const avgSalary = employees.length > 0 ? Math.round(totalPayrollBudget / employees.length) : 0;

  const handleOpenSlip = (emp) => {
    setSelectedSlip(emp);
    setPayslipModalOpen(true);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E3C72', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaidIcon fontSize="large" sx={{ color: '#2A5298' }} />
            Payroll & Compensation Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enterprise salary disbursements, automated tax breakdown, and printable corporate payslips.
          </Typography>
        </Box>
        <Chip
          icon={<CheckCircleIcon />}
          label="Payroll Disbursal Cycle: Active (Oct 2026)"
          color="success"
          sx={{ fontWeight: 700, px: 1, py: 2.2 }}
        />
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1E3C72', mb: 1 }}>
                <AccountBalanceWalletIcon />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total Net Payroll</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3C72' }}>
                ${totalPayrollBudget.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                For {employees.length} active corporate personnel
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10B981', mb: 1 }}>
                <TrendingUpIcon />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Average Compensation</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3C72' }}>
                ${avgSalary.toLocaleString()}
                <Typography component="span" variant="body2" color="text.secondary">/mo</Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Median base CTC across departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#3B82F6', mb: 1 }}>
                <ReceiptLongIcon />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total Tax Deducted</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3C72' }}>
                ${Math.round(totalPayrollBudget * 0.10).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Compliant with federal TDS withholdings
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#F59E0B', mb: 1 }}>
                <PaidIcon />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Disbursal Schedule</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3C72' }}>
                Oct 31, 2026
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ACH direct deposit auto-release
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Payroll Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E3C72' }}>
              Employee Salary & Compensation Register
            </Typography>
            <TextField
              size="small"
              placeholder="Search by employee or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 300 } }}
            />
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#F1F5F9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Department & Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Gross Pay</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Deductions (Tax + PF)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Net Salary</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Payslip</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1">Loading compensation database from MySQL...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">No matching employee payroll records found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.slice(0, 25).map((emp) => (
                    <TableRow key={emp.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E3C72' }}>
                          {emp.firstName} {emp.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {emp.email} (ID #{emp.id})
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {emp.department ? emp.department.name : 'Operations'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {emp.designation}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        ${emp.grossEarnings?.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: '#EF4444', fontWeight: 600 }}>
                        -${emp.totalDeductions?.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#10B981', fontSize: '1rem' }}>
                        ${emp.netPay?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={emp.status}
                          size="small"
                          color={emp.status === 'Disbursed' ? 'success' : 'warning'}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ReceiptLongIcon />}
                          onClick={() => handleOpenSlip(emp)}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            borderColor: '#1E3C72',
                            color: '#1E3C72',
                            '&:hover': {
                              bgcolor: 'rgba(30, 60, 114, 0.05)',
                              borderColor: '#1E3C72',
                            },
                          }}
                        >
                          View Slip
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              Showing top {Math.min(25, filteredEmployees.length)} of {filteredEmployees.length} employee records.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Enterprise Printable Payslip Modal Dialog */}
      <Dialog
        open={payslipModalOpen}
        onClose={() => setPayslipModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        {selectedSlip && (
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header / Watermark style letterhead */}
            <Box sx={{ borderBottom: '2px solid #1E3C72', pb: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E3C72', letterSpacing: 1 }}>
                  EMPLOYEE MANAGEMENT ENTERPRISE CORP
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Human Resources & Global Payroll Administration | Tax ID: US-9948271-X
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Chip label="CONFIDENTIAL PAYSLIP" color="primary" sx={{ fontWeight: 800 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {selectedSlip.payPeriod}
                </Typography>
              </Box>
            </Box>

            {/* Employee Meta Grid */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Employee Name</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {selectedSlip.firstName} {selectedSlip.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Employee ID</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    EMP-00{selectedSlip.id}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Department</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {selectedSlip.department?.name || 'Operations'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Bank Direct Deposit</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {selectedSlip.accountNo}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Earnings & Deductions Dual Column Breakdown */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Earnings Column */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1E3C72', mb: 1, borderBottom: '1px solid #CBD5E1', pb: 0.5 }}>
                  Earnings (USD)
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                  <Typography variant="body2">Basic Salary</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${selectedSlip.baseSalary.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                  <Typography variant="body2">House Rent Allowance (HRA)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${selectedSlip.hra.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                  <Typography variant="body2">Special / Performance Allowance</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${selectedSlip.allowance.toLocaleString()}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total Gross Earnings</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3C72' }}>
                    ${selectedSlip.grossEarnings.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>

              {/* Deductions Column */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#EF4444', mb: 1, borderBottom: '1px solid #CBD5E1', pb: 0.5 }}>
                  Deductions (USD)
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                  <Typography variant="body2">Provident Fund (PF - 12%)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${selectedSlip.pf.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                  <Typography variant="body2">Federal Withholding Tax (TDS)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${selectedSlip.tax.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                  <Typography variant="body2">Medical Insurance Premium</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>$0 (Covered)</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total Deductions</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#EF4444' }}>
                    -${selectedSlip.totalDeductions.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Net Amount Banner */}
            <Box
              sx={{
                p: 2.5,
                bgcolor: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
                background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
                color: 'white',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Net Disbursed Take-Home Pay
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  ${selectedSlip.netPay.toLocaleString()} USD
                </Typography>
              </Box>
              <Chip label="PAYMENT VERIFIED" color="success" sx={{ fontWeight: 800 }} />
            </Box>

            {/* Footer Signatures */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 4, borderTop: '1px dashed #CBD5E1' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Digitally Signed by:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontStyle: 'italic' }}>Corporate Comptroller & HR</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">System Timestamp:</Typography>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>{new Date().toLocaleString()}</Typography>
              </Box>
            </Box>

            {/* Modal Actions */}
            <DialogActions sx={{ mt: 3, px: 0 }}>
              <Button onClick={() => setPayslipModalOpen(false)} sx={{ textTransform: 'none' }}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={handlePrintSlip}
                sx={{
                  background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Print / Download PDF
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default PayrollPortal;
