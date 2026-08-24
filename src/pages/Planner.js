import React, { useEffect, useState } from "react";

/*
  ============================================================
  AI STUDY PLANNER
  Planner Page
  ============================================================

  Features:
  - Add subjects
  - Save subjects in localStorage
  - Generate a complete timetable
  - Multiple subjects in sequence
  - Morning / Afternoon / Evening / Night
  - Study sessions
  - Short breaks
  - Lunch break
  - Generated plan saved in localStorage
  - Responsive UI
  - CSS is included in this file
*/

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const SUBJECT_STORAGE_KEY = "aiStudySubjects";
const PLAN_STORAGE_KEY = "aiGeneratedPlan";

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function formatTime(totalMinutes) {
  let minutes = totalMinutes;

  // Keep time inside a normal day.
  minutes = Math.max(0, Math.min(minutes, 1439));

  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const period = hours >= 12 ? "PM" : "AM";

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return `${hours}:${String(mins).padStart(2, "0")} ${period}`;
}

function getDateLabel(date) {
  const today = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function getDifficultyColor(difficulty) {
  if (difficulty === "Easy") {
    return "#16a34a";
  }

  if (difficulty === "Hard") {
    return "#dc2626";
  }

  return "#d97706";
}

function getDifficultyEmoji(difficulty) {
  if (difficulty === "Easy") {
    return "🟢";
  }

  if (difficulty === "Hard") {
    return "🔴";
  }

  return "🟡";
}

function getTimePeriod(minutes) {
  if (minutes < 12 * 60) {
    return "Morning";
  }

  if (minutes < 17 * 60) {
    return "Afternoon";
  }

  if (minutes < 21 * 60) {
    return "Evening";
  }

  return "Night";
}

// ============================================================
// GENERATE DAILY SCHEDULE
// ============================================================

function createDailySchedule(subjects, dateOffset = 0) {
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return {
      date: new Date().toISOString(),
      label: dateOffset === 0 ? "Today" : "Tomorrow",
      sessions: [],
    };
  }

  const date = new Date();
  date.setDate(date.getDate() + dateOffset);

  /*
    Start at 9:00 AM.

    The schedule is divided into:
      Morning
      Afternoon
      Evening
      Night

    A break is inserted after every study session.
  */

  let currentTime = 9 * 60;

  const sessions = [];

  // Maximum number of subjects per day.
  // This prevents an unrealistic timetable.
  const maxSubjects = Math.min(subjects.length, 6);

  const dailySubjects = [...subjects]
    .sort((a, b) => {
      const progressA = Number(a.progress || 0);
      const progressB = Number(b.progress || 0);

      // Lower progress gets higher priority.
      return progressA - progressB;
    })
    .slice(0, maxSubjects);

  dailySubjects.forEach((subject, index) => {
    /*
      Determine duration.

      Hard subjects:
        60-90 minutes

      Medium:
        60 minutes

      Easy:
        45-60 minutes
    */

    let duration = 60;

    if (subject.difficulty === "Hard") {
      duration = index % 2 === 0 ? 90 : 75;
    } else if (subject.difficulty === "Easy") {
      duration = 45;
    } else {
      duration = 60;
    }

    // Respect user's daily study hours if available.
    const dailyHours = Number(subject.dailyHours || subject.hours || 1);

    if (dailyHours <= 1) {
      duration = Math.min(duration, 60);
    }

    if (dailyHours >= 3 && subject.difficulty === "Hard") {
      duration = 90;
    }

    /*
      Add lunch break around 12:30 PM.
    */

    if (currentTime >= 12 * 60 && currentTime < 13 * 60) {
      const lunchStart = currentTime;
      const lunchEnd = lunchStart + 60;

      sessions.push({
        type: "break",
        title: "Lunch Break",
        start: formatTime(lunchStart),
        end: formatTime(lunchEnd),
        duration: 60,
        period: "Afternoon",
        icon: "🍴",
      });

      currentTime = lunchEnd;
    }

    /*
      If we reach 12:30 PM before a study session,
      add lunch first.
    */

    if (currentTime < 12 * 60 && currentTime + duration > 12 * 60) {
      const lunchStart = 12 * 60;
      const lunchEnd = 13 * 60;

      const availableBeforeLunch = lunchStart - currentTime;

      if (availableBeforeLunch >= 30) {
        duration = availableBeforeLunch;
      } else {
        sessions.push({
          type: "break",
          title: "Lunch Break",
          start: formatTime(lunchStart),
          end: formatTime(lunchEnd),
          duration: 60,
          period: "Afternoon",
          icon: "🍴",
        });

        currentTime = lunchEnd;
      }
    }

    const start = currentTime;
    const end = currentTime + duration;

    sessions.push({
      type: "study",
      subject: subject.name,
      difficulty: subject.difficulty,
      progress: Number(subject.progress || 0),
      duration,
      start: formatTime(start),
      end: formatTime(end),
      period: getTimePeriod(start),
      icon: "📚",
    });

    currentTime = end;

    /*
      Add break after every subject except the last one.
    */

    if (index < dailySubjects.length - 1) {
      let breakDuration = 15;

      /*
        After a 90-minute hard session,
        give a longer 20-minute break.
      */

      if (duration >= 90) {
        breakDuration = 20;
      }

      const breakStart = currentTime;
      const breakEnd = currentTime + breakDuration;

      sessions.push({
        type: "break",
        title: "Short Break",
        start: formatTime(breakStart),
        end: formatTime(breakEnd),
        duration: breakDuration,
        period: getTimePeriod(breakStart),
        icon: "☕",
      });

      currentTime = breakEnd;

      /*
        If the schedule reaches 12:30 PM,
        insert lunch.
      */

      if (currentTime >= 12 * 60 && currentTime < 13 * 60) {
        const lunchStart = currentTime;
        const lunchEnd = lunchStart + 60;

        sessions.push({
          type: "break",
          title: "Lunch Break",
          start: formatTime(lunchStart),
          end: formatTime(lunchEnd),
          duration: 60,
          period: "Afternoon",
          icon: "🍴",
        });

        currentTime = lunchEnd;
      }
    }
  });

  return {
    date: date.toISOString(),
    label: getDateLabel(date),
    sessions,
  };
}

