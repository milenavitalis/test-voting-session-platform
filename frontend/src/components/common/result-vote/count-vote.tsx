interface CountVoteProps {
  count: number;
  title: string;
}

const CountVote = ({ count, title }: CountVoteProps) => {
  return (
    <div className="gap-3 flex flex-row border p-4 border-gray-300 rounded-2xl">
      <div className="font-semibold">{title}:</div>
      <div>{count}</div>
    </div>
  );
};

export default CountVote;
