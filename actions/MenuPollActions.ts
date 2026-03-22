"use server";
import MenuPoll from "@/models/MenuPoll";

interface MenuPollType {
  menuId: string;
  expiryDate: Date;
}

export async function CreateMenuPoll(data: MenuPollType) {
  try {
    const menuPoll = new MenuPoll(data);
    await menuPoll.save();

    return {
      status: 200,
      message: "Menu Poll created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function UpdateMenuPoll(id: string, data: MenuPollType) {
  try {
    await MenuPoll.findByIdAndUpdate(id, data);

    return {
      status: 200,
      message: "Menu Poll updated successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function DeleteMenuPoll(id: string) {
  try {
    await MenuPoll.findByIdAndDelete(id);

    return {
      status: 200,
      message: "Menu Poll deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function GetAllMenuPolls() {
  try {
    const menuPolls = await MenuPoll.find();
    return {
      status: 200,
      data: menuPolls,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function GetMenuPoll(id: string) {
  try {
    const menuPoll = await MenuPoll.findById(id);

    if (!menuPoll) {
      return {
        status: 404,
        message: "Poll not found",
      };
    }

    return {
      status: 200,
      data: menuPoll,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function GetMenuPollByBoarderId(
  menuPollId: string,
  boarderId: string
) {
  try {
    const menuPoll = await MenuPoll.findById(menuPollId);

    if (!menuPoll) {
      return {
        status: 404,
        message: "Poll not found",
      };
    }

    // Filter feedbacks by boarderId
    const filteredFeedbacks = menuPoll.feedbacks
      .filter((feedback) => feedback.boarderId.toString() === boarderId)
      .map(({ day, mealType, feedback }) => ({
        day,
        mealType,
        feedback,
      }));
    return {
      status: 200,
      data: {
        ...menuPoll.toObject(),
        feedbacks: filteredFeedbacks, // Only feedbacks matching boarderId
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function GetMenuPollByMenuId(menuId: string) {
  try {
    const menuPoll = await MenuPoll.find({ menuId: menuId });

    if (!menuPoll) {
      return {
        status: 200,
        data: [],
      };
    }

    return {
      status: 200,
      data: menuPoll,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function GetMenuPollByMenuIdAndBoarderId(
  menuId: string,
  boarderId: string
) {
  try {
    const menuPoll = await MenuPoll.findOne({
      menuId: menuId,
      "feedbacks.boarderId": boarderId,
    });

    return {
      status: 200,
      data: menuPoll,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function addFeedbackByMenuId(
  menuPollId: string,
  feedback: {
    boarderId: string;
    mealType: string;
    day: string;
    feedback: "Like" | "Dislike";
    replacementSuggestion?: string;
  }
) {
  try {
    const existingMenuPoll = await MenuPoll.findOne({
      _id: menuPollId,
      "feedbacks.boarderId": feedback.boarderId,
      "feedbacks.mealType": feedback.mealType,
      "feedbacks.day": feedback.day,
    });

    if (existingMenuPoll) {
      await MenuPoll.findOneAndUpdate(
        {
          _id: menuPollId,
          "feedbacks.boarderId": feedback.boarderId,
          "feedbacks.mealType": feedback.mealType,
          "feedbacks.day": feedback.day,
        },
        {
          $set: {
            "feedbacks.$.feedback": feedback.feedback,
            "feedbacks.$.replacementSuggestion":
              feedback.replacementSuggestion || null,
          },
        },
        { new: true }
      );

      return {
        status: 200,
        message: "Feedback updated successfully",
      };
    } else {
      // Add new feedback if it doesn't exist
      const res = await MenuPoll.findByIdAndUpdate(
        menuPollId,
        {
          $push: { feedbacks: feedback },
        },
        { new: true }
      );

      if (!res) {
        return {
          status: 404,
          message: "MenuPoll not found",
        };
      }

      return {
        status: 200,
        message: "Feedback added successfully",
      };
    }
  } catch (error) {
    console.log(error);

    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}
