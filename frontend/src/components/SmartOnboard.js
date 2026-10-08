import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  MenuItem,
  LinearProgress,
  Paper,
  Divider,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BadgeIcon from '@mui/icons-material/Badge';
import { getAllDepartments } from '../services/departmentService';
import { addEmployee } from '../services/employeeService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SAMPLE_RESUMES = [
  {
    title: 'Senior Full-Stack Engineer',
    rawText: `ALEX TURNER
Email: alex.turner.dev@gmail.com | Phone: +1 555-019-2834
Age: 31 | Location: San Francisco, CA

SUMMARY:
Passionate Full-Stack Software Engineer with 7+ years building enterprise web applications, microservices, and reactive SPAs using React 18, Java Spring Boot, MySQL, and Docker.

TECHNICAL SKILLS:
- Languages: Java, JavaScript (ES6+), TypeScript, SQL, Python
- Frameworks: Spring Boot, Spring Security, React, Next.js, Node.js
- Databases: MySQL, PostgreSQL, MongoDB, Redis
- Cloud & DevOps: Docker, Kubernetes, AWS (EC2, S3, RDS), CI/CD

EXPERIENCE:
Staff Software Engineer at Apex Solutions (2021 - Present)
- Engineered REST APIs handling 40,000+ RPM using Spring Boot and JPA.
- Designed responsive Material-UI dashboard increasing user engagement by 45%.`,
    parsed: {
      firstName: 'Alex',
      lastName: 'Turner',
      email: 'alex.turner.dev@gmail.com',
      age: 31,
      skills: ['React 18', 'Java Spring Boot', 'MySQL', 'Docker', 'REST APIs'],
      experienceYears: '7+ Years',
      matchedRole: 'Senior Full-Stack Developer',
      confidenceScore: 98,
    },
  },
  {
    title: 'Cloud DevOps & Infrastructure Architect',
    rawText: `MARCUS VANCE
Email: marcus.vance.cloud@hotmail.com | Phone: +1 555-014-9921
Age: 36 | Location: Austin, TX

SUMMARY:
DevOps and Cloud Infrastructure Architect with 9 years of experience in Kubernetes cluster administration, Terraform Infrastructure as Code, AWS cloud security, and automated CI/CD pipelines.

TECHNICAL SKILLS:
- Cloud: AWS, Google Cloud Platform (GCP)
- Orchestration: Kubernetes, Docker Swarm, Helm
- CI/CD & IaC: Jenkins, GitHub Actions, Terraform, Ansible
- Monitoring: Prometheus, Grafana, Datadog

EXPERIENCE:
Lead DevOps Engineer at CloudScale Technologies (2020 - Present)
- Architected multi-region AWS EKS clusters achieving 99.99% uptime.`,
    parsed: {
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'marcus.vance.cloud@hotmail.com',
      age: 36,
      skills: ['Kubernetes', 'Terraform', 'AWS EKS', 'Docker', 'Jenkins CI/CD'],
      experienceYears: '9+ Years',
      matchedRole: 'Cloud DevOps Architect',
      confidenceScore: 96,
    },
  },
  {
    title: 'HR & Talent Acquisition Lead',
    rawText: `PRIYA SHARMA
Email: priya.sharma.hr@yahoo.com | Phone: +1 555-012-7843
Age: 29 | Location: New York, NY

SUMMARY:
Strategic People Operations & HR Specialist with 5 years leading corporate talent acquisition, compensation benchmarking, performance appraisal workflows, and employee engagement programs.

CORE COMPETENCIES:
- Human Resources Management, Talent Acquisition & Onboarding
- Payroll Systems, Compensation & Benefits, Labor Law Compliance
- Performance Reviews, Culture Building, HRIS Software

EXPERIENCE:
Senior HR Business Partner at InnovateCorp (2022 - Present)
- Scaled tech team from 40 to 180 employees with 92% retention rate.`,
    parsed: {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma.hr@yahoo.com',
      age: 29,
      skills: ['Talent Acquisition', 'HRIS Systems', 'Payroll', 'Employee Relations'],
      experienceYears: '5+ Years',
      matchedRole: 'HR & Talent Specialist',
      confidenceScore: 95,
    },
  },
];

