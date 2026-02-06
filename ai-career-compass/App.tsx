
import React, { useState } from 'react';
import { UserProfile, RoadmapResponse } from './types';
import { generateRoadmap } from './services/geminiService';
import SkillGapChart from './components/SkillGapChart';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    currentRole: '',
    targetRole: '',
    skills: '',
    weeklyHours: 15,
  });
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'projects'>('overview');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await generateRoadmap(profile);
      setRoadmap(result);
    } catch (err) {
      setError("Failed to generate roadmap. Please check your connection and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRoadmap(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 ai-gradient rounded-lg flex items-center justify-center font-bold text-white text-xl">
            A
          </div>
          <h1 className="text-xl font-bold tracking-tight">AI Career Compass</h1>
        </div>
        {roadmap && (
          <button 
            onClick={handleReset}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Create New Plan
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {!roadmap && !loading && (
          <div className="max-w-xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Your AI Career <span className="text-transparent bg-clip-text ai-gradient">Starts Here</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Tell us where you are and where you want to go. We'll generate a personalized 60-day mission plan.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="glass-effect p-8 rounded-2xl border border-slate-700 space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Current Role</label>
                <input 
                  required
                  placeholder="e.g. Software Engineer, Student"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={profile.currentRole}
                  onChange={e => setProfile({...profile, currentRole: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Target Role</label>
                <input 
                  required
                  placeholder="e.g. Machine Learning Engineer, AI Researcher"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={profile.targetRole}
                  onChange={e => setProfile({...profile, targetRole: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Your Current Skills</label>
                <textarea 
                  required
                  placeholder="e.g. Python, SQL, Basic Statistics"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-24"
                  value={profile.skills}
                  onChange={e => setProfile({...profile, skills: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Weekly Commitment: <span className="text-indigo-400">{profile.weeklyHours} hours</span></label>
                <input 
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  className="w-full accent-indigo-500"
                  value={profile.weeklyHours}
                  onChange={e => setProfile({...profile, weeklyHours: parseInt(e.target.value)})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 ai-gradient text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Generate 60-Day Roadmap
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-indigo-400">AI</div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">Architecting Your Journey...</h3>
              <p className="text-slate-400 mt-2">Gemini is drafting your personalized milestones and skill gap analysis.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-center mb-8">
            {error}
          </div>
        )}

        {roadmap && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Dashboard Navigation */}
            <div className="flex flex-wrap items-center gap-4 mb-8 border-b border-slate-800 pb-4">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'timeline' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                60-Day Timeline
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Projects & Courses
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="glass-effect p-8 rounded-2xl border border-slate-700">
                    <h3 className="text-2xl font-bold text-white mb-4">Skill Gap Analysis</h3>
                    <p className="text-slate-400 mb-6">Visualizing where you are vs where you need to be for a {roadmap.careerPath} role.</p>
                    <SkillGapChart data={roadmap.skillAnalysis} />
                  </div>
                  <div className="glass-effect p-8 rounded-2xl border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Strategic Summary</h3>
                    <p className="text-slate-300 leading-relaxed">{roadmap.summary}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass-effect p-8 rounded-2xl border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-6">Top Recommended Courses</h3>
                    <div className="space-y-4">
                      {roadmap.recommendedCourses.map((course, idx) => (
                        <a 
                          key={idx}
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all group"
                        >
                          <h4 className="font-bold text-white group-hover:text-indigo-400">{course.title}</h4>
                          <p className="text-sm text-slate-400">{course.provider}</p>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="glass-effect p-8 rounded-2xl border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-6">Learning Intensity</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-slate-800 h-4 rounded-full overflow-hidden">
                        <div 
                          className="h-full ai-gradient" 
                          style={{ width: `${Math.min(100, (profile.weeklyHours / 40) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">{profile.weeklyHours}h / week</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 italic">Optimized for your specified commitment.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roadmap.sixtyDayPlan.map((item, idx) => (
                    <div key={idx} className="glass-effect p-6 rounded-xl border border-slate-700 flex flex-col hover:border-indigo-500 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Day {item.day}</span>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">{item.topic}</h4>
                      <p className="text-sm text-slate-400 flex-1">{item.description}</p>
                      {item.resources && item.resources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-800">
                          <p className="text-xs text-slate-500 mb-2">RESOURCES</p>
                          <div className="flex flex-wrap gap-2">
                            {item.resources.map((res, ridx) => (
                              <span key={ridx} className="text-[10px] px-2 py-1 bg-slate-900 rounded border border-slate-700 text-slate-300">
                                {res}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-white">Targeted Capstone Projects</h3>
                <p className="text-slate-400 max-w-2xl">These projects are designed to bridge your skill gaps and build a professional portfolio for your transition into {roadmap.careerPath}.</p>
                <div className="grid grid-cols-1 gap-8">
                  {roadmap.capstoneProjects.map((project, idx) => (
                    <div key={idx} className="glass-effect p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-all group overflow-hidden">
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 space-y-6">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/30">
                                {project.complexity}
                              </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                            <p className="text-slate-300 mt-4 leading-relaxed">{project.description}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Key Skills Involved</p>
                              <div className="flex flex-wrap gap-2">
                                {project.keySkills.map((skill, sidx) => (
                                  <span key={sidx} className="text-xs font-semibold text-indigo-300">{skill}</span>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tech Stack</p>
                              <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech, tidx) => (
                                  <span key={tidx} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 border border-slate-700">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-1/3 flex flex-col gap-4">
                          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <span>⚠️</span> Potential Challenges
                            </p>
                            <p className="text-sm text-slate-300 italic">{project.potentialChallenges}</p>
                          </div>
                          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <span>🎯</span> Career Contribution
                            </p>
                            <p className="text-sm text-slate-300">{project.careerContribution}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-12 px-6 mt-12 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} AI Career Compass • Powered by Gemini 3</p>
        <p className="mt-2 text-xs opacity-50">Roadmaps are AI-generated based on current job market data and your specific profile.</p>
      </footer>
    </div>
  );
};

export default App;
