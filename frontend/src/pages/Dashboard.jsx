import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = "https://team-task-manager-reposit.onrender.com";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [allStats, setAllStats] = useState({});
  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        `${API}/api/projects`,
        { headers: { 
          Authorization: `Bearer ${token}` 
        }}
      );
      setProjects(res.data);
      res.data.forEach(p => fetchStats(p._id));
    } catch (err) { 
      if(err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const fetchStats = async (projectId) => {
    try {
      const res = await axios.get(
        `${API}/api/tasks/dashboard/${projectId}`,
        { headers: { 
          Authorization: `Bearer ${token}` 
        }}
      );
      setAllStats(prev => ({
        ...prev, [projectId]: res.data
      }));
    } catch (err) { 
      console.error(err); 
    }
  };

  const totalTasks = Object.values(allStats)
    .reduce((sum, s) => sum + (s.total || 0), 0);
  const totalDone = Object.values(allStats)
    .reduce((sum, s) => sum + (s.done || 0), 0);
  const totalOverdue = Object.values(allStats)
    .reduce((sum, s) => sum + (s.overdue || 0), 0);
  const totalInProgress = Object.values(allStats)
    .reduce((sum, s) => 
      sum + (s.inProgress || 0), 0);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.nav}>
        <h2 style={{color:'white', margin:0}}>
          📋 Team Task Manager
        </h2>
        <div style={{display:'flex',
          alignItems:'center', gap:15}}>
          <span style={{color:'white'}}>
            👤 {user.name}
          </span>
          <button onClick={logout} 
            style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={{margin:'0 0 20px 0'}}>
          Welcome back, {user.name}! 👋
        </h2>

        {/* STATS CARDS */}
        <div style={styles.statsRow}>
          <div style={{...styles.stat,
            background:'#0A2342'}}>
            <h1 style={{margin:0, color:'white'}}>
              {projects.length}
            </h1>
            <p style={{margin:0, color:'#aaa'}}>
              Total Projects
            </p>
          </div>
          <div style={{...styles.stat,
            background:'#3498DB'}}>
            <h1 style={{margin:0, color:'white'}}>
              {totalTasks}
            </h1>
            <p style={{margin:0, color:'white'}}>
              Total Tasks
            </p>
          </div>
          <div style={{...styles.stat,
            background:'#E67E22'}}>
            <h1 style={{margin:0, color:'white'}}>
              {totalInProgress}
            </h1>
            <p style={{margin:0, color:'white'}}>
              In Progress
            </p>
          </div>
          <div style={{...styles.stat,
            background:'#27AE60'}}>
            <h1 style={{margin:0, color:'white'}}>
              {totalDone}
            </h1>
            <p style={{margin:0, color:'white'}}>
              Completed
            </p>
          </div>
          <div style={{...styles.stat,
            background:'#C0392B'}}>
            <h1 style={{margin:0, color:'white'}}>
              {totalOverdue}
            </h1>
            <p style={{margin:0, color:'white'}}>
              Overdue
            </p>
          </div>
        </div>

        {/* PROJECTS */}
        <div style={{display:'flex',
          justifyContent:'space-between',
          alignItems:'center', margin:'25px 0 15px'}}>
          <h3 style={{margin:0}}>
            📁 Your Projects
          </h3>
          <button style={styles.btn}
            onClick={() => navigate('/projects')}>
            + New Project
          </button>
        </div>

        <div style={styles.grid}>
          {projects.map(p => {
            const s = allStats[p._id] || {};
            const isAdmin = 
              p.admin._id === user.id ||
              p.admin === user.id;
            return (
              <div key={p._id} style={styles.card}
                onClick={() => 
                  navigate(`/tasks/${p._id}`)}>
                <div style={{display:'flex',
                  justifyContent:'space-between',
                  alignItems:'flex-start'}}>
                  <h3 style={{margin:0,
                    color:'#0A2342'}}>
                    {p.name}
                  </h3>
                  <span style={{
                    background: isAdmin ? 
                      '#0A2342' : '#27AE60',
                    color:'white', 
                    padding:'2px 10px',
                    borderRadius:20, fontSize:11
                  }}>
                    {isAdmin ? '👑 Admin' : 
                      '👤 Member'}
                  </span>
                </div>

                <p style={{color:'#888',
                  fontSize:13, margin:'8px 0'}}>
                  {p.description || 
                    'No description'}
                </p>

                {/* Mini stats */}
                <div style={{display:'flex',
                  gap:8, marginTop:10}}>
                  <span style={styles.miniStat}>
                    📋 {s.total || 0} tasks
                  </span>
                  <span style={{...styles.miniStat,
                    background:'#d5f5e3',
                    color:'#27AE60'}}>
                    ✅ {s.done || 0}
                  </span>
                  {s.overdue > 0 && (
                    <span style={{...styles.miniStat,
                      background:'#fadbd8',
                      color:'#C0392B'}}>
                      ⚠️ {s.overdue} overdue
                    </span>
                  )}
                </div>

                <p style={{color:'#888',
                  fontSize:12, margin:'8px 0 0'}}>
                  👥 {p.members.length} members
                </p>
              </div>
            );
          })}

          {projects.length === 0 && (
            <div style={styles.empty}>
              <h3>No projects yet!</h3>
              <p>Create your first project 
                to get started</p>
              <button style={styles.btn}
                onClick={() => 
                  navigate('/projects')}>
                + Create Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

const styles = {
  page: { minHeight:'100vh',
    background:'#f4f6f7' },
  nav: { background:'#0A2342',
    padding:'15px 30px', display:'flex',
    justifyContent:'space-between',
    alignItems:'center' },
  content: { padding:30, maxWidth:1200,
    margin:'0 auto' },
  statsRow: { display:'flex', gap:15,
    flexWrap:'wrap' },
  stat: { flex:1, minWidth:140, padding:20,
    borderRadius:12, textAlign:'center' },
  grid: { display:'grid',
    gridTemplateColumns:
      'repeat(auto-fill, minmax(300px,1fr))',
    gap:20 },
  card: { background:'white', padding:20,
    borderRadius:12, cursor:'pointer',
    boxShadow:'0 2px 10px rgba(0,0,0,0.08)',
    borderLeft:'4px solid #27AE60',
    transition:'transform 0.2s' },
  miniStat: { background:'#EBF5FB',
    color:'#0A2342', padding:'3px 8px',
    borderRadius:12, fontSize:11 },
  btn: { background:'#27AE60', color:'white',
    border:'none', padding:'10px 20px',
    borderRadius:8, cursor:'pointer',
    fontSize:14 },
  logoutBtn: { background:'transparent',
    color:'white', border:'1px solid white',
    padding:'6px 14px', borderRadius:6,
    cursor:'pointer' },
  empty: { gridColumn:'1/-1',
    textAlign:'center', padding:60,
    background:'white', borderRadius:12,
    color:'#888' }
};