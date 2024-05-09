import css from "./profile.module.css";
import ContentPane from "../../components/content-pane/content-pane";
import { useTranslation } from "react-i18next";
import PersonalData from "./personal-data";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { useAuth } from "../../services/auth";
import avatar from "../../images/avatar-profile.svg";
import cyberCard from "../../images/ranks/cards ranks/sayber_rank_svg.svg"
import bladeCard from "../../images/ranks/cards ranks/blade_rank_svg.svg"
import viperCard from "../../images/ranks/cards ranks/viper_rank_svg.svg"
import hackerCard from "../../images/ranks/cards ranks/hacker_rank_svg.svg"
import rocketmanCard from "../../images/ranks/cards ranks/rocketman_rank_svg.svg"

import cyber from "../../images/ranks/ciber_png.png"
import blade from "../../images/ranks/blade_png.png"
import viper from "../../images/ranks/viper_png.png"
import hacker from "../../images/ranks/hacker_png.png"
import rocketman from "../../images/ranks/rocketman_png.png"
import bottom_line from "../../images/profile/bottom_line.svg";


import { useHistory, Link } from "react-router-dom";
import exit from "./../../images/profile/exit_arrow_right_safety.svg";
import Social from "./social";
import Safety from "./safety";
import { useMediaQuery } from "beautiful-react-hooks";
import Button from "../../components/button/button";
import Modal from "../../components/modal/modal";
import close from "./../../images/close_modal_touch.svg";

