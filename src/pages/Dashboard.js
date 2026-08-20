import { useMemo, useState } from "react";

function Dashboard() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "JavaScript Arrays",
      subject: "JavaScript",
      duration: 45,
      completed: true,
    },
    {
      id: 2,
      title: "React Hooks",
      subject: "React",
      duration: 60,
      completed: false,
    },
    {
      id: 3,
      title: "React Router",
      subject: "React",
      duration: 45,
      completed: false,
    },
    {
      id: 4,
      title: "CSS Flexbox",
      subject: "CSS",
      duration: 30,
      completed: false,
    },
    {
      id: 5,
      title: "JavaScript Functions",
      subject: "JavaScript",
      duration: 45,
      completed: true,
    },
  ]);

  const [streak, setStreak] = useState(6);

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const remainingTasks = totalTasks - completedTasks;

  const progress = Math.round(
    (completedTasks / totalTasks) * 100
  );

  const totalStudyMinutes = tasks
    .filter((task) => task.completed)
    .reduce(
      (total, task) => total + task.duration,
      0
    );

  const totalPlannedMinutes = tasks.reduce(
    (total, task) => total + task.duration,
    0
  );

  const studyProgressMessage = useMemo(() => {
    if (progress === 100) {
      return "🎉 Amazing! Today's study plan is complete.";
    }

    if (progress >= 60) {
      return "🔥 Great progress! Keep going.";
    }

    if (progress >= 30) {
      return "💪 You're building momentum.";
    }

    return "🚀 Let's get your study session started.";
  }, [progress]);

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
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
              letterSpacing: "0.5px",
            }}
          >
            YOUR STUDY SPACE
          </p>

          <h1
            style={{
              marginTop: "8px",
              marginBottom: "8px",
              fontSize: "38px",
              color: "#0f172a",
            }}
          >
            🎓 Good morning!
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "17px",
              margin: 0,
            }}
          >
            {studyProgressMessage}
          </p>
        </div>

        {/* Main Statistics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {/* Streak */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "22px",
              borderRadius: "16px",
              boxShadow:
                "0 4px 15px rgba(15, 23, 42, 0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            <p
              style={{
                color: "#64748b",
                margin: 0,
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              🔥 STUDY STREAK
            </p>

            <h2
              style={{
                fontSize: "30px",
                margin: "10px 0 6px",
                color: "#0f172a",
              }}
            >
              {streak} days
            </h2>

            <button
              onClick={() =>
                setStreak((current) => current + 1)
              }
              style={{
                border: "none",
                backgroundColor: "#fef3c7",
                color: "#92400e",
                padding: "8px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              🔥 Keep Streak
            </button>
          </div>

          {/* Tasks */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "22px",
              borderRadius: "16px",
              boxShadow:
                "0 4px 15px rgba(15, 23, 42, 0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            <p
              style={{
                color: "#64748b",
                margin: 0,
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              ✅ TASKS COMPLETE
            </p>

            <h2
              style={{
                fontSize: "30px",
                margin: "10px 0 6px",
                color: "#0f172a",
              }}
            >
              {completedTasks}/{totalTasks}
            </h2>

            <p
              style={{
                color: "#16a34a",
                margin: 0,
                fontWeight: "700",
              }}
            >
              {progress}% complete
            </p>
          </div>

          {/* Subjects */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "22px",
              borderRadius: "16px",
              boxShadow:
                "0 4px 15px rgba(15, 23, 42, 0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            <p
              style={{
                color: "#64748b",
                margin: 0,
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              📚 ACTIVE SUBJECTS
            </p>

            <h2
              style={{
                fontSize: "30px",
                margin: "10px 0 6px",
                color: "#0f172a",
              }}
            >
              4
            </h2>

            <p
              style={{
                color: "#64748b",
                margin: 0,
              }}
            >
              Active this week
            </p>
          </div>

          {/* Study time */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "22px",
              borderRadius: "16px",
              boxShadow:
                "0 4px 15px rgba(15, 23, 42, 0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            <p
              style={{
                color: "#64748b",
                margin: 0,
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              ⏱️ STUDY TIME
            </p>

            <h2
              style={{
                fontSize: "30px",
                margin: "10px 0 6px",
                color: "#0f172a",
              }}
            >
              {totalStudyMinutes}m
            </h2>

            <p
              style={{
                color: "#64748b",
                margin: 0,
              }}
            >
              Completed today
            </p>
          </div>
        </div>

        {/* Additional Analytics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          {/* Completion */}
          <div
            style={{
              backgroundColor: "#eef2ff",
              padding: "18px",
              borderRadius: "14px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#4338ca",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              🎯 COMPLETION RATE
            </p>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: "30px",
                fontWeight: "800",
                color: "#312e81",
              }}
            >
              {progress}%
            </p>

            <p
              style={{
                margin: "5px 0 0",
                color: "#6366f1",
                fontSize: "12px",
              }}
            >
              Daily target
            </p>
          </div>

          {/* Remaining */}
          <div
            style={{
              backgroundColor: "#ecfdf5",
              padding: "18px",
              borderRadius: "14px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#166534",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              📚 TASKS REMAINING
            </p>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: "30px",
                fontWeight: "800",
                color: "#166534",
              }}
            >
              {remainingTasks}
            </p>

            <p
              style={{
                margin: "5px 0 0",
                color: "#16a34a",
                fontSize: "12px",
              }}
            >
              Tasks left today
            </p>
          </div>

          {/* Completed time */}
          <div
            style={{
              backgroundColor: "#fff7ed",
              padding: "18px",
              borderRadius: "14px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#c2410c",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              ⏱️ COMPLETED TIME
            </p>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: "30px",
                fontWeight: "800",
                color: "#c2410c",
              }}
            >
              {totalStudyMinutes}m
            </p>

            <p
              style={{
                margin: "5px 0 0",
                color: "#ea580c",
                fontSize: "12px",
              }}
            >
              of {totalPlannedMinutes}m planned
            </p>
          </div>

          {/* Remaining time */}
          <div
            style={{
              backgroundColor: "#fef2f2",
              padding: "18px",
              borderRadius: "14px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#b91c1c",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              ⌛ REMAINING TIME
            </p>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: "30px",
                fontWeight: "800",
                color: "#b91c1c",
              }}
            >
              {totalPlannedMinutes -
                totalStudyMinutes}
              m
            </p>

            <p
              style={{
                margin: "5px 0 0",
                color: "#dc2626",
                fontSize: "12px",
              }}
            >
              Still to complete
            </p>
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Tasks */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "18px",
              boxShadow:
                "0 4px 15px rgba(15, 23, 42, 0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#4f46e5",
                    fontSize: "13px",
                    fontWeight: "700",
                    margin: 0,
                  }}
                >
                  TODAY
                </p>

                <h2
                  style={{
                    margin: "5px 0",
                    color: "#0f172a",
                  }}
                >
                  📚 Study Tasks
                </h2>
              </div>

              <span
                style={{
                  backgroundColor: "#eef2ff",
                  color: "#4338ca",
                  padding: "7px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {completedTasks}/{totalTasks}
              </span>
            </div>

            <div
              style={{
                marginTop: "20px",
              }}
            >
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() =>
                    toggleTask(task.id)
                  }
                  style={{
                    width: "100%",
                    border: "none",
                    backgroundColor:
                      task.completed
                        ? "#f0fdf4"
                        : "#f8fafc",
                    padding: "15px",
                    borderRadius: "12px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "22px",
                      }}
                    >
                      {task.completed
                        ? "✅"
                        : "⬜"}
                    </span>

                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "700",
                          color:
                            task.completed
                              ? "#16a34a"
                              : "#0f172a",
                          textDecoration:
                            task.completed
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {task.title}
                      </p>

                      <p
                        style={{
                          margin:
                            "4px 0 0",
                          color: "#64748b",
                          fontSize: "13px",
                        }}
                      >
                        {task.subject} •{" "}
                        {task.duration} min
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "18px",
              boxShadow:
                "0 4px 15px rgba(15, 23, 42, 0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            <p
              style={{
                color: "#4f46e5",
                fontSize: "13px",
                fontWeight: "700",
                margin: 0,
              }}
            >
              DAILY TARGET
            </p>

            <h2
              style={{
                margin: "5px 0",
                color: "#0f172a",
              }}
            >
              🎯 Study Progress
            </h2>

            <div
              style={{
                marginTop: "30px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "180px",
                  height: "180px",
                  margin: "0 auto",
                  borderRadius: "50%",
                  background: `conic-gradient(
                    #4f46e5 ${progress * 3.6}deg,
                    #e2e8f0 0deg
                  )`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "138px",
                    height: "138px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <strong
                    style={{
                      fontSize: "32px",
                      color: "#0f172a",
                    }}
                  >
                    {progress}%
                  </strong>

                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    complete
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "30px",
                padding: "15px",
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                🧠 Smart recommendation
              </p>

              <p
                style={{
                  marginTop: "7px",
                  marginBottom: 0,
                  color: "#64748b",
                  lineHeight: "1.5",
                }}
              >
                {remainingTasks > 0
                  ? "Focus on your unfinished tasks next. Completing them will improve today's study progress."
                  : "🎉 You've completed everything planned for today!"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick action */}
        <div
          style={{
            marginTop: "20px",
            padding: "22px 25px",
            borderRadius: "18px",
            background:
              "linear-gradient(135deg, #312e81, #4f46e5)",
            color: "#ffffff",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "8px",
            }}
          >
            🚀 Ready for a focused session?
          </h2>

          <p
            style={{
              marginTop: 0,
              marginBottom: "15px",
              opacity: 0.9,
            }}
          >
            Turn one of today's unfinished tasks into a
            focused study session.
          </p>

          <a
            href="/focus"
            style={{
              display: "inline-block",
              textDecoration: "none",
              backgroundColor: "#ffffff",
              color: "#312e81",
              padding: "10px 16px",
              borderRadius: "10px",
              fontWeight: "700",
            }}
          >
            ⏱️ Start Focus Mode
          </a>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;