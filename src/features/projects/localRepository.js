// LocalStorage repository (prototype).
// Future step: replace this module with a MongoDB-backed repository
// that keeps the same public functions/signatures.
const STORAGE_KEY = "epico:projects:v1";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function loadProjectsFromLocalStorage() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = safeParse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveProjectsToLocalStorage(projects) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getAccessibleProjects(projects, userId) {
  return projects.filter((p) => p?.members?.some((m) => m.userId === userId));
}

export function createProject({ title, ownerMember }) {
  return {
    id: uid(),
    title: title || "Untitled",
    createdAt: new Date().toISOString(),
    members: [ownerMember],
    missions: [],
  };
}

export function addMemberToProject(project, member) {
  const exists = project.members.some((m) => m.userId === member.userId);
  if (exists) return project;
  return {
    ...project,
    members: [...project.members, member],
  };
}

export function updateProjectMissions(project, missions) {
  return {
    ...project,
    missions,
  };
}

export function updateProjectTitle(project, title) {
  return {
    ...project,
    title: title || "Untitled",
  };
}

export function removeMemberFromProject(project, userId) {
  const nextMembers = (project?.members || []).filter(
    (m) => m?.userId !== userId,
  );

  if (nextMembers.length === (project?.members || []).length) {
    return project;
  }

  return {
    ...project,
    members: nextMembers,
  };
}

