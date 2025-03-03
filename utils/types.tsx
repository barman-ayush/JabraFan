export type MatchesResponse = {
  data: {
    generated_at: string;
    sport_events: SportEvent[];
  };
  status: number;
  headers: Record<string, unknown>;
  res: Record<string, unknown>;
};

export type SportEvent = {
  id: string;
  tournament_round: {
    type: string;
    number: number;
  };
  season: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    year: string;
  };
  scheduled: string;
  start_time_tbd: boolean;
  tournament: {
    id: string;
    name: string;
    type: string;
    gender: "men" | "women";
    sport: {
      id: string;
      name: string;
    };
    category: {
      id: string;
      name: string;
      country_code: string;
    };
  };
  status: "not_started" | "live" | string;
  competitors: {
    id: string;
    name: string;
    country: string;
    country_code: string;
    abbreviation: string;
    qualifier: "home" | "away";
    gender: "male" | "female";
  }[];
  sport_event_conditions: {
    day_night: "day" | "night";
    weather_info?: {
      rain_conditions: string;
      sky_conditions: string;
      temperature_range: string;
      wind_conditions: string;
    };
    pitch_info?: {
      boundary_position: string;
      grass_cover: string;
      pitch_moisture: string;
      pitch_quality: string;
    };
    outfield_info?: {
      outfield_conditions: string;
    };
  };
};

export type MatchResponse = {
  data: {
    sport_event: {
      id: string;
      season: {
        name: string;
      };
      scheduled: string;
      competitors: Array<{
        name: string;
        abbreviation: string;
      }>;
    };
    sport_event_status: {
      status: "not_started" | "live" | string;
      current_inning: number;
      period_scores: Array<{
        home_score?: number;
        away_score?: number;
        home_wickets?: number;
        away_wickets?: number;
      }>;
    };
  };
  status: number;
};
