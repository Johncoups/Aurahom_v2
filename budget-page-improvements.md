- [X] Use the project's construction method instead of the hard-coded `traditional-frame`
  - [X] Load the selected construction method from Supabase `roadmap_data`/profile when the dashboard initializes
  - [X] Pass the construction method through context or props into `BudgetPage`
  - [X] Update `BudgetPage` to rebuild categories and seed data whenever the construction method changes
  - [X] Add fallback handling if a method is missing or unsupported in the alignment JSON

- [X] Support construction method switching in the UI
  - [X] Design a selector (dropdown/tabs) listing available construction methods from the alignment file
  - [X] Persist the selected method to Supabase so it follows the project
  - [X] Trigger a budget refresh (categories + data) when the user switches methods
  - [X] Provide user feedback when switching methods overwrites unsaved edits

- [X] Persist budget edits to Supabase (or API)
  - [X] Define a Supabase table schema for budget items (project id, phase, description, cost fields)
  - [X] Load existing budget rows for the project on mount and merge with seeded defaults
  - [X] Save item edits, additions, and deletions via Supabase mutations with optimistic UI updates
  - [X] Handle conflict resolution or versioning so simultaneous edits don't overwrite each other
  - [X] **FIXED: Budget page now loads saved data from Supabase on mount** - Added loadBudgetData function and useEffect to fetch and merge stored items with seeded defaults

- [X] Add per-phase "Other / Custom Item" support
  - [X] Provide an "Add custom item" action within each phase accordion
  - [X] Initialize new custom rows with editable description and zeroed cost fields
  - [X] Persist custom rows alongside standard items in Supabase with a custom flag
  - [X] Allow users to delete custom items without affecting seeded entries
  - [X] Implement debounced saves (1.5s) with immediate flush on blur for smooth data entry
  - [X] Add pending save indicator (spinner) to show when saves are in progress

- [X] Implement phase-level rollups and summaries
  - [X] Calculate estimated vs. actual vs. variance totals per phase
  - [X] Display phase totals in the accordion header or a summary bar
  - [X] Add optional visual indicators (progress bars or badges) for variance thresholds
  - [X] Include project-wide totals that sum across phases

- [ ] Provide filtering, search, and collapse/expand controls
  - [ ] Add a search input to filter rows by description or vendor
  - [ ] Implement phase-level and global collapse/expand toggles
  - [ ] Remember user-expanded state between sessions (local storage or Supabase user prefs)
  - [ ] Offer quick filters (e.g., show phases with over-budget variance)

- [ ] Add validation cues for data entry
  - [ ] Enforce numeric formatting on currency inputs with masking or validation rules
  - [ ] Flag negative or non-numeric values with inline error states
  - [ ] Highlight variance overruns (actual > estimated) with color cues
  - [ ] Prevent saving invalid rows until errors are resolved

- [ ] Implement import/export functionality
  - [ ] Define a CSV/JSON schema matching the budget data model
  - [ ] Build an export action to download the current budget (respecting filters)
  - [ ] Add an import workflow with preview + validation before committing data
  - [ ] Handle duplicate detection and merge strategies during import
