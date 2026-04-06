import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';

export default function CalendarPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    apiRequest('/calendar').then(setPlans).catch(console.error);
  }, []);

  return (
    <main className="page">
      <section className="card recommend-hero">
        <div className="panel-eyebrow">Outfit planner</div>
        <h1 className="page-title">Kalendár outfitov</h1>
        <p className="page-subtitle">Naplánované kombinácie pre jednotlivé dni.</p>
      </section>

      <section className="card">
        {plans.length ? (
          <div className="calendar-list">
            {plans.map((plan) => (
              <div className="list-row" key={plan.id}>
                <div>
                  <strong>{plan.outfit_name}</strong>
                  <div className="muted">Naplánovaný look</div>
                </div>
                <div className="chip-date">{new Date(plan.planned_date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">Kalendár je zatiaľ prázdny.</div>
        )}
      </section>
    </main>
  );
}
