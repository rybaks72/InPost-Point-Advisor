import type { RecommendedPoint } from "../types/point";

type RankingListProps = {
  recommendedPoints: RecommendedPoint[];
  isLoading: boolean;
  error: string | null;
};

function RankingList({ recommendedPoints, isLoading, error }: RankingListProps) {

  return (
    <section className="card ranking-card">
      <div className="card-header">
        <h2>Recommended pickup points</h2>
        <p>
          The ranking compares points using distance, status, availability and
          selected preferences.
        </p>
      </div>

      {isLoading && (
        <div className="empty-ranking">
          Loading InPost points and calculating recommendations...
        </div>
      )}

      {!isLoading && error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!isLoading && !error && recommendedPoints.length === 0 && (
        <div className="empty-ranking">
          Run a search to see the best matching InPost points.
        </div>
      )}

      {!isLoading && !error && recommendedPoints.length > 0 && (
        <div className="ranking-list">
          {recommendedPoints.map((recommendedPoint, index) => (
            <article key={recommendedPoint.point.name} className="ranking-item">
              <div className="ranking-item-main">
                <div>
                  <h3 className="ranking-title">
                    #{index + 1} {recommendedPoint.point.name}
                  </h3>

                  <p className="ranking-meta">
                    {recommendedPoint.distanceKm.toFixed(2)} km ·{" "}
                    {recommendedPoint.point.status} · score {recommendedPoint.score}
                  </p>
                </div>

                <span className="ranking-badge">
                  {recommendedPoint.point.address_details?.city ?? "Unknown city"}
                </span>
              </div>

              {recommendedPoint.reasons.length > 0 && (
                <div className="ranking-reasons">
                  {recommendedPoint.reasons.map((reason) => (
                    <span key={reason} className="reason-chip">
                      {reason}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default RankingList
