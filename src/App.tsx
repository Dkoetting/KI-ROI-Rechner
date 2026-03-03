import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WizardProvider } from './context/WizardContext';
import { Wizard } from './components/Wizard';
import { Results } from './components/Results';

export default function App() {
  return (
    <BrowserRouter>
      <WizardProvider>
        <Routes>
          <Route path="/" element={<Wizard />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WizardProvider>
    </BrowserRouter>
  );
}
