import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findQuizBySlug } from "../data/quizes.js";

export const Quiz = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const quiz = useMemo(() => findQuizBySlug(slug), [slug]);
  const [secondsLeft, setSecondsLeft] = useState(getInitialSeconds(quiz?.time));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!quiz) {
      navigate("/get-started");
    }
  }, [quiz, navigate]);

  useEffect(() => {
    if(done) return;
    if(secondsLeft<=0){
      setDone(true);
      return;
    }
    const intervalId = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev-1 : 0))
    }, 1000);
    return () => clearInterval(intervalId);
  }, [secondsLeft, done]);

      useEffect(() => {
        if(secondsLeft === 120){
            alert(`Quiz is about to end in ${Math.floor(secondsLeft/60)} minutes`);
        }
    },[secondsLeft]);

  function getInitialSeconds(time){
    if(typeof time === "number"){
      return time*60;
    }
    if(typeof time === "string"){
      const mins = parseInt(time.split(" ")[0]);
      return mins*60;
    }
    return 0;
  }
 
  function formatTimer(seconds){
    const mins = Math.floor(seconds/60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  if (!quiz) return null;

  const q = quiz.questions[current];
  
  function answerStatus(index){
      setSelected(index);
      setIsAnswered(true);
  }
  const optionList = q.options.map((opt, index) => {
      let buttonStyle = {
        width: "100%", 
        padding: "10px 18px", 
        borderRadius: "8px", 
        border: "none", 
        background: "#fff", 
        color: "#181920", 
        fontWeight: "bold",
        cursor: isAnswered ? "not-allowed" : "pointer",
        opacity: 1
      };

      if (isAnswered) {
        if (opt.isCorrect) {
          buttonStyle.background = "#4CAF50"; // Green for correct
          buttonStyle.color = "#fff";
        } else if (index === selected && !opt.isCorrect) {
          buttonStyle.background = "#f44336"; // Red for wrong selected
          buttonStyle.color = "#fff";
        }
      }

      return (
        <button 
          key={opt.id}
          onClick={() => answerStatus(index)} 
          disabled={isAnswered} 
          style={buttonStyle}
        >
          {opt.text}
        </button>
      )
  })
  const submit = () => {
    if (selected === null) return;
    const isCorrect = q.options[selected].isCorrect === true;
    if (isCorrect) setScore((s) => s + 1);
    if (current + 1 < quiz.questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setIsAnswered(false);
    setScore(0);
    setDone(false);
    setSecondsLeft(getInitialSeconds(quiz.time));
  };

  return (
    <main className="about-main">
      <div className="body-container transparent-bg" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1>{quiz.title}</h1>
        
        {!done ? (
            <div>
            <p style={{ color: "#ffd700" , background: "blue", padding: "8px 12px", borderRadius: "8px" , width: "fit-content", display: "flex" , justifyContent: "center", alignItems: "center" , marginLeft: "325px", marginTop: "20px"}}>Timer: {formatTimer(secondsLeft)}</p>
          
            <p style={{ color: "#ffd700" , marginBottom: "10px"}}>
              Question {current + 1} of {quiz.questions.length}
            </p>
            <h2 style={{ marginBottom: "16px" }}>{q.question}</h2>
            <div style={{ display: "grid", gap: "12px" }}>
              {optionList}
            </div>
            <button
              onClick={submit}
              style={{ marginTop: "16px", padding: "10px 18px", borderRadius: "8px", border: "none", background: quiz.color, color: "#181920", fontWeight: "bold" }}
            >
              {current + 1 === quiz.questions.length ? "Finish" : "Next"}
            </button>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h2 style={{
                color: "#ff2800",
                margin: "10px"
            }}>Quiz completed in {formatTimer(getInitialSeconds(quiz.time) - secondsLeft)}</h2>
            <h2>Score: {score} / {quiz.questions.length}</h2>
            <button
              onClick={restart}
              style={{ marginTop: "25px", padding: "10px 18px", borderRadius: "8px", border: "none", background: quiz.color, color: "#181920", fontWeight: "bold" }}
            >
              Restart
            </button>
            <button onClick = {() => navigate("/get-started")} style={{ marginTop: "25px", marginLeft: "16px",padding: "10px 18px", borderRadius: "8px", border: "none", background: quiz.color, color: "#181920", fontWeight: "bold" }}>Explore more</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Quiz;

