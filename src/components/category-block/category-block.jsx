import css from "./category-block.module.css";
import {useFetchSectionsQuery} from "../../app/api/games.api";
import {useDispatch, useSelector} from "react-redux";
import {setFilters} from "../../features/games/game.slice";
import CategoryIconBackground from "./category-icon";
export default function CategoryBlock( activeWager) {
    const { data: sections } = useFetchSectionsQuery();
    const dispatch = useDispatch();
    const showCategoryBlock = useSelector(
        (state) => state.game.showCategoryBlockSlice
    );

    const handleClick = (sectionTitle) => {
        if (sectionTitle === "all_games") {
            const currentFilters = {
                section: "",
                title: "",
                producer: "",
            };
            dispatch(setFilters(currentFilters));
        } else {
            const currentFilters = {
                section: sectionTitle,
                title: "",
                producer: "",
            };
            dispatch(setFilters(currentFilters));
        }
    };

    if (!showCategoryBlock) return null;

    return (
        <div className={css.category_container}>
            {sections && sections.find(section => section?.title === "all_games") && (
                <div key="all_games"  onClick={() => handleClick("all_games")}>
                    <CategoryIconBackground category={{ title: "all_games" }} />
                </div>
            )}

            {sections && sections.map(section => (
                section?.title !== "all_games" && !(section?.title === "live_games" && activeWager.activeWager) && (
                    <div key={section?.title}  onClick={() => handleClick(section?.title)}>
                        <CategoryIconBackground category={section} />
                    </div>
                )
            ))}
        </div>
    )
}