export default function Profile() {
  const isTablet = useMediaQuery("(max-width: 1463px)");
  const isMobile = useMediaQuery("(max-width: 960px)");
  const { t } = useTranslation();
  const history = useHistory();
  const [openSettings, setOpenSettigs] = useState(true);
  const [openPrivelegeMenu, setOpenPrivelegeMenu] = useState(false);
  const [openPrivelegeMenuModal, setOpenPrivelegeMenuModal] = useState(false);
  const auth = useAuth();

  const ranks = {
    1: [
      cyber,
      cyberCard,
      "Cyber",
      "support 24/7",
      "weekly bonus",
      "200 000",
      "450 000",
      "1 000 000",
    ],
    2: [
      blade,
      bladeCard,
      "Blade",
      "support 24/7",
      "weekly bonus",
      "300 000",
      "1 000 000",
      "2 500 000",
    ],
    3: [
      viper,
      viperCard,
      "Viper",
      "support 24/7",
      "weekly bonus",
      "450 000",
      "1 300 000",
      "3 100 000",
    ],
    4: [
      hacker,
      hackerCard,
      "Hacker",
      "support 24/7",
      "weekly bonus",
      "900 000",
      "1 800 000",
      "6 500 000",
    ],
    5: [
      rocketman,
      rocketmanCard,
      "Rocketman",
      "personal manager",
      "additional bonuses",
      "4 500 000",
      "No Limit",
      "No Limit",
      "5 000",
      "accelerated withdrawal of funds",
    ],
    // 6: [
    //   marquis,
    //   marquisCard,
    //   "Marquis",
    //   "personal manager",
    //   "additional bonuses",
    //   "7 000 000",
    //   "No Limit",
    //   "No Limit",
    //   "8 000",
    //   "accelerated withdrawal of funds",
    // ],
    // 7: [
    //   duke,
    //   dukeCard,
    //   "Duke",
    //   "personal manager",
    //   "additional bonuses",
    //   "10 000 000",
    //   "No Limit",
    //   "No Limit",
    //   "10 000",
    //   "accelerated withdrawal of funds",
    // ],
    // 8: [
    //   king,
    //   kingCard,
    //   "King",
    //   "personal manager",
    //   "additional bonuses",
    //   "15 000 000",
    //   "No Limit",
    //   "No Limit",
    //   "15 000",
    //   "accelerated withdrawal of funds",
    // ],
    // 9: [
    //   god,
    //   godCard,
    //   "God",
    //   "personal manager",
    //   "additional bonuses",
    //   "25 000 000",
    //   "No Limit",
    //   "No Limit",
    //   "20 000",
    //   "accelerated withdrawal of funds",
    // ],
  };

  const [
    rankImg,
    rankCard,
    rankTitle,
    support,
    bonus,
    withdrawalDay,
    withdrawalWeek,
    withdrawalMonth,
    giftNY,
  ] = useMemo(() => {
    const rankId = auth.user.rank === null ? 1 : auth.user.rank_id;
    return ranks[rankId] || [];
  }, [auth.user.rank, auth.user.rank_id]);

  const now = auth?.user?.rank ? auth.user.rank.cashback_percent : "";
  const newAvatar =
    auth.user === null
      ? ""
      : auth.user.avatar_image === null || auth.user.avatar_image === undefined
        ? avatar
        : auth.user.avatar_image;
  const depositSum =
    auth.user.dep_sum === undefined
      ? 0
      : new Intl.NumberFormat("ru-RU").format(auth.user.dep_sum / 100);
  const depositSumMonth =
    auth.user.dep_sum_month === undefined
      ? 0
      : new Intl.NumberFormat("ru-RU").format(auth.user.dep_sum_month / 100);
  const depositSumMonthCalc =
    auth.user.dep_sum_month === undefined ? 0 : auth.user.dep_sum_month / 100;
  const depositAmountCalc =
    auth.user.rank === null
      ? ""
      : auth.user.rank.next_rank.deposit_amount === null
        ? "0"
        : auth.user.rank.next_rank.deposit_amount / 100;
  const depositAmount =
    auth.user.rank === null
      ? ""
      : new Intl.NumberFormat("ru-RU").format(
          auth.user.rank.deposit_amount === null
            ? "0"
            : auth.user.rank.deposit_amount / 100
        );
  const depositAmountLine =
    auth.user.rank === null
      ? ""
      : new Intl.NumberFormat("de-DE").format(
          auth.user.rank.next_rank.deposit_amount === null
            ? "0"
            : auth.user.rank.next_rank.deposit_amount / 100
        );
  const depositLine = Math.min(
    (depositSumMonthCalc * 100) / depositAmountCalc,
    100
  );
  const currency = auth?.user ? auth.user.currency.code : "";
  const birthdayGift =
    auth.user.rank === null
      ? ""
      : new Intl.NumberFormat("ru-RU").format(
          auth.user.rank.present_amount / 100
        );

  return (
    <div className={css.profile}>
      <div className={css.profile_menu}>
        <div className={css.settings}>
          <div
            className={classNames(css.menu_settings, {
              [css.menu_active]: openSettings,
            })}
            onClick={() => {
              setOpenSettigs(true);
            }}
          >
            <p>
              {t("settings")}
            </p>
          </div>
          <div
            className={classNames(css.menu_safety, {
              [css.menu_active]: !openSettings,
            })}
            onClick={() => {
              setOpenSettigs(false);
            }}
          >
            <p>
              {t("safety")}
            </p>
          </div>
        </div>
        <div className={css.skewed_line}></div>
        <div
          className={css.settings_exit}
          onClick={() => {
            window.openSplash();
            auth.signout(() => {
              window.closeSplash(100);
              history.push("/");
            });
          }}
        >
          <span>{t("Log out")}</span>
          <img src={exit} alt="" />
        </div>
      </div>
      <div
        className={classNames(css.profile_settings, {
          [css.hiden]: !openSettings,
        })}
      >
        <div className={css.block}>
          <div className={classNames(css.block_avatar_rank)}>
            <div className={css.corner_shape_left}></div>
            <div className={css.corner_shape_right}></div>
            {
              isMobile && (
              <>
                <div className={css.user_rank_info_mobile}>
                  {/* LEFT SIDE */}
                  <div className={css.user_rank_card}>
                      <img
                        className={css.rank_card_img}
                        src={rankCard}
                        alt=""
                      />
                      <div className={css.rank_level_from}>
                        <p className={classNames(css.rank_title_ptag)}>
                            {t(rankTitle)}
                        </p>
                        <p className={css.rank_level_text}>
                        {t("Level")} 1
                        </p>
                      </div>
                      


                  </div>
                  {/* MIDDLE SIDE */}
                  <div className={css.rank_title_progress_line}>
                    <div className={css.rank_title_container}>
                      <div className={css.rank_level_to}>
                        <div>
                          <p className={classNames(css.rank_title_ptag)}>
                          Блейд
                          </p>
                          <p className={css.rank_level_text}>
                          {t("Level")} 2
                          </p>
                        </div>
                        <img src={blade} className={css.blade_rank_img} />

                      </div>
                    </div>
                  </div>
                </div>
                <div className={css.you_nickname_container}>
                        <span className={classNames(css.nickname_title)}>
                          Вы: {auth.user.nickname}
                        </span>
                      </div>
                <div className={css.progress_line_container_mobile}> 
                  <div className={css.progress_line_png}>
                    <ProgressLineMobile depositLine={depositLine} />
                  </div>
                  <div className={css.deposit_from_to}>
                    <p>{depositSumMonth} {currency}</p>
                    <p>{auth?.user.rank_id === 9 ? "Max Rank" : depositAmountLine} {currency}</p>
                  </div>
                </div>
                
                      <Priveleges
                        props={{
                          support,
                          now,
                          birthdayGift,
                          giftNY,
                          depositAmount,
                          withdrawalDay,
                          withdrawalWeek,
                          withdrawalMonth,
                          bonus,
                          currency,
                          isMobile,
                          openPrivelegeMenu,
                        }}
                      />
                    
                    <Button
                      className={css.privilege_btn}
                      onClick={() => {
                        isTablet && !isMobile
                          ? setOpenPrivelegeMenuModal(!openPrivelegeMenuModal)
                          : setOpenPrivelegeMenu(!openPrivelegeMenu);
                      }}
                    >
                      {openPrivelegeMenu && isMobile
                        ? t("hide")
                        : t("Information about rank")}
                    </Button>
                  <Social/>
                
              </>
              )
            }
{/* DESKTOP */}
            <div className={css.settings_wrapper}>
              <div className={css.user_rank_info}>
                {/* LEFT SIDE */}
                <div className={css.user_rank_card}>
                    <img
                      className={css.rank_card_img}
                      src={rankCard}
                      alt=""
                    />
                    
                    <span className={classNames(css.nickname_title)}>
                      {auth.user.nickname}
                    </span>
                    
                    <span className={classNames(css.rank_title)}>
                    {t("rank")}{" "}
                      <span className={classNames(css.rank_title__span)}>
                        {t(rankTitle)}
                      </span>
                    </span>
                </div>
                {/* MIDDLE SIDE */}
                <div className={css.rank_title_progress_line}>
                  <div className={css.rank_title_container}>
                    <div className={css.rank_level_from}>
                      <p className={classNames(css.rank_title_ptag)}>
                          {t(rankTitle)}
                      </p>
                      <p className={css.rank_level_text}>
                      {t("Level")} 1
                      </p>

                    </div>
                    <div className={css.rank_level_to}>
                      <div>
                        <p className={classNames(css.rank_title_ptag)}>
                        Блейд
                        </p>
                        <p className={css.rank_level_text}>
                        {t("Level")} 2
                        </p>
                      </div>
                      <img src={blade} className={css.blade_rank_img} />

                    </div>

                  </div>
                  <div className={css.progress_line_png} >
                    {isTablet ? (
                      <ProgressLineTablet depositLine={depositLine} />
                    ): (
                      <ProgressLine depositLine={depositLine}/>

                    )}
                  </div>
                  <div className={css.deposit_from_to}>
                    <p>{depositSumMonth} {currency}</p>
                    <p>{auth?.user.rank_id === 9 ? "Max Rank" : depositAmountLine} {currency}</p>
                  </div>

                </div>
                {/* RIGHT SIDE */}
                <Social/>
              </div>
            {/* BORDER BOTTOM */}
              <img className={css.bottom_line_security} src={bottom_line} alt="bottom_line" />
              {
                !isMobile && (
                <>
                <div className={css.information_about_rank}>
                  <h2>{t("Information about rank")}</h2>
                  <div className={css.rank_col_info_container}>
                    <img className={css.ran_col_img} src={rankImg} />
                    <div className={css.col_info_wrapper}>
                      <div className={css.first_col}>
                              <span>{t(support)}</span>
                              {now === ("" || 0) ? (
                                ""
                              ) : (
                                <span>
                                  {t("cashback")} {now}%
                                </span>
                              )}
                              {birthdayGift === ("" || "0") ? (
                                ""
                              ) : (
                                <span>
                                  {t("birthday gift")} {birthdayGift} {currency}{" "}
                                </span>
                              )}
                              {giftNY === ("" || undefined) ? (
                                ""
                              ) : (
                                <span>
                                  {t("new year's gift")} {giftNY} {currency}
                                </span>
                              )}
                              <span>
                                {t("withdrawal up to")} {withdrawalDay} {currency} {t("in a day")}
                              </span>

                      </div>
                      <div className={css.second_col}>

                              <span>
                                {t("withdrawal up to")} {withdrawalWeek} {currency} {t("in week")}
                              </span>
                              <span>
                                {t("withdrawal up to")} {withdrawalMonth} {currency} {t("per month")}
                              </span>
                              <span>{t(bonus)}</span>
                      </div>

                    </div>

                  </div>
                </div>
                <img className={css.bottom_line_security} src={bottom_line} alt="bottom_line" />
                </>
                )
              }
            
            <PersonalData />
            </div>
            
           {/* <div className={css.block_avatar__social}>
               <ContentPane className={classNames(css.avatar_wraper)}>
                <div className={classNames(css.avatar_block)}>
                  <img
                    className={classNames(css.avatar)}
                    src={newAvatar}
                    alt=""
                  />
                  <img
                    className={classNames(css.image_rank)}
                    src={rankImg}
                    alt=""
                  />
                </div>
                <div className={css.title_blcok}>
                  <span className={classNames(css.nickname_title)}>
                    {auth.user.nickname}
                  </span>
                  <span className={classNames(css.rank_title)}>
                    {t("rank")}{" "}
                    <span className={classNames(css.rank_title__span)}>
                      {t(rankTitle)}
                    </span>
                  </span>
                </div>
                {isTablet && (
                  <>
                    <DepositAmount
                      props={{
                        depositSum,
                        depositSumMonth,
                        currency,
                        depositLine,
                        depositAmountLine,
                      }}
                      variant="menu"
                    />
                    {isMobile && (
                      <Priveleges
                        props={{
                          support,
                          now,
                          birthdayGift,
                          giftNY,
                          depositAmount,
                          withdrawalDay,
                          withdrawalWeek,
                          withdrawalMonth,
                          bonus,
                          currency,
                          isMobile,
                          openPrivelegeMenu,
                        }}
                      />
                    )}
                    <Button
                      className={css.privilege_btn}
                      onClick={() => {
                        isTablet && !isMobile
                          ? setOpenPrivelegeMenuModal(!openPrivelegeMenuModal)
                          : setOpenPrivelegeMenu(!openPrivelegeMenu);
                      }}
                    >
                      {openPrivelegeMenu && isMobile
                        ? t("hide")
                        : t("list of privileges")}
                    </Button>
                    {!isMobile && <Social />}
                  </>
                )}
                <Modal isOpen={openPrivelegeMenuModal} theme={"privelege"}>
                  <div className={css.modal_privelege}>
                    <div
                      className={css.modal_close}
                      onClick={() => setOpenPrivelegeMenuModal(false)}
                    >
                      <img src={close} alt="" />
                    </div>
                    <RankCard
                      props={{
                        rankCard,
                        rankTitle,
                        depositSum,
                        depositSumMonth,
                        currency,
                        depositLine,
                        depositAmountLine,
                        support,
                        now,
                        birthdayGift,
                        giftNY,
                        depositAmount,
                        withdrawalDay,
                        withdrawalWeek,
                        withdrawalMonth,
                        bonus,
                      }}
                    />
                  </div>
                </Modal>
              </ContentPane> 
              {((!isTablet && !isMobile) || isMobile) && <Social />}
            </div> */}
            {/* <ContentPane
              className={classNames(
                css.pane,
                css.pane_padding,
                css.personal_data
              )}
              paneClass={classNames(
                css.without_shadow,
                css.pane__content,
                css.pane__content_padding
              )}
            >
              <PersonalData />
            </ContentPane>
            {!isTablet && (
              <RankCard
                variant="modal_list"
                props={{
                  rankCard,
                  rankTitle,
                  depositSum,
                  depositSumMonth,
                  currency,
                  depositLine,
                  depositAmountLine,
                  support,
                  now,
                  birthdayGift,
                  giftNY,
                  depositAmount,
                  withdrawalDay,
                  withdrawalWeek,
                  withdrawalMonth,
                  bonus,
                }}
              />
            )}  */}
          </div>
        </div>
      </div>
      <div
        className={classNames(css.profile_safety, {
          [css.hiden]: openSettings,
        })}
      >
        <Safety />
      </div>
    </div>
  );
}

