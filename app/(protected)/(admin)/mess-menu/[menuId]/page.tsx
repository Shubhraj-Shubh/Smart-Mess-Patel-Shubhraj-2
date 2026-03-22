import { GetMenu } from "@/actions/MessMenuActions";
import MessMenuForm from "./MessMenu";
import { GetMenuPollByMenuId } from "@/actions/MenuPollActions";
import CopyButton from "./CopyButton";
import CreatePoll from "./CreatePoll";

export default async function Page({
  params,
}: {
  params: Promise<{ menuId: string }>;
}) {
  const menuId = (await params).menuId;

  const res = await GetMenu(menuId as string);

  if (res.status === 500) return <p>Internal Server Error</p>;

  const pollRes = await GetMenuPollByMenuId(menuId as string);

  if (pollRes.status !== 200) return <p>Internal Server Error</p>;

  return (
    <>
      <CreatePoll menuId={menuId} />
      <div className="gap-4 flex max-w-screen-xl m-auto my-8">
        {pollRes.data && pollRes.data.length > 0 ? (
          pollRes.data.map((poll, index) => (
            <div
              key={poll._id.toString()}
              className="bg-white relative  min-w-72 rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {/* Index Badge */}
                  <span className="inline-block px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
                    Poll #{index + 1}
                  </span>

                  {/* Expiry Date */}
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h2 className="text-gray-500 text-sm">
                      Expires: {poll.expiryDate.toLocaleDateString()}
                    </h2>
                  </div>
                </div>

                {/* Copy Button */}
                <div className="hover:bg-gray-50 p-2 rounded-md transition-colors">
                  <CopyButton pollId={poll._id.toString()} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No polls found</p>
          </div>
        )}
      </div>
      <div>{res.data && <MessMenuForm menu={res.data} />}</div>
    </>
  );
}
