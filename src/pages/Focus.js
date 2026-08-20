import { useEffect, useMemo, useState } from "react";

const focusModes = [
  {
    name: "Quick Focus",
    minutes: 15,
    description: "Short session for a quick revision task.",
  },
  {
    name: "Standard Focus",
    minutes: 25,
    description: "Classic focused study session.",
  },
  {
    name: "Deep Focus",
    minutes: 50,
    description: "Long session for difficult concepts.",
  },
];

function Focus() {
  const [tasks] = useState([
    {
      id: 1,
      title: "React Hooks",
      subject: "React",
    },
    {
      id: 2,
      title: "JavaScript Arrays",
      subject: "JavaScript",
    },
    {
      id: 3,
      title: "CSS Flexbox",
      subject: "CSS",
    },
  ]);

  const [selectedTask, setSelectedTask] =
    useState(tasks[0]);

  const [selectedMode, setSelectedMode] =
    useState(focusModes[1]);

  const [timeLeft, setTimeLeft] = useState(
    focusModes[1].minutes * 60
  );

  const [isRunning, setIsRunning] =
    useState(false);

  const [sessionComplete, setSessionComplete] =
    useState(false);

  const [completedSessions, setCompletedSessions] =
    useState(0);

  const [totalFocusMinutes, setTotalFocusMinutes] =
    useState(0);

  const totalSeconds = selectedMode.minutes * 60;

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setSessionComplete(true);

      setCompletedSessions(
        (current) => current + 1
      );

      setTotalFocusMinutes(
        (current) =>
          current + selectedMode.minutes
      );
    }
  }, [
    timeLeft,
    isRunning,
    selectedMode.minutes,
  ]);

  const minutes = Math.floor(
    timeLeft / 60
  );

  const seconds = timeLeft % 60;

  const progress = Math.round(
    ((totalSeconds - timeLeft) /
      totalSeconds) *
      100
  );

  const formattedTime = `${String(
    minutes
  ).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const isAlmostDone =
    timeLeft > 0 && timeLeft <= 60;

  const focusMessage = useMemo(() => {
    if (sessionComplete) {
      return "🎉 Excellent! You completed a focused study session.";
    }

    if (isAlmostDone) {
      return "⏳ Almost there! Finish strong.";
    }

    if (isRunning) {
      return "🔥 Stay focused. One task at a time.";
    }

    if (progress > 0) {
      return "💪 You're making progress. Keep going.";
    }

    return "🚀 Start your session when you're ready.";
  }, [
    sessionComplete,
    isAlmostDone,
    isRunning,
    progress,
  ]);

  const selectTask = (task) => {
    setSelectedTask(task);
    setTimeLeft(
      selectedMode.minutes * 60
    );
    setIsRunning(false);
    setSessionComplete(false);
  };

  const selectMode = (mode) => {
    setSelectedMode(mode);
    setTimeLeft(mode.minutes * 60);
    setIsRunning(false);
    setSessionComplete(false);
  };

  const resetTimer = () => {
    setTimeLeft(
      selectedMode.minutes * 60
    );
    setIsRunning(false);
    setSessionComplete(false);
  };

  const toggleTimer = () => {
    if (sessionComplete) {
      return;
    }

    setIsRunning(
      (current) => !current
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)",
        padding: "30px 20px 50px",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "7px 12px",
              borderRadius: "20px",
              backgroundColor:
                "rgba(255,255,255,0.1)",
              color: "#c7d2fe",
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "0.8px",
            }}
          >
            DEEP WORK SPACE
          </div>

          <h1
            style={{
              margin: "14px 0 8px",
              fontSize: "40px",
            }}
          >
            ⏱️ Focus Mode
          </h1>

          <p
            style={{
              margin: 0,
              color: "#cbd5e1",
              fontSize: "15px",
            }}
          >
            {focusMessage}
          </p>
        </div>

        {/* Main card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
            borderRadius: "24px",
            padding: "28px",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.25)",
          }}
        >
          {/* Focus mode selector */}
          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#6366f1",
                fontSize: "12px",
                fontWeight: "800",
                letterSpacing: "0.5px",
              }}
            >
              CHOOSE FOCUS MODE
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "10px",
                marginTop: "12px",
              }}
            >
              {focusModes.map((mode) => {
                const active =
                  mode.name ===
                  selectedMode.name;

                return (
                  <button
                    key={mode.name}
                    onClick={() =>
                      selectMode(mode)
                    }
                    style={{
                      textAlign: "left",
                      padding: "14px",
                      borderRadius: "12px",
                      border: active
                        ? "2px solid #4f46e5"
                        : "1px solid #e2e8f0",
                      backgroundColor: active
                        ? "#eef2ff"
                        : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                      }}
                    >
                      {mode.name}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        marginTop: "5px",
                        color: "#64748b",
                        fontSize: "12px",
                      }}
                    >
                      {mode.minutes} minutes
                    </span>

                    <span
                      style={{
                        display: "block",
                        marginTop: "5px",
                        color: "#94a3b8",
                        fontSize: "11px",
                        lineHeight: "1.4",
                      }}
                    >
                      {mode.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) 290px",
              gap: "30px",
            }}
          >
            {/* Timer */}
            <div
              style={{
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#6366f1",
                  fontWeight: "800",
                  fontSize: "12px",
                }}
              >
                CURRENT SESSION
              </p>

              <h2
                style={{
                  margin: "10px 0 0",
                  fontSize: "28px",
                }}
              >
                {selectedTask.title}
              </h2>

              <p
                style={{
                  marginTop: "5px",
                  color: "#64748b",
                }}
              >
                {selectedTask.subject} •{" "}
                {selectedMode.name}
              </p>

              {/* Almost done warning */}
              {isAlmostDone &&
                !sessionComplete && (
                  <div
                    style={{
                      margin:
                        "18px auto 0",
                      maxWidth: "450px",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      backgroundColor:
                        "#fff7ed",
                      color: "#c2410c",
                      fontWeight: "700",
                      fontSize: "13px",
                    }}
                  >
                    ⏳ Less than one minute
                    remaining. Finish strong!
                  </div>
                )}

              {/* Timer circle */}
              <div
                style={{
                  width: "260px",
                  height: "260px",
                  margin:
                    "30px auto 25px",
                  borderRadius: "50%",
                  background: `conic-gradient(
                    #4f46e5 ${
                      progress * 3.6
                    }deg,
                    #e2e8f0 0deg
                  )`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  transition:
                    "background 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "210px",
                    height: "210px",
                    borderRadius: "50%",
                    backgroundColor:
                      "#ffffff",
                    display: "flex",
                    flexDirection:
                      "column",
                    justifyContent:
                      "center",
                    alignItems: "center",
                  }}
                >
                  <strong
                    style={{
                      fontSize: "48px",
                      letterSpacing: "2px",
                    }}
                  >
                    {formattedTime}
                  </strong>

                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      marginTop: "4px",
                    }}
                  >
                    {progress}% complete
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={toggleTimer}
                  disabled={
                    sessionComplete
                  }
                  style={{
                    border: "none",
                    backgroundColor:
                      sessionComplete
                        ? "#cbd5e1"
                        : "#4f46e5",
                    color: "#ffffff",
                    padding:
                      "12px 24px",
                    borderRadius:
                      "10px",
                    cursor:
                      sessionComplete
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: "800",
                  }}
                >
                  {isRunning
                    ? "⏸ Pause"
                    : "▶ Start"}
                </button>

                <button
                  onClick={resetTimer}
                  style={{
                    border:
                      "1px solid #cbd5e1",
                    backgroundColor:
                      "#ffffff",
                    color: "#334155",
                    padding:
                      "12px 24px",
                    borderRadius:
                      "10px",
                    cursor: "pointer",
                    fontWeight: "800",
                  }}
                >
                  ↻ Reset
                </button>
              </div>

              {/* Completion */}
              {sessionComplete && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    borderRadius: "12px",
                    backgroundColor:
                      "#f0fdf4",
                    color: "#166534",
                    fontWeight: "700",
                  }}
                >
                  ✅ Focus session completed!
                  Great work.
                </div>
              )}
            </div>

            {/* Task panel */}
            <div>
              <p
                style={{
                  color: "#6366f1",
                  fontSize: "12px",
                  fontWeight: "800",
                  margin: 0,
                }}
              >
                CHOOSE TASK
              </p>

              <h3
                style={{
                  margin:
                    "5px 0 18px",
                }}
              >
                Study Sessions
              </h3>

              {tasks.map((task) => {
                const active =
                  task.id ===
                  selectedTask.id;

                return (
                  <button
                    key={task.id}
                    onClick={() =>
                      selectTask(task)
                    }
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: active
                        ? "2px solid #4f46e5"
                        : "1px solid #e2e8f0",
                      backgroundColor: active
                        ? "#eef2ff"
                        : "#ffffff",
                      borderRadius:
                        "12px",
                      padding: "14px",
                      marginBottom:
                        "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <strong>
                          {task.title}
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
                          {task.subject}
                        </p>
                      </div>

                      <span
                        style={{
                          color:
                            "#4f46e5",
                          fontWeight:
                            "800",
                        }}
                      >
                        {selectedMode.minutes}m
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Stats */}
              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    padding: "15px",
                    borderRadius: "12px",
                    backgroundColor:
                      "#f8fafc",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    Sessions completed
                  </p>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "5px",
                      fontSize: "26px",
                    }}
                  >
                    {completedSessions}
                  </strong>
                </div>

                <div
                  style={{
                    padding: "15px",
                    borderRadius: "12px",
                    backgroundColor:
                      "#eef2ff",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#6366f1",
                      fontSize: "12px",
                    }}
                  >
                    Total focused time
                  </p>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "5px",
                      fontSize: "26px",
                      color: "#312e81",
                    }}
                  >
                    {totalFocusMinutes}m
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Session progress */}
          <div
            style={{
              marginTop: "30px",
              paddingTop: "25px",
              borderTop:
                "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Session Progress
              </span>

              <strong>
                {progress}%
              </strong>
            </div>

            <div
              style={{
                height: "10px",
                borderRadius: "20px",
                overflow: "hidden",
                backgroundColor:
                  "#e2e8f0",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor:
                    "#4f46e5",
                  transition:
                    "width 0.5s linear",
                }}
              />
            </div>
          </div>
        </div>

        {/* Productivity tip */}
        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor:
                "rgba(255,255,255,0.08)",
              color: "#e2e8f0",
            }}
          >
            🎯 <strong>One task at a time</strong>
            <p
              style={{
                margin:
                  "6px 0 0",
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              Avoid switching between subjects during a session.
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor:
                "rgba(255,255,255,0.08)",
              color: "#e2e8f0",
            }}
          >
            📵 <strong>Reduce distractions</strong>
            <p
              style={{
                margin:
                  "6px 0 0",
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              Keep notifications and unnecessary tabs closed.
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor:
                "rgba(255,255,255,0.08)",
              color: "#e2e8f0",
            }}
          >
            🧠 <strong>Take a short break</strong>
            <p
              style={{
                margin:
                  "6px 0 0",
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              Rest briefly after completing your focus session.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Focus;