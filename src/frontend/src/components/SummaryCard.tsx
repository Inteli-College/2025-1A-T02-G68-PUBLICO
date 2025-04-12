
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  value: string;
}

const SummaryCard = ({ icon, title, value }: SummaryCardProps) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gray-100 rounded-md">{icon}</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
