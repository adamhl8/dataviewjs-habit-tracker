# dataviewjs-habit-tracker

This is a code snippet for the Obsidian plugin [Dataview](https://github.com/blacksmithgu/obsidian-dataview). This generates a table that tracks habit completions over the past week. No Dataview annotations required!

Issues/PRs are welcome and encouraged.

## Example

```
## Habits
- [ ] Exercise
- [ ] Read
- [ ] Study
- [ ] New Habit

(you can also use a "#habit" tag)

- [ ] #habit Exercise
...

<dataviewjs code block here>
```

Get snippet code [here](https://github.com/adamhl8/dataviewjs-habits-tracker/blob/main/dataviewjs.js).

![](https://user-images.githubusercontent.com/1844269/177612045-5409aff4-c569-419c-8314-1554ee206091.png)

- It automatically creates table headers based on unique task names (no duplicates).
- **This means you don't need to define any specific Dataview annotations. Just normal tasks.**
- If a task didn't exist previously (or no longer exists), you'll see a "➖" for its status. Otherwise, "✔" for complete and "❌" for incomplete.

## Setup

**If the table does not show up right away, try restarting Obsidian.**

This assumes you're using the built-in Daily notes plugin.

- In your daily notes template, add habits (as tasks) under a header named "Habits".
  - You can also add a `#habit` tag to your tasks in addition to or instead of the header.
- Paste the [dataviewjs snippet](https://github.com/adamhl8/dataviewjs-habits-tracker/blob/main/dataviewjs.js) in a dataviewjs code block in your template.

````
```dataviewjs
<code here>
```
````

- Create daily notes using a "YYYY-MM-DD" naming scheme. e.g. 2022-07-31
- Place daily notes in a folder called "Daily Notes".
  - To use a different folder name, change the `.pages('"Daily Notes"')` line in the code.
