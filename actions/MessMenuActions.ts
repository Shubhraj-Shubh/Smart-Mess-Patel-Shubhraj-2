"use server";
import MessMenu from "@/models/MessMenu";

interface MealType {
  veg: string[];
  nonVeg: string[];
}

interface Meal {
  morning: MealType;
  lunch: MealType;
  eveningSnack: MealType;
  dinner: MealType;
}

interface Day {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  meals: Meal;
}

interface MenuType {
  season: "Summer" | "Winter" | "Autumn" | "Spring";
  startDate: Date;
  endDate: Date;
  menu: Day[];
}

export async function CreateMenu(data: MenuType) {
  try {
    const menu = new MessMenu(data);
    await menu.save();

    return {
      status: 200,
      message: "Menu created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function UpdateMenu(id: string, data: MenuType) {
  try {
    await MessMenu.findByIdAndUpdate(id, data);

    return {
      status: 200,
      message: "Menu updated successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function DeleteMenu(id: string) {
  try {
    await MessMenu.findByIdAndDelete(id);

    return {
      status: 200,
      message: "Menu deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function ActiveMenu() {
  try {
    const menu = await MessMenu.findOne({ active: true });

    if (!menu) {
      return {
        status: 404,
        message: "Menu not found",
      };
    }

    const updatedMenu = {
      _id: menu._id.toString(),
      season: menu.season,
      startDate: menu.startDate,
      endDate: menu.endDate,
      active: menu.active,
      menu: menu.menu.map((dayItem) => ({
        day: dayItem.day,
        meals: {
          morning: {
            veg: dayItem.meals.morning.veg,
            nonVeg: dayItem.meals.morning.nonVeg,
          },
          lunch: {
            veg: dayItem.meals.lunch.veg,
            nonVeg: dayItem.meals.lunch.nonVeg,
          },
          eveningSnack: {
            veg: dayItem.meals.eveningSnack.veg,
            nonVeg: dayItem.meals.eveningSnack.nonVeg,
          },
          dinner: {
            veg: dayItem.meals.dinner.veg,
            nonVeg: dayItem.meals.dinner.nonVeg,
          },
        },
      })),
    };

    return {
      status: 200,
      message: "Menu fetched successfully",
      data: updatedMenu.menu,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function GetMenu(id: string) {
  try {
    const menu = await MessMenu.findById(id);

    if (!menu) {
      return {
        status: 404,
        message: "Menu not found",
      };
    }

    const updatedMenu = {
      _id: menu._id.toString(),
      season: menu.season,
      startDate: menu.startDate,
      endDate: menu.endDate,
      active: menu.active,
      menu: menu.menu.map((dayItem) => ({
        day: dayItem.day,
        meals: {
          morning: {
            veg: dayItem.meals.morning.veg,
            nonVeg: dayItem.meals.morning.nonVeg,
          },
          lunch: {
            veg: dayItem.meals.lunch.veg,
            nonVeg: dayItem.meals.lunch.nonVeg,
          },
          eveningSnack: {
            veg: dayItem.meals.eveningSnack.veg,
            nonVeg: dayItem.meals.eveningSnack.nonVeg,
          },
          dinner: {
            veg: dayItem.meals.dinner.veg,
            nonVeg: dayItem.meals.dinner.nonVeg,
          },
        },
      })),
    };

    return {
      status: 200,
      message: "Menu fetched successfully",
      data: updatedMenu,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function GetAllMenus() {
  try {
    const menus = await MessMenu.find();

    if (!menus) {
      return {
        status: 404,
        message: "No menus found",
      };
    }

    const updatedMenus = menus.map((menu) => {
      return {
        _id: menu._id.toString(),
        season: menu.season,
        startDate: menu.startDate,
        endDate: menu.endDate,
        active: menu.active,
      };
    });

    return {
      status: 200,
      message: "Menus fetched successfully",
      data: updatedMenus,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}