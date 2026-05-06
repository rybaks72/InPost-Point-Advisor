import type { SearchPreferences } from "../types/point";

type SearchFormProps = {
  preferences: SearchPreferences;
  onPreferencesChange: (preferences: SearchPreferences) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
};

function SearchForm({ preferences, onPreferencesChange, onSubmit, isLoading }: SearchFormProps) {

  return (
    <>
        <section className="card search-card">
            <div className="card-header">
                <h2>Search parameters</h2>
                <p>
                Enter your location and choose what matters most when selecting a
                pickup point.
                </p>
            </div>

            <form className="search-form" onSubmit={onSubmit}>
                <div className="form-row">
                <label htmlFor="address">Address or City</label>
                <input
                    id="address"
                    type="text"
                    placeholder="Warsaw Central Station"
                    value={preferences.address}
                    onChange={(event) =>
                        onPreferencesChange({
                        ...preferences,
                        address: event.target.value,
                        })
                    }
                />
                </div>

                <div className="form-row">
                <label htmlFor="country">Country</label>
                <input
                    id="country"
                    type="text"
                    placeholder="PL"
                    value={preferences.country}
                    onChange={(event) =>
                        onPreferencesChange({
                        ...preferences,
                        country: event.target.value.toUpperCase(),
                        })
                    }
                />
                </div>

                <div className="form-row">
                <label htmlFor="maxResults">Max results</label>
                <input
                    id="maxResults"
                    type="number"
                    placeholder="10"
                    value={preferences.maxResults}
                    onChange={(event) =>
                        onPreferencesChange({
                        ...preferences,
                        maxResults: Number(event.target.value),
                        })
                    }
                />
                </div>

                <div className="form-row">
                <label htmlFor="maxDistanceKm">Max Distance(km)</label>
                <input
                    id="maxDistanceKm"
                    type="number"
                    min="1"
                    max="50"
                    value={preferences.maxDistanceKm}
                    onChange={(event) =>
                        onPreferencesChange({
                        ...preferences,
                        maxDistanceKm: Number(event.target.value),
                        })
                    }
                />
                </div>

                <div className="form-row">
                <label htmlFor="preferredType">Preferred point type</label>
                <select 
                    id="preferredType"
                    value={preferences.preferredType}
                    onChange={(event) =>
                        onPreferencesChange({
                        ...preferences,
                        preferredType: event.target.value as SearchPreferences["preferredType"],
                        })
                    }
                >
                    <option value="any">Any</option>
                    <option value="locker">Parcel locker</option>
                    <option value="point">Pickup point</option>
                </select>
                </div>

                <div className="checkbox-row">
                <input 
                    id="onlyOperating" 
                    type="checkbox" 
                    checked={preferences.onlyOperating}
                    onChange={(event) =>
                        onPreferencesChange({
                        ...preferences,
                        onlyOperating: event.target.checked,
                        })
                    }
                />
                <label htmlFor="onlyOperating">Only operating points</label>
                </div>

                <div className="checkbox-row">
                <input 
                    id="only24h" 
                    type="checkbox" 
                    checked={preferences.prefer24h}
                    onChange={(event) =>
                        onPreferencesChange({
                        ...preferences,
                        prefer24h: event.target.checked,
                        })
                    }
                />
                <label htmlFor="only24h">Prefer 24/7 availability</label>
                </div>

                <button type="submit" className="primary-button" disabled={isLoading}>
                    {isLoading ? "Searching..." : "Find best points"}
                </button>
            </form>
        </section>
    </>
  )
}

export default SearchForm
