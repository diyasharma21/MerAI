"use client"
import { generateQuiz, saveQuizResult  } from '@/actions/interview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useFetch from '@/hooks/use-fetch';
import { LoaderCircle } from 'lucide-react';
import {useEffect, useState} from 'react'
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';
import QuizResult from './quiz-result';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
        setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowExplanation(false); // reset explanation for next question
    } else {
        finishQuiz();
    }
  };

  const calulateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
        if (answer === quizData[index].correctAnswer) {
            correct++;
        }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calulateScore();
    try {
        await saveQuizResultFn(quizData, answers, score);
        toast.success("Quiz Completed!");
    } catch (error) {
        toast.error(error.message || "Failed to Save Quiz Results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  if (generatingQuiz) {
    return <BarLoader className='mt-4' width={"100%"} color='pink'/>
  }

  if (resultData) {
    return (
        <div className='mx-2'>
            <QuizResult result={resultData} onStartNew={startNewQuiz} />
        </div>
    )
  }

  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Up for the Challenge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Here are 10 questions crafted specifically for your area of expertise.
            Take your time, answer thoughtfully, and see how well you can perform.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={generateQuizFn} className="w-full">
            Begin the Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle> Question {currentQuestion + 1} of {quizData.length} </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">
          {question.question}
        </p>

        <RadioGroup
          className="space-y-2"
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
        >
          {question.options.map((option, index) => (
            <div className="flex items-center space-x-2" key={index}>
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className='mt-4 p-4 bg-muted rounded-lg'>
            <p className='font-medium'>Explanation:</p>
            <p className='text-muted-foreground'>{question.explanation}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            Show Explanation
          </Button>
        )}

        <Button
          onClick={handleNext}
          className="ml-auto"
          disabled={!answers[currentQuestion] || savingResult}
        >
          {savingResult && (
            <LoaderCircle className='mt-4' width={"100%"} color='pink' />
          )}
          {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Quiz;
