import ContentPane from "../../components/content-pane/content-pane";
import {useTranslation} from "react-i18next";
import css from "./terms-of-use.module.css";

export default function ResponsibleGaming() {
    const {t, i18n} = useTranslation();

    if (i18n.resolvedLanguage === "ru")

        return (
            <ContentPane title={t("Responsible gaming policy")}>
                <div className={css.text}>
                    <p>ПОЛИТИКА ОТВЕТСТВЕННОЙ ИГРЫ</p>
                    <p><br/></p>
                    <p>Royal Assa N.V.</p>
                    <p>garillacasino.com</p>
                    <p>Обновлено: 03.08.2022</p>
                    <p><br/></p>
                    <p>Казино &ndash; это веселое и захватывающее развлечение.</p>
                    <p><br/></p>
                    <p>Азартные игры &mdash; привлекательный вариант, если Вы хотите испытать свою удачу и навыки.</p>
                    <p><br/></p>
                    <p>Большинство игроков без проблем наслаждаются этим видом развлечения, но есть небольшое количество людей, которые теряют контроль.</p>
                    <p><br/></p>
                    <p>Играйте ответственно!</p>
                    <p><br/></p>
                    <p>ИГРОВАЯ ЗАВИСИМОСТЬ</p>
                    <p><br/></p>
                    <p>Признаки, указывающие на зависимость:</p>
                    <p><br/></p>
                    <p>игрок не способен остановиться</p>
                    <p>он берет деньги взаймы для игры в казино</p>
                    <p>у него меняется характер</p>
                    <p>он ставит под угрозу работу, семью ради азартных игр</p>
                    <p><br/></p>
                    <p>Если Вы не уверены, есть ли у Вас зависимость от азартных игр, рекомендуем пройти анонимный тест по следующей <a
                        href="https://www.begambleaware.org/gambling-problems/do-i-have-a-gambling-problem/">ссылке</a>&nbsp;</p>
                    <p><br/></p>
                    <p>ЛИМИТЫ</p>
                    <p><br/></p>
                    <p>Лимит позволяет игроку установить максимальный предел потерь на выбранный период. У Вас всегда есть возможность установить или изменить лимит.&nbsp;</p>
                    <p><br/></p>
                    <p>Пожалуйста, напишите нам на <a href="mailto:support@garillacasino.com">support@garillacasino.com</a> о желаемых ограничениях.</p>
                    <p><br/></p>
                    <p>САМОИСКЛЮЧЕНИЕ</p>
                    <p><br/></p>
                    <p>Вы также можете сообщить нам о своем решении отказаться от азартных игр, написав на <a href="mailto:support@garillacasino.com">support@garillacasino.com</a>.</p>
                    <p><br/></p>
                    <p>Мы примем меры, чтобы ограничить доступ к Вашей учетной записи и исключить Вас из получения рекламных предложений.</p>
                    <p><br/></p>
                    <p>ПОМОЩЬ ИЗ ВНЕШНИХ ИСТОЧНИКОВ</p>
                    <p><br/></p>
                    <p>Следующие организации предлагают консультации и поддержку в отношении игровой зависимости:</p>
                    <p><br/></p>
                    <a>Gambling Therapy;</a><br/>
                    <a>Gamblers Anonymous;</a><br/>
                    <a>GamCare.</a>
                    <p><br/></p>
                    <p>АЗАРТНЫЕ ИГРЫ ДЛЯ НЕСОВЕРШЕННОЛЕТНИХ</p>
                    <p><br/></p>
                    <p>Мы не приемлем азартные игры среди несовершеннолетних.</p>
                    <p><br/></p>
                    <p>Из-за особенностей Интернета все еще существует вероятность того, что лица, не достигшие совершеннолетия, могут заинтересоваться и играть в азартные игры.</p>
                    <p><br/></p>
                    <p>Мы настоятельно рекомендуем родителям защищать своих детей от доступа к сайтам онлайн-игр с помощью специального программного обеспечения:</p>
                    <p><br/></p>
                    <a>Net Nanny;&nbsp;</a><br/>
                    <a>CyberPatrol;</a><br/>
                    <a>GamBlock&reg; &nbsp;</a>
                    <p><br/></p>
                    <p><br/></p>
                </div>
            </ContentPane>
        )

    else {
        return (
            <ContentPane title={t("Responsible gaming policy")}>
                <div className={css.text}>
                    <p><br/></p>
                    <p>RESPONSIBLE GAMING POLICY</p>
                    <p>Royal Assa N.V.</p>
                    <p>garillacasino.com</p>
                    <p>Last updated: 03.08.2022</p>
                    <p>Casino is fun and exciting entertainment.&nbsp;</p>
                    <p>Gambling is an attractive option if you want to try your luck and skills.</p>
                    <p>Most visitors enjoy this kind of entertainment without any problems, but there are a small number of people who lose control over their gambling activity.&nbsp;</p>
                    <p>Play responsibly!</p>
                    <p>COMPULSIVE GAMBLER</p>
                    <p>Signs indicating a disorder include:</p>
                    <p>- the person&rsquo;s inability to stop gambling,&nbsp;</p>
                    <p>- borrowing money for gambling,</p>
                    <p>- changes in the character of the player,&nbsp;</p>
                    <p>- risking their employment or family for the sake of gambling.</p>
                    <p>If you are not sure, whether you are addicted to gambling, we recommend you pass an anonymous test via the following <a
                        href="https://www.begambleaware.org/gambling-problems/do-i-have-a-gambling-problem/">link</a></p>
                    <p>LIMITS</p>
                    <p>Loss limit allows a player to set the maximum loss limit for a selected period. There is always a possibility to change the loss limit.</p>
                    <p>Please write to <a href="mailto:support@garillacasino.com">support@garillacasino.com</a> in order to establish a limit.</p>
                    <p><br/></p>
                    <p>SELF-EXCLUSION</p>
                    <p>You can also inform us about your decision to stop gambling by contacting <a href="mailto:support@garillacasino.com">support@garillacasino.com</a>.&nbsp;</p>
                    <p>We will take measures to limit access to your account and exclude you from receiving promotional offers.&nbsp;</p>
                    <p>HELP FROM EXTERNAL SOURCES&nbsp;</p>
                    <p>The following organizations offer consultation and support in regard to gambling addiction:&nbsp;</p>
                    <a>Gambling Therapy;</a><br/>
                    <a>Gamblers Anonymous;</a><br/>
                    <a>GamCare.</a>
                    <p>UNDERAGE GAMBLING</p>
                    <p>We do not tolerate underage gambling.</p>
                    <p>However, due to the nature of the internet, there is still a chance that individuals under the legal age may register and play.&nbsp;</p>
                    <p>We strongly advise parents to protect their children from accessing online gaming websites by using special software:</p>
                    <a>Net Nanny;&nbsp;</a><br/>
                    <a>CyberPatrol;</a><br/>
                    <a>GamBlock&reg; &nbsp;</a>
                    <p><br/></p>
                </div>
            </ContentPane>
        )
    }
}