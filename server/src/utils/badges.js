// Central badge registry. Keys are stored on user.badges; labels/icons are
// looked up here so changing display text never requires a data migration.
const BADGES = {
  first_lesson: { icon: '🎯', label: 'First lesson complete' },
  streak_3: { icon: '🔥', label: '3-day streak' },
  streak_7: { icon: '🔥', label: '7-day streak' },
  streak_30: { icon: '🔥', label: '30-day streak' },
  first_certificate: { icon: '🏅', label: 'First certificate earned' },
  course_complete: { icon: '🎓', label: 'Completed a full course' },
  five_courses: { icon: '⭐', label: 'Enrolled in 5+ courses' }
};

/**
 * Updates a user's learning streak based on today's activity, and awards
 * any newly-earned badges. Mutates the user document in place — caller is
 * responsible for calling user.save().
 */
function updateStreakAndBadges(user) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (user.lastActivityDate) {
    const last = new Date(user.lastActivityDate);
    last.setHours(0, 0, 0, 0);
    const dayDiff = Math.round((today - last) / (1000 * 60 * 60 * 24));

    if (dayDiff === 0) {
      // already logged activity today — streak unchanged
    } else if (dayDiff === 1) {
      user.currentStreak = (user.currentStreak || 0) + 1;
    } else {
      user.currentStreak = 1; // gap of 2+ days — streak resets
    }
  } else {
    user.currentStreak = 1;
  }

  user.lastActivityDate = today;
  user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);

  awardBadge(user, 'first_lesson');
  if (user.currentStreak >= 3) awardBadge(user, 'streak_3');
  if (user.currentStreak >= 7) awardBadge(user, 'streak_7');
  if (user.currentStreak >= 30) awardBadge(user, 'streak_30');
  if (user.enrolledCourses.length >= 5) awardBadge(user, 'five_courses');
}

function awardBadge(user, key) {
  if (!user.badges) user.badges = [];
  if (!user.badges.includes(key)) user.badges.push(key);
}

module.exports = { BADGES, updateStreakAndBadges, awardBadge };
