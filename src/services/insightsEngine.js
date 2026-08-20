export function generateInsights(subjects) {
  if (!subjects || subjects.length === 0) {
    return {
      overall: "Add some subjects to start receiving insights.",
      insights: [],
    };
  }

  const analyzedSubjects = subjects.map((subject) => {
    const today = new Date();
    const exam = new Date(subject.examDate);

    const difference =
      exam.getTime() - today.getTime();

    const daysLeft = Math.max(
      1,
      Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      )
    );

    const remaining = 100 - Number(subject.progress);

    let difficultyScore = 30;

    if (subject.difficulty === "medium") {
      difficultyScore = 60;
    }

    if (subject.difficulty === "hard") {
      difficultyScore = 100;
    }

    const urgencyScore = Math.min(
      100,
      Math.round((14 / daysLeft) * 100)
    );

    const priority = Math.round(
      urgencyScore * 0.45 +
      difficultyScore * 0.3 +
      remaining * 0.25
    );

    return {
      ...subject,
      daysLeft,
      remaining,
      priority,
    };
  });

  const highestPriority = [...analyzedSubjects].sort(
    (a, b) => b.priority - a.priority
  )[0];

  const lowestProgress = [...analyzedSubjects].sort(
    (a, b) => a.progress - b.progress
  )[0];

  const closestExam = [...analyzedSubjects].sort(
    (a, b) => a.daysLeft - b.daysLeft
  )[0];

  const totalProgress = Math.round(
    analyzedSubjects.reduce(
      (sum, subject) =>
        sum + Number(subject.progress),
      0
    ) / analyzedSubjects.length
  );

  const totalDailyHours = analyzedSubjects.reduce(
    (sum, subject) =>
      sum + Number(subject.dailyHours),
    0
  );

  const insights = [];

  // Highest priority subject
  insights.push({
    id: 1,
    type: "priority",
    icon: "🚨",
    title: "Highest Priority",
    message: `${highestPriority.name} needs the most attention right now.`,
    details: `Priority score: ${highestPriority.priority}/100.`,
    action: `Focus on ${highestPriority.name} today.`,
  });

  // Closest exam
  if (closestExam.daysLeft <= 7) {
    insights.push({
      id: 2,
      type: "deadline",
      icon: "📅",
      title: "Upcoming Exam",
      message: `${closestExam.name} is approaching quickly.`,
      details: `${closestExam.daysLeft} day${
        closestExam.daysLeft !== 1
          ? "s"
          : ""
      } remaining.`,
      action: `Increase revision time for ${closestExam.name}.`,
    });
  }

  // Low progress
  if (lowestProgress.progress < 50) {
    insights.push({
      id: 3,
      type: "progress",
      icon: "📉",
      title: "Low Progress",
      message: `${lowestProgress.name} is currently below 50% completion.`,
      details: `Current progress: ${lowestProgress.progress}%.`,
      action: `Complete one focused session for ${lowestProgress.name} today.`,
    });
  }

  // Overall progress
  if (totalProgress >= 75) {
    insights.push({
      id: 4,
      type: "positive",
      icon: "🎉",
      title: "Strong Progress",
      message: "You're making excellent overall progress.",
      details: `Average completion is ${totalProgress}%.`,
      action: "Use your remaining time for revision and practice.",
    });
  } else if (totalProgress < 40) {
    insights.push({
      id: 4,
      type: "warning",
      icon: "⚠️",
      title: "Needs Attention",
      message: "Your overall syllabus progress is still low.",
      details: `Average completion is only ${totalProgress}%.`,
      action: "Increase your daily study consistency.",
    });
  }

  // Study hours
  if (totalDailyHours < 2) {
    insights.push({
      id: 5,
      type: "habit",
      icon: "⏱️",
      title: "Study Time",
      message: "Your planned study time is quite low.",
      details: `Current planned time: ${totalDailyHours} hours/day.`,
      action: "Consider adding another focused study session.",
    });
  } else if (totalDailyHours >= 4) {
    insights.push({
      id: 6,
      type: "habit",
      icon: "💪",
      title: "Strong Study Commitment",
      message: "You have allocated substantial study time.",
      details: `${totalDailyHours} hours/day are planned.`,
      action: "Protect your focus time and avoid overloading sessions.",
    });
  }

  let overall;

  if (highestPriority.priority >= 80) {
    overall = `Your immediate focus should be ${highestPriority.name}.`;
  } else if (totalProgress >= 70) {
    overall =
      "You're in a good position. Focus on revision and weak areas.";
  } else {
    overall =
      "You have a manageable workload, but consistency is important.";
  }

  return {
    overall,
    insights,
    totalProgress,
    totalDailyHours,
    highestPriority,
  };
}