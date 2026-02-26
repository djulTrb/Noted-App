import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ui/ProtectedRoute.jsx';

// Pages
import Home from './routes/Home.jsx';
import Login from './routes/Login.jsx';
import Signup from './routes/Signup.jsx';
import Notes from './routes/Notes.jsx';
import NoteEditor from './routes/NoteEditor.jsx';
import Settings from './routes/Settings.jsx';
import Stats from './routes/Stats.jsx';
import TodoList from './routes/TodoList.jsx';
import Expenses from './routes/Expenses.jsx';

function App() {
    return (
        <div className="min-h-screen flex flex-col relative w-full">
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route
                    path="/notes"
                    element={
                        <ProtectedRoute>
                            <Notes />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/editor"
                    element={
                        <ProtectedRoute>
                            <NoteEditor />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/editor/:id"
                    element={
                        <ProtectedRoute>
                            <NoteEditor />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/stats"
                    element={
                        <ProtectedRoute>
                            <Stats />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/todo"
                    element={
                        <ProtectedRoute>
                            <TodoList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/expenses"
                    element={
                        <ProtectedRoute>
                            <Expenses />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
