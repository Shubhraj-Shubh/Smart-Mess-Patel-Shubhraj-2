"use server";
import Boarder from "@/models/Boarder";

type BoarderResult = {
  _id: string;
  name: string;
  rollno: string;
  email: string;
  cardNo: string;
  phoneNo: string;
  secret: string;
  session: number;
  amount: number;
  fineAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export const getBoarder = async (
  email: string
): Promise<BoarderResult | null> => {
  try {
    const boarder = await Boarder.findOne({ email });

    if (!boarder) return null;

    const updatedData = {
      ...boarder.toObject(),
      _id: boarder._id.toString(),
      fineAmount: boarder.fineAmount ,
    };

    return updatedData;
  } catch (error) {
    console.error("Failed to fetch boarder:", error);
    return null;
  }
};

export const searchBoardersWithNameSession = async (
  search: string,
  session?: number | undefined
) => {
  try {
    const query: {
      $or: Array<{ name?: RegExp; rollno?: RegExp }>;
      session?: number;
    } = {
      $or: [
        { name: new RegExp(search || "", "i") },
        { rollno: new RegExp(search || "", "i") },
      ],
    };

    if (session !== undefined) {
      query.session = session;
    }

    const boarders = await Boarder.find(query);

    const filteredBoarders = boarders.map((boarder) => ({
      _id: boarder._id.toString(),
      name: boarder.name,
      email: boarder.email,
      rollno: boarder.rollno,
      phoneNo: boarder.phoneNo,
      session: boarder.session,
      cardNo: boarder.cardNo,
      secret: boarder.secret,
      amount: boarder.amount,
      fineAmount: boarder.fineAmount,
    }));

    return filteredBoarders;
  } catch (error) {
    console.log(error);
    return [];
  }
};
