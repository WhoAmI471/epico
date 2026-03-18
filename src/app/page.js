"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  PRIORITY_CONFIG_RU,
  TYPE_CONFIG,
} from "../features/missions/constants";
import { classNames } from "../shared/ui";
import { MissionsHeader } from "../features/missions/ui/MissionsHeader";
import { MissionsList } from "../features/missions/ui/MissionsList";
import { CreateMissionBar } from "../features/missions/ui/CreateMissionBar";
import { MissionsSidebar } from "../features/missions/ui/MissionsSidebar";
import { RequireAuth } from "../shared/auth/RequireAuth";
import { RequireOnboarding } from "../shared/auth/RequireOnboarding";
import {
  loadProjectsFromLocalStorage,
  saveProjectsToLocalStorage,
  getAccessibleProjects,
  createProject,
  addMemberToProject,
  updateProjectMissions,
} from "../features/projects/localRepository";
import { deriveHandleFromSession } from "../features/projects/utils";
import { ProductHeader } from "../features/projects/ui/ProductHeader";

export default function Home() {
  const { data: session, status } = useSession();

  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [onboardingDisplayName, setOnboardingDisplayName] = useState(null);

  const currentProject = useMemo(
    () => projects.find((p) => p.id === currentProjectId) || null,
    [projects, currentProjectId],
  );

  const [missions, setMissions] = useState([]);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftType, setDraftType] = useState("feature");
  const [draftPriority, setDraftPriority] = useState("medium");
  const [draftLane, setDraftLane] = useState("Backlog");
  const [showDraftConfigurator, setShowDraftConfigurator] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState({
    feature: false,
    research: false,
    task: false,
  });
  const [openFilterPanel, setOpenFilterPanel] = useState(true);
  const [filterPreset, setFilterPreset] = useState(null);
  const [filterName, setFilterName] = useState("Untitled-1");
  const [filterPriority, setFilterPriority] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [onlyMyMissions, setOnlyMyMissions] = useState(false);
  const [laneFilter, setLaneFilter] = useState("All Mission");
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [editingMission, setEditingMission] = useState(null);

  const projectMembers = currentProject?.members || [];
  const allAssignees = useMemo(
    () => projectMembers.map((m) => m.handle).filter(Boolean),
    [projectMembers],
  );
  const currentUserId = session?.user?.id || session?.user?.sub;
  const currentUserHandle = useMemo(() => {
    if (!currentUserId) return allAssignees[0] || null;
    return (
      projectMembers.find((m) => m.userId === currentUserId)?.handle ||
      allAssignees[0] ||
      null
    );
  }, [currentUserId, projectMembers, allAssignees]);

  const [projectsReady, setProjectsReady] = useState(false);
  const accessibleProjects = useMemo(() => {
    if (!currentUserId) return [];
    return getAccessibleProjects(projects, currentUserId);
  }, [projects, currentUserId]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (projectsReady) return;

    const userId = session?.user?.id || session?.user?.sub;
    if (!userId) return;

    const onboardingNameKey = `epico:displayName:${userId}`;
    const onboardingDisplayName =
      localStorage.getItem(onboardingNameKey) ||
      session?.user?.name ||
      "User";
    setOnboardingDisplayName(onboardingDisplayName);

    const existingProjects = loadProjectsFromLocalStorage();
    const accessible = getAccessibleProjects(existingProjects, userId);

    let nextProjects = existingProjects;
    let nextCurrentProject = accessible[0] || null;

    if (!nextCurrentProject) {
      const ownerMember = {
        userId,
        name: onboardingDisplayName,
        handle: deriveHandleFromSession(session.user, onboardingDisplayName),
      };
      const project = createProject({
        title: onboardingDisplayName,
        ownerMember,
      });
      nextProjects = [project, ...existingProjects];
      nextCurrentProject = project;
    }

    setProjects(nextProjects);
    setCurrentProjectId(nextCurrentProject.id);
    saveProjectsToLocalStorage(nextProjects);
    setProjectsReady(true);
  }, [status, projectsReady, session]);

  useEffect(() => {
    if (!currentProject) return;
    setMissions(currentProject.missions || []);
    setSelectedMissionId(null);
    setEditingMission(null);
    setSelectedAssignees([]);
    setOnlyMyMissions(false);
  }, [currentProject?.id]);

  const visibleMissions = useMemo(() => {
    let result = missions;

    const typeKeys = Object.keys(selectedTypes).filter(
      (t) => selectedTypes[t],
    );
    if (typeKeys.length > 0) {
      result = result.filter((m) => typeKeys.includes(m.type));
    }

    if (filterPriority !== "all") {
      result = result.filter((m) => m.priority === filterPriority);
    }

    if (dateFrom) {
      result = result.filter((m) => m.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((m) => m.date <= dateTo);
    }

    if (selectedAssignees.length > 0) {
      result = result.filter((m) =>
        selectedAssignees.includes(m.assignee),
      );
    }

    if (laneFilter !== "All Mission") {
      result = result.filter((m) => m.lane === laneFilter);
    }

    if (onlyMyMissions && currentUserHandle) {
      result = result.filter((m) => m.assignee === currentUserHandle);
    }

    return result;
  }, [
    missions,
    selectedTypes,
    filterPriority,
    dateFrom,
    dateTo,
    selectedAssignees,
    laneFilter,
    onlyMyMissions,
    currentUserHandle,
  ]);

  useEffect(() => {
    if (!selectedMissionId) {
      setEditingMission(null);
      return;
    }
    const mission = missions.find((m) => m.id === selectedMissionId);
    setEditingMission(mission ? { ...mission } : null);
  }, [selectedMissionId, missions]);

  function handleToggleType(type) {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  function handleApplyPreset(preset) {
    setFilterPreset(preset.id);
    setSelectedTypes({
      feature: preset.chipKey === "feature",
      research: preset.chipKey === "research",
      task: preset.chipKey === "task",
    });
  }

  function handleToggleAssignee(name) {
    setSelectedAssignees((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }

  function handleSaveFilter() {
    const activeTypes = Object.entries(selectedTypes)
      .filter(([, active]) => active)
      .map(([key]) => TYPE_CONFIG[key].label)
      .join(", ");

    const activeAssignees =
      selectedAssignees.length > 0 ? selectedAssignees.join(", ") : "Все";

    const summary = [
      `Типы: ${activeTypes || "Все"}`,
      `Приоритет: ${
        filterPriority === "all" ? "Все" : PRIORITY_CONFIG_RU[filterPriority]
      }`,
      `Исполнители: ${activeAssignees}`,
    ].join("\n");

    alert(`Фильтр "${filterName}" сохранён.\n\n${summary}`);
  }

  function handleResetFilters() {
    setSelectedTypes({ feature: false, research: false, task: false });
    setFilterPriority("all");
    setDateFrom("");
    setDateTo("");
    setSelectedAssignees([]);
    setFilterPreset(null);
    setOnlyMyMissions(false);
    setLaneFilter("All Mission");
  }

  function handleCreateMission() {
    const title =
      draftTitle.trim() || `Новая миссия #${missions.length + 1}`;
    const nextId = missions[0]?.id ? Math.max(...missions.map((m) => m.id)) + 1 : 1;

    const createdMission = {
      id: nextId,
      title,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: draftType,
      lane: draftLane,
      priority: draftPriority,
      assignee: allAssignees[0] ?? "@new",
    };

    const nextMissions = [createdMission, ...missions];
    setMissions(nextMissions);
    setProjects((prev) => {
      const updated = prev.map((p) =>
        p.id === currentProjectId
          ? updateProjectMissions(p, nextMissions)
          : p,
      );
      saveProjectsToLocalStorage(updated);
      return updated;
    });
    setDraftTitle("");
  }

  function handleCreateProject() {
    if (status !== "authenticated") return;
    const userId = currentUserId;
    if (!userId) return;

    const title =
      onboardingDisplayName ||
      session?.user?.name ||
      "Untitled";

    const ownerMember = {
      userId,
      name: title,
      handle: deriveHandleFromSession(session.user, title),
    };

    const project = createProject({ title, ownerMember });
    const nextProjects = [project, ...projects];
    setProjects(nextProjects);
    saveProjectsToLocalStorage(nextProjects);
    setCurrentProjectId(project.id);
    setMissions([]);
    setSelectedMissionId(null);
    setEditingMission(null);
    setSelectedAssignees([]);
    setOnlyMyMissions(false);
    setOpenFilterPanel(true);
    setFilterPreset(null);
    handleResetFilters();
  }

  function handleAddUserToProject() {
    if (!currentProjectId) return;
    const name = window.prompt("User display name:");
    if (!name) return;
    const usernameOrHandle = window.prompt(
      "Username/handle (without @). Leave empty to auto-generate:"
    );

    const normalizedHandle = usernameOrHandle
      ? `@${String(usernameOrHandle).replace(/^@/, "").trim()}`
      : deriveHandleFromSession({ name }, name);

    const member = {
      userId: `member:${normalizedHandle}`,
      name: String(name),
      handle: normalizedHandle,
    };

    setProjects((prev) => {
      const updated = prev.map((p) =>
        p.id === currentProjectId ? addMemberToProject(p, member) : p,
      );
      saveProjectsToLocalStorage(updated);
      return updated;
    });
    setSelectedAssignees([]);
  }

  function handleSaveMissionChanges() {
    if (!editingMission) return;

    const nextMissions = missions.map((m) =>
      m.id === editingMission.id ? editingMission : m,
    );
    setMissions(nextMissions);
    setProjects((prev) => {
      const updated = prev.map((p) =>
        p.id === currentProjectId
          ? updateProjectMissions(p, nextMissions)
          : p,
      );
      saveProjectsToLocalStorage(updated);
      return updated;
    });
  }

  function handleChangeEditingField(field, value) {
    setEditingMission((prev) =>
      prev ? { ...prev, [field]: value } : prev,
    );
  }

  return (
    <RequireAuth>
      <RequireOnboarding>
        <div className="flex min-h-screen bg-gradient-to-b from-[#05060a] to-[#0b0b14] text-zinc-50">
          <main className="flex w-full flex-col px-8 py-6 lg:px-10 lg:py-8">
            <MissionsHeader />
            <ProductHeader
              projects={accessibleProjects}
              currentProjectId={currentProjectId}
              onSelectProject={setCurrentProjectId}
              onCreateProject={handleCreateProject}
            />

        <section className="flex flex-1 flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
              <CreateMissionBar
                draftTitle={draftTitle}
                setDraftTitle={setDraftTitle}
                onCreate={handleCreateMission}
                showConfigurator={showDraftConfigurator}
                setShowConfigurator={setShowDraftConfigurator}
                draftType={draftType}
                setDraftType={setDraftType}
                draftPriority={draftPriority}
                setDraftPriority={setDraftPriority}
                draftLane={draftLane}
                setDraftLane={setDraftLane}
              />
            </div>

            <div className="mb-3 flex items-center justify-between text-[11px] font-medium text-zinc-500">
              <span>
                Всего миссий:{" "}
                <span className="text-zinc-200">{visibleMissions.length}</span>
              </span>
              <button
                type="button"
                onClick={() => setOnlyMyMissions((v) => !v)}
                className="inline-flex items-center gap-1 rounded-full bg-zinc-950/60 px-3 py-1 text-[11px] font-medium ring-1 ring-zinc-800/90 hover:bg-zinc-900"
              >
                <span
                  className={classNames(
                    "h-1.5 w-1.5 rounded-full",
                    onlyMyMissions ? "bg-emerald-400" : "bg-zinc-600",
                  )}
                />
                Только мои
              </button>
            </div>

            <MissionsList
              missions={visibleMissions}
              selectedMissionId={selectedMissionId}
              onSelect={setSelectedMissionId}
            />
          </div>

          <MissionsSidebar
            editingMission={editingMission}
            allAssignees={allAssignees}
            onAddUser={handleAddUserToProject}
            onBackToFilters={() => setSelectedMissionId(null)}
            onChangeEditingField={handleChangeEditingField}
            onSaveMissionChanges={handleSaveMissionChanges}
            openFilterPanel={openFilterPanel}
            setOpenFilterPanel={setOpenFilterPanel}
            filterPreset={filterPreset}
            handleApplyPreset={handleApplyPreset}
            filterName={filterName}
            setFilterName={setFilterName}
            selectedTypes={selectedTypes}
            handleToggleType={handleToggleType}
            laneFilter={laneFilter}
            setLaneFilter={setLaneFilter}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            selectedAssignees={selectedAssignees}
            handleToggleAssignee={handleToggleAssignee}
            handleToggleAssigneesAll={() =>
              setSelectedAssignees(
                selectedAssignees.length ? [] : [...allAssignees],
              )
            }
            onlyMyMissions={onlyMyMissions}
            setOnlyMyMissions={setOnlyMyMissions}
            handleResetFilters={handleResetFilters}
            handleSaveFilter={handleSaveFilter}
          />
          </section>
          </main>
        </div>
      </RequireOnboarding>
    </RequireAuth>
  );
}
