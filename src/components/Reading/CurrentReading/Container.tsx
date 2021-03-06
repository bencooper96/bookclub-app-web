import { CurrentReadingRow } from "./Row";
import { Skeleton } from "src/components/Skeleton";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hydrateReadings } from "src/features/readings/currentReadingSlice";
import { useCurrentlyReadingQuery } from "src/generated/graphql";
import { CurrentReadingToolbar } from "./Toolbar";
import { useSelector } from "react-redux";
import { allCurrentReadings } from "src/features/readings/currentReadingSlice";

export const CurrentReadingContainer = () => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [{ data }] = useCurrentlyReadingQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.currentlyReading && firstLoad) {
      dispatch(hydrateReadings(data.currentlyReading));
      setFirstLoad(false);
    }
  }, [data]);

  const currentReadings = useSelector(allCurrentReadings);
  return (
    <div className="flex flex-col mx-auto gap-3 w-full col-span-4">
      <div className="flex flex-row justify-between items-center ">
        <h2 className="text-darkBlue text-3xl font-bold truncate">
          Currently Reading
        </h2>
        <CurrentReadingToolbar />
      </div>
      <Skeleton
        className="h-14 my-1 bg-accent"
        isLoaded={currentReadings != null}
        variant="list"
      >
        {currentReadings.map((data) => {
          const props = {
            author: data.author,
            title: data.title,
            type: data.type,
            id: data.id,
          };
          return <CurrentReadingRow key={data.id} {...props} />;
        })}
      </Skeleton>
    </div>
  );
};
