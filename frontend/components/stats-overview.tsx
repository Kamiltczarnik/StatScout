import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function StatsOverview() {
  const data = [
    {
      name: "Oct",
      total: 176,
    },
    {
      name: "Nov",
      total: 220,
    },
    {
      name: "Dec",
      total: 195,
    },
    {
      name: "Jan",
      total: 210,
    },
    {
      name: "Feb",
      total: 185,
    },
    {
      name: "Mar",
      total: 230,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

