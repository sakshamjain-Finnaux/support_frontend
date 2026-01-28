import TimelineBox from "./TimelineBox";
export default function TimeLine({ timeline }) {
  return (
    !!timeline.length && (
      <div className="flex flex-col">
        <h2 className="text-body-500 text-2xl font-medium mb-4 text-center">
          Issue Timeline
        </h2>
        {timeline.map((obj, index) =>
          index === timeline.length - 1 ? null : (
            <div key={index}>
              <TimelineBox {...obj} />
              <div className="border-2 border-body-600 border-dotted h-14 w-0 my-2 mx-auto" />
            </div>
          ),
        )}
        <TimelineBox {...timeline[timeline.length - 1]} />
      </div>
    )
  );
}
