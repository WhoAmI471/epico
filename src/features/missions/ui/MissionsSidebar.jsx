import { FiltersPanel } from "./FiltersPanel";
import { MissionDetailsPanel } from "./MissionDetailsPanel";

export function MissionsSidebar({
  editingMission,
  allAssignees,
  onBackToFilters,
  onChangeEditingField,
  onSaveMissionChanges,
  openFilterPanel,
  setOpenFilterPanel,
  filterPreset,
  handleApplyPreset,
  filterName,
  setFilterName,
  selectedTypes,
  handleToggleType,
  laneFilter,
  setLaneFilter,
  filterPriority,
  setFilterPriority,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  selectedAssignees,
  handleToggleAssignee,
  handleToggleAssigneesAll,
  onlyMyMissions,
  setOnlyMyMissions,
  handleResetFilters,
  handleSaveFilter,
}) {
  return (
    <aside className="mt-4 w-full rounded-2xl bg-zinc-950/80 p-4 ring-1 ring-zinc-900/90 sm:mt-0 sm:w-[320px] lg:w-[360px]">
      {editingMission ? (
        <MissionDetailsPanel
          mission={editingMission}
          allAssignees={allAssignees}
          onBackToFilters={onBackToFilters}
          onChangeField={onChangeEditingField}
          onSave={onSaveMissionChanges}
        />
      ) : (
        <FiltersPanel
          open={openFilterPanel}
          onToggleOpen={() => setOpenFilterPanel((v) => !v)}
          filterPreset={filterPreset}
          onApplyPreset={handleApplyPreset}
          filterName={filterName}
          setFilterName={setFilterName}
          selectedTypes={selectedTypes}
          onToggleType={handleToggleType}
          laneFilter={laneFilter}
          setLaneFilter={setLaneFilter}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          allAssignees={allAssignees}
          selectedAssignees={selectedAssignees}
          onToggleAssignee={handleToggleAssignee}
          onToggleAssigneesAll={handleToggleAssigneesAll}
          onlyMyMissions={onlyMyMissions}
          setOnlyMyMissions={setOnlyMyMissions}
          onReset={handleResetFilters}
          onSave={handleSaveFilter}
        />
      )}
    </aside>
  );
}

