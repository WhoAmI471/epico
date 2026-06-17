export function MissionTypeIcon({ type }) {
  if (type === "feature") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="4.5" y="4.5" width="9" height="9" fill="#C768E9" />
      </svg>
    );
  }
  if (type === "research") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="5" fill="#3B7FFF" />
      </svg>
    );
  }
  if (type === "task") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 4L14.5 13H3.5L9 4Z" fill="#51B738" />
      </svg>
    );
  }
  return null;
}

