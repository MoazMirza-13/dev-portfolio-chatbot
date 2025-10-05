export const getButtonClass = (isActive: boolean) =>
  `px-3 py-1.5 rounded-md border text-sm transition cursor-pointer ${
    isActive
      ? "bg-gray-100 border-gray-400 text-foreground dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
      : "bg-muted text-muted-foreground border-transparent hover:bg-accent hover:text-accent-foreground"
  }`;
