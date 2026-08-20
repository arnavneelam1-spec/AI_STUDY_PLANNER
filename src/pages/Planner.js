import { useEffect, useMemo, useState } from "react";
import { generateStudyPlan } from "../services/plannerEngine";
import {
  loadSubjects,
  saveSubjects,
} from "../services/storage";

const defaultSubjects = [
  {
    id: 1,
    name: "React",
    difficulty: "hard",
    examDate: "2026-08-22",
    progress: 35,
    dailyHours: 2,
  },
  {
    id: 2,
    name: "JavaScript",
    difficulty: "medium",
    examDate: "2026-08-25",
    progress: 65,
    dailyHours: 1.5,
  },
  {
    id: 3,
    name: "CSS",
    difficulty: "easy",
    examDate: "2026-08-28",
    progress: 80,
    dailyHours: 1,
  },
];

function Planner() {
  const [subjects, setSubjects] =
    useState(() =>
      loadSubjects(defaultSubjects)
    );

  const [name, setName] = useState("");
  const [difficulty, setDifficulty] =
    useState("medium");
  const [examDate, setExamDate] =
    useState("");
  const [progress, setProgress] =
    useState(0);
  const [dailyHours, setDailyHours] =
    useState(1);

  const [studyPlan, setStudyPlan] =
    useState(null);

  // Save whenever subjects change
  useEffect(() => {
    saveSubjects(subjects);
  }, [subjects]);

  const calculatePriority = (subject) => {
    const today = new Date();
    const exam = new Date(
      subject.examDate
    );

    const difference =
      exam.getTime() - today.getTime();

    const daysLeft = Math.max(
      1,
      Math.ceil(
        difference /
          (1000 * 60 * 60 * 24)
      )
    );

    const urgencyScore = Math.min(
      100,
      Math.round(
        (14 / daysLeft) * 100
      )
    );

    const difficultyScore =
      subject.difficulty === "hard"
        ? 100
        : subject.difficulty ===
          "medium"
          ? 60
          : 30;

    const progressScore =
      100 - Number(subject.progress);

    const priority = Math.round(
      urgencyScore * 0.45 +
        difficultyScore * 0.3 +
        progressScore * 0.25
    );

    let label;

    if (priority >= 75) {
      label = "HIGH PRIORITY";
    } else if (priority >= 45) {
      label = "MEDIUM PRIORITY";
    } else {
      label = "LOW PRIORITY";
    }

    return {
      priority,
      label,
      daysLeft,
    };
  };

  const rankedSubjects = useMemo(() => {
    return subjects
      .map((subject) => ({
        ...subject,
        analysis:
          calculatePriority(
            subject
          ),
      }))
      .sort(
        (a, b) =>
          b.analysis.priority -
          a.analysis.priority
      );
  }, [subjects]);

  const addSubject = (event) => {
    event.preventDefault();

    if (
      !name.trim() ||
      !examDate ||
      dailyHours <= 0
    ) {
      return;
    }

    const newSubject = {
      id: Date.now(),
      name: name.trim(),
      difficulty,
      examDate,
      progress:
        Number(progress),
      dailyHours:
        Number(dailyHours),
    };

    setSubjects((current) => [
      ...current,
      newSubject,
    ]);

    setName("");
    setDifficulty("medium");
    setExamDate("");
    setProgress(0);
    setDailyHours(1);
    setStudyPlan(null);
  };

  const removeSubject = (id) => {
    setSubjects((current) =>
      current.filter(
        (subject) =>
          subject.id !== id
      )
    );

    setStudyPlan(null);
  };

  const createStudyPlan = () => {
    const plan =
      generateStudyPlan(
        subjects
      );

    setStudyPlan(plan);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor:
          "#f8fafc",
        padding:
          "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#4f46e5",
              fontWeight: "700",
              fontSize: "13px",
            }}
          >
            SMART PLANNING
          </p>

          <h1
            style={{
              margin:
                "8px 0",
              fontSize: "36px",
              color:
                "#0f172a",
            }}
          >
            📚 Study Planner
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            Your subjects are now saved
            automatically in the browser.
          </p>
        </div>

        {/* Storage status */}
        <div
          style={{
            marginBottom: "20px",
            padding: "14px 16px",
            borderRadius: "12px",
            backgroundColor:
              "#ecfdf5",
            color: "#166534",
            border:
              "1px solid #bbf7d0",
          }}
        >
          💾 <strong>{subjects.length}</strong>{" "}
          subjects saved locally.
        </div>

        {/* Generator */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #312e81, #4f46e5)",
            color: "#ffffff",
            padding: "25px",
            borderRadius: "18px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: "20px",
              flexWrap:
                "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight:
                    "700",
                  color:
                    "#c7d2fe",
                }}
              >
                🧠 SMART PLANNER
              </p>

              <h2
                style={{
                  margin:
                    "6px 0 5px",
                }}
              >
                Generate today's plan
              </h2>

              <p
                style={{
                  margin: 0,
                  color:
                    "#e0e7ff",
                }}
              >
                Use your saved subjects to
                generate a prioritized study schedule.
              </p>
            </div>

            <button
              onClick={
                createStudyPlan
              }
              style={{
                border: "none",
                backgroundColor:
                  "#ffffff",
                color:
                  "#312e81",
                padding:
                  "13px 20px",
                borderRadius:
                  "10px",
                fontWeight:
                  "800",
                cursor:
                  "pointer",
              }}
            >
              🧠 Generate Plan
            </button>
          </div>
        </div>

        {/* Generated plan */}
        {studyPlan && (
          <div
            style={{
              backgroundColor:
                "#ffffff",
              padding:
                "25px",
              borderRadius:
                "18px",
              boxShadow:
                "0 4px 15px rgba(15,23,42,0.06)",
              marginBottom:
                "25px",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color:
                  "#0f172a",
              }}
            >
              🎯 Generated Study Plan
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              <div
                style={{
                  padding:
                    "20px",
                  backgroundColor:
                    "#f8fafc",
                  borderRadius:
                    "14px",
                }}
              >
                <h3>
                  📅 Today
                </h3>

                {studyPlan.today.map(
                  (task) => (
                    <div
                      key={task.id}
                      style={{
                        backgroundColor:
                          "#ffffff",
                        padding:
                          "14px",
                        borderRadius:
                          "10px",
                        marginBottom:
                          "10px",
                      }}
                    >
                      <strong>
                        {task.subject}
                      </strong>

                      <p
                        style={{
                          margin:
                            "5px 0",
                          color:
                            "#64748b",
                          fontSize:
                            "13px",
                        }}
                      >
                        {task.topic} •{" "}
                        {task.minutes} min
                      </p>

                      <small
                        style={{
                          color:
                            "#4f46e5",
                          fontWeight:
                            "700",
                        }}
                      >
                        Priority{" "}
                        {task.priority}
                      </small>
                    </div>
                  )
                )}
              </div>

              <div
                style={{
                  padding:
                    "20px",
                  backgroundColor:
                    "#f8fafc",
                  borderRadius:
                    "14px",
                }}
              >
                <h3>
                  🌅 Tomorrow
                </h3>

                {studyPlan.tomorrow.map(
                  (task) => (
                    <div
                      key={task.id}
                      style={{
                        backgroundColor:
                          "#ffffff",
                        padding:
                          "14px",
                        borderRadius:
                          "10px",
                        marginBottom:
                          "10px",
                      }}
                    >
                      <strong>
                        {task.subject}
                      </strong>

                      <p
                        style={{
                          margin:
                            "5px 0",
                          color:
                            "#64748b",
                          fontSize:
                            "13px",
                        }}
                      >
                        {task.topic} •{" "}
                        {task.minutes} min
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add subject + list */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Form */}
          <form
            onSubmit={
              addSubject
            }
            style={{
              backgroundColor:
                "#ffffff",
              padding:
                "25px",
              borderRadius:
                "18px",
              boxShadow:
                "0 4px 15px rgba(15,23,42,0.06)",
            }}
          >
            <h2>
              ➕ Add Subject
            </h2>

            <label
              style={{
                display:
                  "block",
                marginTop:
                  "18px",
                fontWeight:
                  "600",
              }}
            >
              Subject Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="e.g. React Hooks"
              style={{
                width:
                  "100%",
                padding:
                  "11px",
                marginTop:
                  "7px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #cbd5e1",
                boxSizing:
                  "border-box",
              }}
            />

            <label
              style={{
                display:
                  "block",
                marginTop:
                  "18px",
                fontWeight:
                  "600",
              }}
            >
              Difficulty
            </label>

            <select
              value={
                difficulty
              }
              onChange={(event) =>
                setDifficulty(
                  event.target.value
                )
              }
              style={{
                width:
                  "100%",
                padding:
                  "11px",
                marginTop:
                  "7px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #cbd5e1",
              }}
            >
              <option value="easy">
                🟢 Easy
              </option>

              <option value="medium">
                🟡 Medium
              </option>

              <option value="hard">
                🔴 Hard
              </option>
            </select>

            <label
              style={{
                display:
                  "block",
                marginTop:
                  "18px",
                fontWeight:
                  "600",
              }}
            >
              Exam Date
            </label>

            <input
              type="date"
              value={
                examDate
              }
              onChange={(event) =>
                setExamDate(
                  event.target.value
                )
              }
              style={{
                width:
                  "100%",
                padding:
                  "11px",
                marginTop:
                  "7px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #cbd5e1",
                boxSizing:
                  "border-box",
              }}
            />

            <label
              style={{
                display:
                  "block",
                marginTop:
                  "18px",
                fontWeight:
                  "600",
              }}
            >
              Current Progress:{" "}
              {progress}%
            </label>

            <input
              type="range"
              min="0"
              max="100"
              value={
                progress
              }
              onChange={(event) =>
                setProgress(
                  Number(
                    event.target.value
                  )
                )
              }
              style={{
                width:
                  "100%",
              }}
            />

            <label
              style={{
                display:
                  "block",
                marginTop:
                  "18px",
                fontWeight:
                  "600",
              }}
            >
              Daily Study Hours
            </label>

            <input
              type="number"
              min="0.5"
              max="12"
              step="0.5"
              value={
                dailyHours
              }
              onChange={(event) =>
                setDailyHours(
                  Number(
                    event.target.value
                  )
                )
              }
              style={{
                width:
                  "100%",
                padding:
                  "11px",
                marginTop:
                  "7px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #cbd5e1",
                boxSizing:
                  "border-box",
              }}
            />

            <button
              type="submit"
              style={{
                width:
                  "100%",
                marginTop:
                  "22px",
                padding:
                  "12px",
                border:
                  "none",
                borderRadius:
                  "10px",
                backgroundColor:
                  "#4f46e5",
                color:
                  "#ffffff",
                fontWeight:
                  "700",
                cursor:
                  "pointer",
              }}
            >
              ➕ Save Subject
            </button>
          </form>

          {/* Subject list */}
          <div
            style={{
              backgroundColor:
                "#ffffff",
              padding:
                "25px",
              borderRadius:
                "18px",
              boxShadow:
                "0 4px 15px rgba(15,23,42,0.06)",
            }}
          >
            <h2
              style={{
                marginTop:
                  0,
              }}
            >
              📚 Saved Subjects
            </h2>

            {rankedSubjects.map(
              (subject) => (
                <div
                  key={subject.id}
                  style={{
                    border:
                      "1px solid #e2e8f0",
                    borderRadius:
                      "14px",
                    padding:
                      "16px",
                    marginBottom:
                      "10px",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <strong>
                        {subject.name}
                      </strong>

                      <p
                        style={{
                          margin:
                            "5px 0 0",
                          color:
                            "#64748b",
                          fontSize:
                            "12px",
                        }}
                      >
                        {subject.difficulty} •{" "}
                        {
                          subject.dailyHours
                        }{" "}
                        hr/day •{" "}
                        {
                          subject.progress
                        }
                        %
                      </p>
                    </div>

                    <span
                      style={{
                        fontWeight:
                          "700",
                        color:
                          "#4f46e5",
                      }}
                    >
                      {
                        calculatePriority(
                          subject
                        ).priority
                      }
                      /100
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop:
                        "10px",
                      height:
                        "8px",
                      backgroundColor:
                        "#e2e8f0",
                      borderRadius:
                        "20px",
                    }}
                  >
                    <div
                      style={{
                        width: `${
                          calculatePriority(
                            subject
                          ).priority
                        }%`,
                        height:
                          "100%",
                        backgroundColor:
                          "#4f46e5",
                        borderRadius:
                          "20px",
                      }}
                    />
                  </div>

                  <button
                    onClick={() =>
                      removeSubject(
                        subject.id
                      )
                    }
                    style={{
                      marginTop:
                        "10px",
                      border:
                        "none",
                      background:
                        "none",
                      color:
                        "#64748b",
                      cursor:
                        "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Planner;