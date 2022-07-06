const habits = [] // Array of objects for each page's tasks.
const defaultHeaders = ['Day']
const headers = new Set(defaultHeaders) // Set of task names to be used as table headers.
const rows = []

const noteDay = dv.current().file.day
const pages = dv
  .pages('"Daily Notes"')
  .where((p) => p.file.day >= noteDay.minus({ days: 7 })) // Only include previous week in table.
  .where((p) => p.file.day <= noteDay) // Don't include future notes.
  .sort((p) => p.file.day, 'desc') // Sort table by most recent day.

for (const page of pages) {
  // Only include tasks under a header named "Habits".
  const pageHabits = page.file.tasks.filter((t) => t.header.subpath == 'Habits')

  const noteLink = page.file.link
  noteLink.display = page.file.day.weekdayLong // Set display name of the note link to the day of the week.
  const habitsObject = { noteLink }

  for (const habit of pageHabits) {
    const habitText = habit.text.split(' ✅')[0] // Remove completion text from Tasks plugin if it exsits.
    habitsObject[habitText] = habit.completed // Build habitsObject. Key is the task's text. Value is tasks's completion.
    headers.add(habitText) // Build headers set where each header is the task's text.
  }

  habits.push(habitsObject)
}

for (const habitsObject of habits) {
  const row = [habitsObject.noteLink] // Start building row data. Fill in first value (Day) with note link.
  for (const header of headers) {
    if (defaultHeaders.includes(header)) continue // Don't overwrite default headers.

    let habitStatus = '➖' // This emoji is seen if a corresponding task doesn't exist for a header (e.g. task didn't previously exist).
    if (habitsObject.hasOwnProperty(header))
      // If task exists, we know it must be complete or incomplete.
      habitStatus = habitsObject[header] ? '✔' : '❌'
    row.push(habitStatus)
  }
  rows.push(row)
}

dv.table(headers, rows)
