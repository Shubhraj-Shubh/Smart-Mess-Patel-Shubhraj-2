import Event from "@/models/EventModel";

const RemoveUser = async ({
  params,
}: {
  params: Promise<{ eventId: string; userId: string }>;
}) => {
  try {
    const userId = (await params).userId;
    const eventId = (await params).eventId;

    const event = await Event.findById(eventId);

    if (!event) {
      return (
        <>
          <div className="mt-20">No event found with the id of {eventId}</div>
        </>
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        $pull: { boarders: userId },
      },
      { new: true }
    );

    return (
      <>
        <div className="mt-20">
          User removed from event
          {updatedEvent?.boarders.map((boarder, index) => (
            <div className="mt-2" key={index}>{boarder.toString()}</div>
          ))}
        </div>
      </>
    );
  } catch (error) {
    console.log(error);
    return (
      <>
        <div className="mt-20">Internal server error</div>
      </>
    );
  }
};

export default RemoveUser;
