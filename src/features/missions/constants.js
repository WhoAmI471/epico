export const INITIAL_MISSIONS = [
  {
    id: 1,
    title: "Исследовать путь пользователя по воронке от входа до корзины",
    date: "2024-04-12",
    time: "11:24",
    type: "research",
    lane: "Backlog",
    priority: "medium",
    assignee: "@leonidlapidus",
  },
  {
    id: 2,
    title: "Исследовать путь пользователя по воронке от входа до корзины",
    date: "2024-04-11",
    time: "11:24",
    type: "feature",
    lane: "Research",
    priority: "highest",
    assignee: "@vvmalya",
  },
  {
    id: 3,
    title: "Исследовать путь пользователя по воронке от входа до корзины",
    date: "2024-04-11",
    time: "11:24",
    type: "task",
    lane: "Development",
    priority: "low",
    assignee: "@ElderlyTM",
  },
  {
    id: 4,
    title: "Исследовать путь пользователя по воронке от входа до корзины",
    date: "2024-04-11",
    time: "11:24",
    type: "feature",
    lane: "QA & Test",
    priority: "high",
    assignee: "@IgorVict",
  },
  {
    id: 5,
    title: "Исследовать путь пользователя по воронке от входа до корзины",
    date: "2024-04-11",
    time: "11:24",
    type: "research",
    lane: "Business Analysis",
    priority: "medium",
    assignee: "@paveldurov",
  },
];

export const TYPE_CONFIG = {
  feature: { label: "Feature", color: "bg-violet-500" },
  research: { label: "Research", color: "bg-sky-500" },
  task: { label: "Task", color: "bg-emerald-500" },
};

export const PRIORITY_CONFIG_RU = {
  lowest: "Самый низкий",
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  highest: "Самый высокий",
};

export const PRIORITY_LABEL_EN = {
  lowest: "Lowest",
  low: "Low",
  medium: "Medium",
  high: "High",
  highest: "Highest",
};

export const PRIORITY_VISUAL = {
  lowest: { icon: "˅˅", color: "text-emerald-400" },
  low: { icon: "˅", color: "text-emerald-400" },
  medium: { icon: "=", color: "text-amber-300" },
  high: { icon: "˄", color: "text-rose-400" },
  highest: { icon: "˄˄", color: "text-rose-400" },
};

export const FILTER_PRESETS = [
  { id: "only-features", label: "Only Features", chipKey: "feature" },
  { id: "only-researches", label: "Only Researches", chipKey: "research" },
  { id: "only-tasks", label: "Only Tasks", chipKey: "task" },
];

export const LANE_CONFIG = {
  Backlog: { bg: "bg-rose-700", text: "text-white" },
  Research: { bg: "bg-violet-600", text: "text-white" },
  Development: { bg: "bg-sky-600", text: "text-white" },
  "QA & Test": { bg: "bg-emerald-600", text: "text-white" },
  "Business Analysis": { bg: "bg-amber-600", text: "text-white" },
};

export const LANES = [
  "Backlog",
  "Research",
  "Development",
  "QA & Test",
  "Business Analysis",
];

