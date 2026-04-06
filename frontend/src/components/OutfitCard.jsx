const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000';

function normalizeImage(imageUrl) {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${UPLOADS_BASE_URL}${imageUrl}`;
}

export default function OutfitCard({ outfit, onFavorite, onPlan }) {
  return (
    <div className="card outfit-preview recommend-hero">
      <div className="section-header">
        <div>
          <div className="panel-eyebrow">✨ AI pick</div>
          <h2 className="section-title">{outfit.name}</h2>
          {outfit.explanation && <p className="section-copy">{outfit.explanation}</p>}
        </div>
      </div>

      {Array.isArray(outfit.items) && outfit.items.length > 0 ? (
        <div className="mini-grid">
          {outfit.items.map((item) => (
            <div key={`${outfit.id || outfit.name}-${item.id}`} className="mini-item">
              {item.image_url ? (
                <img className="mini-image" src={normalizeImage(item.image_url)} alt={item.name} />
              ) : (
                <div className="mini-image" />
              )}
              <div>
                <strong>{item.name}</strong>
                <div className="muted">{item.category}</div>
                <div className="muted">{item.color || 'neutral tone'}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">AI zatiaľ nenašla vhodnú kombináciu.</div>
      )}

      {(onFavorite || onPlan) && (
        <div className="actions-row">
          {onFavorite && <button className="secondary-btn" onClick={onFavorite}>Do obľúbených</button>}
          {onPlan && <button className="primary-btn" onClick={onPlan}>Naplánovať outfit</button>}
        </div>
      )}
    </div>
  );
}
