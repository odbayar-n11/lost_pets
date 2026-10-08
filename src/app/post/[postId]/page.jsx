"use client"
import { useParams, useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/client"
import { useEffect, useState } from "react"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = supabaseClient()

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    if (params?.quizId) {
      const getQuiz = async () => {
        const { data, error } = await supabase
          .from("quizQuestions")
          .select("*, questionOptions(*)")
          .eq("quizId", params.quizId)

        if (!error && data) {
          setQuestions(data)
        }
      }
      getQuiz()
    }
  }, [params?.quizId])

  const handleAnswer = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    let score = 0
    let total = 0

    questions.forEach((q) => {
      const point = q.point || 0
      total += point

      const chosenOptionId = answers[q.id]
      const correctOption = q.questionOptions?.find((option) => option.isCorrect)

      if (correctOption && chosenOptionId === correctOption.id) {
        score += point
      }
    })

    // Navigate to the results page with score and total as query params
    router.push(`/quiz/${params.quizId}/result?score=${score}&total=${total}`)
  }

  if (questions.length === 0) {
    return <div className="p-6 text-center">Loading quiz...</div>
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Step Indicator */}
      <div className="text-sm text-muted-foreground font-medium">
        Question {currentIndex + 1} of {questions.length}
      </div>

      {/* Single Question Display */}
      <div className="space-y-4 rounded-lg border p-4">
        <div className="font-semibold">{currentQuestion.question}</div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Points: {currentQuestion.point}</span>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Pick the correct answer:</p>
          {currentQuestion.questionOptions?.map((option) => (
            <div key={option.id} className="flex items-center gap-2">
              <input
                type="radio"
                id={`q-${currentQuestion.id}-opt-${option.id}`}
                name={`correct-${currentQuestion.id}`}
                checked={answers[currentQuestion.id] === option.id}
                onChange={() => handleAnswer(currentQuestion.id, option.id)}
              />
              <label htmlFor={`q-${currentQuestion.id}-opt-${option.id}`}>
                {option.option}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation & Submit Buttons */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded border px-4 py-2 text-sm disabled:opacity-50"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="rounded bg-black px-4 py-2 text-sm text-white"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded bg-green-600 px-4 py-2 text-sm text-white"
          >
            Check your score
          </button>
        )}
      </div>
    </div>
  )
}