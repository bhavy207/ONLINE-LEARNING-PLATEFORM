import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Rating,
  Chip,
  Avatar
} from '@mui/material';
import {
  PlayCircleOutline as PlayIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock data - replace with API call
const courseData = {
  id: 1,
  title: 'Introduction to Web Development',
  description: 'Learn the basics of web development including HTML, CSS, and JavaScript. This comprehensive course will take you from beginner to professional web developer.',
  instructor: {
    name: 'John Doe',
    avatar: 'https://source.unsplash.com/random/100x100?portrait',
    bio: 'Senior Web Developer with 10+ years of experience'
  },
  rating: 4.5,
  students: 1234,
  duration: '8 weeks',
  level: 'Beginner',
  category: 'Web Development',
  image: 'https://source.unsplash.com/random/1200x400?web',
  price: 49.99,
  lessons: [
    {
      id: 1,
      title: 'Introduction to HTML',
      duration: '45 minutes',
      type: 'video'
    },
    {
      id: 2,
      title: 'HTML Elements and Attributes',
      duration: '60 minutes',
      type: 'video'
    },
    {
      id: 3,
      title: 'HTML Forms and Input',
      duration: '30 minutes',
      type: 'quiz'
    }
  ],
  requirements: [
    'Basic computer knowledge',
    'No prior programming experience required',
    'A computer with internet connection'
  ],
  whatYouWillLearn: [
    'HTML5 fundamentals',
    'CSS3 styling and layout',
    'JavaScript basics',
    'Responsive web design',
    'Web development best practices'
  ]
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEnroll = () => {
    // TODO: Implement enrollment logic
    navigate(`/courses/${id}/lessons/1`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Course Header */}
      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        <Box
          sx={{
            height: 300,
            backgroundImage: `url(${courseData.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              p: 2
            }}
          >
            <Typography variant="h4" gutterBottom>
              {courseData.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating value={courseData.rating} readOnly />
              <Typography variant="body2">
                ({courseData.rating}) • {courseData.students} students
              </Typography>
              <Chip label={courseData.level} size="small" />
              <Chip label={courseData.duration} size="small" />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              About This Course
            </Typography>
            <Typography variant="body1" paragraph>
              {courseData.description}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Curriculum" />
              <Tab label="Requirements" />
              <Tab label="What You'll Learn" />
            </Tabs>

            <Box sx={{ mt: 2 }}>
              {activeTab === 0 && (
                <List>
                  {courseData.lessons.map((lesson, index) => (
                    <React.Fragment key={lesson.id}>
                      <ListItem>
                        <ListItemIcon>
                          {lesson.type === 'video' ? <PlayIcon /> : <QuizIcon />}
                        </ListItemIcon>
                        <ListItemText
                          primary={lesson.title}
                          secondary={lesson.duration}
                        />
                      </ListItem>
                      {index < courseData.lessons.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}

              {activeTab === 1 && (
                <List>
                  {courseData.requirements.map((requirement, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText primary={requirement} />
                      </ListItem>
                      {index < courseData.requirements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}

              {activeTab === 2 && (
                <List>
                  {courseData.whatYouWillLearn.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText primary={item} />
                      </ListItem>
                      {index < courseData.whatYouWillLearn.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Price
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              ${courseData.price}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleEnroll}
            >
              Enroll Now
            </Button>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Instructor
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={courseData.instructor.avatar}
                alt={courseData.instructor.name}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1">
                  {courseData.instructor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {courseData.instructor.bio}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetail; 