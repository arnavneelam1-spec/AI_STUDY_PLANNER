const SUBJECTS_KEY = "studyPlanner_subjects";

export function loadSubjects(defaultSubjects = []) {
  try {
    const saved = localStorage.getItem(
      SUBJECTS_KEY
    );

    if (saved) {
      return JSON.parse(saved);
    }

    localStorage.setItem(
      SUBJECTS_KEY,
      JSON.stringify(defaultSubjects)
    );

    return defaultSubjects;
  } catch (error) {
    console.error(
      "Could not load subjects:",
      error
    );

    return defaultSubjects;
  }
}

export function saveSubjects(subjects) {
  try {
    localStorage.setItem(
      SUBJECTS_KEY,
      JSON.stringify(subjects)
    );
  } catch (error) {
    console.error(
      "Could not save subjects:",
      error
    );
  }
}

export function clearSubjects() {
  localStorage.removeItem(
    SUBJECTS_KEY
  );
}