function ProgressLineMobile({ depositLine, variant }) {
  const rectangles = [];

  for (let i = 0; i < 19; i++) {
    if(i < 1) {
      if(depositLine > 0 && depositLine < 2) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else if (depositLine > 1) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }
      else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px"}} key={i}></div>);
      }
    }
    else if(i < 2) {
      if(depositLine < 8 && depositLine > 1) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else if(depositLine > 7) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px"}} key={i}></div>);
      }
    }
    else if(i < 6) {
      if(depositLine < 16 && depositLine > 7) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else if (depositLine > 15) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px"}} key={i}></div>);
      }
    }
    else if(i < 8) {
      if(depositLine < 31 && depositLine > 15) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else if(depositLine > 30) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px"}} key={i}></div>);
      }
    }
    else if(i < 7) {
      if(depositLine < 51 && depositLine > 30) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else if (depositLine > 50) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"42px",width:"9px"}} key={i}></div>);
      }
    } else if (i < 11) {
      if( depositLine > 50 && depositLine < 71) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid #9c799b", height:"42px",width:"9px",background:"#9c799b"}}></div>);
      }else if (depositLine > 70) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid #9c799b", height:"42px",width:"9px",background:"#9c799b"}}></div>);
      } else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid #9c799b", height:"42px",width:"9px"}}></div>);

      }
    }  else if (i < 15) {
      if( depositLine > 70 && depositLine < 86) {
        rectangles.push(<div className={css.orange} style={{border: "1px solid #c7537d", height:"42px",width:"9px",background:"#c7537d"}} key={i}></div>);
      } else if (depositLine > 85) {
        rectangles.push(<div className={css.orange} style={{border: "1px solid #c7537d", height:"42px",width:"9px",background:"#c7537d"}} key={i}></div>);
      } else {
        rectangles.push(<div className={css.orange} style={{border: "1px solid #c7537d", height:"42px",width:"9px"}} key={i}></div>);
      }

    }  else if(i < 18) {
      if(depositLine > 85  && depositLine < 100) {
        rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"42px",width:"9px",background:"#fd2156"}} key={i}></div>);
      } else if(depositLine === 100) {
        rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"42px",width:"9px",background:"#fd2156"}} key={i}></div>)
      } else {
        rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"42px",width:"9px"}} key={i}></div>)
      }
    } else {
        if(depositLine === 100) {
          rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"42px",width:"9px",background:"#fd2156"}} key={i}></div>)
        } else {
          rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"42px",width:"9px"}} key={i}></div>)
        }
    }
  }

  return (
    <div className={css.rectangle_levels}>

      <div className={css.uncolored_rectangles_mobile}>
        {rectangles.map(rectangle => (
          <div className={css.rectangle_level}>
            {rectangle}
          </div>
        ))}
        
      </div>
    </div>
  )
}
function ProgressLineTablet({ depositLine, variant }) {
  const rectangles = [];

  for (let i = 0; i < 26; i++) {
    if(i < 1) {
      if(depositLine > 0 && depositLine < 2) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else if (depositLine > 1) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }
      else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px"}} key={i}></div>);
      }
    }
    else if(i < 2) {
      if(depositLine < 8 && depositLine > 1) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else if(depositLine > 7) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px"}} key={i}></div>);
      }
    }
    else if(i < 6) {
      if(depositLine < 16 && depositLine > 7) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else if (depositLine > 15) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px"}} key={i}></div>);
      }
    }
    else if(i < 10) {
      if(depositLine < 31 && depositLine > 15) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else if(depositLine > 30) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px"}} key={i}></div>);
      }
    }
    else if(i < 13) {
      if(depositLine < 51 && depositLine > 30) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else if (depositLine > 50) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px"}} key={i}></div>);
      }
    } else if (i < 18) {
      if( depositLine > 50 && depositLine < 71) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid #9c799b", height:"52px",width:"17px",background:"#9c799b"}}></div>);
      }else if (depositLine > 70) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid #9c799b", height:"52px",width:"17px",background:"#9c799b"}}></div>);
      } else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid #9c799b", height:"52px",width:"17px"}}></div>);

      }
    }  else if (i < 22) {
      if( depositLine > 70 && depositLine < 86) {
        rectangles.push(<div className={css.orange} style={{border: "1px solid #c7537d", height:"52px",width:"17px",background:"#c7537d"}} key={i}></div>);
      } else if (depositLine > 85) {
        rectangles.push(<div className={css.orange} style={{border: "1px solid #c7537d", height:"52px",width:"17px",background:"#c7537d"}} key={i}></div>);
      } else {
        rectangles.push(<div className={css.orange} style={{border: "1px solid #c7537d", height:"52px",width:"17px"}} key={i}></div>);
      }

    }  else if(i < 25) {
      if(depositLine > 85  && depositLine < 100) {
        rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"52px",width:"17px",background:"#fd2156"}} key={i}></div>);
      } else if(depositLine === 100) {
        rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"52px",width:"17px",background:"#fd2156"}} key={i}></div>)
      } else {
        rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"52px",width:"17px"}} key={i}></div>)
      }
    } else {
        if(depositLine === 100) {
          rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"52px",width:"17px",background:"#fd2156"}} key={i}></div>)
        } else {
          rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"52px",width:"17px"}} key={i}></div>)
        }
    }
  }

  return (
    <div className={css.rectangle_levels}>

      <div className={css.uncolored_rectangles}>
        {rectangles.map(rectangle => (
          <div className={css.rectangle_level}>
            {rectangle}
          </div>
        ))}
        
      </div>
    </div>
  )
}
function ProgressLine({ depositLine, variant }) {
  const rectangles = [];

  for (let i = 0; i < 38; i++) {
    if(i < 1) {
      if(depositLine > 0 && depositLine < 2) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else if (depositLine > 1) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }
      else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px"}} key={i}></div>);
      }
    }
    else if(i < 2) {
      if(depositLine < 8 && depositLine > 1) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else if(depositLine > 7) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px"}} key={i}></div>);
      }
    }
    else if(i < 7) {
      if(depositLine < 16 && depositLine > 7) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else if (depositLine > 15) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px"}} key={i}></div>);
      }
    }
    else if(i < 13) {
      if(depositLine < 31 && depositLine > 15) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else if(depositLine > 30) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      }else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px"}} key={i}></div>);
      }
    }
    else if(i < 19) {
      if(depositLine < 51 && depositLine > 30) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else if (depositLine > 50) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px",background:"rgb(21, 244, 252)"}} key={i}></div>);
      } else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid rgba(21, 244, 252, 1)", height:"52px",width:"17px"}} key={i}></div>);
      }
    } else if (i < 25) {
      if( depositLine > 50 && depositLine < 76) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid #9c799b", height:"52px",width:"17px",background:"#9c799b"}}></div>);
      }else if (depositLine > 75) {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid #9c799b", height:"52px",width:"17px",background:"#9c799b"}}></div>);
      } else {
        rectangles.push(<div className={css.cyan} style={{border: "1px solid #9c799b", height:"52px",width:"17px"}}></div>);

      }
    }  else if (i < 31) {
      if( depositLine > 75 && depositLine < 86) {
        rectangles.push(<div className={css.orange} style={{border: "1px solid #c7537d", height:"52px",width:"17px",background:"#c7537d"}} key={i}></div>);
      } else if (depositLine > 85) {
        rectangles.push(<div className={css.orange} style={{border: "1px solid #c7537d", height:"52px",width:"17px",background:"#c7537d"}} key={i}></div>);
      } else {
        rectangles.push(<div className={css.orange} style={{border: "1px solid #c7537d", height:"52px",width:"17px"}} key={i}></div>);
      }

    }  else if(i < 37) {
      if(depositLine > 85  && depositLine < 100) {
        rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"52px",width:"17px",background:"#fd2156"}} key={i}></div>);
      } else if(depositLine === 100) {
        rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"52px",width:"17px",background:"#fd2156"}} key={i}></div>)
      } else {
        rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"52px",width:"17px"}} key={i}></div>)
      }
    } else {
        if(depositLine === 100) {
          rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"52px",width:"17px",background:"#fd2156"}} key={i}></div>)
        } else {
          rectangles.push(<div className={css.red} style={{border: "1px solid #fd2156", height:"52px",width:"17px"}} key={i}></div>)
        }
    }
  }

  return (
    <div className={css.rectangle_levels}>

      <div className={css.uncolored_rectangles}>
        {rectangles.map(rectangle => (
          <div className={css.rectangle_level}>
            {rectangle}
          </div>
        ))}
        
      </div>
    </div>
  )
}


