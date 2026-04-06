const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000';

function normalizeImage(imageUrl) {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${UPLOADS_BASE_URL}${imageUrl}`;
}

function randomHeight(item) {
  const heights = [220, 280, 320, 360];
  return heights[item.id % heights.length];
}

export default function ClothingList({ items, onDelete }) {
  if (!items.length) {
    return <div className="card empty-state">Zatiaľ nemáš uložené žiadne kúsky. Pridaj prvý outfit ingredient ✨</div>;
  }

  return (
    <div className="masonry-grid">
      {items.map((item) => (
        <div className="masonry-item" key={item.id}>
          <article className="card wardrobe-card">
            <div className="card-media-wrap" style={{ minHeight: randomHeight(item) }}>
              {item.image_url ? (
                <img className="item-image" style={{ height: randomHeight(item) }} src={normalizeImage(item.image_url)} alt={item.name} />
              ) : null}
              <span className="card-badge">{item.category}</span>
            </div>

            <div className="card-content">
              <div className="card-title-row">
                <h3 className="card-title">{item.name}</h3>
                <button className="ghost-btn" onClick={() => onDelete(item.id)}>Delete</button>
              </div>

              <div className="tag-list">
                {item.color && <span className="tag">{item.color}</span>}
                {item.season && <span className="tag">{item.season}</span>}
                {item.style && <span className="tag">{item.style}</span>}
                {item.formality && <span className="tag">{item.formality}</span>}
                {item.brand && <span className="tag">{item.brand}</span>}
              </div>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}
