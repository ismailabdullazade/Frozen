import ContentPane from "../../components/content-pane/content-pane";
import { useTranslation } from "react-i18next";
import css from "./terms-of-use.module.css";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useFetchSiteSectionBySlugQuery } from "../../app/api/games.api";
import Loader from "../../components/loader/Loader";
import NotFound from "../error/not-found";

export default function Text({}) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { slug } = useParams();
  const { data, isLoading, isError } = useFetchSiteSectionBySlugQuery({
    slug,
    lang: i18n.resolvedLanguage,
  });

  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.replace("#", "")).scrollIntoView();
    }
  }, [location.hash]);

  return (
    <>
      {isError ? (
        <NotFound />
      ) : (
        <ContentPane /* title={t(slug)}*/ paneClass={css.text__container}>
          {isLoading && (
            <div className={css.text}>
              <Loader />
            </div>
          )}
          {data && (
            <div
              className={css.text}
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          )}
        </ContentPane>
      )}
    </>
  );
}
