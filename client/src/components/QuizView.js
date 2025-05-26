import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock data - replace with API call
const quizData = {
  id: 1,
  title: 'HTML Forms and Input Quiz',
  description: 'Test your knowledge of HTML forms and input elements.',
  timeLimit: 30, // minutes
  questions: [
    {
      id: 1,
      question: 'What is the correct HTML element for creating a text input?',
      options: ['<input>', '<text>', '<textfield>', '<input type="text">'],
      correctAnswer: 3
    },
    {
      id: 2,
      question: 'Which HTML attribute specifies that an input field must be filled out?',
      options: ['placeholder', 'required', 'validate', 'mandatory'],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'What is the correct HTML element for creating a dropdown list?',
      options: ['<list>', '<dropdown>', '<select>', '<option>'],
      correctAnswer: 2
    }
  ]
};

const QuizView = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit * 60); // Convert to seconds

  // Timer effect
  React.useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, showResults]);

  const handleAnswerChange = (event) => {
    setAnswers({
      ...answers,
      [currentQuestion]: parseInt(event.target.value)
    });
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: quizData.questions.length,
      percentage: (correct / quizData.questions.length) * 100
    };
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Quiz Results
          </Typography>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" color="primary">
              {score.percentage}%
            </Typography>
            <Typography variant="h6">
              You got {score.correct} out of {score.total} questions correct
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {quizData.questions.map((question, index) => (
              <Grid item xs={12} key={question.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Question {index + 1}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {question.question}
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {question.options.map((option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          control={
                            <Radio
                              checked={answers[index] === optionIndex}
                              disabled
                              sx={{
                                color: optionIndex === question.correctAnswer
                                  ? 'success.main'
                                  : answers[index] === optionIndex
                                  ? 'error.main'
                                  : 'default'
                              }}
                            />
                          }
                          label={option}
                        />
                      ))}
                    </Box>
                    {answers[index] !== question.correctAnswer && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Correct answer: {question.options[question.correctAnswer]}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/courses/${courseId}`)}
            >
              Back to Course
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">
            {quizData.title}
          </Typography>
          <Typography variant="h6" color="primary">
            Time Left: {formatTime(timeLeft)}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={(currentQuestion / quizData.questions.length) * 100}
          sx={{ mb: 4 }}
        />

        <Typography variant="h6" gutterBottom>
          Question {currentQuestion + 1} of {quizData.questions.length}
        </Typography>

        <Typography variant="body1" paragraph>
          {quizData.questions[currentQuestion].question}
        </Typography>

        <FormControl component="fieldset">
          <RadioGroup
            value={answers[currentQuestion]?.toString() || ''}
            onChange={handleAnswerChange}
          >
            {quizData.questions[currentQuestion].options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index.toString()}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          {currentQuestion < quizData.questions.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== quizData.questions.length}
            >
              Submit Quiz
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizView; 