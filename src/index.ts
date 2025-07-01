import type { DateTime } from "luxon"
import type { DataArray } from "obsidian-dataview/lib/api/data-array.d.ts"
import type { DataviewInlineApi } from "obsidian-dataview/lib/api/inline-api.d.ts"
import type { SMarkdownPage, STask } from "obsidian-dataview/lib/data-model/serialized/markdown.d.ts"
import type { Link } from "obsidian-dataview/lib/data-model/value.d.ts"

interface ExtendedDataviewInlineApi extends DataviewInlineApi {
  current: () => SMarkdownPage
}

declare const dv: ExtendedDataviewInlineApi

// This is our own object for storing a page along with its habits.
interface PageData {
  page: SMarkdownPage
  habits: Record<string, boolean>
}

const defaultHeaders = ["Day"]

function getPageDay(currentPage: SMarkdownPage) {
  const pageDay = currentPage.file.day
  if (!pageDay) {
    // biome-ignore lint/style/useThrowOnlyError: Obsidian shows the stack trace if an error occurs, so we overwrite it to show a friendlier message.
    throw {
      stack:
        '(If this note is your template, this error is expected.) Unable to get note\'s day. Note should be named in the "YYYY-MM-DD" format.',
    }
  }
  return pageDay
}

function getDailyNotesPages(pageDay: DateTime) {
  return dv
    .pages('"Daily Notes"')
    .where((p: SMarkdownPage) => getPageDay(p) >= pageDay.minus({ days: 7 })) // Only include previous week in table.
    .where((p: SMarkdownPage) => getPageDay(p) <= pageDay) // Don't include future notes.
    .sort((p: SMarkdownPage) => p.file.day, "desc") as DataArray<SMarkdownPage> // Sort table by most recent day.
}

function getCleanHabitText(habit: STask) {
  let habitText = habit.text.split(" ✅")[0] ?? "" // Remove completion text from Tasks plugin.
  // Remove tag text.
  for (const tag of habit.tags) {
    habitText = habitText.replace(tag, "")
  }
  return habitText.trim()
}

function getPageHabits(page: SMarkdownPage) {
  const habitTasks = page.file.tasks.filter(
    (t) => (t.section as Link).subpath === "Habits" || t.tags.includes("#habit"),
  )
  const habits: Record<string, boolean> = {}

  // Build habits. Key is the task's text. Value is tasks's completion.
  for (const habitTask of habitTasks) {
    const habitText = getCleanHabitText(habitTask)
    habits[habitText] = habitTask.completed
  }

  return habits
}

function createRow(pageData: PageData, headers: Set<string>) {
  const pageDay = getPageDay(pageData.page)
  const pageLink = pageData.page.file.link as Link
  pageLink.display = pageDay.weekdayLong ?? "" // Set display name of the note link to the day of the week.

  const row: (Link | string)[] = [pageLink] // Start building row data. Fill in first value (Day) with note link.
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
  const pageDataArray: DataArray<PageData> = pages.map((page) => {
    const habits = getPageHabits(page)
    for (const habit of Object.keys(habits)) headers.add(habit)
    return { page, habits }
  })

  const rows: (string | Link)[][] = []
  for (const pageData of pageDataArray) {
    const row = createRow(pageData, headers)
    // don't include rows where no habits exist
    if (row.slice(defaultHeaders.length).every((status) => status === "➖")) continue
    rows.push(row)
  }

  await dv.table([...headers], rows)
}

await main()
