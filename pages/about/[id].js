import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./about.module.css";
import Episode from "../../components/Shared/Episode";
import Menu from "../../components/Shared/Menu";
import TMDB from "../../components/TMDB";
import { FaInfoCircle, FaPlay } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import MovieRow from "../../components/Shared/MovieRow";
import Footer from "../../components/Shared/Footer";
import Head from "next/head";
import Link from "next/link";

export default function About() {
  const router = useRouter();
  const { id, type } = router.query;

  const [similarList, setSimilarList] = useState([]);
  const [item, setItem] = useState(null);
  const [season, setSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const loadAll = async () => {
      let chosenInfo = await TMDB.getMovieInfo(id, type);
      setItem(chosenInfo);

      let options =
        chosenInfo &&
        chosenInfo.seasons &&
        chosenInfo.seasons.map((season) => ({ value: season.season_number, label: season.name }));
      setOptions(options);

      let list = await TMDB.getSimilar(id, type);
      setSimilarList(list);
    };

    loadAll();
  }, [id]);

  useEffect(() => {
    const loadAll = async () => {
      let result = await TMDB.getEpisodes(id, season || 1);
      console.log(result);
      setEpisodes(result.episodes);
    };

    loadAll();
  }, [id, season]);

  // atualizar titulo conforme nome
  useEffect(() => {
    console.log("title", item?.title);
    console.log("name", item?.name);
    try {
      if (item?.title !== undefined) {
        document.title = item.title.split(":")[0] + " | The Movie";
      } else if (item?.name !== undefined) {
        document.title = item.name.split(":")[0] + " | The Movie";
      } else {
        document.title = "The Movie";
      }
    } catch {
      console.log("Error title");
    }
  }, [item]);

  function addItem() {
    let addMovie = TMDB.addUserList(id, type)
    return addMovie
  }

  return (
    <>
      {/* <Head>
        <title>
          {(item?.title && item.title.split(":")[0]) + " | The Movie" ||
            (item?.name && item.name.split(":")[0]) + " | The Movie" ||
            "The Movie"}
        </title>
        <meta property="og:title" content="Filmes The Movie" key="title" />
      </Head> */}
      <div className={styles.container}>
        <Menu />
        {item && (
          <section
            className={styles.cover}
            style={{
              backgroundSize: "cover",
              backgroundPosition: "top",
              backgroundImage: `linear-gradient(90deg, #171717 5%, transparent), url(https://image.tmdb.org/t/p/original${item.backdrop_path})`,
            }}
          >
            <div className={styles.info}>
              <div className={styles.name}>
                <h1>{(item.title && item.title.split(":")[0]) || (item.name && item.name.split(":")[0])}</h1>
              </div>

              <div className={styles.desc}>
                <p>{item.overview}</p>
              </div>

              <div className={styles.rating}>
                <p>{item.number_of_seasons || item.runtime}</p>
                <p>
                  {new Date(item.first_air_date).getFullYear() || new Date(item.release_date).getFullYear()}{" "}
                </p>
              </div>

              <div className={styles.movie_progress}>
                <div className={styles.progress_bar}>
                  <div className={styles.progress}></div>
                </div>
                <strong>T01:E03</strong>
              </div>

              <div className={styles.buttons}>
                <button className={styles.button_watch} href="">
                  <FaPlay className={styles.icon_fa} color="var(--color-white)" size={16} />
                  Assistir
                </button>

                <button className={styles.button_more_info} href="">
                  <FaInfoCircle className={styles.icon_fa} color="var(--color-white)" size={16} />
                  Mais informa????es
                </button>

                <a onClick={() => addItem()} className={styles.button_add_list}>
                  <AiOutlinePlus className={styles.icon} />
                </a>
              </div>
            </div>
          </section>
        )}

        {type === "tv" && (
          <div className={styles.tv}>
            <div className={styles.season}>
              <h2>Epis??dios</h2>
              {options && (
                <select defaultValue={1} onChange={(e) => setSeason(e.target.value)}>
                  {options.map((season) => (
                    <option value={season.value}>{season.label}</option>
                  ))}
                </select>
              )}
            </div>

            <div className={styles.episodes}>
              {episodes &&
                episodes.map((episode, key) => (
                  <Episode key={key} number_episode={episode.episode_number} name={episode.name} />
                ))}
            </div>
          </div>
        )}

        <div className={styles.list}>
          {similarList.map((item, key) => (
            <MovieRow key={key} title={item.title} items={item.items} />
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
}
