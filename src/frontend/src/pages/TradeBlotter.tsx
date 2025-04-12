
import React from "react";
import { 
  ArrowDown, 
  ArrowUp, 
  Briefcase, 
  Download, 
  Filter, 
  PieChart, 
  Upload 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import SummaryCard from "@/components/SummaryCard";

const Positions = () => {
  return (
    <DashboardLayout title="Positions">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <SummaryCard 
          icon={<PieChart className="h-5 w-5 text-primary" />} 
          title="Total Trades" 
          value="12" 
        />
        <SummaryCard 
          icon={<ArrowUp className="h-5 w-5 text-green-500" />} 
          title="Profitable Positions" 
          value="8" 
        />
        <SummaryCard 
          icon={<ArrowDown className="h-5 w-5 text-red-500" />} 
          title="Total Commission Paid" 
          value="500" 
        />
        <SummaryCard 
          icon={<Briefcase className="h-5 w-5 text-gray-700" />} 
          title="Total Market Value" 
          value="$125,000"  
        />
      </div>

      {/* Positions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-medium">Open Positions</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-100">
          <Input 
            placeholder="Search positions..." 
            className="max-w-md"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Symbol</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Quantity</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Entry Price</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Current Price</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">P/L</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { symbol: "AAPL", type: "Long", quantity: 100, entryPrice: 150.25, currentPrice: 172.30, pl: "+14.67%", status: 'True' },
                { symbol: "TSLA", type: "Short", quantity: 50, entryPrice: 220.00, currentPrice: 205.85, pl: "+6.43%", status: 'True' },
                { symbol: "MSFT", type: "Long", quantity: 75, entryPrice: 280.15, currentPrice: 305.50, pl: "+9.05%", status: 'True' },
                { symbol: "AMZN", type: "Long", quantity: 30, entryPrice: 135.78, currentPrice: 132.15, pl: "-2.67%", status: 'True' },
                { symbol: "META", type: "Short", quantity: 45, entryPrice: 310.25, currentPrice: 328.10, pl: "-5.75%", status: 'False' },
              ].map((position, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{position.symbol}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      position.type === "Long" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {position.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">{position.quantity}</td>
                  <td className="py-4 px-4">${position.entryPrice}</td>
                  <td className="py-4 px-4">${position.currentPrice}</td>
                  <td className={`py-4 px-4 font-medium ${
                    position.pl.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}>
                    {position.pl}
                  </td>
                  <td className="py-4 px-4">${position.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="py-4 px-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 1-5 of 12 positions
          </div>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Positions;
