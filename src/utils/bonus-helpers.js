export const splitTitle = ({ bonus, className }) => {
  const parts = bonus?.title?.split(" ");

  return (
    <div className={className}>
      {parts && parts.length > 0 && (
        <>
          <div>{parts[0]}</div>
          {parts.length > 1 && (
            <div>{parts.slice(-(parts.length - 1)).join(" ")}</div>
          )}
        </>
      )}
    </div>
  );
};

export const isFreeDepBonus = (bonus) => {
  if (!bonus) {
    return false;
  }

  //Бонусы доступеные для активации без депозита с типом 4, 5, 6
  return [4, 5, 6].includes(bonus.bonus_slot_type_id);
};
