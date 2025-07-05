import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Sector } from 'recharts';
import { ArrowUpRight, DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import { getProjectStatuses,getProjectProfits } from './supabaseServices'; // make sure path is correct

// --- Static Data for Bar and Line Charts ---
const barChartData = [
  { name: 'Jan', profit: 4000, expenses: 2400 },
  { name: 'Feb', profit: 3000, expenses: 1398 },
  { name: 'Mar', profit: 2000, expenses: 9800 },
  { name: 'Apr', profit: 2780, expenses: 3908 },
  { name: 'May', profit: 1890, expenses: 4800 },
  { name: 'Jun', profit: 2390, expenses: 3800 },
  { name: 'Jul', profit: 3490, expenses: 4300 },
];




const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// --- Reusable Card Components ---
const Card = ({ children, className }) => (
  <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`p-4 sm:p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

// --- Active Shape for Pie Chart ---
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Value ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

// --- Main Dashboard Component ---
const Dashboard = () => {
  const [activePieIndex, setActivePieIndex] = useState(0);
  const [pieChartData, setPieChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  const onPieEnter = (_, index) => {
    setActivePieIndex(index);
  };

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await getProjectStatuses();
        if (data && data.length > 0) {
          const counts = data.reduce((acc, curr) => {
            const status = curr.status || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});

          const pieData = Object.keys(counts).map((status) => ({
            name: status,
            value: counts[status],
          }));

          setPieChartData(pieData);
        } else {
          setPieChartData([]);
        }
      } catch (error) {
        console.error('Failed to load statuses for pie chart:', error);
        setPieChartData([]);
      }
    };

    fetchStatuses();
  }, []);

  useEffect(() => {
  const fetchProfits = async () => {
    try {
      const data = await getProjectProfits();
      if (data && data.length > 0) {
        // Group profits by month
        const profitsByMonth = data.reduce((acc, curr) => {
          const date = new Date(curr.project_date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // e.g., 2025-07
          acc[monthKey] = (acc[monthKey] || 0) + (curr.final_value || 0);
          return acc;
        }, {});

        // Sort months chronologically
        const sortedMonths = Object.keys(profitsByMonth).sort();

        const lineData = sortedMonths.map((month) => ({
          name: month,        // e.g., "2025-07"
          profit: profitsByMonth[month],
        }));

        setLineChartData(lineData);
      } else {
        setLineChartData([]);
      }
    } catch (error) {
      console.error('Failed to load profit data for line chart:', error);
      setLineChartData([]);
    }
  };

  fetchProfits();
}, []);


  return (
    <div className="min-h-screen bg-gray-50 w-full text-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-500">Total profit</h3>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-gray-500">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-500">Subscriptions</h3>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-gray-500">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-500">Sales</h3>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-gray-500">+19% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-gray-500">Active Now</h3>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-gray-500">+201 since last hour</p>
            </CardContent>
          </Card>
        </div>

        {/* --- Charts --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-xl font-semibold">Profit Overview</h2>
              <p className="text-sm text-gray-500">A look at profit vs. expenses over the past months.</p>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem'
                    }}
                    cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card>
  <CardHeader>
    <h2 className="text-xl font-semibold">Monthly Profit Trends</h2>
    <p className="text-sm text-gray-500">See profit growth over recent months.</p>
  </CardHeader>
  <CardContent className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={lineChartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`} />
        <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '0.5rem' }} />
        <Legend iconType="circle" />
        <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>


          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Project Status Distribution</h2>
              <p className="text-sm text-gray-500">Distribution of project statuses from your database.</p>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activePieIndex}
                    activeShape={renderActiveShape}
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
