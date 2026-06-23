export function AuthSidebar() {
  return (
    <aside className="hidden md:flex w-80 lg:w-96 shrink-0 flex-col items-center justify-center gap-3 bg-neutral-200 dark:bg-neutral-800 border-r border-neutral-300 dark:border-neutral-600 p-12">
      <span className="text-6xl font-bold text-green-600 dark:text-green-400 leading-none select-none">
        &Oslash;
      </span>
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
        OffNotes
      </h1>
      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Your notes, on or offline.
      </p>
    </aside>
  )
}