function DepositAmount({ props, variant }) {
  const {
    depositSum,
    currency,
    depositLine,
    depositAmountLine,
    depositSumMonth,
  } = props;
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <div className={classNames(css.progress_line, css[variant])}>
      <span className={css.progress_line__title}>
        {t("number of deposits")}
      </span>
      <span className={css.progress_line__text}>
        {depositSumMonth} {currency}
      </span>
      <div className={css.progress_line__container}>
        <div className={css.deposit__line__wrapper}>
          <div className={css.deposit_line__progressLabels}>
            <span className={css.deposit_line__progressLabelsPoint} />
            <span className={css.deposit_line__progressLabelsPoint} />
          </div>
          <ProgressLine depositLine={depositLine} variant={variant} />
        </div>
      </div>
      <div className={css.deposit_line__progressCaption}>
        <span>0</span>
        <span>{auth?.user.rank_id === 9 ? "Max Rank" : depositAmountLine}</span>
      </div>
    </div>
  );
}

function Priveleges({ props }) {
  const {
    support,
    now,
    birthdayGift,
    giftNY,
    depositAmount,
    withdrawalDay,
    withdrawalWeek,
    withdrawalMonth,
    bonus,
    currency,
    isMobile,
    openPrivelegeMenu,
  } = props;
  const { t } = useTranslation();
  return (
    <div
      className={classNames(css.block_privileges, {
        [css.priveleges_hiden]: isMobile && !openPrivelegeMenu,
      })}
    >
                    <div className={css.col_info_wrapper}>
                      <div className={css.first_col}>
                              <span>{t(support)}</span>
                              {now === ("" || 0) ? (
                                ""
                              ) : (
                                <span>
                                  {t("cashback")} {now}%
                                </span>
                              )}
                              {birthdayGift === ("" || "0") ? (
                                ""
                              ) : (
                                <span>
                                  {t("birthday gift")} {birthdayGift} {currency}{" "}
                                </span>
                              )}
                              {giftNY === ("" || undefined) ? (
                                ""
                              ) : (
                                <span>
                                  {t("new year's gift")} {giftNY} {currency}
                                </span>
                              )}
                              <span>
                                {t("withdrawal up to")} {withdrawalDay} {currency} {t("in a day")}
                              </span>

                      </div>
                      <div className={css.second_col}>

                              <span>
                                {t("withdrawal up to")} {withdrawalWeek} {currency} {t("in week")}
                              </span>
                              <span>
                                {t("withdrawal up to")} {withdrawalMonth} {currency} {t("per month")}
                              </span>
                              <span>{t(bonus)}</span>
                      </div>

                    </div>
    </div>
  );
}

