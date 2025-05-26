import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PlayCircleOutline as PlayIcon,
  Quiz as QuizIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReactPlayer from 'react-player';

// Mock data - replace with API call
const courseData = {
  id: 1,
  title: 'Introduction to Web Development',
  lessons: [
    {
      id: 1,
      title: 'Introduction to HTML',
      type: 'video',
      duration: '45 minutes',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with actual video URL
      description: 'Learn the basics of HTML and how to create your first web page.',
      resources: [
        {
          title: 'HTML Cheat Sheet',
          type: 'pdf',
          url: '#'
        },
        {
          title: 'Practice Exercise',
          type: 'doc',
          url: '#'
        }
      ]
    },
    {
      id: 2,
      title: 'HTML Elements and Attributes',
      type: 'video',
      duration: '60 minutes',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Explore different HTML elements and their attributes.',
      resources: [
        {
          title: 'Elements Reference',
          type: 'pdf',
          url: '#'
        }
      ]
    },
    {
      id: 3,
      title: 'HTML Forms and Input',
      type: 'quiz',
      duration: '30 minutes',
      description: 'Test your knowledge of HTML forms and input elements.',
      questions: [
        {
          question: 'What is the correct HTML element for creating a text input?',
          options: ['<input>', '<text>', '<textfield>', '<input type="text">'],
          correctAnswer: 0
        }
      ]
    }
  ]
};

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const currentLessonIndex = courseData.lessons.findIndex(
    (lesson) => lesson.id === parseInt(lessonId)
  );
  const currentLesson = courseData.lessons[currentLessonIndex];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < courseData.lessons.length - 1) {
      navigate(`/courses/${courseId}/lessons/${courseData.lessons[currentLessonIndex + 1].id}`);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      navigate(`/courses/${courseId}/lessons/${courseData.lessons[currentLessonIndex - 1].id}`);
    }
  };

  const drawer = (
    <Box sx={{ width: 280, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Course Content
      </Typography>
      <List>
        {courseData.lessons.map((lesson, index) => (
          <React.Fragment key={lesson.id}>
            <ListItem
              button
              selected={lesson.id === parseInt(lessonId)}
              onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
            >
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
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open={drawerOpen}
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              position: 'relative'
            }
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          {/* Video/Content Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h5">
                  {currentLesson.title}
                </Typography>
              </Box>

              {currentLesson.type === 'video' ? (
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <ReactPlayer
                    url={currentLesson.videoUrl}
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    controls
                  />
                </Box>
              ) : (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Quiz: {currentLesson.title}
                  </Typography>
                  {/* Add quiz component here */}
                </Box>
              )}

              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" paragraph>
                  {currentLesson.description}
                </Typography>
              </Box>

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  startIcon={<ChevronLeftIcon />}
                  onClick={handlePreviousLesson}
                  disabled={currentLessonIndex === 0}
                >
                  Previous Lesson
                </Button>
                <Button
                  endIcon={<ChevronRightIcon />}
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === courseData.lessons.length - 1}
                >
                  Next Lesson
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Resources Section */}
          {currentLesson.resources && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Resources
                </Typography>
                <List>
                  {currentLesson.resources.map((resource, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={resource.title}
                          secondary={`Type: ${resource.type.toUpperCase()}`}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          href={resource.url}
                          target="_blank"
                        >
                          Download
                        </Button>
                      </ListItem>
                      {index < currentLesson.resources.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default LessonView; 