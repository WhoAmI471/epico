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
    title: "Добавить метод получения списка задач при загрузке фичи",
    date: "2024-04-11",
    time: "11:24",
    type: "feature",
    lane: "Development",
    priority: "low",
    assignee: "@ElderlyTN",
  },
  {
    id: 3,
    title: "Добавить метод получения списка фильтров и сортировок",
    date: "2024-04-11",
    time: "11:24",
    type: "task",
    lane: "QA & Test",
    priority: "high",
    assignee: "@EgorVict",
  },
  {
    id: 4,
    title: "Исправить поведение кнопки вызова модального окна на главной",
    date: "2024-04-11",
    time: "11:24",
    type: "feature",
    lane: "Business Analysis",
    priority: "highest",
    assignee: "@vikakorobov",
  },
  {
    id: 5,
    title: "Исправить страницу одного товара: кнопка добавления в корзину",
    date: "2024-04-11",
    time: "11:24",
    type: "research",
    lane: "Backlog",
    priority: "medium",
    assignee: "@vvmalya",
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
  lowest: { icon: "/lowest.svg", color: "text-emerald-400" },
  low: { icon: "/low.svg", color: "text-emerald-400" },
  medium: { icon: "/medium.svg", color: "text-amber-300" },
  high: { icon: "/high.svg", color: "text-rose-400" },
  highest: { icon: "/highest.svg", color: "text-rose-400" },
};

export const FILTER_PRESETS = [
  { id: "only-features", label: "Only Features", chipKey: "feature" },
  { id: "only-researches", label: "Only Researches", chipKey: "research" },
  { id: "only-tasks", label: "Only Tasks", chipKey: "task" },
];

export const LANE_CONFIG = {
  Backlog: { bg: "bg-[#9F1849]", text: "text-white" },
  Research: { bg: "bg-[#6826AB]", text: "text-white" },
  Development: { bg: "bg-[#0D4FCB]", text: "text-white" },
  "QA & Test": { bg: "bg-[#1A8200]", text: "text-white" },
  "Business Analysis": { bg: "bg-[#B65B08]", text: "text-white" },
};

export const LANES = [
  "Backlog",
  "Research",
  "Development",
  "QA & Test",
  "Business Analysis",
];

