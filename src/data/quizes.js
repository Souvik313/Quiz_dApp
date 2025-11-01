export const defaultQuizzes = [
  {
    slug: "general-knowledge",
    title: "General Knowledge",
    type: "Multiple Choice",
    difficulty: "Easy",
    questionsCount: 15,
    time: "10 min",
    color: "#4e54c8",
    questions: [
      {
        id: "gk-q1",
        question: "What is the capital of France?",
        options: [
          { id: "gk-q1-o1", text: "Paris", isCorrect: true },
          { id: "gk-q1-o2", text: "London", isCorrect: false },
          { id: "gk-q1-o3", text: "Berlin", isCorrect: false },
          { id: "gk-q1-o4", text: "Madrid", isCorrect: false }
        ],
        explanation: "Paris is the capital of France"
      },
      {
        id: "gk-q2",
        question: "What is the capital of Germany?",
        options: [
          { id: "gk-q2-o1", text: "Berlin", isCorrect: true },
          { id: "gk-q2-o2", text: "Paris", isCorrect: false },
          { id: "gk-q2-o3", text: "Madrid", isCorrect: false },
          { id: "gk-q2-o4", text: "Rome", isCorrect: false }
        ],
        explanation: "Berlin is the capital of Germany"
      },
      {
        id: "gk-q3",
        question: "What is the capital of Italy?",
        options: [
          { id: "gk-q3-o1", text: "Rome", isCorrect: true },
          { id: "gk-q3-o2", text: "Paris", isCorrect: false },
          { id: "gk-q3-o3", text: "Madrid", isCorrect: false },
          { id: "gk-q3-o4", text: "Berlin", isCorrect: false }
        ],
        explanation: "Rome is the capital of Italy"
      },
      {
        id: "gk-q4",
        question: "Who is the prime minister of India?",
        options: [
          { id: "gk-q4-o1", text: "Narendra Modi", isCorrect: true },
          { id: "gk-q4-o2", text: "Rahul Gandhi", isCorrect: false },
          { id: "gk-q4-o3", text: "Arvind Kejriwal", isCorrect: false },
          { id: "gk-q4-o4", text: "Mamata Banerjee", isCorrect: false }
        ],
        explanation: "Narendra Modi is the prime minister of India"
      },
      {
        id: "gk-q5",
        question: "What is the term of service of the president of India?",
        options: [
          { id: "gk-q5-o1", text: "5 years", isCorrect: true },
          { id: "gk-q5-o2", text: "10 years", isCorrect: false },
          { id: "gk-q5-o3", text: "15 years", isCorrect: false }
        ],
        explanation: "5 years is the term of service of the president of India"
      },
      {
        id: "gk-q6",
        question: "Which is the largest ocean on Earth?",
        options: [
          { id: "gk-q6-o1", text: "Atlantic Ocean", isCorrect: false },
          { id: "gk-q6-o2", text: "Indian Ocean", isCorrect: false },
          { id: "gk-q6-o3", text: "Pacific Ocean", isCorrect: true },
          { id: "gk-q6-o4", text: "Arctic Ocean", isCorrect: false }
        ],
        explanation: "The Pacific Ocean is the largest and deepest ocean."
      },
      {
        id: "gk-q7",
        question: "Who wrote the play 'Romeo and Juliet'?",
        options: [
          { id: "gk-q7-o1", text: "Charles Dickens", isCorrect: false },
          { id: "gk-q7-o2", text: "William Shakespeare", isCorrect: true },
          { id: "gk-q7-o3", text: "Jane Austen", isCorrect: false },
          { id: "gk-q7-o4", text: "Mark Twain", isCorrect: false }
        ],
        explanation: "Shakespeare wrote it in the late 16th century."
      },
      {
        id: "gk-q8",
        question: "What is the chemical symbol for gold?",
        options: [
          { id: "gk-q8-o1", text: "Ag", isCorrect: false },
          { id: "gk-q8-o2", text: "Au", isCorrect: true },
          { id: "gk-q8-o3", text: "Gd", isCorrect: false },
          { id: "gk-q8-o4", text: "Pt", isCorrect: false }
        ],
        explanation: "Au comes from the Latin 'Aurum'."
      },
      {
        id: "gk-q9",
        question: "Which country has the largest population?",
        options: [
          { id: "gk-q9-o1", text: "United States", isCorrect: false },
          { id: "gk-q9-o2", text: "India", isCorrect: true },
          { id: "gk-q9-o3", text: "China", isCorrect: false },
          { id: "gk-q9-o4", text: "Indonesia", isCorrect: false }
        ],
        explanation: "India recently surpassed China in population."
      },
      {
        id: "gk-q10",
        question: "What is the hardest natural substance on Earth?",
        options: [
          { id: "gk-q10-o1", text: "Graphite", isCorrect: false },
          { id: "gk-q10-o2", text: "Diamond", isCorrect: true },
          { id: "gk-q10-o3", text: "Quartz", isCorrect: false },
          { id: "gk-q10-o4", text: "Corundum", isCorrect: false }
        ],
        explanation: "Diamond ranks highest on the Mohs scale."
        }    
    ]
  }
];

export function findQuizBySlug(slug) {
  const stored = JSON.parse(localStorage.getItem("userQuizzes") || "[]");
  const merged = [...defaultQuizzes, ...stored];
  return merged.find((q) => q.slug === slug);
}