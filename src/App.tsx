import React, { useEffect, useState } from 'react';
import { Song } from './types';

const STORAGE_KEY = 'songs';

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSongs(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  }, [songs]);

  const handleAddOrUpdate = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (editingId !== null) {
      setSongs(prev =>
        prev.map(song =>
          song.id === editingId ? { ...song, entry: trimmed } : song
        )
      );
      setEditingId(null);
    } else {
      setSongs(prev => [...prev, { id: Date.now(), entry: trimmed }]);
    }
    setInput('');
  };

  const handleEdit = (id: number) => {
    const song = songs.find(s => s.id === id);
    if (song) {
      setInput(song.entry);
      setEditingId(id);
    }
  };

  const handleDelete = (id: number) => {
    setSongs(prev => prev.filter(song => song.id !== id));
  };

  return (
    <div style={{ margin:20, padding: 20, borderStyle: "solid", borderRadius: "10px" }}>
      <h1>Holy Shit its a  Song List</h1>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter Song name"
      />
      <button onClick={handleAddOrUpdate}>
        {editingId !== null ? 'Update' : 'Add'}
      </button>

      <ul>
        {songs.map(song => (
          <li key={song.id}>
            {song.entry}
            <button onClick={() => handleEdit(song.id)}>Edit</button>
            <button onClick={() => handleDelete(song.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