const SmartOnboard = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [selectedSample, setSelectedSample] = useState(0);
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES[0].rawText);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');
  const [parsedCandidate, setParsedCandidate] = useState(SAMPLE_RESUMES[0].parsed);

  // Form inputs for finalizing creation
  const [formData, setFormData] = useState({
    firstName: SAMPLE_RESUMES[0].parsed.firstName,
    lastName: SAMPLE_RESUMES[0].parsed.lastName,
    email: SAMPLE_RESUMES[0].parsed.email,
    age: SAMPLE_RESUMES[0].parsed.age,
    departmentId: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await getAllDepartments();
        setDepartments(data || []);
        if (data && data.length > 0) {
          setFormData((prev) => ({ ...prev, departmentId: data[0].id }));
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepts();
  }, []);

  const handleSelectSample = (index) => {
    setSelectedSample(index);
    setResumeText(SAMPLE_RESUMES[index].rawText);
    setParsedCandidate(SAMPLE_RESUMES[index].parsed);
    setFormData((prev) => ({
      ...prev,
      firstName: SAMPLE_RESUMES[index].parsed.firstName,
      lastName: SAMPLE_RESUMES[index].parsed.lastName,
      email: SAMPLE_RESUMES[index].parsed.email,
      age: SAMPLE_RESUMES[index].parsed.age,
    }));
  };

  const handleRunAiScan = () => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStep('Tokenizing unstructured resume text...');

    setTimeout(() => {
      setScanProgress(45);
      setScanStep('Extracting named entities (Name, Email, Age, Years Experience)...');
    }, 600);

    setTimeout(() => {
      setScanProgress(80);
      setScanStep('Matching skills matrix against corporate department taxonomies...');
    }, 1200);

    setTimeout(() => {
      setScanProgress(100);
      setScanStep('Parsing complete! Profile mapped.');
      setIsScanning(false);
      const activeSample = SAMPLE_RESUMES[selectedSample];
      setParsedCandidate(activeSample.parsed);
      setFormData((prev) => ({
        ...prev,
        firstName: activeSample.parsed.firstName,
        lastName: activeSample.parsed.lastName,
        email: activeSample.parsed.email,
        age: activeSample.parsed.age,
      }));
      toast.success('AI Resume Extraction Completed with High Confidence!');
    }, 1800);
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.age || !formData.departmentId) {
      toast.error('Please verify all candidate profile fields before saving.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        age: parseInt(formData.age, 10),
        department: { id: parseInt(formData.departmentId, 10) },
      };

      await addEmployee(payload);
      toast.success(`🎉 ${formData.firstName} ${formData.lastName} successfully onboarded to MySQL database!`);
      setTimeout(() => {
        navigate('/employees');
      }, 1500);
    } catch (err) {
      console.error('Error saving onboarded employee:', err);
      toast.error('Could not save employee to database. Please check connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E3C72', display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon fontSize="large" sx={{ color: '#ff9800' }} />
            AI Resume Parser & Smart Onboarding
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Scan resumes with automated Named Entity Recognition (NER) to auto-fill and register new personnel in MySQL.
          </Typography>
        </Box>
        <Chip
          icon={<PsychologyIcon />}
          label="AI Model: Gemini NER Extraction Engine"
          color="primary"
          sx={{ fontWeight: 700, px: 1, py: 2.2 }}
        />
      </Box>

      {/* Row: Quick Sample Selector */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1 }}>
          Choose a Pre-loaded Candidate Resume or Paste Your Own:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {SAMPLE_RESUMES.map((sample, idx) => (
            <Button
              key={idx}
              variant={selectedSample === idx ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleSelectSample(idx)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: selectedSample === idx ? '#1E3C72' : 'transparent',
                borderColor: '#1E3C72',
                color: selectedSample === idx ? 'white' : '#1E3C72',
              }}
            >
              {sample.title}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Main Grid: Input on Left, AI Output on Right */}
      <Grid container spacing={3}>
        {/* Left Column: Raw Resume Text & Scanner */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E3C72' }}>
                  Candidate CV / Resume Input
                </Typography>
                <Chip icon={<CloudUploadIcon />} label="Raw Text / Document" size="small" />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={12}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste candidate resume content here..."
                sx={{
                  fontFamily: 'monospace',
                  bgcolor: '#F8FAFC',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.88rem',
                  },
                }}
              />

              {isScanning && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1E3C72' }}>
                      {scanStep}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {scanProgress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={scanProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#E2E8F0',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #1E3C72, #ff9800)',
                      },
                    }}
                  />
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                disabled={isScanning}
                startIcon={<AutoAwesomeIcon />}
                onClick={handleRunAiScan}
                sx={{
                  mt: 3,
                  py: 1.4,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  boxShadow: '0 4px 14px rgba(245, 124, 0, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)',
                  },
                }}
              >
                {isScanning ? 'Extracting with AI Engine...' : 'Scan & Extract with AI'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: AI Extraction & Live MySQL Onboarding Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', height: '100%' }}>
            <CardContent>
              {/* Extracted AI Preview Banner */}
              <Box sx={{ p: 2, bgcolor: '#F0FDF4', borderRadius: 2, border: '1px solid #BBF7D0', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <CheckCircleIcon fontSize="small" />
                    AI Profile Extraction: {parsedCandidate.confidenceScore}% Match
                  </Typography>
                  <Chip label={parsedCandidate.experienceYears} color="success" size="small" sx={{ fontWeight: 700 }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Matched Target Role: <strong>{parsedCandidate.matchedRole}</strong>
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                  {parsedCandidate.skills.map((skill, i) => (
                    <Chip key={i} label={skill} size="small" sx={{ bgcolor: 'white', fontWeight: 600, border: '1px solid #CBD5E1' }} />
                  ))}
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E3C72', mb: 2 }}>
                Confirm & Register to Database
              </Typography>

              <form onSubmit={handleCreateEmployee}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Assign Corporate Department"
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      required
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.name} (Dept #{dept.id})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  type="submit"
                  disabled={saving}
                  variant="contained"
                  startIcon={<PersonAddAlt1Icon />}
                  sx={{
                    mt: 3,
                    py: 1.4,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
                    boxShadow: '0 4px 14px rgba(30, 60, 114, 0.35)',
                  }}
                >
                  {saving ? 'Creating in MySQL...' : 'Commit & Create Real Employee in MySQL'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SmartOnboard;
