"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { addFeedbackByMenuId } from "@/actions/MenuPollActions";
import { toast } from "sonner";

type FeedbackState = {
  isOpen: boolean;
  day: string;
  mealType: string;
  feedback: "Like" | "Dislike";
};

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
  feedbackId: string;
  boarderId: string;
  feedbacks: {
    day: string;
    mealType: "morning" | "lunch" | "eveningSnack" | "dinner";
    feedback: "Like" | "Dislike";
  }[];
};

const MealPlan = ({ data, feedbackId, boarderId, feedbacks }: MealPlanType) => {
  const mealOrder: Array<"morning" | "lunch" | "eveningSnack" | "dinner"> = [
    "morning",
    "lunch",
    "eveningSnack",
    "dinner",
  ];

  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    isOpen: false,
    day: "",
    mealType: "",
    feedback: "Like",
  });

  const [replacementSuggestion, setReplacementSuggestion] = useState("");

  const sendFeedback = async (values: {
    mealType: string;
    day: string;
    feedback: "Like" | "Dislike";
    replacementSuggestion: string;
  }) => {
    try {
      const res = await addFeedbackByMenuId(feedbackId, {
        ...values,
        boarderId: boarderId,
      });

      if (res.status === 200) {
        toast.success(`Successfully ${values.day} Feedback Submitted`);
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFeedbackClick = (
    day: string,
    mealType: string,
    feedback: "Like" | "Dislike"
  ) => {
    if (feedback === "Like") {
      sendFeedback({
        day,
        mealType,
        feedback,
        replacementSuggestion: "",
      });
    } else {
      // For "Dislike", open dialog to get replacement suggestion
      setFeedbackState({
        isOpen: true,
        day,
        mealType,
        feedback,
      });
    }
  };

  const handleSubmitFeedback = () => {
    sendFeedback({
      day: feedbackState.day,
      mealType: feedbackState.mealType,
      feedback: feedbackState.feedback,
      replacementSuggestion,
    });

    // Reset state
    setFeedbackState({
      isOpen: false,
      day: "",
      mealType: "",
      feedback: "Like",
    });
    setReplacementSuggestion("");
  };

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

                // Check if feedback exists for this day and mealType
                const existingFeedback = feedbacks.find(
                  (fb) => fb.day === day && fb.mealType === mealType
                );

                return (
                  <div key={mealType} className="space-y-2 w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-600">
                        {formattedMealType}
                      </h4>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() =>
                            handleFeedbackClick(day, mealType, "Like")
                          }
                          disabled={!!existingFeedback} // Disable if feedback exists
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() =>
                            handleFeedbackClick(day, mealType, "Dislike")
                          }
                          disabled={!!existingFeedback} // Disable if feedback exists
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

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

      {/* Feedback Dialog for Replacement Suggestion */}
      <Dialog
        open={feedbackState.isOpen}
        onOpenChange={(open) =>
          setFeedbackState((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suggest a replacement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              What would you prefer instead for {feedbackState.day}&apos;s{" "}
              {feedbackState.mealType.replace(/([A-Z])/g, " $1").toLowerCase()}?
            </p>
            <Textarea
              placeholder="I would prefer..."
              value={replacementSuggestion}
              onChange={(e) => setReplacementSuggestion(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setFeedbackState((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MealPlan;