// ============================================================
// CREATE COMPLETE PLAN
// ============================================================

function generateCompletePlan(subjects) {
  const today = createDailySchedule(subjects, 0);
  const tomorrow = createDailySchedule(subjects, 1);

  return {
    createdAt: new Date().toISOString(),

    /*
      IMPORTANT:

      The application expects:

        generatedPlan.days

      This fixes the error:

        generatedPlan.days.map

    */

    days: [today, tomorrow],
  };
}

// ============================================================
// COMPONENT
// ============================================================

export default function Planner() {
  // ============================================================
  // STATE
  // ============================================================

  const [subjects, setSubjects] = useState([]);

  const [generatedPlan, setGeneratedPlan] = useState(null);

  const [form, setForm] = useState({
    name: "",
    difficulty: "Medium",
    examDate: "",
    progress: 0,
    dailyHours: 1,
  });

  const [message, setMessage] = useState("");

  // ============================================================
  // LOAD SAVED DATA
  // ============================================================

  useEffect(() => {
    try {
      /*
        We check a few possible old storage keys so
        previous versions of your project can still work.
      */

      const possibleSubjectKeys = [
        SUBJECT_STORAGE_KEY,
        "subjects",
        "studySubjects",
        "savedSubjects",
      ];

      let savedSubjects = null;

      for (const key of possibleSubjectKeys) {
        const stored = localStorage.getItem(key);

        if (stored) {
          try {
            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed)) {
              savedSubjects = parsed;
              break;
            }
          } catch (error) {
            console.log("Could not parse saved subjects:", error);
          }
        }
      }

      if (Array.isArray(savedSubjects)) {
        setSubjects(savedSubjects);
      }

      // Load generated plan.
      const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);

      if (savedPlan) {
        try {
          const parsedPlan = JSON.parse(savedPlan);

          /*
            Only use the saved plan if it has the correct
            days array.
          */

          if (
            parsedPlan &&
            Array.isArray(parsedPlan.days)
          ) {
            setGeneratedPlan(parsedPlan);
          }
        } catch (error) {
          console.log("Could not load generated plan:", error);
        }
      }
    } catch (error) {
      console.log("Local storage error:", error);
    }
  }, []);

  // ============================================================
  // SAVE SUBJECTS AUTOMATICALLY
  // ============================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        SUBJECT_STORAGE_KEY,
        JSON.stringify(subjects)
      );
    } catch (error) {
      console.log("Could not save subjects:", error);
    }
  }, [subjects]);

  // ============================================================
  // SAVE GENERATED PLAN
  // ============================================================

  useEffect(() => {
    if (!generatedPlan) {
      return;
    }

    /*
      Don't save invalid plans.
    */

    if (!Array.isArray(generatedPlan.days)) {
      return;
    }

    try {
      localStorage.setItem(
        PLAN_STORAGE_KEY,
        JSON.stringify(generatedPlan)
      );
    } catch (error) {
      console.log("Could not save generated plan:", error);
    }
  }, [generatedPlan]);

  // ============================================================
  // HANDLE FORM
  // ============================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ============================================================
  // ADD SUBJECT
  // ============================================================

  function handleAddSubject(event) {
    event.preventDefault();

    const trimmedName = form.name.trim();

    if (!trimmedName) {
      setMessage("Please enter a subject name.");
      return;
    }

    /*
      Prevent duplicate subjects.
    */

    const alreadyExists = subjects.some(
      (subject) =>
        subject.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (alreadyExists) {
      setMessage("This subject is already saved.");
      return;
    }

    const newSubject = {
      id: Date.now(),

      name: trimmedName,

      difficulty: form.difficulty,

      examDate: form.examDate,

      progress: Number(form.progress),

      dailyHours: Number(form.dailyHours),

      createdAt: new Date().toISOString(),
    };

    setSubjects((previous) => [
      ...previous,
      newSubject,
    ]);

    setForm({
      name: "",
      difficulty: "Medium",
      examDate: "",
      progress: 0,
      dailyHours: 1,
    });

    setMessage(`${trimmedName} added successfully.`);

    /*
      Clear message after a short time.
    */

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  // ============================================================
  // REMOVE SUBJECT
  // ============================================================

  function removeSubject(id) {
    setSubjects((previous) =>
      previous.filter((subject) => subject.id !== id)
    );

    setMessage("Subject removed.");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  // ============================================================
  // GENERATE PLAN
  // ============================================================

  function handleGeneratePlan() {
    if (subjects.length === 0) {
      setMessage(
        "Please add at least one subject before generating a plan."
      );

      return;
    }

    const plan = generateCompletePlan(subjects);

    setGeneratedPlan(plan);

    setMessage(
      "Your personalized timetable has been generated."
    );

    /*
      Scroll to generated timetable.
    */

    setTimeout(() => {
      const element =
        document.getElementById("generated-plan");

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }

  // ============================================================
  // CLEAR PLAN
  // ============================================================

  function clearGeneratedPlan() {
    setGeneratedPlan(null);

    localStorage.removeItem(PLAN_STORAGE_KEY);

    setMessage("Generated plan cleared.");
  }

  // ============================================================
  // CALCULATE TOTAL STUDY TIME
  // ============================================================

  function getTotalStudyMinutes() {
    if (
      !generatedPlan ||
      !Array.isArray(generatedPlan.days)
    ) {
      return 0;
    }

    return generatedPlan.days.reduce(
      (total, day) => {
        if (!Array.isArray(day.sessions)) {
          return total;
        }

        return (
          total +
          day.sessions.reduce(
            (dayTotal, session) => {
              if (session.type === "study") {
                return dayTotal + Number(session.duration || 0);
              }

              return dayTotal;
            },
            0
          )
        );
      },
      0
    );
  }

  const totalStudyMinutes = getTotalStudyMinutes();

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="planner-page">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <section className="planner-heading">

        <div>
          <div className="planner-eyebrow">
            SMART PLANNING
          </div>

          <h1 className="planner-title">
            📚 Study Planner
          </h1>

          <p className="planner-subtitle">
            Your subjects are now saved automatically in the browser.
          </p>
        </div>

      </section>

      {/* ======================================================
          SAVED SUBJECT MESSAGE
      ====================================================== */}

      <div className="saved-message">
        💾{" "}
        <strong>
          {subjects.length}
        </strong>{" "}
        {subjects.length === 1 ? "subject" : "subjects"} saved locally.
      </div>

      {/* ======================================================
          SUCCESS / ERROR MESSAGE
      ====================================================== */}

      {message && (
        <div className="planner-message">
          {message}
        </div>
      )}

      {/* ======================================================
          SMART PLAN GENERATOR
      ====================================================== */}

      <section className="smart-generator">

        <div className="generator-content">

          <div className="generator-eyebrow">
            🧠 SMART PLANNER
          </div>

          <h2>
            Generate today's plan
          </h2>

          <p>
            Generate a complete study timetable with subjects,
            timings and healthy breaks.
          </p>

          <div className="generator-features">

            <span>
              ⏰ Timed sessions
            </span>

            <span>
              ☕ Smart breaks
            </span>

            <span>
              🌅 Morning → 🌙 Night
            </span>

          </div>

        </div>

        <button
          className="generate-button"
          onClick={handleGeneratePlan}
        >
          🧠 Generate Plan
        </button>

      </section>

      {/* ======================================================
          GENERATED STUDY PLAN
      ====================================================== */}

      <section
        className="generated-plan"
        id="generated-plan"
      >

        <div className="section-header">

          <div>
            <h2>
              🎯 Generated Study Plan
            </h2>

            <p>
              Your personalized timetable with study sessions
              and breaks.
            </p>
          </div>

          {generatedPlan &&
            Array.isArray(generatedPlan.days) &&
            generatedPlan.days.length > 0 && (
              <button
                className="clear-plan-button"
                onClick={clearGeneratedPlan}
              >
                Clear Plan
              </button>
            )}

        </div>

        {/* ====================================================
            SAFE GENERATED PLAN CHECK

            THIS FIXES:

            generatedPlan.days.map

            when days is undefined.
        ==================================================== */}

        {generatedPlan &&
          Array.isArray(generatedPlan.days) &&
          generatedPlan.days.length > 0 ? (

          <div className="days-container">

            {generatedPlan.days.map(
              (day, dayIndex) => (

                <div
                  className="day-card"
                  key={dayIndex}
                >

                  {/* DAY HEADER */}

                  <div className="day-header">

                    <div>

                      <div className="day-small-label">
                        {dayIndex === 0
                          ? "📅 TODAY'S SCHEDULE"
                          : "📅 NEXT DAY SCHEDULE"}
                      </div>

                      <h3>
                        {day.label}
                      </h3>

                    </div>

                    <div className="day-date">
                      {new Date(day.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>

                  </div>

                  {/* ==================================================
                      SESSION LIST
                  ================================================== */}

                  {Array.isArray(day.sessions) &&
                  day.sessions.length > 0 ? (

                    <div className="timeline">

                      {day.sessions.map(
                        (session, sessionIndex) => {

                          if (
                            session.type === "break"
                          ) {
                            return (
                              <div
                                className="break-row"
                                key={sessionIndex}
                              >

                                <div className="timeline-line">
                                  <div className="break-dot">
                                    ☕
                                  </div>
                                </div>

                                <div className="break-card">

                                  <div>
                                    <strong>
                                      {session.title}
                                    </strong>

                                    <div className="break-time">
                                      {session.start}{" "}
                                      –{" "}
                                      {session.end}
                                    </div>
                                  </div>

                                  <span>
                                    {session.duration} min
                                  </span>

                                </div>

                              </div>
                            );
                          }

                          return (
                            <div
                              className="study-row"
                              key={sessionIndex}
                            >

                              <div className="timeline-line">

                                <div className="study-dot">
                                  📚
                                </div>

                              </div>

                              <div className="study-card">

                                <div className="study-card-top">

                                  <div>

                                    <div className="session-period">
                                      {session.period}
                                    </div>

                                    <h4>
                                      {session.subject}
                                    </h4>

                                  </div>

                                  <div
                                    className="difficulty-badge"
                                    style={{
                                      color:
                                        getDifficultyColor(
                                          session.difficulty
                                        ),
                                    }}
                                  >
                                    {getDifficultyEmoji(
                                      session.difficulty
                                    )}{" "}
                                    {session.difficulty}
                                  </div>

                                </div>

                                <div className="study-details">

                                  <span>
                                    ⏰{" "}
                                    {session.start}
                                    {" "}
                                    –{" "}
                                    {session.end}
                                  </span>

                                  <span>
                                    ⏱️{" "}
                                    {session.duration} min
                                  </span>

                                  <span>
                                    📊{" "}
                                    {session.progress}% progress
                                  </span>

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  ) : (

                    <div className="empty-day">
                      No sessions scheduled for this day.
                    </div>

                  )}

                </div>

              )
            )}

          </div>

        ) : (

          <div className="empty-plan">

            <div className="empty-plan-icon">
              🧠
            </div>

            <h3>
              Your AI study timetable will appear here
            </h3>

            <p>
              Add your subjects below and click
              <strong> Generate Plan </strong>
              to create a complete schedule.
            </p>

          </div>

        )}

        {/* ==================================================
            PLAN SUMMARY
        ================================================== */}

        {generatedPlan &&
          Array.isArray(generatedPlan.days) &&
          generatedPlan.days.length > 0 && (

            <div className="plan-summary">

              <div className="summary-item">
                <span>📚</span>

                <div>
                  <strong>
                    {subjects.length}
                  </strong>

                  <small>
                    Subjects
                  </small>
                </div>
              </div>

              <div className="summary-item">
                <span>⏱️</span>

                <div>
                  <strong>
                    {totalStudyMinutes}
                  </strong>

                  <small>
                    Study minutes
                  </small>
                </div>
              </div>

              <div className="summary-item">
                <span>☕</span>

                <div>
                  <strong>
                    Smart
                  </strong>

                  <small>
                    Breaks included
                  </small>
                </div>
              </div>

              <div className="summary-item">
                <span>🌅</span>

                <div>
                  <strong>
                    Full Day
                  </strong>

                  <small>
                    Morning to Night
                  </small>
                </div>
              </div>

            </div>
          )}

      </section>

      {/* ======================================================
          ADD SUBJECT + SAVED SUBJECTS
      ====================================================== */}

      <section className="bottom-grid">

        {/* ====================================================
            ADD SUBJECT
        ==================================================== */}

        <div className="panel-card">

          <div className="panel-title">
            <span>＋</span>
            Add Subject
          </div>

          <form onSubmit={handleAddSubject}>

            {/* SUBJECT NAME */}

            <div className="form-group">

              <label>
                Subject Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. React Hooks"
              />

            </div>

            {/* DIFFICULTY */}

            <div className="form-group">

              <label>
                Difficulty
              </label>

              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
              >

                <option value="Easy">
                  🟢 Easy
                </option>

                <option value="Medium">
                  🟡 Medium
                </option>

                <option value="Hard">
                  🔴 Hard
                </option>

              </select>

            </div>

            {/* EXAM DATE */}

            <div className="form-group">

              <label>
                Exam Date
              </label>

              <input
                type="date"
                name="examDate"
                value={form.examDate}
                onChange={handleChange}
              />

            </div>

            {/* PROGRESS */}

            <div className="form-group">

              <label>
                Current Progress:{" "}
                <strong>
                  {form.progress}%
                </strong>
              </label>

              <input
                className="range-input"
                type="range"
                name="progress"
                min="0"
                max="100"
                value={form.progress}
                onChange={handleChange}
              />

            </div>

            {/* DAILY HOURS */}

            <div className="form-group">

              <label>
                Daily Study Hours
              </label>

              <input
                type="number"
                name="dailyHours"
                min="0.5"
                max="8"
                step="0.5"
                value={form.dailyHours}
                onChange={handleChange}
              />

            </div>

            {/* SAVE BUTTON */}

            <button
              type="submit"
              className="save-subject-button"
            >
              ＋ Save Subject
            </button>

          </form>

        </div>

        {/* ====================================================
            SAVED SUBJECTS
        ==================================================== */}

        <div className="panel-card">

          <div className="panel-title">
            📚 Saved Subjects
          </div>

          {subjects.length === 0 ? (

            <div className="no-subjects">

              <div>
                📚
              </div>

              <h3>
                No subjects yet
              </h3>

              <p>
                Add your first subject to create your study plan.
              </p>

            </div>

          ) : (

            <div className="subjects-list">

              {subjects.map(
                (subject) => (

                  <div
                    className="subject-card"
                    key={subject.id}
                  >

                    <div className="subject-card-header">

                      <div>

                        <h3>
                          {subject.name}
                        </h3>

                        <p>
                          {getDifficultyEmoji(
                            subject.difficulty
                          )}{" "}
                          {subject.difficulty}
                          {" • "}
                          {subject.dailyHours} hr/day
                        </p>

                      </div>

                      <strong>
                        {subject.progress}%
                      </strong>

                    </div>

                    <div className="progress-bar-container">

                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              Number(
                                subject.progress || 0
                              )
                            )
                          )}%`,
                        }}
                      />

                    </div>

                    {subject.examDate && (
                      <div className="exam-date">
                        📅 Exam:{" "}
                        {new Date(
                          `${subject.examDate}T00:00:00`
                        ).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                    )}

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeSubject(subject.id)
                      }
                    >
                      Remove
                    </button>

                  </div>
                )
              )}

            </div>

          )}

        </div>

      </section>

      {/* ======================================================
          AI PLANNING INFORMATION
      ====================================================== */}

      <section className="ai-info">

        <div className="ai-info-icon">
          🤖
        </div>

        <div>

          <h3>
            How your Smart Planner works
          </h3>

          <p>
            Your timetable prioritizes subjects with lower progress
            and creates a balanced schedule with study sessions,
            short recovery breaks and a lunch break.
          </p>

          <div className="ai-info-list">

            <span>
              🌅 Morning — Deep learning
            </span>

            <span>
              ☀️ Afternoon — Practice
            </span>

            <span>
              🌆 Evening — Revision
            </span>

            <span>
              🌙 Night — Light review
            </span>

          </div>

        </div>

      </section>

      {/* ======================================================
          CSS
      ====================================================== */}

      <style>{`

        /* =====================================================
           GLOBAL PLANNER
        ===================================================== */

        .planner-page {
          min-height: 100vh;
          background: #f5f7fb;
          color: #172033;
          padding: 32px 24px 60px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          box-sizing: border-box;
        }

        .planner-page * {
          box-sizing: border-box;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .planner-heading {
          max-width: 1100px;
          margin: 0 auto 22px;
        }

        .planner-eyebrow {
          color: #4f46e5;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .planner-title {
          margin: 0;
          font-size: 34px;
          line-height: 1.2;
          font-weight: 800;
          color: #11182b;
        }

        .planner-subtitle {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 16px;
        }

        /* =====================================================
           SAVED MESSAGE
        ===================================================== */

        .saved-message {
          max-width: 1100px;
          margin: 0 auto 18px;
          background: #ecfdf5;
          border: 1px solid #86efac;
          color: #166534;
          padding: 13px 16px;
          border-radius: 10px;
          font-size: 15px;
        }

        .planner-message {
          max-width: 1100px;
          margin: 0 auto 18px;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          color: #3730a3;
          padding: 13px 16px;
          border-radius: 10px;
          font-weight: 600;
        }

        /* =====================================================
           SMART GENERATOR
        ===================================================== */

        .smart-generator {
          max-width: 1100px;
          margin: 0 auto 24px;
          padding: 26px 28px;
          border-radius: 17px;
          background:
            linear-gradient(
              135deg,
              #3730a3 0%,
              #4f46e5 55%,
              #5146e5 100%
            );
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
          box-shadow:
            0 12px 30px rgba(79, 70, 229, 0.18);
        }

        .generator-content {
          min-width: 0;
        }

        .generator-eyebrow {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.4px;
          margin-bottom: 7px;
          color: #e0e7ff;
        }

        .smart-generator h2 {
          margin: 0 0 6px;
          font-size: 23px;
          font-weight: 800;
        }

        .smart-generator p {
          margin: 0;
          color: #e0e7ff;
          font-size: 15px;
        }

        .generator-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 15px;
        }

        .generator-features span {
          background: rgba(255, 255, 255, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .generate-button {
          border: none;
          background: white;
          color: #3730a3;
          border-radius: 10px;
          padding: 13px 20px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.2s ease;
        }

        .generate-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.15);
        }

        /* =====================================================
           GENERATED PLAN
        ===================================================== */

        .generated-plan {
          max-width: 1100px;
          margin: 0 auto 24px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 17px;
          padding: 24px;
          box-shadow:
            0 7px 20px rgba(15, 23, 42, 0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .section-header h2 {
          margin: 0;
          color: #11182b;
          font-size: 22px;
        }

        .section-header p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .clear-plan-button {
          background: white;
          border: 1px solid #cbd5e1;
          color: #475569;
          border-radius: 8px;
          padding: 9px 13px;
          cursor: pointer;
          font-weight: 700;
        }

        .clear-plan-button:hover {
          border-color: #ef4444;
          color: #dc2626;
        }

        /* =====================================================
           DAYS
        ===================================================== */

        .days-container {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .day-card {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          overflow: hidden;
        }

        .day-header {
          padding: 18px;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: center;
        }

        .day-small-label {
          color: #4f46e5;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.7px;
          margin-bottom: 4px;
        }

        .day-header h3 {
          margin: 0;
          font-size: 20px;
          color: #172033;
        }

        .day-date {
          background: #eef2ff;
          color: #4f46e5;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        /* =====================================================
           TIMELINE
        ===================================================== */

        .timeline {
          padding: 15px;
        }

        .study-row,
        .break-row {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr);
          gap: 10px;
        }

        .timeline-line {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .timeline-line::after {
          content: "";
          position: absolute;
          top: 32px;
          bottom: -15px;
          width: 2px;
          background: #e2e8f0;
        }

        .study-row:last-child .timeline-line::after,
        .break-row:last-child .timeline-line::after {
          display: none;
        }

        .study-dot,
        .break-dot {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 2;
          font-size: 14px;
        }

        .study-dot {
          background: #eef2ff;
          border: 1px solid #c7d2fe;
        }

        .break-dot {
          background: #fff7ed;
          border: 1px solid #fed7aa;
        }

        .study-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          padding: 14px;
          margin-bottom: 10px;
        }

        .study-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }

        .session-period {
          color: #4f46e5;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          margin-bottom: 3px;
        }

        .study-card h4 {
          margin: 0;
          font-size: 16px;
          color: #172033;
        }

        .difficulty-badge {
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .study-details {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 10px;
        }

        .study-details span {
          background: #f8fafc;
          color: #64748b;
          border-radius: 6px;
          padding: 5px 7px;
          font-size: 11px;
          font-weight: 600;
        }

        /* =====================================================
           BREAK
        ===================================================== */

        .break-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          margin-bottom: 10px;
          border-radius: 9px;
          background: #fffbeb;
          border: 1px dashed #fbbf24;
          color: #92400e;
        }

        .break-card strong {
          font-size: 12px;
        }

        .break-time {
          font-size: 11px;
          margin-top: 2px;
          color: #a16207;
        }

        .break-card > span {
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        /* =====================================================
           EMPTY PLAN
        ===================================================== */

        .empty-plan {
          text-align: center;
          padding: 55px 20px;
          background: #f8fafc;
          border-radius: 13px;
          border: 1px dashed #cbd5e1;
        }

        .empty-plan-icon {
          font-size: 45px;
          margin-bottom: 10px;
        }

        .empty-plan h3 {
          margin: 0 0 8px;
          font-size: 18px;
          color: #172033;
        }

        .empty-plan p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .empty-day {
          padding: 35px 15px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }

        /* =====================================================
           PLAN SUMMARY
        ===================================================== */

        .plan-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border-radius: 10px;
          padding: 12px;
        }

        .summary-item > span {
          font-size: 20px;
        }

        .summary-item strong {
          display: block;
          font-size: 16px;
          color: #172033;
        }

        .summary-item small {
          display: block;
          color: #64748b;
          font-size: 10px;
          margin-top: 2px;
        }

        /* =====================================================
           BOTTOM GRID
        ===================================================== */

        .bottom-grid {
          max-width: 1100px;
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .panel-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 17px;
          padding: 22px;
          box-shadow:
            0 7px 20px rgba(15, 23, 42, 0.05);
        }

        .panel-title {
          font-size: 21px;
          font-weight: 800;
          color: #172033;
          margin-bottom: 20px;
        }

        /* =====================================================
           FORM
        ===================================================== */

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #172033;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          min-height: 43px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: white;
          padding: 9px 11px;
          color: #172033;
          font-size: 14px;
          outline: none;
          transition: 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #4f46e5;
          box-shadow:
            0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .range-input {
          min-height: auto !important;
          padding: 0 !important;
          accent-color: #4f46e5;
          cursor: pointer;
        }

        .save-subject-button {
          width: 100%;
          border: none;
          border-radius: 8px;
          background: #4f46e5;
          color: white;
          padding: 12px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .save-subject-button:hover {
          background: #4338ca;
          transform: translateY(-1px);
        }

        /* =====================================================
           SUBJECT LIST
        ===================================================== */

        .subjects-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 3px;
        }

        .subject-card {
          border: 1px solid #dbe3ef;
          border-radius: 11px;
          padding: 14px;
          background: white;
        }

        .subject-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }

        .subject-card h3 {
          margin: 0;
          font-size: 15px;
          color: #172033;
        }

        .subject-card p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .subject-card-header > strong {
          color: #4f46e5;
          font-size: 16px;
        }

        .progress-bar-container {
          width: 100%;
          height: 7px;
          background: #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          margin-top: 10px;
        }

        .progress-bar {
          height: 100%;
          background: #4f46e5;
          border-radius: 20px;
          transition: width 0.3s ease;
        }

        .exam-date {
          color: #64748b;
          font-size: 11px;
          margin-top: 9px;
        }

        .remove-button {
          border: none;
          background: transparent;
          color: #64748b;
          padding: 0;
          margin-top: 9px;
          cursor: pointer;
          font-size: 12px;
        }

        .remove-button:hover {
          color: #dc2626;
        }

        .no-subjects {
          text-align: center;
          padding: 50px 20px;
          color: #64748b;
        }

        .no-subjects > div {
          font-size: 40px;
        }

        .no-subjects h3 {
          color: #172033;
          margin: 10px 0 5px;
          font-size: 17px;
        }

        .no-subjects p {
          margin: 0;
          font-size: 13px;
        }

        /* =====================================================
           AI INFO
        ===================================================== */

        .ai-info {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #c7d2fe;
          background: #eef2ff;
          border-radius: 14px;
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .ai-info-icon {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 10px;
          font-size: 23px;
        }

        .ai-info h3 {
          margin: 0 0 5px;
          color: #312e81;
          font-size: 17px;
        }

        .ai-info p {
          margin: 0;
          color: #4c4c7a;
          font-size: 13px;
          line-height: 1.6;
        }

        .ai-info-list {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 12px;
        }

        .ai-info-list span {
          background: white;
          color: #3730a3;
          padding: 6px 9px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 700;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 900px) {

          .days-container {
            grid-template-columns: 1fr;
          }

          .bottom-grid {
            grid-template-columns: 1fr;
          }

          .plan-summary {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        @media (max-width: 650px) {

          .planner-page {
            padding: 20px 14px 40px;
          }

          .planner-title {
            font-size: 28px;
          }

          .smart-generator {
            flex-direction: column;
            align-items: stretch;
            padding: 22px;
          }

          .generate-button {
            width: 100%;
          }

          .generated-plan,
          .panel-card {
            padding: 17px;
          }

          .section-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .clear-plan-button {
            width: 100%;
          }

          .plan-summary {
            grid-template-columns: 1fr 1fr;
          }

          .day-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .study-card-top {
            flex-direction: column;
          }

          .ai-info {
            flex-direction: column;
          }

        }

        @media (max-width: 420px) {

          .plan-summary {
            grid-template-columns: 1fr;
          }

          .study-details {
            flex-direction: column;
          }

          .generator-features {
            flex-direction: column;
            align-items: flex-start;
          }

        }

      `}</style>

    </div>
  );
}
