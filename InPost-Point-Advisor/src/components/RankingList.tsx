import type { RecommendedPoint } from "../types/point";

type RankingListProps = {
  recommendedPoints: RecommendedPoint[];
  isLoading: boolean;
  error: string | null;
  onSelectPoint: (point: RecommendedPoint) => void;
  selectedPoint: RecommendedPoint | null;
};

function RankingList({ recommendedPoints, isLoading, error, onSelectPoint, selectedPoint }: RankingListProps) {

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
          {recommendedPoints.map((recommendedPoint, index) => {
            const addr = recommendedPoint.point.address_details;
            const addressLine = addr
              ? [addr.street, addr.building_number, addr.post_code, addr.city]
                  .filter(Boolean)
                  .join(" ")
              : null;

            const is24h = recommendedPoint.point.opening_hours
              ?.toLowerCase()
              .includes("24") ?? false;

            return (
              <article
                key={recommendedPoint.point.name}
                className={`ranking-item ${selectedPoint?.point.name === recommendedPoint.point.name ? "ranking-item--selected" : ""}`}
                onClick={() => onSelectPoint(recommendedPoint)}
                style={{ cursor: "pointer" }}
              >
                <div className="ranking-item-top">
                  <div className="ranking-item-top-left">
                    <div className="ranking-rank-badge">
                      {index + 1}
                    </div>
                    <div className="ranking-name-block">
                      <h3 className="ranking-title">
                        {recommendedPoint.point.name}
                      </h3>
                      {addressLine && (
                        <p className="ranking-address">{addressLine}</p>
                      )}
                      {recommendedPoint.reasons.length > 0 && (
                        <p className="ranking-reasons-text">
                          {recommendedPoint.reasons.join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                  {addr?.city && (
                    <span className="pill pill-city">
                      {addr.city}
                    </span>
                  )}
                </div>

                {/* Bottom row: pills */}
                <div className="ranking-pills">
                  <span className="pill pill-distance">
                    {recommendedPoint.distanceKm.toFixed(1)} km
                  </span>

                  <span className={`pill pill-status ${recommendedPoint.point.status === "Operating" ? "pill-status--ok" : "pill-status--off"}`}>
                    {recommendedPoint.point.status}
                  </span>

                  {is24h && (
                    <span className="pill pill-24h">24/7</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RankingList;