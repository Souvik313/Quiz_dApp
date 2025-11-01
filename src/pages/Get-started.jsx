import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const quizTopics = [
  {
    title: "General Knowledge",
    type: "Multiple Choice",
    difficulty: "Easy",
    questions: 15,
    time: "10 min",
    color: "#4e54c8",
  },
  {
    title: "Science & Technology",
    type: "True/False",
    difficulty: "Medium",
    questions: 12,
    time: "8 min",
    color: "#8f94fb",
  },
  {
    title: "History",
    type: "Multiple Choice",
    difficulty: "Medium",
    questions: 10,
    time: "7 min",
    color: "#ffd700",
  },
  {
    title: "Sports",
    type: "Mixed",
    difficulty: "Easy",
    questions: 20,
    time: "12 min",
    color: "#ff6f61",
  },
  {
    title: "Programming",
    type: "Multiple Choice",
    difficulty: "Hard",
    questions: 10,
    time: "15 min",
    color: "green",
  },
  {
    title: "Movies & TV",
    type: "True/False",
    difficulty: "Hard",
    questions: 14,
    time: "9 min",
    color: "#ff4500",
  },
];

export const GetStarted = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [allTopics, setAllTopics] = useState(quizTopics);
  const [numberOfQuizzes, setNumberOfQuizzes] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("userQuizzes") || "[]");
      if (Array.isArray(stored) && stored.length > 0) {
        setAllTopics([...quizTopics, ...stored]);
      } else {
        setAllTopics(quizTopics);
      }
    } catch (_) {
      setAllTopics(quizTopics);
    }
  }, []);

  
  const filteredTopics = () => {
    if (selectedTopic === "" && difficulty === "") {
      return allTopics;
    } else if (difficulty !== "" && selectedTopic === "") {
      return allTopics.filter(
        (topic) => topic.difficulty.toLowerCase() === difficulty
      );
    } else if (difficulty === "" && selectedTopic !== "") {
      return allTopics.filter(
        (topic) =>
          topic.title.toLowerCase().replace(/ /g, "-") === selectedTopic
      );
    }
    return allTopics.filter(
      (topic) =>
        topic.difficulty.toLowerCase() === difficulty &&
        topic.title.toLowerCase().replace(/ /g, "-") === selectedTopic
    );
  };

  return (
    <main className="about-main">
      <div className="body-container transparent-bg">
        <h1>Choose Your Quiz Topic</h1>
        <select
          name="quiz-topic"
          id="quiz-topic"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ffd700",
            background: "rgba(30,32,40,0.35)",
            color: "#fff",
            fontSize: "1rem",
            marginBottom: "24px",
            marginRight: "16px",
          }}
        >
          <option value="" disabled>
            __Select a topic__
          </option>
          {allTopics.map((topic, index) => (
            <option
              key={index}
              value={topic.title.toLowerCase().replace(/ /g, "-")}
            >
              {topic.title}
            </option>
          ))}
        </select>
        <select
          name="quiz-difficulty"
          id="quiz-difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ffd700",
            background: "rgba(30,32,40,0.35)",
            color: "#fff",
            fontSize: "1rem",
            marginBottom: "24px",
          }}
        >
          <option value="" disabled>
            __Select difficulty__
          </option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: "32px",
        }}
        >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "50px",
            justifyItems: "center",
            alignItems: "center",
            marginTop: "32px",
            width: "100%",
            maxWidth: "1400px",
          }}
        >
          {filteredTopics().map((topic, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(30,32,40,0.7)",
                borderRadius: "16px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                padding: "28px 32px",
                minWidth: "400px",
                maxWidth: "450px",
                color: topic.color,
                border: `2px solid ${topic.color}`,
                textAlign: "center",
                transition: "transform 0.2s",
                cursor: "pointer",
              }}
              onClick={() =>{
                navigate(`/quiz/${topic.title.toLowerCase().replace(/ /g, "-")}`);
                setNumberOfQuizzes(prevNumberOfQuizzes => prevNumberOfQuizzes + 1);
                localStorage.setItem("numberofquizzes", numberOfQuizzes);
              }}
            >
              <h2 style={{ marginBottom: "12px", color: topic.color }}>
                {topic.title}
              </h2>
              <p style={{ color: "#fff", fontWeight: "bold" }}>
                Type: {topic.type}
              </p>
              <p style={{ color: "#fff" }}>Difficulty: {topic.difficulty}</p>
              <p style={{ color: "#fff" }}>Questions: {topic.questions}</p>
              <p style={{ color: "#fff" }}>Time: {topic.time}</p>
              <button
                style={{
                  marginTop: "16px",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: topic.color,
                  color: "#181920",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "32px",
          }}
        >
          <button
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              background: "#ffd700",
              color: "#181920",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onClick = {() => navigate("/create-quiz")}
          >
            <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>+</span>
            Create quiz
          </button>
        </div>
      </div>
    </main>
  );
};
