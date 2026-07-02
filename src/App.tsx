import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AnswerBuilder } from './pages/AnswerBuilder';
import { DailyQuiz } from './pages/DailyQuiz';
import { Dashboard } from './pages/Dashboard';
import { Flashcards } from './pages/Flashcards';
import { MistakeLog } from './pages/MistakeLog';
import { MockAssessment } from './pages/MockAssessment';
import { QuestionBank } from './pages/QuestionBank';
import { ReadinessReport } from './pages/ReadinessReport';
import { SevenDayPlan } from './pages/SevenDayPlan';
import { SpeakingPractice } from './pages/SpeakingPractice';
import { TopicDetail } from './pages/TopicDetail';
import { TopicLibrary } from './pages/TopicLibrary';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="plan" element={<SevenDayPlan />} />
          <Route path="plan/quiz/:day" element={<DailyQuiz />} />
          <Route path="topics" element={<TopicLibrary />} />
          <Route path="topics/:id" element={<TopicDetail />} />
          <Route path="practice/builder" element={<AnswerBuilder />} />
          <Route path="practice/speaking" element={<SpeakingPractice />} />
          <Route path="practice/flashcards" element={<Flashcards />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="mock" element={<MockAssessment />} />
          <Route path="mistakes" element={<MistakeLog />} />
          <Route path="readiness" element={<ReadinessReport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
