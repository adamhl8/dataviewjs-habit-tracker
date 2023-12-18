// dataviewjs-habit-tracker | https://github.com/adamhl8/dataviewjs-habit-tracker
// Looking to make modifications? See the TypeScript source here: https://github.com/adamhl8/dataviewjs-habit-tracker/blob/main/src/index.ts

// src/index.ts
var getPageDay = function (currentPage) {
  const pageDay = currentPage.file.day
  if (!pageDay) {
    throw {
      stack:
        '(If this note is your template, this error is expected.) Unable to get note\'s day. Note should be named in the "YYYY-MM-DD" format.',
    }
  }
  return pageDay
}
var getDailyNotesPages = function (pageDay) {
  return dv
    .pages('"Daily Notes"')
    .where((p) => getPageDay(p) >= pageDay.minus({ days: 7 }))
    .where((p) => getPageDay(p) <= pageDay)
    .sort((p) => p.file.day, "desc")
}
var getCleanHabitText = function (habit) {
  let habitText = habit.text.split(" \u2705")[0] ?? ""
  for (const tag of habit.tags) {
    habitText = habitText.replace(tag, "")
  }
  return habitText.trim()
}
var getPageHabits = function (page) {
  const habitTasks = page.file.tasks.filter((t) => t.section.subpath == "Habits")
  const habits = {}
  for (const habitTask of habitTasks) {
    const habitText = getCleanHabitText(habitTask)
    habits[habitText] = habitTask.completed
  }
  return habits
}
var createRow = function (pageData, headers) {
  const pageDay = getPageDay(pageData.page)
  const pageLink = pageData.page.file.link
  pageLink.display = pageDay.weekdayLong ?? ""
  const row = [pageLink]
  for (const header of headers) {
    if (defaultHeaders.includes(header)) continue
    let habitStatus = "\u2796"
    if (Object.prototype.hasOwnProperty.call(pageData.habits, header))
      habitStatus = pageData.habits[header] ? "\u2714" : "\u274C"
    row.push(habitStatus)
  }
  return row
}
async function main() {
  const currentPage = dv.current()
  const pageDay = getPageDay(currentPage)
  const pages = getDailyNotesPages(pageDay)
  const headers = new Set(defaultHeaders)
  const pageDataArray = pages.map((page) => {
    const habits = getPageHabits(page)
    for (const habit of Object.keys(habits)) headers.add(habit)
    return { page, habits }
  })
  const rows = []
  for (const pageData of pageDataArray) {
    const row = createRow(pageData, headers)
    rows.push(row)
  }
  await dv.table([...headers], rows)
}
var defaultHeaders = ["Day"]
await main()
