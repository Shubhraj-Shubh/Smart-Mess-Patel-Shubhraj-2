import Link from "next/link";
import React from "react";

type MenuType = {
  menus: {
    _id: string;
    season: string;
    startDate: Date;
    endDate: Date;
    active: boolean;
  }[];
};

const MenuPage: React.FC<MenuType> = ({ menus }) => {
  // Format date to readable string
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Seasonal Menus
        </h1>

        {menus.length === 0 ? (
          <p className="text-gray-500">No menus available</p>
        ) : (
          <div className="space-y-8">
            {menus.map((menu) => (
              <div
                key={menu._id}
                className="bg-white w-full rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <Link href={`/mess-menu/${menu._id}`} className="w-full">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {menu.season} Season
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {formatDate(menu.startDate)} - {formatDate(menu.endDate)}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
