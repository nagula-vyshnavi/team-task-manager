import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } 
  from 'react-router-dom';
const API = "https://team-task-manager-reposit.onrender.com";
function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { projectId } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => { 
    fetchTasks();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${API}/api/tasks/project/${projectId}`,
        { headers: { 
          Authorization: `Bearer ${token}` 
        }}
      );
      setTasks(res.data);
    } catch (err) { 
      console.error('FETCH ERROR:', err); 
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${API}/api/tasks/dashboard/${projectId}`,
        { headers: { 
          Authorization: `Bearer ${token}` 
        }}
      );
      setStats(res.data);
    } catch (err) { 
      console.error('STATS ERROR:', err); 
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(
        `${API}/api/tasks`,
        { 
          title, 
          description, 
          priority,
          dueDate,
          projectId 
        },
        { headers: { 
          Authorization: `Bearer ${token}` 
        }}
      );
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setSuccess('Task created! ✅');
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('CREATE ERROR:', err);
      setError(
        err.response?.data?.message 
        || 'Failed to create task!'
      );
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/api/tasks/${id}/status`,
        { status },
        { headers: { 
          Authorization: `Bearer ${token}` 
        }}
      );
      fetchTasks();
      fetchStats();
    } catch (err) { 
      console.error('UPDATE ERROR:', err); 
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `${API}/api/tasks/${id}`,
        { headers: { 
          Authorization: `Bearer ${token}` 
        }}
      );
      fetchTasks();
      fetchStats();
    } catch (err) { 
      console.error('DELETE ERROR:', err); 
    }
  };

  const getColor = (status) => {
    if (status === 'Done') return '#27AE60';
    if (status === 'In Progress') return '#E67E22';
    return '#3498DB';
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return '#C0392B';
    if (p === 'Medium') return '#E67E22';
    return '#27AE60';
  };

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.nav}>
        <h2 style={{color:'white', margin:0}}>
          ✅ Task Manager
        </h2>
        <button style={styles.backBtn}
          onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
      </div>

      {/* STATS BAR */}
      <div style={styles.statsBar}>
        <div style={styles.statBox}>
          <strong>{stats.total || 0}</strong>
          <span>Total</span>
        </div>
        <div style={{...styles.statBox, 
          background:'#3498DB'}}>
          <strong>{stats.todo || 0}</strong>
          <span>To Do</span>
        </div>
        <div style={{...styles.statBox,
          background:'#E67E22'}}>
          <strong>{stats.inProgress || 0}</strong>
          <span>In Progress</span>
        </div>
        <div style={{...styles.statBox,
          background:'#27AE60'}}>
          <strong>{stats.done || 0}</strong>
          <span>Done</span>
        </div>
        <div style={{...styles.statBox,
          background:'#C0392B'}}>
          <strong>{stats.overdue || 0}</strong>
          <span>Overdue</span>
        </div>
      </div>

      <div style={styles.content}>
        {/* CREATE TASK FORM */}
        <div style={styles.formCard}>
          <h3 style={{marginTop:0}}>➕ Create Task</h3>
          {error && (
            <p style={styles.error}>{error}</p>
          )}
          {success && (
            <p style={styles.successMsg}>{success}</p>
          )}
          <form onSubmit={createTask}>
            <input style={styles.input}
              placeholder="Task Title *"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required />
            <textarea style={styles.input}
              placeholder="Description"
              value={description}
              onChange={e => 
                setDescription(e.target.value)}
              rows={3} />
            <label style={styles.label}>
              Priority:
            </label>
            <select style={styles.input}
              value={priority}
              onChange={e => 
                setPriority(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <label style={styles.label}>
              Due Date:
            </label>
            <input style={styles.input}
              type="date" value={dueDate}
              onChange={e => 
                setDueDate(e.target.value)} />
            <button style={styles.btn} type="submit">
              ➕ Create Task
            </button>
          </form>
        </div>

        {/* TASK LIST */}
        <div style={styles.list}>
          <h3 style={{marginTop:0}}>
            📋 All Tasks ({tasks.length})
          </h3>

          {tasks.length === 0 && (
            <div style={styles.empty}>
              <p>No tasks yet!</p>
              <p>Create your first task 👈</p>
            </div>
          )}

          {/* TO DO */}
          {tasks.filter(
            t => t.status === 'To Do'
          ).length > 0 && (
            <div>
              <h4 style={{color:'#3498DB'}}>
                📌 To Do
              </h4>
              {tasks.filter(
                t => t.status === 'To Do'
              ).map(t => (
                <TaskCard key={t._id} task={t}
                  onUpdate={updateStatus}
                  onDelete={deleteTask}
                  getColor={getColor}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          )}

          {/* IN PROGRESS */}
          {tasks.filter(
            t => t.status === 'In Progress'
          ).length > 0 && (
            <div>
              <h4 style={{color:'#E67E22'}}>
                🔄 In Progress
              </h4>
              {tasks.filter(
                t => t.status === 'In Progress'
              ).map(t => (
                <TaskCard key={t._id} task={t}
                  onUpdate={updateStatus}
                  onDelete={deleteTask}
                  getColor={getColor}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          )}

          {/* DONE */}
          {tasks.filter(
            t => t.status === 'Done'
          ).length > 0 && (
            <div>
              <h4 style={{color:'#27AE60'}}>
                ✅ Done
              </h4>
              {tasks.filter(
                t => t.status === 'Done'
              ).map(t => (
                <TaskCard key={t._id} task={t}
                  onUpdate={updateStatus}
                  onDelete={deleteTask}
                  getColor={getColor}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, onUpdate, 
  onDelete, getColor, getPriorityColor }) {
  return (
    <div style={cardStyles.card}>
      <div style={cardStyles.header}>
        <h4 style={{margin:0}}>{task.title}</h4>
        <span style={{
          background: getColor(task.status),
          color:'white', padding:'2px 10px',
          borderRadius:20, fontSize:11
        }}>{task.status}</span>
      </div>

      {task.description && (
        <p style={{color:'#666', 
          margin:'8px 0', fontSize:13}}>
          {task.description}
        </p>
      )}

      <div style={cardStyles.footer}>
        <span style={{
          background: getPriorityColor(task.priority),
          color:'white', padding:'2px 8px',
          borderRadius:12, fontSize:11
        }}>
          {task.priority}
        </span>

        {task.dueDate && (
          <span style={{color:'#888', fontSize:12}}>
            📅 {new Date(task.dueDate)
              .toLocaleDateString()}
          </span>
        )}

        <select
          value={task.status}
          onChange={e => 
            onUpdate(task._id, e.target.value)}
          style={cardStyles.select}>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <button
          onClick={() => onDelete(task._id)}
          style={cardStyles.deleteBtn}>
          🗑️
        </button>
      </div>
    </div>
  );
}

export default Tasks;

const styles = {
  page: { minHeight:'100vh', 
    background:'#f4f6f7' },
  nav: { background:'#0A2342', 
    padding:'15px 30px',
    display:'flex', 
    justifyContent:'space-between',
    alignItems:'center' },
  statsBar: { background:'#1B4F72',
    padding:'15px 30px', display:'flex', gap:15 },
  statBox: { background:'#0A2342', color:'white',
    padding:'10px 20px', borderRadius:8,
    textAlign:'center', display:'flex',
    flexDirection:'column', gap:2, fontSize:13 },
  content: { padding:25, maxWidth:1100,
    margin:'0 auto', display:'grid',
    gridTemplateColumns:'320px 1fr', gap:20 },
  formCard: { background:'white', padding:20,
    borderRadius:12, height:'fit-content',
    boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  list: { background:'white', padding:20,
    borderRadius:12,
    boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  input: { width:'100%', padding:10, margin:'5px 0',
    borderRadius:8, border:'1px solid #ddd',
    fontSize:13, boxSizing:'border-box' },
  label: { fontSize:12, color:'#666',
    display:'block', marginTop:8 },
  btn: { width:'100%', padding:12,
    background:'#27AE60', color:'white',
    border:'none', borderRadius:8,
    cursor:'pointer', marginTop:10,
    fontSize:14 },
  backBtn: { background:'transparent',
    color:'white', border:'1px solid white',
    padding:'6px 14px', borderRadius:6,
    cursor:'pointer' },
  error: { color:'red', background:'#ffeaea',
    padding:8, borderRadius:8, 
    textAlign:'center', fontSize:13 },
  successMsg: { color:'green',
    background:'#e8f8e8', padding:8,
    borderRadius:8, textAlign:'center',
    fontSize:13 },
  empty: { textAlign:'center', 
    padding:40, color:'#888' }
};

const cardStyles = {
  card: { border:'1px solid #eee', padding:15,
    borderRadius:10, marginBottom:12,
    borderLeft:'4px solid #27AE60',
    background:'#fafafa' },
  header: { display:'flex',
    justifyContent:'space-between',
    alignItems:'center' },
  footer: { display:'flex', gap:8,
    alignItems:'center', marginTop:10,
    flexWrap:'wrap' },
  select: { padding:'4px 8px', borderRadius:6,
    border:'1px solid #ddd', fontSize:12,
    cursor:'pointer' },
  deleteBtn: { background:'none', border:'none',
    cursor:'pointer', fontSize:16,
    marginLeft:'auto' }
};