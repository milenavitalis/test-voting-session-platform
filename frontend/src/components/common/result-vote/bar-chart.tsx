import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Props = {
  data: {
    positive_count: number;
    negative_count: number;
  };
};

const BarChart = ({ data }: Props) => {
  const chartData = [
    { name: "Sim", votos: data.positive_count, fill: "var(--chart-2)" },
    { name: "Não", votos: data.negative_count, fill: "var(--destructive)" },
  ];

  const chartConfig = {
    votos: {
      label: "Votos",
      color: "var(--chart-2)",
    },
  };

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Resultado da Votação</CardTitle>
        <CardDescription>Contagem de votos por opção</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ReBarChart
            width={300}
            height={250}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="votos" radius={[4, 4, 0, 0]} />
          </ReBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarChart;
