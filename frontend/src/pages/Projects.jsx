import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API = "https://team-task-manager-reposit.onrender.com";
function Projects() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  console.log('API URL:', API);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${API}/api/projects`,
        { name, description },
        { headers: { 
          Authorization: `Bearer ${token}` 
        }}
      );
      console.log('Project created:', res.data);
      navigate('/dashboard');
    } catch (err) {
      console.log('CREATE ERROR:', err);
      setError(
        err.response?.data?.message 
        || 'Failed to create project!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          📁 Create New Project
        </h2>
        <p style={styles.apiInfo}>
          API: {API}
        </p>
        {error && (
          <p style={styles.error}>{error}</p>
        )}
        <form onSubmit={handleCreate}>
          <input
            style={styles.input}
            type="text"
            placeholder="Project Name *"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <textarea
            style={styles.input}
            placeholder="Description (optional)"
            value={description}
            onChange={e => 
              setDescription(e.target.value)}
            rows={3}
          />
          <button
            style={loading ? 
              styles.btnOff : styles.btn}
            type="submit"
            disabled={loading}
          >
            {loading ? 
              'Creating...' : 'Create Project'}
          </button>
        </form>
        <button
          style={styles.back}
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Projects;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#0A2342'
  },
  card: {
    background: 'white',
    padding: 40,
    borderRadius: 12,
    width: 420,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  title: {
    textAlign: 'center',
    color: '#0A2342',
    marginTop: 0
  },
  apiInfo: {
    fontSize: 10,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 10
  },
  input: {
    width: '100%',
    padding: 12,
    margin: '8px 0',
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: 14,
    boxSizing: 'border-box'
  },
  btn: {
    width: '100%',
    padding: 12,
    background: '#27AE60',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 10
  },
  btnOff: {
    width: '100%',
    padding: 12,
    background: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'not-allowed',
    marginTop: 10
  },
  back: {
    width: '100%',
    padding: 10,
    background: 'transparent',
    color: '#0A2342',
    border: '1px solid #0A2342',
    borderRadius: 8,
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 10
  },
  error: {
    color: 'red',
    background: '#ffeaea',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 13
  }
};