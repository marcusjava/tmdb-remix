import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getMovies } from "~/service/api";
import type { Movie } from "~/utils/firebase.types";
import { getListMovies, randomBanner } from "~/utils/movies";
import styled from "@emotion/styled";
import { Category } from "~/components/Category";
import { useLoaderData } from "@remix-run/react";
import { Banner } from "~/components/Banner";

const Container = styled.div`
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 80%;
`;

interface LoaderData {
  nowMovies: Movie[];
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  banner: Movie;
}

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  //send to front MOVIE LIST
  const { nowData, popularData, topRatedData } = await getMovies(request);

  return {
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
    useLoaderData<LoaderData>();
  return (
    <Container>
      <Banner imageSrc={banner?.poster_path} />
      <Category title="Populares" items={popularMovies} />
      <Category title="Em cartaz" items={nowMovies} />
      <Category title="Top Filmes" items={topRatedMovies} />
    </Container>
  );
}
