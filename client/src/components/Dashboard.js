import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - replace with actual data from API
  const enrolledCourses = [
    { id: 1, title: 'Introduction to Web Development', progress: 75 },
    { id: 2, title: 'Advanced JavaScript', progress: 30 },
    { id: 3, title: 'React Fundamentals', progress: 50 }
  ];

  const upcomingAssignments = [
    { id: 1, title: 'Final Project Submission', dueDate: '2024-04-15' },
    { id: 2, title: 'Quiz: React Hooks', dueDate: '2024-04-10' }
  ];

  const achievements = [
    { id: 1, title: 'First Course Completed', date: '2024-03-20' },
    { id: 2, title: 'Perfect Quiz Score', date: '2024-03-25' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      <Grid container spacing={3}>
        {/* Enrolled Courses */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Courses
            </Typography>
            <List>
              {enrolledCourses.map((course) => (
                <React.Fragment key={course.id}>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={course.title}
                      secondary={`Progress: ${course.progress}%`}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      Continue
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Assignments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Assignments
            </Typography>
            <List>
              {upcomingAssignments.map((assignment) => (
                <React.Fragment key={assignment.id}>
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={assignment.title}
                      secondary={`Due: ${assignment.dueDate}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Achievements
            </Typography>
            <List>
              {achievements.map((achievement) => (
                <React.Fragment key={achievement.id}>
                  <ListItem>
                    <ListItemIcon>
                      <EmojiEventsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={achievement.title}
                      secondary={`Earned on: ${achievement.date}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 