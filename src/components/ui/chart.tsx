import React from "react";
import { ChartTooltipProps } from "recharts";

export const ChartContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-[350px]">{children}</div>
);

export const ChartTooltip = ({ active, payload, label }: ChartTooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow">
        <p className="font-semibold">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ChartTooltipContent = ChartTooltip;

export const ChartConfig = {
  colors: {
    primary: "#22c55e",
    secondary: "#f97316",
  },
};