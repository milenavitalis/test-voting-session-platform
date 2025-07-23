import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/logic/reducer";
import Header from "@/components/common/header";
import BubbleLoader from "@/components/layouts/loader";
import CountVote from "@/components/common/result-vote/count-vote";
import BarChart from "@/components/common/result-vote/bar-chart";

const ResultVote = () => {
  const navigate = useNavigate();
  const { topics, voteResult, loadTopics, loadVoteResult } = useSelector(
    (state: RootState) => state.topic
  );

  if (loadTopics || loadVoteResult) {
    return <BubbleLoader />;
  }

  useEffect(() => {
    if (!loadTopics && !loadVoteResult && (!topics || topics.length === 0)) {
      navigate("/home/result", { replace: true });
    }
  }, [topics, loadTopics, loadVoteResult, navigate]);

  if (!voteResult) {
    return;
  }
  return (
    <div className="p-4 gap-3 flex flex-col min-h-screen">
      <Header
        title="Resultado da votação"
        description="Confira o resultado da última sessão de votação"
      />
      <CountVote count={voteResult.positive_count} title="Votos positivos" />
      <CountVote count={voteResult.negative_count} title="Votos negativos" />
      <BarChart data={voteResult} />
    </div>
  );
};

export default ResultVote;
