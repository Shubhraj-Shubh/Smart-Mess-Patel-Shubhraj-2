type MealPlanType = {
  data: {
    day: string;
    meals: {
      morning: {
        veg: string[];
        nonVeg: string[];
      };
      lunch: {
        veg: string[];
        nonVeg: string[];
      };
      eveningSnack: {
        veg: string[];
        nonVeg: string[];
      };
      dinner: {
        veg: string[];
        nonVeg: string[];
      };
    };
  }[];
};

const MealPlan = ({ data }: MealPlanType) => {
  const mealOrder: Array<"morning" | "lunch" | "eveningSnack" | "dinner"> = [
    "morning",
    "lunch",
    "eveningSnack",
    "dinner",
  ];

  return (
    <div className="overflow-x-auto p-4 mb-20 max-w-screen-xl mx-auto">
      <div className="flex flex-col gap-4 min-w-max">
        {data.map(({ day, meals }) => (
          <div
            key={day}
            className="min-w-[250px] border bg-white rounded-lg shadow-md p-4"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800">{day}</h3>

            <div className="flex items-start justify-evenly gap-4">
              {mealOrder.map((mealType) => {
                const meal = meals[mealType];
                const formattedMealType = mealType
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                return (
                  <div key={mealType} className="space-y-2 w-full">
                    <h4 className="text-sm font-semibold text-gray-600">
                      {formattedMealType}
                    </h4>

                    {/* Veg Section */}
                    {meal.veg.some((item) => item.trim()) && (
                      <div className="bg-green-50 p-2 rounded-md border border-green-200">
                        <span className="text-sm font-medium text-green-700">
                          Veg
                        </span>
                        <ul className="mt-1 space-y-1">
                          {meal.veg
                            .filter((item) => item.trim())
                            .map((item, index) => (
                              <li
                                key={`veg-${index}`}
                                className="text-sm text-green-800"
                              >
                                {item}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Non-Veg Section */}
                    {meal.nonVeg.some((item) => item.trim()) && (
                      <div className="bg-red-50 p-2 rounded-md border border-red-200">
                        <span className="text-sm font-medium text-red-700">
                          Non-Veg
                        </span>
                        <ul className="mt-1 space-y-1">
                          {meal.nonVeg
                            .filter((item) => item.trim())
                            .map((item, index) => (
                              <li
                                key={`nonveg-${index}`}
                                className="text-sm text-red-800"
                              >
                                {item}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlan;
