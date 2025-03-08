// dataviewjs-habit-tracker | https://github.com/adamhl8/dataviewjs-habit-tracker
// Looking to make modifications? See the TypeScript source here: https://github.com/adamhl8/dataviewjs-habit-tracker/blob/main/src/index.ts

const defaultHeaders = ["Day"]
function getPageDay(currentPage) {
  const pageDay = currentPage.file.day
  if (!pageDay) {
    throw {
      stack:
        '(If this note is your template, this error is expected.) Unable to get note\'s day. Note should be named in the "YYYY-MM-DD" format.',
    }
  }
  return pageDay
}
function getDailyNotesPages(pageDay) {
  return dv
    .pages('"Daily Notes"')
    .where((p) => getPageDay(p) >= pageDay.minus({ days: 7 })) // Only include previous week in table.
    .where((p) => getPageDay(p) <= pageDay) // Don't include future notes.
    .sort((p) => p.file.day, "desc") // Sort table by most recent day.
}
function getCleanHabitText(habit) {
  let habitText = habit.text.split(" ✅")[0] ?? "" // Remove completion text from Tasks plugin.
  // Remove tag text.
  for (const tag of habit.tags) {
    habitText = habitText.replace(tag, "")
  }
  return habitText.trim()
}
function getPageHabits(page) {
  const habitTasks = page.file.tasks.filter((t) => t.section.subpath === "Habits" || t.tags.includes("#habit"))
  const habits = {}
  // Build habits. Key is the task's text. Value is tasks's completion.
  for (const habitTask of habitTasks) {
    const habitText = getCleanHabitText(habitTask)
    habits[habitText] = habitTask.completed
  }
  return habits
}
function createRow(pageData, headers) {
  const pageDay = getPageDay(pageData.page)
  const pageLink = pageData.page.file.link
  pageLink.display = pageDay.weekdayLong ?? "" // Set display name of the note link to the day of the week.
  const row = [pageLink] // Start building row data. Fill in first value (Day) with note link.
  for (const header of headers) {
    if (defaultHeaders.includes(header)) continue // Don't overwrite default headers.
    let habitStatus = "➖" // This emoji is seen if a corresponding task doesn't exist for a header (e.g. task didn't previously exist).
    if (Object.hasOwn(pageData.habits, header))
      // If task exists, we know it must be complete or incomplete.
      habitStatus = pageData.habits[header] ? "✔" : "❌"
    row.push(habitStatus)
  }
  return row
}
async function main() {
  const currentPage = dv.current()
  const pageDay = getPageDay(currentPage)
  const pages = getDailyNotesPages(pageDay)
  const headers = new Set(defaultHeaders) // Set of task names to be used as table headers.
  const pageDataArray = pages.map((page) => {
    const habits = getPageHabits(page)
    for (const habit of Object.keys(habits)) headers.add(habit)
    return { page, habits }
  })
  const rows = []
  for (const pageData of pageDataArray) {
    const row = createRow(pageData, headers)
    // don't include rows where no habits exist
    if (row.slice(defaultHeaders.length).every((status) => status === "➖")) continue
    rows.push(row)
  }
  await dv.table([...headers], rows)
}
await main()
