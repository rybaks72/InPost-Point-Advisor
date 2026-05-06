import "./components/SearchForm"
import './App.css'
import SearchForm from "./components/SearchForm"
import Header from "./components/Header"
import Map from "./components/Map"
import RankingList from "./components/RankingList"
import { fetchPoints } from "./api/pointsApi"
import { useState } from "react"
import type { InPostPoint, RecommendedPoint, SearchPreferences } from "./types/point"
import { recommendPoints } from "./logic/recommendation"

function App() {
  const [points, setPoints] = useState<InPostPoint[]>([]);
  const [recommendedPoints, setRecommendedPoints] = useState<RecommendedPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<SearchPreferences>({
    address: "Palace of Culture and Science",
    country: "PL",
    maxPages: 50,
    maxResults: 10,
    maxDistanceKm: 5,
    onlyOperating: true,
    prefer24h: false,
    preferredType: "any",
  });

  const temporaryUserLocation = {
    latitude: 52.2318,
    longitude: 21.0060,
  };


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

   try {
      setIsLoading(true);
      setError(null);

      const loadedPoints = await fetchPoints({
        country: preferences.country,
        maxPages: preferences.maxPages,
        perPage: 500,
      });

      setPoints(loadedPoints);
      const recommendations = recommendPoints(
      loadedPoints,
      temporaryUserLocation,
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
                <Map/>
            </section>
            <RankingList 
              recommendedPoints={recommendedPoints}
              isLoading={isLoading}
              error={error}
            />
        </main>
    </>
  )
}

export default App
