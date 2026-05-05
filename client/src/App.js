import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

function App() {

  // ================= STATE =================
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [logs, setLogs] = useState([]);
  const [currentLog, setCurrentLog] = useState(null);
  const [timer, setTimer] = useState(0);

  const [range, setRange] = useState("7");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState("");

  const [leaderboard, setLeaderboard] = useState([]);

  // ================= AUTH =================
  const login = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email, password
    });
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);
  };

  const register = async () => {
    await axios.post("http://localhost:5000/api/auth/register", {
      email, password
    });
    alert("Registered!");
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  // ================= FETCH =================
  const fetchLogs = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/work", {
      headers: { authorization: token }
    });
    setLogs(res.data);
  }, [token]);

  useEffect(() => {
    if (token) fetchLogs();
  }, [token, fetchLogs]);

  // ================= TIMER =================
  useEffect(() => {
    let interval;
    if (currentLog) {
      interval = setInterval(() => {
        setTimer((t) => {
          const newTime = t + 1;
          if (newTime === 3600) setNotification("⚠️ 1 hour reached!");
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentLog]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  // ================= WORK =================
  const startWork = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/work/start",
      {},
      { headers: { authorization: token } }
    );
    setCurrentLog(res.data);
    setTimer(0);
  };

  const endWork = async () => {
    await axios.post(
      `http://localhost:5000/api/work/end/${currentLog._id}`,
      {},
      { headers: { authorization: token } }
    );
    setCurrentLog(null);
    fetchLogs();
    setNotification("✅ Session completed!");
  };

  const deleteLog = async (id) => {
    await axios.delete(`http://localhost:5000/api/work/${id}`, {
      headers: { authorization: token }
    });
    fetchLogs();
  };

  // ================= FILTER =================
  const filteredLogs = logs
    .filter((log) => {
      const days = range === "all" ? 9999 : parseInt(range);
      const diff =
        (Date.now() - new Date(log.startTime)) / (1000 * 60 * 60 * 24);
      return diff <= days;
    })
    .filter((log) =>
      new Date(log.startTime)
        .toLocaleString()
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // ================= DATA =================
  const chartData = filteredLogs.map((log) => ({
    date: new Date(log.startTime).toLocaleDateString(),
    hours: log.endTime
      ? (new Date(log.endTime) - new Date(log.startTime)) /
        (1000 * 60 * 60)
      : 0,
  }));

  const totalHours = chartData.reduce((s, d) => s + d.hours, 0).toFixed(2);
  const weeklyHours = chartData.slice(-7).reduce((s, d) => s + d.hours, 0).toFixed(2);

  const longestSession = logs.reduce((max, log) => {
    if (!log.endTime) return max;
    const duration =
      (new Date(log.endTime) - new Date(log.startTime)) / 60000;
    return duration > max ? duration : max;
  }, 0);

  // ================= STREAK =================
  const getStreak = () => {
    let streak = 0;
    let current = new Date();
    for (let i = 0; i < 30; i++) {
      const dayStr = current.toDateString();
      const worked = logs.some(log =>
        new Date(log.startTime).toDateString() === dayStr
      );
      if (worked) streak++;
      else break;
      current.setDate(current.getDate() - 1);
    }
    return streak;
  };

  const streak = getStreak();

  // ================= INSIGHTS =================
  const insights = [];
  if (weeklyHours > totalHours / 2) insights.push("📈 Strong week");
  if (longestSession > 120) insights.push("🔥 Long focus session");
  if (streak >= 3) insights.push("🚀 Great streak");
  if (totalHours < 2) insights.push("⚠️ Low activity");

  // ================= FOCUS =================
  const focusScore = Math.min(100, Math.round(totalHours * 10 + streak * 5));

  // ================= LEADERBOARD =================
  useEffect(() => {
    setLeaderboard([
      { name: "You", score: focusScore },
      { name: "Alex", score: 80 },
      { name: "Sam", score: 65 }
    ]);
  }, [focusScore]);

  // ================= HEATMAP =================
  const heatmap = Array(7).fill(0);
  filteredLogs.forEach(log => {
    if (!log.endTime) return;
    const day = new Date(log.startTime).getDay();
    const hours = (new Date(log.endTime) - new Date(log.startTime)) / (1000*60*60);
    heatmap[day] += hours;
  });

  // ================= GOAL =================
  const dailyGoal = 6;
  const todayHours = filteredLogs
    .filter(log => new Date(log.startTime).toDateString() === new Date().toDateString())
    .reduce((sum, log) => {
      if (!log.endTime) return sum;
      return sum + (new Date(log.endTime) - new Date(log.startTime))/(1000*60*60);
    }, 0);

  const progress = Math.min((todayHours / dailyGoal) * 100, 100);

  // ================= TIMELINE =================
  const todayLogs = logs.filter(
    log => new Date(log.startTime).toDateString() === new Date().toDateString()
  );

  // ================= LOGIN =================
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-xl w-[350px] text-center">
          <h1 className="text-3xl mb-4">🚀 Work Tracker</h1>
          <input onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="p-2 mb-2 text-black w-full"/>
          <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="p-2 mb-2 text-black w-full"/>
          <button onClick={login} className="bg-green-500 w-full py-2 mb-2">Login</button>
          <button onClick={register} className="bg-blue-500 w-full py-2">Register</button>
        </div>
      </div>
    );
  }

  // ================= DASHBOARD =================
  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-white/5 p-6 border-r border-gray-700">
        <h2 className="text-xl mb-6">🚀 Menu</h2>
        <button onClick={logout} className="bg-red-500 w-full py-2 rounded">Logout</button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {notification && (
          <div className="bg-green-500 text-black p-2 mb-4 text-center rounded">
            {notification}
          </div>
        )}

        {/* FILTER */}
        <div className="flex gap-4 mb-4">
          <select onChange={(e)=>setRange(e.target.value)} className="text-black p-2">
            <option value="7">7d</option>
            <option value="30">30d</option>
            <option value="all">All</option>
          </select>

          <input placeholder="Search" onChange={(e)=>setSearch(e.target.value)} className="p-2 text-black"/>

        </div>

        {/* CONTROL */}
        {!currentLog ? (
          <button onClick={startWork} className="bg-green-500 px-4 py-2 rounded">Start</button>
        ) : (
          <button onClick={endWork} className="bg-red-500 px-4 py-2 rounded">End</button>
        )}

        {currentLog && <p className="mt-2 text-yellow-400">{formatTime(timer)}</p>}

        {/* ANALYTICS */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/5 p-4 rounded">Total: {totalHours}</div>
          <div className="bg-white/5 p-4 rounded">Weekly: {weeklyHours}</div>
          <div className="bg-white/5 p-4 rounded">Longest: {longestSession.toFixed(1)}m</div>
          <div className="bg-white/5 p-4 rounded">🔥 {streak}d</div>
        </div>

        {/* CHARTS */}
        <LineChart width={700} height={250} data={chartData}>
          <XAxis dataKey="date"/>
          <YAxis/>
          <Tooltip/>
          <CartesianGrid stroke="#444"/>
          <Line dataKey="hours" stroke="#00ffff"/>
        </LineChart>

        <BarChart width={700} height={200} data={chartData}>
          <XAxis dataKey="date"/>
          <YAxis/>
          <Tooltip/>
          <Bar dataKey="hours" fill="#8b5cf6"/>
        </BarChart>

        {/* HEATMAP */}
        <div className="flex gap-2 mt-4">
          {heatmap.map((h,i)=>(
            <div key={i} className="w-8 h-8 rounded"
              style={{ backgroundColor: `rgba(0,255,200,${Math.min(h/5,1)})` }}>
            </div>
          ))}
        </div>

        {/* GOAL */}
        <div className="mt-4">
          <div className="bg-gray-700 h-4 rounded">
            <div className="bg-green-400 h-4 rounded" style={{width:`${progress}%`}}></div>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="mt-4">
          {insights.map((i,idx)=><p key={idx}>{i}</p>)}
        </div>

        {/* TIMELINE */}
        <div className="flex gap-2 mt-4">
          {todayLogs.map((l,i)=>(
            <div key={i} className="bg-green-400 h-4" style={{width:30}}></div>
          ))}
        </div>

        {/* LEADERBOARD */}
        <div className="mt-4">
          {leaderboard.map((u,i)=><p key={i}>{u.name}: {u.score}</p>)}
        </div>

        {/* LOGS */}
        {filteredLogs.map(log => (
          <div key={log._id} className="bg-gray-800 p-2 mt-2 rounded">
            {new Date(log.startTime).toLocaleString()}
            <button onClick={()=>deleteLog(log._id)} className="ml-2 bg-red-500 px-2">Delete</button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;