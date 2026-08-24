import { useMemo, useState } from "react";

// Keep this outside the component because it never changes.
// This also prevents unnecessary useMemo recalculations.
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Progress() {
  const [selectedDay, setSelectedDay] =
    useState("Monday");

  const [weeklyTasks, setWeeklyTasks] = useState({
    Monday: [
      {
        id: 1,
        title: "React Hooks",
        subject: "React",
        minutes: 60,
        completed: false,
      },
      {
        id: 2,
        title: "JavaScript Arrays",
        subject: "JavaScript",
        minutes: 45,
        completed: true,
      },
      {
        id: 3,
        title: "CSS Flexbox",
        subject: "CSS",
        minutes: 30,
        completed: false,
      },
    ],

    Tuesday: [
      {
        id: 4,
        title: "React Router",
        subject: "React",
        minutes: 60,
        completed: false,
      },
      {
        id: 5,
        title: "JavaScript Functions",
        subject: "JavaScript",
        minutes: 45,
        completed: false,
      },
    ],

    Wednesday: [
      {
        id: 6,
        title: "React State",
        subject: "React",
        minutes: 60,
        completed: false,
      },
      {
        id: 7,
        title: "CSS Grid",
        subject: "CSS",
        minutes: 45,
        completed: false,
      },
    ],

    Thursday: [
      {
        id: 8,
        title: "React Context",
        subject: "React",
        minutes: 60,
        completed: false,
      },
    ],

    Friday: [
      {
        id: 9,
        title: "JavaScript Async/Await",
        subject: "JavaScript",
        minutes: 60,
        completed: false,
      },
    ],

    Saturday: [
      {
        id: 10,
        title: "React Revision",
        subject: "React",
        minutes: 90,
        completed: false,
      },
    ],

    Sunday: [
      {
        id: 11,
        title: "Weekly Revision",
        subject: "Mixed",
        minutes: 120,
        completed: false,
      },
    ],
  });

  // =========================================================
  // SELECTED DAY DATA
  // =========================================================

  const selectedTasks =
    weeklyTasks[selectedDay] || [];

  const completedCount =
    selectedTasks.filter(
      (task) => task.completed
    ).length;

  const totalCount =
    selectedTasks.length;

  const dailyProgress =
    totalCount === 0
      ? 0
      : Math.round(
          (completedCount / totalCount) *
            100
        );

  // =========================================================
  // WEEKLY DATA
  // =========================================================

  const totalWeeklyTasks =
    Object.values(weeklyTasks)
      .flat().length;

  const completedWeeklyTasks =
    Object.values(weeklyTasks)
      .flat()
      .filter(
        (task) => task.completed
      ).length;

  const weeklyProgress =
    totalWeeklyTasks === 0
      ? 0
      : Math.round(
          (completedWeeklyTasks /
            totalWeeklyTasks) *
            100
        );

  // =========================================================
  // TIME DATA
  // =========================================================

  const totalMinutes =
    selectedTasks.reduce(
      (total, task) =>
        total + task.minutes,
      0
    );

  const completedMinutes =
    selectedTasks
      .filter(
        (task) => task.completed
      )
      .reduce(
        (total, task) =>
          total + task.minutes,
        0
      );

  // =========================================================
  // TOGGLE TASK
  // =========================================================

  const toggleTask = (taskId) => {
    setWeeklyTasks((current) => ({
      ...current,

      [selectedDay]: current[
        selectedDay
      ].map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed:
                !task.completed,
            }
          : task
      ),
    }));
  };

  // =========================================================
  // WEEKLY DAY SUMMARY
  // =========================================================

  const daySummary = useMemo(() => {
    return days.map((day) => {
      const tasks =
        weeklyTasks[day] || [];

      const completed =
        tasks.filter(
          (task) => task.completed
        ).length;

      return {
        day,
        completed,
        total: tasks.length,
        progress:
          tasks.length === 0
            ? 0
            : Math.round(
                (completed /
                  tasks.length) *
                  100
              ),
      };
    });
  }, [weeklyTasks]);

  // =========================================================
  // RETURN
  // =========================================================

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
        {/* =================================================
            HEADER
        ================================================= */}

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
            WEEKLY OVERVIEW
          </p>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "36px",
              color: "#0f172a",
            }}
          >
            📅 Study Calendar
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
            }}
          >
            Select a day to view and
            complete your planned study
            sessions.
          </p>
        </div>

        {/* =================================================
            WEEKLY PROGRESS
        ================================================= */}

        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "22px",
            borderRadius: "18px",
            boxShadow:
              "0 4px 15px rgba(15, 23, 42, 0.06)",
            marginBottom: "20px",
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
                  margin: 0,
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Weekly Completion
              </p>

              <h2
                style={{
                  margin: "5px 0",
                  color: "#0f172a",
                }}
              >
                {weeklyProgress}% complete
              </h2>
            </div>

            <span
              style={{
                fontWeight: "700",
                color: "#4f46e5",
              }}
            >
              {completedWeeklyTasks}/
              {totalWeeklyTasks} tasks
            </span>
          </div>

          <div
            style={{
              marginTop: "15px",
              height: "10px",
              borderRadius: "20px",
              backgroundColor: "#e2e8f0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${weeklyProgress}%`,
                height: "100%",
                backgroundColor: "#4f46e5",
                transition:
                  "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* =================================================
            DAY SELECTOR
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {daySummary.map((item) => {
            const isSelected =
              item.day === selectedDay;

            return (
              <button
                key={item.day}
                onClick={() =>
                  setSelectedDay(
                    item.day
                  )
                }
                style={{
                  border: isSelected
                    ? "2px solid #4f46e5"
                    : "1px solid #e2e8f0",

                  backgroundColor:
                    isSelected
                      ? "#eef2ff"
                      : "#ffffff",

                  borderRadius: "14px",

                  padding: "14px",

                  cursor: "pointer",

                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  {item.day}
                </p>

                <p
                  style={{
                    margin:
                      "5px 0 0 0",
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  {item.progress}%
                </p>

                <p
                  style={{
                    margin:
                      "4px 0 0 0",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  {item.completed}/
                  {item.total} done
                </p>
              </button>
            );
          })}
        </div>

        {/* =================================================
            SELECTED DAY
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {/* =================================================
              TASKS
          ================================================= */}

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "18px",
              boxShadow:
                "0 4px 15px rgba(15, 23, 42, 0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#4f46e5",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              SELECTED DAY
            </p>

            <h2
              style={{
                margin:
                  "5px 0 20px 0",
                color: "#0f172a",
              }}
            >
              {selectedDay}
            </h2>

            {selectedTasks.length ===
            0 ? (
              <div
                style={{
                  padding: "20px",
                  backgroundColor:
                    "#f8fafc",
                  borderRadius: "12px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                No study tasks planned.
              </div>
            ) : (
              selectedTasks.map(
                (task) => (
                  <button
                    key={task.id}
                    onClick={() =>
                      toggleTask(
                        task.id
                      )
                    }
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border:
                        "1px solid #e2e8f0",

                      backgroundColor:
                        task.completed
                          ? "#f0fdf4"
                          : "#ffffff",

                      borderRadius:
                        "14px",

                      padding: "16px",

                      marginBottom:
                        "10px",

                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems:
                          "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "21px",
                        }}
                      >
                        {task.completed
                          ? "✅"
                          : "⬜"}
                      </span>

                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontWeight:
                              "700",

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
                          fontWeight:
                            "700",
                          color:
                            "#4f46e5",
                          fontSize:
                            "13px",
                        }}
                      >
                        {task.minutes}m
                      </span>
                    </div>
                  </button>
                )
              )
            )}
          </div>

          {/* =================================================
              DAILY STATS
          ================================================= */}

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "18px",
              boxShadow:
                "0 4px 15px rgba(15, 23, 42, 0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#4f46e5",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              DAILY ANALYTICS
            </p>

            <h2
              style={{
                margin:
                  "5px 0 25px 0",
                color: "#0f172a",
              }}
            >
              {selectedDay} Progress
            </h2>

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {/* Tasks Completed */}

              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor:
                    "#eef2ff",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                  }}
                >
                  Tasks Completed
                </p>

                <strong
                  style={{
                    display: "block",
                    marginTop: "5px",
                    fontSize: "26px",
                    color: "#312e81",
                  }}
                >
                  {completedCount}/
                  {totalCount}
                </strong>
              </div>

              {/* Study Minutes */}

              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor:
                    "#f0fdf4",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                  }}
                >
                  Study Minutes
                </p>

                <strong
                  style={{
                    display: "block",
                    marginTop: "5px",
                    fontSize: "26px",
                    color: "#166534",
                  }}
                >
                  {completedMinutes}/
                  {totalMinutes} min
                </strong>
              </div>

              {/* Daily Progress */}

              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor:
                    "#fff7ed",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                  }}
                >
                  Daily Progress
                </p>

                <strong
                  style={{
                    display: "block",
                    marginTop: "5px",
                    fontSize: "26px",
                    color: "#c2410c",
                  }}
                >
                  {dailyProgress}%
                </strong>
              </div>
            </div>

            {/* Daily progress bar */}

            <div
              style={{
                marginTop: "20px",
                height: "12px",
                backgroundColor:
                  "#e2e8f0",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${dailyProgress}%`,
                  backgroundColor:
                    "#22c55e",
                  transition:
                    "width 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Progress;
