import React, { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts"
import {
  ArrowUpRight,
  DollarSign,
  Users,
  Funnel,
  FunnelX,
  ListFilter,
  CreditCard,
  Activity,
} from "lucide-react"
import {
  getProjectStatuses,
  getProjectProfits,
  getFinancialYearProfitSums,
  getCompletedProjectCounts,
  getOngoingProjectsCount,
  getUpcomingProjectsCount,
} from "./supabaseServices"
import { supabase } from "./supabaseClient"

import DataView from "./DataView"
import ProfitPopup from "./ProfitPopup"

// Month name formatter
const formatMonthYear = (dateString) => {
  const [year, month] = dateString.split("-")
  const date = new Date(year, month - 1)
  return date.toLocaleString("default", { month: "short", year: "numeric" }) // e.g., Jan 2025
}

const PIE_CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const Card = ({ children, className }) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
)

const CardHeader = ({ children, className }) => (
  <div className={`p-4 sm:p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className }) => (
  <div className={`p-4 sm:p-6 ${className}`}>{children}</div>
)

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className="text-lg font-bold"
      >
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
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Value ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

const Dashboard = () => {
  const [activePieIndex, setActivePieIndex] = useState(0)
  const [pieChartData, setPieChartData] = useState([])
  const [lineChartData, setLineChartData] = useState([])

  const [monthlyProfit, setMonthlyProfit] = useState(0)
  const [profitChange, setProfitChange] = useState(0)
  const [completedProjectsThisMonth, setCompletedProjectsThisMonth] =
    useState(0)
  const [completedProjectsChange, setCompletedProjectsChange] = useState(0)
  const [ongoingProjectsCount, setOngoingProjectsCount] = useState(0)
  const [upcomingProjectsCount, setUpcomingProjectsCount] = useState(0)

  const [showDataView, setShowDataView] = useState(false)
  const [dataViewTitle, setDataViewTitle] = useState("")
  const [dataViewData, setDataViewData] = useState([])
  const [showProfitPopup, setShowProfitPopup] = useState(false)

  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")

  useEffect(() => {
    if (dateFilterOpen && (!customStartDate || !customEndDate)) {
      const today = new Date()
      const year =
        today.getMonth() + 1 >= 4
          ? today.getFullYear()
          : today.getFullYear() - 1
      const start = `${year}-04-01`
      const end = `${year + 1}-03-31`

      setCustomStartDate(start)
      setCustomEndDate(end)
    }
  }, [dateFilterOpen])

  const onPieEnter = (_, index) => setActivePieIndex(index)

  const loadDefaultLineChart = async () => {
    const data = await getProjectProfits()
    generateLineData(data)
  }

  const generateLineData = (data) => {
    const profitsByMonth = data
      .filter((curr) => curr.status === "Completed")
      .reduce((acc, curr) => {
        const date = new Date(curr.project_date)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        acc[key] = (acc[key] || 0) + (curr.profit || 0)
        return acc
      }, {})
    const sorted = Object.keys(profitsByMonth).sort()
    const lineData = sorted.map((month) => ({
      name: formatMonthYear(month),
      profit: profitsByMonth[month],
    }))
    setLineChartData(lineData)
  }

  const handleFilterSubmit = async () => {
    const data = await getProjectProfits(customStartDate, customEndDate)
    generateLineData(data)
  }

  const clearFilters = async () => {
    setCustomStartDate("")
    setCustomEndDate("")
    await loadDefaultLineChart()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statuses = await getProjectStatuses()
        const counts = statuses.reduce((acc, curr) => {
          const status = curr.status || "Unknown"
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})
        const pieData = Object.keys(counts).map((status) => ({
          name: status,
          value: counts[status],
        }))
        setPieChartData(pieData)
      } catch (e) {
        console.error("Pie chart data error:", e)
      }
    }
    fetchData()
    loadDefaultLineChart()
  }, [])

  useEffect(() => {
    const fetchFinancialYearProfits = async () => {
      const { thisFY, lastFY } = await getFinancialYearProfitSums()
      setMonthlyProfit(thisFY)
      setProfitChange(lastFY === 0 ? 0 : ((thisFY - lastFY) / lastFY) * 100)
    }
    fetchFinancialYearProfits()
  }, [])

  useEffect(() => {
    const fetchCompletedProjects = async () => {
      const { currentMonth, previousMonth } = await getCompletedProjectCounts()
      setCompletedProjectsThisMonth(currentMonth)
      setCompletedProjectsChange(
        previousMonth === 0
          ? 0
          : ((currentMonth - previousMonth) / previousMonth) * 100,
      )
    }
    fetchCompletedProjects()
  }, [])

  useEffect(() => {
    getOngoingProjectsCount()
      .then(setOngoingProjectsCount)
      .catch(() => setOngoingProjectsCount(0))
    getUpcomingProjectsCount()
      .then(setUpcomingProjectsCount)
      .catch(() => setUpcomingProjectsCount(0))
  }, [])

  const handleCardClick = async (status, title) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*, clients(name, phone)")
      .eq("status", status)
    if (error) return alert(`Error: ${error.message}`)
    setDataViewTitle(title)
    setDataViewData(data)
    setShowDataView(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full text-gray-900 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div onClick={() => setShowProfitPopup(true)}>
          <Card className="cursor-pointer">
            <CardHeader className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                Total Profit (This Financial Year)
              </h3>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{monthlyProfit.toLocaleString("en-IN")}
              </div>
              <p
                className={`text-xs ${profitChange >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {profitChange >= 0 ? "+" : ""}
                {profitChange.toFixed(1)}% from last FY
              </p>
            </CardContent>
          </Card>
        </div>

        <div onClick={() => handleCardClick("Upcoming", "Upcoming Projects")}>
          <Card className="cursor-pointer">
            <CardHeader className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                Upcoming Projects
              </h3>
              <ArrowUpRight className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingProjectsCount}</div>
              <p className="text-xs text-gray-500">
                Planned projects not started yet
              </p>
            </CardContent>
          </Card>
        </div>

        <div onClick={() => handleCardClick("Ongoing", "Ongoing Projects")}>
          <Card className="cursor-pointer">
            <CardHeader className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                Ongoing Projects
              </h3>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ongoingProjectsCount}</div>
              <p className="text-xs text-gray-500">Projects in progress</p>
            </CardContent>
          </Card>
        </div>

        <div onClick={() => handleCardClick("Completed", "Completed Projects")}>
          <Card className="cursor-pointer">
            <CardHeader className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                Projects Completed
              </h3>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedProjectsThisMonth}
              </div>
              <p className="text-xs text-gray-500">This month's completions</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- Line Chart --- */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Monthly Profit Trends</h2>
            <button
              onClick={() => setDateFilterOpen(!dateFilterOpen)}
              className=" bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded flex items-center gap-1"
              title={dateFilterOpen ? "Close Filter" : "Open Filter"}
            >
              {dateFilterOpen ? (
                <FunnelX className="w-4 h-4" />
              ) : (
                <Funnel className="w-4 h-4" />
              )}
            </button>
          </div>
          {dateFilterOpen && (
            <div className="flex flex-col sm:flex-row gap-4 max-w-fill flex-wrap">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <button
                onClick={handleFilterSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Clear
              </button>
            </div>
          )}
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}K`} />
              <Tooltip />
              <Legend iconType="circle" />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* --- Pie Chart --- */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Project Status Distribution</h2>
        </CardHeader>
        <CardContent className="h-[400px]">
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
                style={{ outline: "none" }}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {showDataView && (
        <DataView
          title={dataViewTitle}
          data={dataViewData}
          onClose={() => setShowDataView(false)}
        />
      )}
      {showProfitPopup && (
        <ProfitPopup onClose={() => setShowProfitPopup(false)} />
      )}
    </div>
  )
}

export default Dashboard
