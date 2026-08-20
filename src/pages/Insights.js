import { useMemo } from "react";
import { generateInsights } from "../services/insightsEngine";
import { loadSubjects } from "../services/storage";

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

function Insights() {
  const subjects = loadSubjects(defaultSubjects);

  const analysis = useMemo(
    () => generateInsights(subjects),
    [subjects]
  );

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
          maxWidth: "1100px",
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
            PERSONALIZED ANALYSIS
          </p>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "36px",
              color: "#0f172a",
            }}
          >
            🧠 AI Study Insights
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            Your study data is analyzed to identify priorities,
            risks, and useful next actions.
          </p>
        </div>

        {/* Main recommendation */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #312e81, #4f46e5)",
            color: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "25px",
            boxShadow:
              "0 12px 30px rgba(49, 46, 129, 0.18)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#c7d2fe",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            🧠 TOP RECOMMENDATION
          </p>

          <h2
            style={{
              marginTop: "8px",
              fontSize: "28px",
              lineHeight: "1.3",
            }}
          >
            {analysis.overall}
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "12px 15px",
                borderRadius: "10px",
                minWidth: "150px",
              }}
            >
              <span
                style={{
                  display: "block",
                  color: "#c7d2fe",
                  fontSize: "12px",
                }}
              >
                Average Progress
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: "4px",
                  fontSize: "22px",
                }}
              >
                {analysis.totalProgress}%
              </strong>
            </div>

            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "12px 15px",
                borderRadius: "10px",
                minWidth: "150px",
              }}
            >
              <span
                style={{
                  display: "block",
                  color: "#c7d2fe",
                  fontSize: "12px",
                }}
              >
                Daily Study Time
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: "4px",
                  fontSize: "22px",
                }}
              >
                {analysis.totalDailyHours}h
              </strong>
            </div>

            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "12px 15px",
                borderRadius: "10px",
                minWidth: "150px",
              }}
            >
              <span
                style={{
                  display: "block",
                  color: "#c7d2fe",
                  fontSize: "12px",
                }}
              >
                Top Priority
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: "4px",
                  fontSize: "22px",
                }}
              >
                {analysis.highestPriority.name}
              </strong>
            </div>
          </div>
        </div>

        {/* Insight cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "18px",
          }}
        >
          {analysis.insights.map((insight) => (
            <div
              key={insight.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                padding: "22px",
                boxShadow:
                  "0 4px 15px rgba(15, 23, 42, 0.06)",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "12px",
                    backgroundColor: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                  }}
                >
                  {insight.icon}
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "#4f46e5",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    SMART INSIGHT
                  </p>

                  <h3
                    style={{
                      margin: "4px 0",
                      color: "#0f172a",
                    }}
                  >
                    {insight.title}
                  </h3>
                </div>
              </div>

              <p
                style={{
                  marginTop: "18px",
                  color: "#334155",
                  fontWeight: "600",
                  lineHeight: "1.5",
                }}
              >
                {insight.message}
              </p>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {insight.details}
              </p>

              <div
                style={{
                  marginTop: "15px",
                  padding: "12px",
                  borderRadius: "10px",
                  backgroundColor: "#f8fafc",
                  color: "#4338ca",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                💡 {insight.action}
              </div>
            </div>
          ))}
        </div>

        {/* Subject analysis */}
        <div
          style={{
            marginTop: "25px",
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            padding: "25px",
            boxShadow:
              "0 4px 15px rgba(15, 23, 42, 0.06)",
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
            SUBJECT OVERVIEW
          </p>

          <h2
            style={{
              margin: "5px 0 20px",
              color: "#0f172a",
            }}
          >
            What needs your attention?
          </h2>

          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            {subjects
              .slice()
              .sort(
                (a, b) =>
                  a.progress - b.progress
              )
              .map((subject) => (
                <div
                  key={subject.id}
                  style={{
                    padding: "15px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <div>
                    <strong>{subject.name}</strong>

                    <p
                      style={{
                        margin: "5px 0 0",
                        color: "#64748b",
                        fontSize: "12px",
                      }}
                    >
                      {subject.difficulty} •{" "}
                      {subject.dailyHours}h/day
                    </p>
                  </div>

                  <div
                    style={{
                      minWidth: "140px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        marginBottom: "5px",
                      }}
                    >
                      <span>Progress</span>

                      <strong>
                        {subject.progress}%
                      </strong>
                    </div>

                    <div
                      style={{
                        height: "8px",
                        borderRadius: "20px",
                        backgroundColor: "#e2e8f0",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${subject.progress}%`,
                          backgroundColor:
                            subject.progress < 50
                              ? "#ef4444"
                              : subject.progress < 75
                                ? "#f59e0b"
                                : "#22c55e",
                          transition:
                            "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* How to use insights */}
        <div
          style={{
            marginTop: "25px",
            padding: "24px",
            borderRadius: "18px",
            background:
              "linear-gradient(135deg, #eef2ff, #f8fafc)",
            border: "1px solid #e0e7ff",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: "800",
              color: "#4f46e5",
              letterSpacing: "0.6px",
            }}
          >
            🚀 TURN INSIGHTS INTO ACTION
          </p>

          <h3
            style={{
              margin: "8px 0 0",
              color: "#312e81",
              fontSize: "22px",
            }}
          >
            Make your next study session count.
          </h3>

          <p
            style={{
              margin: "10px 0 0",
              color: "#64748b",
              lineHeight: "1.7",
              maxWidth: "800px",
            }}
          >
            Start with your highest-priority subject, work on
            the weakest area first, and use Focus Mode to turn
            the recommendation into a distraction-free study
            session.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "18px",
            }}
          >
            <span
              style={{
                padding: "8px 12px",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
                color: "#4338ca",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              🎯 Prioritize
            </span>

            <span
              style={{
                padding: "8px 12px",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
                color: "#4338ca",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              📚 Study
            </span>

            <span
              style={{
                padding: "8px 12px",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
                color: "#4338ca",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              ✅ Complete
            </span>

            <span
              style={{
                padding: "8px 12px",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
                color: "#4338ca",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              📈 Improve
            </span>
          </div>
        </div>

        {/* Prototype note */}
        <div
          style={{
            marginTop: "18px",
            padding: "15px 18px",
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            color: "#64748b",
            fontSize: "13px",
            lineHeight: "1.6",
            border: "1px solid #e2e8f0",
          }}
        >
          ℹ️ These recommendations are generated by the
          rule-based study intelligence engine using your
          saved study data. No external AI API is required
          for this prototype.
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: "35px",
            paddingTop: "24px",
            paddingBottom: "20px",
            borderTop: "1px solid #e2e8f0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              marginBottom: "8px",
            }}
          >
            🎓
          </div>

          <p
            style={{
              margin: 0,
              fontWeight: "800",
              color: "#0f172a",
              fontSize: "16px",
            }}
          >
            AI Study Planner
          </p>

          <p
            style={{
              margin: "6px 0 0",
              color: "#94a3b8",
              fontSize: "12px",
            }}
          >
            Plan smarter. Focus better. Learn consistently.
          </p>

          <p
            style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              fontSize: "11px",
            }}
          >
            Academic Prototype • Smart Study Intelligence
          </p>
        </footer>
      </div>
    </main>
  );
}

export default Insights;