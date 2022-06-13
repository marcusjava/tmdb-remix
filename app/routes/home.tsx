import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getMovies } from "~/service/api";
import type { Movie } from "~/utils/firebase.types";
import { getListMovies, randomBanner } from "~/utils/movies";
import styled from "@emotion/styled";
import { Category } from "~/components/Category";
import { useLoaderData } from "@remix-run/react";
import { Banner } from "~/components/Banner";
import { getUserInfo } from "~/utils/session.server";
import type { UserRecord } from "firebase-admin/auth";
import { getMoviesDocs } from "~/utils/firebase.server";

const Container = styled.div`
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 80%;
`;

export interface LoaderHomeData {
  nowMovies: Movie[];
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  banner: Movie;
  currentUser: Partial<UserRecord>;
  favorites: Movie[];
}

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderHomeData> => {
  //send to front MOVIE LIST
  const { nowData, popularData, topRatedData } = await getMovies(request);
  let favorites: Movie[] = [];

  //GET USER LOGGED
  const user = await getUserInfo(request);
  if (user) {
    favorites = await getMoviesDocs(user.uid);
  }

  return {
    currentUser: {
      uid: user?.uid,
      displayName: user?.displayName,
    },
    favorites,
    nowMovies: getListMovies(15, nowData),
    popularMovies: getListMovies(5, popularData),
    topRatedMovies: getListMovies(15, topRatedData),
    banner: randomBanner(getListMovies(15, nowData)),
  };
};

export const action: ActionFunction = async ({
  request,
}): Promise<Response> => {
  const { search } = Object.fromEntries(await request.formData());

  if (typeof search !== "string" || !search) {
    throw new Error("Invalid data");
  }

  return redirect(`/home/movie/search/${search}`);
};

export default function Home() {
  const { nowMovies, popularMovies, topRatedMovies, banner } =
    useLoaderData<LoaderHomeData>();
  return (
    <Container>
      <Banner imageSrc={banner?.poster_path} />
      <Category title="Populares" items={popularMovies} />
      <Category title="Em cartaz" items={nowMovies} />
      <Category title="Top Filmes" items={topRatedMovies} />
    </Container>
  );
}
