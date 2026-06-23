export default function AdSlot({ label = '스폰서 슬롯', compact = false }) {
  const client = import.meta.env.VITE_ADSENSE_CLIENT;
  const slot = compact ? import.meta.env.VITE_ADSENSE_SLOT_BOTTOM : import.meta.env.VITE_ADSENSE_SLOT_TOP;

  if (client && slot) {
    return (
      <aside className="ad-slot real-ad" aria-label="광고 영역">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>
    );
  }

  return (
    <aside className={`ad-slot ${compact ? 'compact' : ''}`} aria-label="스폰서 영역">
      <span>{label}</span>
      <strong>광고·스폰서 자리</strong>
      <small>승인 후 애드센스 또는 직접 스폰서 배너로 교체</small>
    </aside>
  );
}
