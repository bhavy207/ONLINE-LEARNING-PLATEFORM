import React from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    title: 'Interactive Learning',
    description: 'Engage with interactive lessons and quizzes to enhance your learning experience.',
    image: 'https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg'
  },
  {
    title: 'Expert Instructors',
    description: 'Learn from industry experts and experienced professionals in their fields.',
    image: 'https://images.pexels.com/photos/5905717/pexels-photo-5905717.jpeg'
  },
  {
    title: 'Flexible Schedule',
    description: 'Learn at your own pace with 24/7 access to course materials.',
    image: 'https://images.pexels.com/photos/5905708/pexels-photo-5905708.jpeg'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Online Learning Platform
          </Typography>
          <Typography variant="h5" paragraph>
            Enhance your skills with our comprehensive online courses
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate(user ? '/courses' : '/register')}
            sx={{ mt: 2 }}
          >
            {user ? 'Browse Courses' : 'Get Started'}
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 