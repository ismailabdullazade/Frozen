import classNames from "classnames";
import css from "./footer-slider.module.css";
import relax from "../../../images/footer-slider/relax.svg";
import oaks from "../../../images/footer-slider/3oaks.svg";
import playson from "../../../images/footer-slider/playson.svg";
import thunderkink from "../../../images/footer-slider/thunderkink.svg";
import betsoft from "../../../images/footer-slider/betsoft.svg";
import playngo from "../../../images/footer-slider/playngo.svg";
import irondog from "../../../images/footer-slider/irondog.svg";
import pragmaticplay from "../../../images/footer-slider/pragmaticplay.svg";
import redtiger from "../../../images/footer-slider/redtiger.svg";
import yggdrasil from "../../../images/footer-slider/yggdrasil.svg";
import nolimit from "../../../images/footer-slider/nolimit.svg";
import playtech from "../../../images/footer-slider/playtech.svg";
import habanero from "../../../images/footer-slider/habanero.svg";
import evoltion from "../../../images/footer-slider/evoltion.svg";
import quickspin from "../../../images/footer-slider/quickspin.svg";
import goldenHero from "../../../images/footer-slider/golden-hero.svg";
import tomHorn from "../../../images/footer-slider/tom-horm.svg";
import pushGaming from "../../../images/footer-slider/push-gaming.svg";
import netent from "../../../images/footer-slider/netent.svg";
import bgaming from "../../../images/footer-slider/bgaming.svg";
import mancla from "../../../images/footer-slider/mancla.svg";
import haksaw from "../../../images/footer-slider/haksaw.svg";
import endorphia from "../../../images/footer-slider/endorphia.svg";
import btg from "../../../images/footer-slider/btg.svg";
import "./style.css";

const Slide = ({ image, alt }) => (
    <div className={css.image_container}>
      <img src={image} alt={alt} />
    </div>
);

export default function FooterSlider() {

    const images = [
        relax,
        oaks,
        playson,
        thunderkink,
        betsoft,
        playngo,
        irondog,
        pragmaticplay,
        redtiger,
        yggdrasil,
        nolimit,
        playtech,
        habanero,
        evoltion,
        quickspin,
        goldenHero,
        tomHorn,
        pushGaming,
        netent,
        bgaming,
        mancla,
        haksaw,
        endorphia,
        btg
    ]
  
    return (
        <div className={classNames("container-full", css.slider)}>
            <div className={css.slider_container}>
                <div className={css.container}>
                    {images.map((image, index) => (
                        <Slide key={index} image={image} alt={`image-${index}`} />
                    ))}
                </div>
                <div className={css.container}>
                    {images.map((image, index) => (
                        <Slide key={index} image={image} alt={`image-${index}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}