function RankCard({ props }) {
  const {
    rankCard,
    rankTitle,
    depositSum,
    depositSumMonth,
    currency,
    depositLine,
    depositAmountLine,
    support,
    now,
    birthdayGift,
    giftNY,
    depositAmount,
    withdrawalDay,
    withdrawalWeek,
    withdrawalMonth,
    bonus,
    variant,
  } = props;
  const { t } = useTranslation();

  return (
    <ContentPane className={classNames(css.rank_wraper, css[variant])}>
      <div className={classNames(css.rank_block, css.rank_block__border)}>
        <div className={css.rank_block__wraper}>
          <img
            className={classNames(css.rank_card__filter, css.rank_card__first)}
            src={rankCard}
            alt=""
          />
          <img className={classNames(css.rank_card)} src={rankCard} alt="" />
          <img
            className={classNames(css.rank_card__filter, css.rank__second)}
            src={rankCard}
            alt=""
          />
          <div className={css.rank_block_card}>
            <span className={css.rank_block__player}>{t(rankTitle)}</span>
          </div>
        </div>
        <DepositAmount
          props={{
            depositSum,
            depositSumMonth,
            currency,
            depositLine,
            depositAmountLine,
          }}
        />
        <Priveleges
          props={{
            support,
            now,
            birthdayGift,
            giftNY,
            depositAmount,
            withdrawalDay,
            withdrawalWeek,
            withdrawalMonth,
            bonus,
            currency,
          }}
        />
      </div>
    </ContentPane>
  );
}
