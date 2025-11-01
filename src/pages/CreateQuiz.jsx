import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { quizTopics } from "./Get-started.jsx";
export const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizType, setQuizType] = useState("Multiple Choice");
  const [quizDifficulty, setQuizDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const createdAt = Date.now();
    const newQuiz = {
      title: quizTitle,
      type: quizType,
      difficulty: quizDifficulty,
      questions: Number(numQuestions),
      time: `${Number(timeLimit)} min`,
      color: "#00ffff",
      createdAt,
    };
    const existing = JSON.parse(localStorage.getItem("userQuizzes") || "[]");
    localStorage.setItem("userQuizzes", JSON.stringify([...existing, newQuiz]));
    setIsSubmitted(true);
    setQuizTitle("");
    setQuizType("Multiple Choice");
    setQuizDifficulty("Easy");
    setNumQuestions("");
    setTimeLimit(0);
    alert("Quiz created successfully!");
  };
  return (
    <main className="about-main">
      <div className="body-container transparent-bg">
        <h1>{!isSubmitted ? "Create your Quiz!" : "Quiz Created!"}</h1>
        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <input
              type="text"
              name="quizTitle"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ffd700",
                background: "rgba(30,32,40,0.35)",
                color: "#fff",
                fontSize: "1rem",
              }}
              required
            />
            <select
              name="quizType"
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ffd700",
                background: "rgba(30,32,40,0.35)",
                color: "#fff",
                fontSize: "1rem",
              }}
              required
            >
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="True/False">True/False</option>
              <option value="Mixed">Mixed</option>
            </select>
            <select
              name="quizDifficulty"
              value={quizDifficulty}
              onChange={(e) => setQuizDifficulty(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ffd700",
                background: "rgba(30,32,40,0.35)",
                color: "#fff",
                fontSize: "1rem",
              }}
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <input
              type="number"
              name="numQuestions"
              value={numQuestions ?? ""}
              onChange={(e) => setNumQuestions(e.target.value)}
              placeholder="Number of Questions"
              min="1"
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ffd700",
                background: "rgba(30,32,40,0.35)",
                color: "#fff",
                fontSize: "1rem",
              }}
              required
            />
            <input
              type="number"
              name="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="Time Limit (in minutes)"
              min="1"
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ffd700",
                background: "rgba(30,32,40,0.35)",
                color: "#fff",
                fontSize: "1rem",
              }}
              required
            />
            <button
              type="submit"
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#ffd700",
                color: "#000",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Create Quiz
            </button>
            <button
              onClick={() => navigate("/get-started")}
              type="submit"
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "red",
                color: "#000",
                fontWeight: "bold",
                cursor: "pointer",
              }}>
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsSubmitted(false)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#ffd700",
              color: "#000",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Create new Quiz
          </button>
          
        )}
      </div>
    </main>
  );
};
