import { useState } from 'react';
import Header from './components/Header';
import Main from './components/Main'

function App() {

  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  return (
    <div>
      <Header setSelectedUser={setSelectedUser} />
      <Main selectedUser={selectedUser} />
    </div>
  );
}

export default App;

