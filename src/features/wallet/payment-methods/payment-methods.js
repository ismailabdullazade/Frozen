import css from "../payment-default.module.css";
import blackRabitEHOT from "../../../images/wallet/methods_wallet/blackRabitEHOT.svg";
import qiwi from "../../../images/wallet/methods_wallet/qiwi.svg";
import p2p from "../../../images/wallet/methods_wallet/p2p.svg";
import sber_tinkoff from "../../../images/wallet/methods_wallet/piastrix_sbp_tinkoff.svg";
import piastrix_sbp_tinkoff from "../../../images/wallet/methods_wallet/piastrix_sbp_tinkoff.svg";
import piastrix_bank from "../../../images/wallet/methods_wallet/piastrix_card.svg";
import piastrix_sber from "../../../images/wallet/methods_wallet/piastrix_sber.svg";
import piastrix_sbp from "../../../images/wallet/methods_wallet/piastrix_sbp.svg";
import piastrix_sbp_sberbank from "../../../images/wallet/methods_wallet/piastrix_sbp_sberbank.svg";
import uMoney from "../../../images/wallet/methods_wallet/u_money.svg";
import Ethereum from "../../../images/wallet//methods_wallet/Ethereum.svg";
import Litecoin from "../../../images/wallet/methods_wallet/Litecoin.svg";
import Bitcoin from "../../../images/wallet/methods_wallet/Bitcoin.svg";
import piastrix from "../../../images/wallet/methods_wallet/piastrix.svg";
import tether_erc20 from "../../../images/wallet/methods_wallet/tether_erc20.svg";
import tether_bep20 from "../../../images/wallet/methods_wallet/tether_bep20.svg";
import tether_trc20 from "../../../images/wallet/methods_wallet/tether_trc20.svg";
import dodgecoin from "../../../images/wallet//methods_wallet/dogecoin.svg";
import bnb from "../../../images/wallet/methods_wallet/bnb.svg";
import tron from "../../../images/wallet/methods_wallet/tron.svg";
import telegram from "../../../images/wallet/methods_wallet/telegram.svg";
import blackRabitP2P from "../../../images/wallet/blackRabitP2P.svg";
import paycosP2P from "./../../../images/wallet/paycos_p2p_106.svg";
import wallet_expert_p2p from "../../../images/wallet/wallet_expert_p2p.svg";
import piastrix_card from "../../../images/wallet/piastrix_card.svg";
import busd from "../../../images/wallet/busd.svg";
import polygon from "../../../images/wallet/polygon.svg";
import matic from "../../../images/wallet/matic.svg";
import dash from "../../../images/wallet/dash.svg";
import { useMemo, useState } from "react";
import PaymentItem from "./payment-item";
import Scrollbar from "../../../components/scrollbar/scrollbar";

function icons(type) {
  return {
    uMoney: {
      icons: [uMoney],
    },
    telegram_pay: {
      icons: [telegram],
    },
    blackRabbit_acquiring: {
      icons: [blackRabitEHOT],
    },
    blackRabbit_payout_crypto: {
      icons: [blackRabitEHOT],
    },
    blackRabbit_p2p: {
      icons: [blackRabitP2P],
    },
    paycos_p2p_106: {
      icons: [paycosP2P],
    },
    wallet_expert_p2p: {
      icons: [wallet_expert_p2p],
    },
    paycos_qiwi: {
      icons: [qiwi],
    },
    paycos_yoomoney: {
      icons: [uMoney],
    },
    paycos_p2p: {
      icons: type === "withdrawal" ? [sber_tinkoff] : [p2p],
    },
    piastrix: {
      icons: [piastrix],
    },
    piastrix_sbp: {
      icons: [piastrix_sbp],
    },
    piastrix_sber: {
      icons: [piastrix_sber],
    },
    piastrix_bank: {
      icons: [piastrix_bank],
    },
    piastrix_card: {
      icons: [piastrix_card],
    },
    piastrix_sbp_sberbank: {
      icons: [piastrix_sbp_sberbank],
    },
    piastrix_sbp_tinkoff: {
      icons: [piastrix_sbp_tinkoff],
    },
    kauri: {
      icons: [
        Bitcoin,
        Ethereum,
        Litecoin,
        tether_erc20,
        tether_trc20,
        tether_bep20,
        dodgecoin,
        bnb,
      ],
      service_info: {
        ETH: Ethereum,
        "USDT-ERC20": tether_erc20,
        "USDT-TRC20": tether_trc20,
        "USDT-BEP20": tether_bep20,
        BTC: Bitcoin,
        LTC: Litecoin,
        BNB: bnb,
        DOGE: dodgecoin,
        // "USDT":
      },
    },
    cryptomus: {
      icons: [
        bnb,
        Bitcoin,
        busd,
        Ethereum,
        Litecoin,
        polygon,
        matic,
        dash,
        tron,
        tether_erc20,
        tether_trc20,
        tether_bep20,
      ],
    },
  };
}

export default function PaymentsMethods({
  setPaymentMethod,
  methods,
  type = "deposit",
}) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const result = useMemo(() => {
    const result = [];

    if (!methods) {
      return result;
    }

    [...methods]
      .sort((a, b) => {
        if (a.order < b.order) {
          return -1;
        }
        if (a.order > b.order) {
          return 1;
        }
        return 0;
      })
      .forEach((item) => {
        const iconsGroup = icons(type)[item.slug];

        if (iconsGroup) {
          if (item.service_info?.length > 0) {
            item.service_info.forEach((name) => {
              result.push({
                provider: item.slug,
                icon: iconsGroup?.service_info[name],
                ...item,
                currency: name,
              });
            });
          } else {
            iconsGroup.icons?.forEach((icon) => {
              result.push({
                provider: item.slug,
                icon,
                ...item,
              });
            });
          }
        }
      });

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods]);

  const handlePaymentSelection = (method) => {
    setSelectedMethod(method);
    setPaymentMethod(method);
  };

  return (
    <Scrollbar>
      <div className={css.list}>
        {result.map((method) => (
          <PaymentItem
            key={method.icon + method.name}
            onClick={() => handlePaymentSelection(method)}
            icon={method.icon}
            method={method.slug}
            isActive={
              selectedMethod?.slug === "kauri"
                ? method?.currency === selectedMethod?.currency
                : method?.slug === selectedMethod?.slug
            }
          />
        ))}
      </div>
    </Scrollbar>
  );
}
