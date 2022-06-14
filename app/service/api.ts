import axios from "axios";
import type { Movie } from "~/utils/firebase.types";

export const api = axios.create({ baseURL: "https://api.themoviedb.org/3" });

const key = process.env.REACT_APP_MOVIEDB_API_KEY;

export const searchMovies = async (term: string) => {
  try {
    const response = await api.get("/search/movie", {
      params: {
        api_key: key,
        query: term,
        language: "pt-BR",
        page: 1,
      },
    });

    return response.data.results;
  } catch (error: any) {
    throw new Error(`Um erro ocorreu ao buscar o filme - ${error.message}`);
  }
};

export const getMovieById = async (id: string) => {
  try {
    const response = await api.get(`/movie/${id}`, {
      params: {
        api_key: key,
        language: "pt-BR",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Ocorreu um erro ao obter o filme - ${error.message}`);
  }
};

export const getMovies = async (
  request: Request
): Promise<{
  nowData: Movie[];
  popularData: Movie[];
  topRatedData: Movie[];
}> => {
  /*  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect("/home/login");
  } */
  const [nowData, popularData, topRatedData] = await Promise.all([
    api.get(`/movie/now_playing?api_key=${key}&language=pt-BR&page=1`),
    api.get(`/movie/popular?api_key=${key}&language=pt-BR&page=1`),
    api.get(`/movie/top_rated?api_key=${key}&language=pt-BR&page=1`),
  ]);

  return {
    nowData: nowData.data.results || [],
    popularData: popularData.data.results || [],
    topRatedData: topRatedData.data.results || [],
  };
};
