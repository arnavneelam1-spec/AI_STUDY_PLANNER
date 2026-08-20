export function generateStudyPlan(subjects) {
  if (!subjects || subjects.length === 0) {
    return {
      today: [],
      tomorrow: [],
    };
  }

  const rankedSubjects = subjects
    .map((subject) => {
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

      const urgencyScore = Math.min(
        100,
        Math.round((14 / daysLeft) * 100)
      );

      const difficultyScore =
        subject.difficulty === "hard"
          ? 100
          : subject.difficulty === "medium"
            ? 60
            : 30;

      const remainingScore =
        100 - Number(subject.progress);

      const priority = Math.round(
        urgencyScore * 0.45 +
          difficultyScore * 0.30 +
          remainingScore * 0.25
      );

      return {
        ...subject,
        priority,
        daysLeft,
      };
    })
    .sort((a, b) => b.priority - a.priority);

  const todayPlan = [];
  const tomorrowPlan = [];

  rankedSubjects.forEach((subject, index) => {
    const studyMinutes = Math.max(
      30,
      Math.round(subject.dailyHours * 60)
    );

    const todayMinutes =
      index === 0
        ? Math.min(studyMinutes, 120)
        : Math.min(studyMinutes, 60);

    todayPlan.push({
      id: `${subject.id}-today`,
      subject: subject.name,
      minutes: todayMinutes,
      priority: subject.priority,
      type:
        subject.priority >= 75
          ? "Priority Study"
          : "Focused Study",
      topic:
        subject.progress < 50
          ? "Core concepts"
          : "Practice & revision",
    });

    if (index < 3) {
      const tomorrowMinutes =
        index === 0
          ? Math.min(studyMinutes, 120)
          : Math.min(studyMinutes, 60);

      tomorrowPlan.push({
        id: `${subject.id}-tomorrow`,
        subject: subject.name,
        minutes: tomorrowMinutes,
        priority: subject.priority,
        type: "Next Day",
        topic:
          subject.progress < 70
            ? "Continue syllabus"
            : "Revision",
      });
    }
  });

  return {
    today: todayPlan,
    tomorrow: tomorrowPlan,
  };
}