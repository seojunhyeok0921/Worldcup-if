import { GROUPS } from '../data/worldCup2026.js';

export default function GroupTabs({ selected, onSelect }) {
  return (
    <div className="group-tabs" role="tablist" aria-label="월드컵 조 선택">
      {Object.keys(GROUPS).map((group) => (
        <button
          key={group}
          className={group === selected ? 'active' : ''}
          onClick={() => onSelect(group)}
          role="tab"
          aria-selected={group === selected}
        >
          {group}조
        </button>
      ))}
    </div>
  );
}
