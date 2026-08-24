import React, { useEffect, useState } from "react";

const Planner = () => {
  // =========================================================
  // SUBJECTS
  // Load subjects from localStorage when the page opens
  // =========================================================

  const [subjects, setSubjects] = useState(() => {
    try {
      const savedSubjects = localStorage.getItem(
        "aiStudyPlannerSubjects"
      );

      return savedSubjects
        ? JSON.parse(savedSubjects)
        : [];
    } catch (error) {
      console.error(
        "Error loading subjects:",
        error
      );

      return [];
    }
  });

  // =========================================================
  // GENERATED PLAN
  // Load previous generated plan from localStorage
  // =========================================================

  const [plan, setPlan] = useState(() => {
    try {
      const savedPlan = localStorage.getItem(
        "aiStudyPlannerPlan"
      );

      return savedPlan
        ? JSON.parse(savedPlan)
        : [];
    } catch (error) {
      console.error(
        "Error loading study plan:",
        error
      );

      return [];
    }
  });

  // =========================================================
  // FORM STATES
  // =========================================================

  const [subjectName, setSubjectName] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("medium");

  const [examDate, setExamDate] =
    useState("");

  const [progress, setProgress] =
    useState(0);

  const [dailyHours, setDailyHours] =
    useState(1);

  const [startTime, setStartTime] =
    useState("08:00");

  const [breakTime, setBreakTime] =
    useState(15);

  // =========================================================
  // SAVE SUBJECTS AUTOMATICALLY
  // =========================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "aiStudyPlannerSubjects",
        JSON.stringify(subjects)
      );
    } catch (error) {
      console.error(
        "Error saving subjects:",
        error
      );
    }
  }, [subjects]);

  // =========================================================
  // SAVE GENERATED PLAN AUTOMATICALLY
  // =========================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "aiStudyPlannerPlan",
        JSON.stringify(plan)
      );
    } catch (error) {
      console.error(
        "Error saving study plan:",
        error
      );
    }
  }, [plan]);

  // =========================================================
  // ADD SUBJECT
  // =========================================================

  const handleAddSubject = (e) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      alert("Please enter a subject name.");
      return;
    }

    const newSubject = {
      id: Date.now(),
      name: subjectName.trim(),
      difficulty: difficulty,
      examDate: examDate,
      progress: Number(progress),
      dailyHours: Number(dailyHours),
    };

    // IMPORTANT:
    // This adds the new subject to the existing array.
    // It does NOT replace previous subjects.

    setSubjects((previousSubjects) => [
      ...previousSubjects,
      newSubject,
    ]);

    // Clear form

    setSubjectName("");
    setDifficulty("medium");
    setExamDate("");
    setProgress(0);
    setDailyHours(1);
  };

  // =========================================================
  // REMOVE SUBJECT
  // =========================================================

  const handleRemoveSubject = (id) => {
    setSubjects((previousSubjects) =>
      previousSubjects.filter(
        (subject) => subject.id !== id
      )
    );
  };

  // =========================================================
  // CALCULATE SUBJECT PRIORITY
  // =========================================================

  const calculatePriority = (subject) => {
    let score = 0;

    // Difficulty

    if (subject.difficulty === "hard") {
      score += 30;
    } else if (
      subject.difficulty === "medium"
    ) {
      score += 20;
    } else {
      score += 10;
    }

    // Progress

    score +=
      30 -
      Math.round(
        Number(subject.progress) * 0.3
      );

    // Exam date

    if (subject.examDate) {
      const today = new Date();

      const exam = new Date(
        `${subject.examDate}T00:00:00`
      );

      const difference = Math.ceil(
        (exam.getTime() -
          today.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (difference <= 3) {
        score += 40;
      } else if (difference <= 7) {
        score += 30;
      } else if (difference <= 14) {
        score += 20;
      } else {
        score += 10;
      }
    }

    return Math.min(
      Math.max(score, 0),
      100
    );
  };

  // =========================================================
  // TIME CONVERSION
  // =========================================================

  const timeToMinutes = (time) => {
    const [hours, minutes] =
      time.split(":").map(Number);

    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes) => {
    const hours =
      Math.floor(minutes / 60) % 24;

    const mins = minutes % 60;

    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(mins).padStart(2, "0")}`;
  };

  // =========================================================
  // DETERMINE TIME PERIOD
  // =========================================================

  const getPeriod = (minutes) => {
    const hour =
      Math.floor(minutes / 60) % 24;

    if (hour >= 5 && hour < 12) {
      return "Morning";
    }

    if (hour >= 12 && hour < 17) {
      return "Afternoon";
    }

    if (hour >= 17 && hour < 21) {
      return "Evening";
    }

    return "Night";
  };

  // =========================================================
  // GENERATE SMART PLAN
  // =========================================================

  const generatePlan = () => {
    if (subjects.length === 0) {
      alert(
        "Please add at least one subject first."
      );

      return;
    }

    // Sort subjects according to priority

    const sortedSubjects = [
      ...subjects,
    ].sort(
      (a, b) =>
        calculatePriority(b) -
        calculatePriority(a)
    );

    const totalMinutes =
      Number(dailyHours) * 60;

    let remainingMinutes =
      totalMinutes;

    let currentTime =
      timeToMinutes(startTime);

    const generatedPlan = [];

    let subjectIndex = 0;

    // =======================================================
    // CREATE MAIN STUDY SESSIONS
    // =======================================================

    while (
      remainingMinutes >= 30 &&
      subjectIndex <
        sortedSubjects.length
    ) {
      const subject =
        sortedSubjects[subjectIndex];

      // Determine session length

      let studyDuration = 60;

      if (
        subject.difficulty === "hard"
      ) {
        studyDuration = 90;
      } else if (
        subject.difficulty === "easy"
      ) {
        studyDuration = 45;
      }

      // Do not exceed available time

      studyDuration = Math.min(
        studyDuration,
        remainingMinutes
      );

      const start =
        minutesToTime(currentTime);

      const end = minutesToTime(
        currentTime +
          studyDuration
      );

      generatedPlan.push({
        id: `${subject.id}-study-${Date.now()}-${subjectIndex}`,
        subject: subject.name,
        duration: studyDuration,
        start: start,
        end: end,
        period:
          getPeriod(currentTime),
        priority:
          calculatePriority(subject),
        type: "study",
      });

      currentTime += studyDuration;

      remainingMinutes -=
        studyDuration;

      // =====================================================
      // ADD BREAK
      // =====================================================

      if (
        remainingMinutes >=
        Number(breakTime)
      ) {
        const breakStart =
          minutesToTime(currentTime);

        currentTime +=
          Number(breakTime);

        const breakEnd =
          minutesToTime(currentTime);

        generatedPlan.push({
          id: `break-${subject.id}-${Date.now()}-${subjectIndex}`,
          subject: "Break",
          duration:
            Number(breakTime),
          start: breakStart,
          end: breakEnd,
          period: getPeriod(
            timeToMinutes(
              breakStart
            )
          ),
          priority: 0,
          type: "break",
        });

        remainingMinutes -=
          Number(breakTime);
      }

      subjectIndex++;
    }

    // =======================================================
    // ADD REVISION SESSION
    // =======================================================

    if (
      remainingMinutes >= 30 &&
      sortedSubjects.length > 0
    ) {
      const revisionSubject =
        sortedSubjects[
          subjectIndex %
            sortedSubjects.length
        ];

      const revisionDuration =
        Math.min(
          remainingMinutes,
          60
        );

      const start =
        minutesToTime(currentTime);

      const end = minutesToTime(
        currentTime +
          revisionDuration
      );

      generatedPlan.push({
        id: `revision-${Date.now()}`,
        subject: `${revisionSubject.name} Revision`,
        duration:
          revisionDuration,
        start: start,
        end: end,
        period:
          getPeriod(currentTime),
        priority:
          calculatePriority(
            revisionSubject
          ),
        type: "study",
      });
    }

    // Save plan in React state.
    // The useEffect above automatically
    // saves it to localStorage.

    setPlan(generatedPlan);
  };

  // =========================================================
  // CLEAR PLAN
  // =========================================================

  const clearPlan = () => {
    setPlan([]);

    localStorage.removeItem(
      "aiStudyPlannerPlan"
    );
  };

  // =========================================================
  // CLEAR ALL SUBJECTS
  // =========================================================

  const clearAllSubjects = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove all subjects?"
    );

    if (!confirmDelete) {
      return;
    }

    setSubjects([]);

    setPlan([]);

    localStorage.removeItem(
      "aiStudyPlannerSubjects"
    );

    localStorage.removeItem(
      "aiStudyPlannerPlan"
    );
  };

  // =========================================================
  // CALCULATE SUMMARY
  // =========================================================

  const totalStudyTime = plan
    .filter(
      (item) => item.type === "study"
    )
    .reduce(
      (total, item) =>
        total + item.duration,
      0
    );

  const totalBreakTime = plan
    .filter(
      (item) => item.type === "break"
    )
    .reduce(
      (total, item) =>
        total + item.duration,
      0
    );

  const studySessions = plan.filter(
    (item) => item.type === "study"
  ).length;

  // =========================================================
  // PERIODS
  // =========================================================

  const periods = [
    "Morning",
    "Afternoon",
    "Evening",
    "Night",
  ];

  const getPeriodItems = (period) => {
    return plan.filter(
      (item) => item.period === period
    );
  };

  const getPeriodIcon = (period) => {
    if (period === "Morning") {
      return "🌅";
    }

    if (period === "Afternoon") {
      return "☀️";
    }

    if (period === "Evening") {
      return "🌇";
    }

    return "🌙";
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <div className="planner-page">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="planner-header">

          <div>
            <div className="planner-label">
              SMART PLANNING
            </div>

            <h1>
              📚 Study Planner
            </h1>

            <p>
              Create a personalized study
              timetable based on your
              subjects, progress and
              exam dates.
            </p>
          </div>

          <div className="planner-header-icon">
            🧠
          </div>

        </div>

        {/* ===================================================
            SAVED MESSAGE
        =================================================== */}

        <div className="saved-message">
          💾{" "}
          <strong>
            {subjects.length}
          </strong>{" "}
          subject
          {subjects.length !== 1
            ? "s"
            : ""}{" "}
          saved automatically.
        </div>

        {/* ===================================================
            PLAN SETTINGS
        =================================================== */}

        <div className="planner-settings">

          <div className="section-heading">
            ⚙️ Plan Settings
          </div>

          <div className="row g-3">

            <div className="col-md-4">

              <label className="form-label">
                Daily Study Hours
              </label>

              <input
                type="number"
                min="1"
                max="12"
                className="form-control"
                value={dailyHours}
                onChange={(e) =>
                  setDailyHours(
                    Number(e.target.value)
                  )
                }
              />

            </div>

            <div className="col-md-4">

              <label className="form-label">
                Study Start Time
              </label>

              <input
                type="time"
                className="form-control"
                value={startTime}
                onChange={(e) =>
                  setStartTime(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="col-md-4">

              <label className="form-label">
                Break After Each Session
              </label>

              <select
                className="form-select"
                value={breakTime}
                onChange={(e) =>
                  setBreakTime(
                    Number(
                      e.target.value
                    )
                  )
                }
              >
                <option value={5}>
                  5 minutes
                </option>

                <option value={10}>
                  10 minutes
                </option>

                <option value={15}>
                  15 minutes
                </option>

                <option value={20}>
                  20 minutes
                </option>

                <option value={30}>
                  30 minutes
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* ===================================================
            SMART GENERATOR
        =================================================== */}

        <div className="smart-generator">

          <div>

            <div className="smart-label">
              🧠 SMART PLANNER
            </div>

            <h2>
              Generate Today's
              Timetable
            </h2>

            <p>
              Your planner analyzes
              difficulty, progress and
              exam dates to prioritize
              your study sessions.
            </p>

          </div>

          <button
            className="generate-button"
            onClick={generatePlan}
          >
            🧠 Generate Smart Plan
          </button>

        </div>

        {/* ===================================================
            SUMMARY
        =================================================== */}

        {plan.length > 0 && (
          <div className="summary-grid">

            <div className="summary-card">

              <span>📚</span>

              <div>
                <strong>
                  {studySessions}
                </strong>

                <small>
                  Study Sessions
                </small>
              </div>

            </div>

            <div className="summary-card">

              <span>⏱️</span>

              <div>
                <strong>
                  {totalStudyTime} min
                </strong>

                <small>
                  Study Time
                </small>
              </div>

            </div>

            <div className="summary-card">

              <span>☕</span>

              <div>
                <strong>
                  {totalBreakTime} min
                </strong>

                <small>
                  Break Time
                </small>
              </div>

            </div>

            <div className="summary-card">

              <span>🎯</span>

              <div>
                <strong>
                  {subjects.length}
                </strong>

                <small>
                  Subjects
                </small>
              </div>

            </div>

          </div>
        )}

        {/* ===================================================
            FULL TIMETABLE
        =================================================== */}

        {plan.length > 0 && (
          <div className="timetable-section">

            <div className="section-title-row">

              <div>

                <div className="small-label">
                  TODAY'S SCHEDULE
                </div>

                <h2>
                  🗓️ Your Smart
                  Timetable
                </h2>

              </div>

              <div className="timetable-actions">

                <div className="schedule-info">
                  {formatDate(
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  )}
                </div>

                <button
                  className="clear-plan-button"
                  onClick={clearPlan}
                >
                  Clear Plan
                </button>

              </div>

            </div>

            {periods.map(
              (period) => {

                const periodItems =
                  getPeriodItems(
                    period
                  );

                if (
                  periodItems.length ===
                  0
                ) {
                  return null;
                }

                return (
                  <div
                    className="period-section"
                    key={period}
                  >

                    <div className="period-heading">

                      <span>
                        {getPeriodIcon(
                          period
                        )}
                      </span>

                      <div>

                        <strong>
                          {period}
                        </strong>

                        <small>
                          {
                            periodItems.length
                          }{" "}
                          scheduled
                          {periodItems.length ===
                          1
                            ? " item"
                            : " items"}
                        </small>

                      </div>

                    </div>

                    <div className="timeline">

                      {periodItems.map(
                        (item) => (

                          <div
                            className={`timeline-item ${
                              item.type ===
                              "break"
                                ? "break-item"
                                : ""
                            }`}
                            key={item.id}
                          >

                            <div className="time-column">

                              <strong>
                                {item.start}
                              </strong>

                              <span>
                                {item.end}
                              </span>

                            </div>

                            <div className="timeline-line">

                              <div className="timeline-dot">
                                {item.type ===
                                "break"
                                  ? "☕"
                                  : "📚"}
                              </div>

                            </div>

                            <div className="schedule-card">

                              {item.type ===
                              "break" ? (
                                <>
                                  <div className="schedule-card-title">
                                    ☕ Healthy
                                    Break
                                  </div>

                                  <p>
                                    Relax,
                                    drink
                                    water,
                                    stretch
                                    and
                                    refresh
                                    your
                                    mind.
                                  </p>

                                  <div className="duration">
                                    {
                                      item.duration
                                    }{" "}
                                    minutes
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="schedule-card-top">

                                    <div>

                                      <div className="schedule-card-title">
                                        {
                                          item.subject
                                        }
                                      </div>

                                      <p>
                                        Focused
                                        study
                                        session
                                      </p>

                                    </div>

                                    <span className="priority-badge">
                                      Priority{" "}
                                      {
                                        item.priority
                                      }
                                    </span>

                                  </div>

                                  <div className="schedule-details">

                                    <span>
                                      ⏰{" "}
                                      {
                                        item.start
                                      }{" "}
                                      –{" "}
                                      {
                                        item.end
                                      }
                                    </span>

                                    <span>
                                      ⏱️{" "}
                                      {
                                        item.duration
                                      }{" "}
                                      min
                                    </span>

                                  </div>

                                </>
                              )}

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

        {/* ===================================================
            SUBJECT SECTION
        =================================================== */}

        <div className="row g-4 mt-1">

          {/* =================================================
              ADD SUBJECT
          ================================================= */}

          <div className="col-lg-6">

            <div className="content-card">

              <div className="section-heading">
                ➕ Add Subject
              </div>

              <p className="muted">
                Add your subjects so the
                smart planner can create
                your personalized timetable.
              </p>

              <form
                onSubmit={
                  handleAddSubject
                }
              >

                <div className="mb-3">

                  <label className="form-label">
                    Subject Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. React Hooks"
                    value={
                      subjectName
                    }
                    onChange={(e) =>
                      setSubjectName(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Difficulty
                  </label>

                  <select
                    className="form-select"
                    value={
                      difficulty
                    }
                    onChange={(e) =>
                      setDifficulty(
                        e.target.value
                      )
                    }
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

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Exam Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={
                      examDate
                    }
                    onChange={(e) =>
                      setExamDate(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Current Progress:{" "}
                    <strong>
                      {progress}%
                    </strong>
                  </label>

                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="100"
                    value={
                      progress
                    }
                    onChange={(e) =>
                      setProgress(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />

                </div>

                <div className="mb-4">

                  <label className="form-label">
                    Preferred Daily
                    Hours
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    min="0.5"
                    max="8"
                    step="0.5"
                    value={
                      dailyHours
                    }
                    onChange={(e) =>
                      setDailyHours(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />

                </div>

                <button
                  type="submit"
                  className="save-button"
                >
                  + Save Subject
                </button>

              </form>

            </div>

          </div>

          {/* =================================================
              SAVED SUBJECTS
          ================================================= */}

          <div className="col-lg-6">

            <div className="content-card">

              <div className="saved-header">

                <div className="section-heading">
                  📚 Saved Subjects
                </div>

                {subjects.length >
                  0 && (
                  <button
                    className="clear-all-button"
                    onClick={
                      clearAllSubjects
                    }
                  >
                    Clear All
                  </button>
                )}

              </div>

              {subjects.length ===
              0 ? (

                <div className="empty-state">

                  <div>
                    📚
                  </div>

                  <h4>
                    No subjects yet
                  </h4>

                  <p>
                    Add your first
                    subject to
                    generate a smart
                    study plan.
                  </p>

                </div>

              ) : (

                <div className="subjects-list">

                  {subjects.map(
                    (subject) => (

                      <div
                        className="subject-card"
                        key={
                          subject.id
                        }
                      >

                        <div className="subject-top">

                          <div>

                            <h4>
                              {
                                subject.name
                              }
                            </h4>

                            <p>
                              {
                                subject.difficulty
                              }{" "}
                              •{" "}
                              {
                                subject.dailyHours
                              }{" "}
                              hr/day
                            </p>

                          </div>

                          <strong>
                            {
                              calculatePriority(
                                subject
                              )
                            }
                            /100
                          </strong>

                        </div>

                        <div className="progress">

                          <div
                            className="progress-bar"
                            style={{
                              width: `${subject.progress}%`,
                            }}
                          />

                        </div>

                        <div className="subject-bottom">

                          <span>
                            Progress{" "}
                            {
                              subject.progress
                            }
                            %
                          </span>

                          <span>
                            Exam:{" "}
                            {subject.examDate
                              ? formatDate(
                                  subject.examDate
                                )
                              : "Not set"}
                          </span>

                          <button
                            onClick={() =>
                              handleRemoveSubject(
                                subject.id
                              )
                            }
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ===================================================
            HOW IT WORKS
        =================================================== */}

        <div className="how-it-works">

          <div className="section-heading">
            🤖 How Smart Planning
            Works
          </div>

          <div className="row g-3">

            <div className="col-md-4">

              <div className="explanation-card">

                <span>
                  1️⃣
                </span>

                <h4>
                  Analyze
                </h4>

                <p>
                  The planner checks
                  subject difficulty,
                  current progress and
                  upcoming exam dates.
                </p>

              </div>

            </div>

            <div className="col-md-4">

              <div className="explanation-card">

                <span>
                  2️⃣
                </span>

                <h4>
                  Prioritize
                </h4>

                <p>
                  Subjects requiring
                  more attention receive
                  a higher priority score.
                </p>

              </div>

            </div>

            <div className="col-md-4">

              <div className="explanation-card">

                <span>
                  3️⃣
                </span>

                <h4>
                  Schedule
                </h4>

                <p>
                  Study sessions and
                  healthy breaks are
                  arranged into a complete
                  timetable.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .planner-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 30px;
          color: #182033;
        }

        .planner-header {
          background: linear-gradient(
            135deg,
            #4338ca,
            #5548ee
          );

          color: white;

          border-radius: 20px;

          padding: 32px;

          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-bottom: 20px;

          box-shadow:
            0 12px 30px
            rgba(67, 56, 202, 0.18);
        }

        .planner-label {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
          opacity: 0.9;
        }

        .planner-header h1 {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .planner-header p {
          margin: 0;
          font-size: 16px;
          opacity: 0.9;
        }

        .planner-header-icon {
          font-size: 70px;
        }

        .saved-message {
          background: #e9fff2;
          border: 1px solid #9ae6b4;
          color: #166534;
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 20px;
        }

        .planner-settings {
          background: white;
          padding: 25px;
          border-radius: 18px;
          margin-bottom: 20px;

          box-shadow:
            0 5px 18px
            rgba(20, 30, 60, 0.06);
        }

        .section-heading {
          font-size: 21px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .form-label {
          font-weight: 700;
          color: #273149;
        }

        .form-control,
        .form-select {
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 11px 13px;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #4f46e5;

          box-shadow:
            0 0 0 3px
            rgba(79, 70, 229, 0.1);
        }

        .smart-generator {
          background: linear-gradient(
            135deg,
            #3730a3,
            #5145e5
          );

          color: white;

          border-radius: 20px;

          padding: 28px;

          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 20px;

          margin-bottom: 22px;
        }

        .smart-label,
        .small-label {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.3px;
          margin-bottom: 7px;
          opacity: 0.85;
        }

        .smart-generator h2 {
          font-size: 26px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .smart-generator p {
          margin: 0;
          opacity: 0.9;
        }

        .generate-button {
          border: none;

          background: white;

          color: #3730a3;

          padding: 14px 22px;

          border-radius: 11px;

          font-weight: 800;

          white-space: nowrap;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .generate-button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 8px 20px
            rgba(0, 0, 0, 0.15);
        }

        .summary-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 16px;

          margin-bottom: 22px;
        }

        .summary-card {
          background: white;

          border-radius: 16px;

          padding: 20px;

          display: flex;

          align-items: center;

          gap: 15px;

          box-shadow:
            0 5px 18px
            rgba(20, 30, 60, 0.06);
        }

        .summary-card > span {
          width: 48px;
          height: 48px;

          display: flex;

          align-items: center;

          justify-content: center;

          background: #eef2ff;

          border-radius: 12px;

          font-size: 24px;
        }

        .summary-card strong {
          display: block;
          font-size: 21px;
          font-weight: 800;
        }

        .summary-card small {
          display: block;
          color: #64748b;
          margin-top: 3px;
        }

        .timetable-section {
          background: white;

          border-radius: 20px;

          padding: 28px;

          margin-bottom: 25px;

          box-shadow:
            0 5px 20px
            rgba(20, 30, 60, 0.07);
        }

        .section-title-row {
          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-bottom: 25px;
        }

        .section-title-row h2 {
          font-weight: 800;
          margin: 0;
        }

        .timetable-actions {
          display: flex;

          align-items: center;

          gap: 10px;
        }

        .schedule-info {
          background: #eef2ff;

          color: #4f46e5;

          padding: 10px 15px;

          border-radius: 10px;

          font-weight: 700;
        }

        .clear-plan-button {
          border: none;

          background: #fee2e2;

          color: #b91c1c;

          padding: 10px 15px;

          border-radius: 10px;

          font-weight: 700;

          cursor: pointer;
        }

        .period-section {
          margin-bottom: 30px;
        }

        .period-heading {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-bottom: 15px;

          padding-bottom: 10px;

          border-bottom:
            1px solid #e2e8f0;
        }

        .period-heading > span {
          font-size: 26px;
        }

        .period-heading strong {
          display: block;
          font-size: 18px;
        }

        .period-heading small {
          color: #64748b;
        }

        .timeline-item {
          display: grid;

          grid-template-columns:
            90px 35px 1fr;

          gap: 12px;

          margin-bottom: 12px;
        }

        .time-column {
          text-align: right;
          padding-top: 14px;
        }

        .time-column strong {
          display: block;
          font-size: 14px;
        }

        .time-column span {
          color: #94a3b8;
          font-size: 12px;
        }

        .timeline-line {
          position: relative;

          display: flex;

          justify-content: center;
        }

        .timeline-line::before {
          content: "";

          position: absolute;

          top: 0;

          bottom: -15px;

          width: 2px;

          background: #e2e8f0;
        }

        .timeline-dot {
          width: 34px;
          height: 34px;

          border-radius: 50%;

          background: #eef2ff;

          display: flex;

          justify-content: center;

          align-items: center;

          z-index: 2;
        }

        .schedule-card {
          background: #f8fafc;

          border: 1px solid #e2e8f0;

          border-radius: 13px;

          padding: 15px 17px;
        }

        .schedule-card-title {
          font-size: 17px;
          font-weight: 800;
        }

        .schedule-card p {
          color: #64748b;
          margin: 4px 0 10px;
        }

        .schedule-card-top {
          display: flex;

          justify-content: space-between;

          gap: 10px;
        }

        .priority-badge {
          background: #ede9fe;

          color: #4f46e5;

          border-radius: 20px;

          padding: 6px 10px;

          height: fit-content;

          font-size: 12px;

          font-weight: 800;
        }

        .schedule-details {
          display: flex;

          gap: 18px;

          color: #475569;

          font-size: 13px;

          font-weight: 600;
        }

        .break-item .schedule-card {
          background: #fffaf0;
          border-color: #fde68a;
        }

        .break-item .timeline-dot {
          background: #fef3c7;
        }

        .content-card {
          background: white;

          border-radius: 18px;

          padding: 24px;

          height: 100%;

          box-shadow:
            0 5px 18px
            rgba(20, 30, 60, 0.06);
        }

        .muted {
          color: #64748b;

          margin-bottom: 20px;
        }

        .save-button {
          width: 100%;

          border: none;

          background: #4f46e5;

          color: white;

          padding: 12px;

          border-radius: 10px;

          font-weight: 800;

          cursor: pointer;
        }

        .save-button:hover {
          background: #4338ca;
        }

        .saved-header {
          display: flex;

          justify-content: space-between;

          align-items: flex-start;
        }

        .clear-all-button {
          border: none;

          background: #fee2e2;

          color: #b91c1c;

          padding: 7px 10px;

          border-radius: 8px;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;
        }

        .subjects-list {
          display: flex;

          flex-direction: column;

          gap: 12px;
        }

        .subject-card {
          border: 1px solid #dbe3ef;

          border-radius: 13px;

          padding: 15px;
        }

        .subject-top {
          display: flex;

          justify-content: space-between;

          gap: 10px;
        }

        .subject-top h4 {
          font-size: 16px;

          font-weight: 800;

          margin: 0;
        }

        .subject-top p {
          color: #64748b;

          margin: 4px 0 10px;

          font-size: 13px;
        }

        .subject-top strong {
          color: #4f46e5;

          font-size: 16px;
        }

        .progress {
          height: 7px;

          background: #e2e8f0;

          border-radius: 20px;

          overflow: hidden;
        }

        .progress-bar {
          background: #4f46e5;

          border-radius: 20px;

          height: 100%;
        }

        .subject-bottom {
          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 10px;

          margin-top: 8px;

          font-size: 12px;

          color: #64748b;
        }

        .subject-bottom button {
          border: none;

          background: transparent;

          color: #64748b;

          cursor: pointer;

          font-weight: 600;
        }

        .subject-bottom button:hover {
          color: #dc2626;
        }

        .empty-state {
          text-align: center;

          padding: 50px 20px;

          color: #64748b;
        }

        .empty-state > div {
          font-size: 40px;

          margin-bottom: 10px;
        }

        .empty-state h4 {
          color: #182033;

          font-weight: 800;
        }

        .how-it-works {
          margin-top: 25px;

          background: white;

          padding: 25px;

          border-radius: 18px;

          box-shadow:
            0 5px 18px
            rgba(20, 30, 60, 0.06);
        }

        .explanation-card {
          background: #f8fafc;

          border: 1px solid #e2e8f0;

          border-radius: 13px;

          padding: 20px;

          height: 100%;
        }

        .explanation-card span {
          font-size: 25px;
        }

        .explanation-card h4 {
          margin-top: 10px;

          font-weight: 800;
        }

        .explanation-card p {
          color: #64748b;

          margin: 0;
        }

        @media (max-width: 900px) {

          .planner-page {
            padding: 18px;
          }

          .planner-header {
            padding: 24px;
          }

          .planner-header h1 {
            font-size: 28px;
          }

          .planner-header-icon {
            font-size: 45px;
          }

          .summary-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 650px) {

          .planner-header {
            flex-direction: column;

            align-items: flex-start;
          }

          .planner-header-icon {
            display: none;
          }

          .smart-generator {
            flex-direction: column;

            align-items: flex-start;
          }

          .generate-button {
            width: 100%;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .section-title-row {
            flex-direction: column;

            align-items: flex-start;

            gap: 12px;
          }

          .timetable-actions {
            flex-direction: column;

            align-items: flex-start;
          }

          .timeline-item {
            grid-template-columns:
              65px 25px 1fr;

            gap: 7px;
          }

          .schedule-card-top {
            flex-direction: column;
          }

          .schedule-details {
            flex-direction: column;

            gap: 5px;
          }

          .subject-bottom {
            flex-direction: column;

            align-items: flex-start;
          }

        }

      `}</style>
    </>
  );
};

export default Planner;
