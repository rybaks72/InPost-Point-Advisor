import "./components/SearchForm"
import './App.css'
import SearchForm from "./components/SearchForm"
import Header from "./components/Header"
import Map from "./components/Map"
import RankingList from "./components/RankingList"
import { fetchPoints } from "./api/pointsApi"
import { useState, useRef} from "react"
import type { InPostPoint, RecommendedPoint, SearchPreferences } from "./types/point"
import { recommendPoints } from "./logic/recommendation"
import { geocodeAddress } from "./api/geocodingApi";

function App() {
  const [points, setPoints] = useState<InPostPoint[]>([]);
  const [recommendedPoints, setRecommendedPoints] = useState<RecommendedPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<SearchPreferences>({
    address: "Palace of Culture and Science",
    country: "PL",
    countryName: "Poland",
    maxResults: 10,
    maxDistanceKm: 5,
    onlyOperating: true,
    prefer24h: false,
    preferredType: "any",
  });
  const [selectedPoint, setSelectedPoint] = useState<RecommendedPoint | null>(null);
  const mapRef = useRef<HTMLElement>(null);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    if (preferences.maxResults < 1 || preferences.maxResults > 50) {
      setError("Max results must be between 1 and 50.");
      return;
    }

    if (preferences.maxDistanceKm <= 0 || preferences.maxDistanceKm > 50) {
      setError("Max distance must be between 1 and 50 km.");
      return;
    }

    if (!preferences.country.trim()) {
      setError("Country is required.");
      return;
    }
    if (!preferences.address.trim()) {
      setError("Please enter an address or city.");
      return;
    }

   try {
      setIsLoading(true);
      setError(null);
      setSelectedPoint(null);

      const loadedPoints = await fetchPoints({
        country: preferences.country,
        perPage: 500,
      });

      setPoints(loadedPoints);
      const userLocation = await geocodeAddress(preferences.address, preferences.country);
      const recommendations = recommendPoints(
      loadedPoints,
      userLocation,
      preferences
      );
      setRecommendedPoints(recommendations);
    } catch (err) {
      setError("Could not load InPost points.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectPoint(point: RecommendedPoint) {
    setSelectedPoint(point);
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
        <main className="app">
            <Header/>

            <section className="dashboard">
                <SearchForm 
                  preferences={preferences} 
                  onPreferencesChange={setPreferences} 
                  onSubmit={handleSearch} 
                  isLoading={isLoading}
                />
                <Map 
                  recommendedPoints={recommendedPoints.slice(0, 5)}
                  selectedPoint={selectedPoint}
                  mapRef={mapRef}
                />
            </section>
            <RankingList 
              recommendedPoints={recommendedPoints}
              isLoading={isLoading}
              error={error}
              onSelectPoint={handleSelectPoint}
              selectedPoint={selectedPoint}
            />
        </main>
    </>
  )
}

export default App
