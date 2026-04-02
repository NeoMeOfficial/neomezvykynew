import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Gift, BarChart3, Euro, Dumbbell, Utensils, Music, Flag, MessageSquare,
  Calendar, FolderOpen, Bell, Settings, LogOut, Shield, ChevronRight, Plus,
  Eye, Trash2, Edit3, TrendingUp, Activity
} from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import ContentManager from '../../components/admin/ContentManager';

// Simple Card component
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg ${className}`}>{children}</div>
);

// Navigation items
const navigationItems = [
  { id: 'overview', label: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
  { id: 'content', label: 'Content Manager', icon: FolderOpen, description: 'Videos, Photos & Media' },
  { id: 'programs', label: 'Programs', icon: Calendar, description: 'Fitness Programs' },
  { id: 'exercises', label: 'Exercises', icon: Dumbbell, description: 'Exercise Library' },
  { id: 'recipes', label: 'Recipes', icon: Utensils, description: 'Recipe Database' },
  { id: 'meditations', label: 'Meditations', icon: Music, description: 'Audio Content' },
  { id: 'community', label: 'Community', icon: Flag, description: 'Post Moderation' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, description: 'User Support' },
  { id: 'users', label: 'Users', icon: Users, description: 'Account Management' },
  { id: 'referrals', label: 'Referrals', icon: Gift, description: 'Reward Program' },
] as const;

export default function AdminNew() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const renderSidebar = () => (
    <div className="h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.telo }}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg" style={{ color: colors.textPrimary }}>NeoMe</h1>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group ${
                isActive ? 'bg-gradient-to-r shadow-lg' : 'hover:bg-white/20'
              }`}
              style={isActive ? { 
                background: `linear-gradient(135deg, ${colors.telo}, ${colors.strava})`,
                color: '#fff'
              } : {}}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} style={!isActive ? { color: colors.textSecondary } : {}} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${isActive ? 'text-white' : ''}`} style={!isActive ? { color: colors.textPrimary } : {}}>
                    {item.label}
                  </span>
                </div>
                <p className={`text-xs truncate ${isActive ? 'text-white/80' : ''}`} style={!isActive ? { color: colors.textTertiary } : {}}>
                  {item.description}
                </p>
              </div>
              
              <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white/60' : 'text-transparent group-hover:text-gray-400'}`} />
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/20 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all">
          <Bell className="w-4 h-4" style={{ color: colors.textSecondary }} />
          <span className="text-sm" style={{ color: colors.textPrimary }}>Notifications</span>
        </button>
        
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all">
          <Settings className="w-4 h-4" style={{ color: colors.textSecondary }} />
          <span className="text-sm" style={{ color: colors.textPrimary }}>Settings</span>
        </button>
        
        <button 
          onClick={() => navigate('/domov')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all"
        >
          <LogOut className="w-4 h-4" style={{ color: colors.periodka }} />
          <span className="text-sm" style={{ color: colors.periodka }}>Exit Admin</span>
        </button>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs px-3 py-1 bg-green-500 text-white rounded-lg">
          ✅ Desktop Mode Active
        </div>
        <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
          <Bell className="w-5 h-5" style={{ color: colors.textSecondary }} />
        </button>
        <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
          <Settings className="w-5 h-5" style={{ color: colors.textSecondary }} />
        </button>
        <button onClick={() => navigate('/domov')} className="p-2 rounded-lg hover:bg-white/20 transition-all">
          <LogOut className="w-5 h-5" style={{ color: colors.periodka }} />
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Welcome back, Admin</h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>Here's what's happening with NeoMe today</p>
        </div>
        <div className="text-xs" style={{ color: colors.textTertiary }}>
          Last updated: {new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6" style={{ color: colors.strava }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Total Users</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>127</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>89 active, 23 trial</div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" style={{ color: colors.strava }} />
            <span className="text-xs font-medium" style={{ color: colors.strava }}>+12% this month</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Euro className="w-6 h-6" style={{ color: colors.accent }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Monthly Revenue</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>€1,891</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>MRR from subscriptions</div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Gift className="w-6 h-6" style={{ color: colors.periodka }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Referrals</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>47</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>8 pending approval</div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Dumbbell className="w-6 h-6" style={{ color: colors.telo }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Content</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>131</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>23 exercises, 108 recipes</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Content Manager', desc: 'Upload videos & photos', icon: FolderOpen, action: () => setActiveTab('content') },
              { label: 'Add Exercise', desc: 'Create workout content', icon: Plus, action: () => setActiveTab('exercises') },
              { label: 'User Management', desc: 'Manage accounts', icon: Users, action: () => setActiveTab('users') },
              { label: 'Review Posts', desc: 'Moderate community', icon: Flag, action: () => setActiveTab('community') },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-left"
              >
                <item.icon className="w-4 h-4" style={{ color: colors.telo }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{item.label}</div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Recent Activity</h3>
          <div className="space-y-3">
            {[
              { text: '5 new user registrations', time: '2 hours ago' },
              { text: '3 referrals submitted', time: '4 hours ago' },
              { text: 'New support ticket', time: '6 hours ago' },
              { text: 'Program updated: BodyForming', time: '8 hours ago' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1 pb-2 border-b border-white/10 last:border-0">
                <div className="text-sm" style={{ color: colors.textPrimary }}>{item.text}</div>
                <div className="text-xs" style={{ color: colors.textTertiary }}>{item.time}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Performance</h3>
          <div className="space-y-3">
            {[
              { label: 'User Retention', value: '78%', color: colors.strava },
              { label: 'Engagement Rate', value: '85%', color: colors.accent },
              { label: 'Conversion Rate', value: '23%', color: colors.telo },
              { label: 'Content Views', value: '2.4k', color: colors.periodka },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/20">
                <span className="text-sm" style={{ color: colors.textPrimary }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderExercises = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Exercise Library</h2>
        <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>
          <Plus className="w-4 h-4 mr-2 inline" />Add Exercise
        </button>
      </div>
      
      {/* Exercise Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>23</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Total Exercises</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>15</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Strengthening</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>8</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Stretching</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.periodka }}>12</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Diastasis Safe</div>
          </div>
        </Card>
      </div>

      {/* Exercise Management */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Exercise Database</h3>
            <div className="flex gap-2">
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Categories</option>
                <option>Strengthening</option>
                <option>Stretching</option>
                <option>Cardio</option>
              </select>
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Levels</option>
                <option>Level 1</option>
                <option>Level 2</option>
                <option>Level 3</option>
                <option>Level 4</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Core Breathing', category: 'Strengthening', level: 1, duration: '5 min', equipment: 'None', diastasisSafe: true },
              { name: 'Pelvic Floor Activation', category: 'Strengthening', level: 1, duration: '10 min', equipment: 'None', diastasisSafe: true },
              { name: 'Modified Plank', category: 'Strengthening', level: 2, duration: '15 min', equipment: 'Mat', diastasisSafe: false },
              { name: 'Hip Flexor Stretch', category: 'Stretching', level: 1, duration: '5 min', equipment: 'None', diastasisSafe: true },
            ].map((exercise, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/30 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6" style={{ color: colors.telo }} />
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: colors.textPrimary }}>{exercise.name}</div>
                    <div className="text-sm flex items-center gap-2" style={{ color: colors.textSecondary }}>
                      <span>{exercise.category}</span>
                      <span>•</span>
                      <span>Level {exercise.level}</span>
                      <span>•</span>
                      <span>{exercise.duration}</span>
                      {exercise.diastasisSafe && (
                        <>
                          <span>•</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600">Diastasis Safe</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Eye className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Edit3 className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Trash2 className="w-4 h-4" style={{ color: colors.periodka }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPrograms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Program Management</h2>
        <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>
          <Plus className="w-4 h-4 mr-2 inline" />Create Program
        </button>
      </div>

      {/* Program Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>4</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Total Programs</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>89</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Active Users</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>67%</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Completion Rate</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.accent }}>4.8</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Avg Rating</div>
          </div>
        </Card>
      </div>

      {/* Program List */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Fitness Programs</h3>
          
          <div className="space-y-4">
            {[
              { 
                name: 'Postpartum Recovery', 
                level: 1, 
                weeks: 8, 
                exercises: 24, 
                users: 34, 
                rating: 4.9,
                description: 'Gentle recovery program focusing on core and pelvic floor rehabilitation'
              },
              { 
                name: 'BodyForming', 
                level: 2, 
                weeks: 12, 
                exercises: 36, 
                users: 28, 
                rating: 4.7,
                description: 'Full-body strengthening and toning program'
              },
              { 
                name: 'ElasticBands', 
                level: 3, 
                weeks: 10, 
                exercises: 30, 
                users: 19, 
                rating: 4.8,
                description: 'Resistance training using elastic bands and equipment'
              },
              { 
                name: 'Strong & Sexy', 
                level: 4, 
                weeks: 16, 
                exercises: 48, 
                users: 8, 
                rating: 4.6,
                description: 'Advanced strength training and conditioning program'
              },
            ].map((program, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>{program.name}</h4>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.telo}20`, color: colors.telo }}>
                        Level {program.level}
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>{program.description}</p>
                    <div className="flex items-center gap-4 text-sm" style={{ color: colors.textTertiary }}>
                      <span>{program.weeks} weeks</span>
                      <span>•</span>
                      <span>{program.exercises} exercises</span>
                      <span>•</span>
                      <span>{program.users} active users</span>
                      <span>•</span>
                      <span>⭐ {program.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: `${colors.strava}20`, color: colors.strava }}>
                      View Program
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                      <Edit3 className="w-4 h-4" style={{ color: colors.textSecondary }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderRecipes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Recipe Database</h2>
        <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.strava }}>
          <Plus className="w-4 h-4 mr-2 inline" />Add Recipe
        </button>
      </div>

      {/* Recipe Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>108</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Total Recipes</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>34</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Breakfast</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.accent }}>54</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Lunch/Dinner</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>20</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Snacks</div>
          </div>
        </Card>
      </div>

      {/* Recipe Management */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Recipe Management</h3>
            <div className="flex gap-2">
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Categories</option>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snacks</option>
              </select>
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Allergens</option>
                <option>Dairy-Free</option>
                <option>Gluten-Free</option>
                <option>Nut-Free</option>
                <option>Vegetarian</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Avokádové toasty s vajíčkom', category: 'Breakfast', time: '15 min', calories: 340, allergens: ['Gluten'], rating: 4.8 },
              { name: 'Quinoa šalát s kuracím mäsom', category: 'Lunch', time: '25 min', calories: 420, allergens: [], rating: 4.6 },
              { name: 'Lososové curry s ryžou', category: 'Dinner', time: '30 min', calories: 380, allergens: ['Fish'], rating: 4.9 },
              { name: 'Energetické guľôčky', category: 'Snack', time: '10 min', calories: 120, allergens: ['Nuts'], rating: 4.7 },
            ].map((recipe, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white/30 flex items-center justify-center">
                    <Utensils className="w-6 h-6" style={{ color: colors.strava }} />
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: colors.textPrimary }}>{recipe.name}</div>
                    <div className="text-sm flex items-center gap-2" style={{ color: colors.textSecondary }}>
                      <span>{recipe.category}</span>
                      <span>•</span>
                      <span>{recipe.time}</span>
                      <span>•</span>
                      <span>{recipe.calories} kcal</span>
                      <span>•</span>
                      <span>⭐ {recipe.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {recipe.allergens.map((allergen, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-600">
                          {allergen}
                        </span>
                      ))}
                      {recipe.allergens.length === 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600">Allergen-Free</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Eye className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Edit3 className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Trash2 className="w-4 h-4" style={{ color: colors.periodka }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderMeditations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Meditation Content</h2>
        <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.mysel }}>
          <Plus className="w-4 h-4 mr-2 inline" />Add Meditation
        </button>
      </div>

      {/* Meditation Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>15</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Total Sessions</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>5</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Stress Relief</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.accent }}>6</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Sleep</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>4</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Focus</div>
          </div>
        </Card>
      </div>

      {/* Meditation Management */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Audio Library</h3>
            <div className="flex gap-2">
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Categories</option>
                <option>Stress Relief</option>
                <option>Sleep</option>
                <option>Focus</option>
                <option>Breathing</option>
              </select>
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Durations</option>
                <option>5-10 min</option>
                <option>10-20 min</option>
                <option>20+ min</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Evening Wind Down', category: 'Sleep', duration: '15 min', plays: 234, rating: 4.9 },
              { name: 'Morning Mindfulness', category: 'Focus', duration: '10 min', plays: 189, rating: 4.7 },
              { name: 'Stress Release', category: 'Stress Relief', duration: '12 min', plays: 156, rating: 4.8 },
              { name: 'Deep Breathing', category: 'Breathing', duration: '8 min', plays: 298, rating: 4.6 },
            ].map((meditation, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/30 flex items-center justify-center">
                    <Music className="w-6 h-6" style={{ color: colors.mysel }} />
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: colors.textPrimary }}>{meditation.name}</div>
                    <div className="text-sm flex items-center gap-2" style={{ color: colors.textSecondary }}>
                      <span>{meditation.category}</span>
                      <span>•</span>
                      <span>{meditation.duration}</span>
                      <span>•</span>
                      <span>{meditation.plays} plays</span>
                      <span>•</span>
                      <span>⭐ {meditation.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Eye className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Edit3 className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Trash2 className="w-4 h-4" style={{ color: colors.periodka }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Community Management</h2>
        <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.periodka }}>
          <Flag className="w-4 h-4 mr-2 inline" />Create Featured Post
        </button>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>47</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Pending Posts</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.periodka }}>8</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Reported Content</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>127</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Active Users</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>89%</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Approval Rate</div>
          </div>
        </Card>
      </div>

      {/* Moderation Queue */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Moderation Queue</h3>
            <div className="flex gap-2">
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Posts</option>
                <option>Pending Review</option>
                <option>Reported</option>
                <option>Featured</option>
              </select>
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Categories</option>
                <option>Success Stories</option>
                <option>Questions</option>
                <option>Tips & Advice</option>
                <option>Motivation</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                author: 'Lucia K.', 
                content: 'Práve som dokončila svoj prvý týždeň Postpartum programu a cítim sa úžasne! Ďakujem za túto aplikáciu ❤️',
                category: 'Success Story',
                time: '2 hours ago',
                status: 'pending',
                likes: 0,
                reports: 0
              },
              { 
                author: 'Andrea M.', 
                content: 'Má niekto skúsenosť s Level 3 cvičeniami? Sú naozaj náročné alebo je to len môj pocit?',
                category: 'Question',
                time: '4 hours ago',
                status: 'pending',
                likes: 0,
                reports: 0
              },
              { 
                author: 'Zuzana H.', 
                content: 'Tento recept na avokádové toasty je perfektný na raňajky! Určite odporúčam všetkým 🥑',
                category: 'Tips & Advice',
                time: '6 hours ago',
                status: 'reported',
                likes: 3,
                reports: 1
              },
            ].map((post, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                      <Users className="w-5 h-5" style={{ color: colors.telo }} />
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: colors.textPrimary }}>{post.author}</div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>{post.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-red-500/20 text-red-600'
                    }`}>
                      {post.status === 'pending' ? 'Pending' : 'Reported'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm mb-3" style={{ color: colors.textPrimary }}>{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm" style={{ color: colors.textTertiary }}>
                    <span>❤️ {post.likes}</span>
                    {post.reports > 0 && <span>⚠️ {post.reports} reports</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: `${colors.strava}20`, color: colors.strava }}>
                      Approve
                    </button>
                    <button className="px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: `${colors.periodka}20`, color: colors.periodka }}>
                      Reject
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                      <Eye className="w-4 h-4" style={{ color: colors.textSecondary }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>User Management</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: `${colors.strava}20`, color: colors.strava }}>
            Export Users
          </button>
          <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>
            <Users className="w-4 h-4 mr-2 inline" />Add User
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>127</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Total Users</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>89</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Subscribers</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.accent }}>23</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Trial Users</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>15</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Free Users</div>
          </div>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>User Database</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm placeholder-gray-500"
              />
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Statuses</option>
                <option>Subscribers</option>
                <option>Trial</option>
                <option>Free</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Lucia Novakova', email: 'lucia.n@gmail.com', status: 'Subscriber', joined: '2024-01-15', lastActive: '2 hours ago' },
              { name: 'Andrea Svoboda', email: 'andrea.s@email.sk', status: 'Trial', joined: '2024-03-01', lastActive: '1 day ago' },
              { name: 'Zuzana Horak', email: 'zuzana.h@yahoo.com', status: 'Subscriber', joined: '2024-02-20', lastActive: '3 hours ago' },
              { name: 'Petra Kralova', email: 'petra.k@outlook.com', status: 'Free', joined: '2024-03-10', lastActive: '1 week ago' },
            ].map((user, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                    <Users className="w-6 h-6" style={{ color: colors.telo }} />
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: colors.textPrimary }}>{user.name}</div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>{user.email}</div>
                    <div className="text-xs flex items-center gap-2" style={{ color: colors.textTertiary }}>
                      <span>Joined {user.joined}</span>
                      <span>•</span>
                      <span>Active {user.lastActive}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    user.status === 'Subscriber' ? 'bg-green-500/20 text-green-600' :
                    user.status === 'Trial' ? 'bg-yellow-500/20 text-yellow-600' :
                    'bg-gray-500/20 text-gray-600'
                  }`}>
                    {user.status}
                  </span>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Eye className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Edit3 className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'content':
        return <ContentManager />;
      case 'programs':
        return renderPrograms();
      case 'exercises':
        return renderExercises();
      case 'recipes':
        return renderRecipes();
      case 'meditations':
        return renderMeditations();
      case 'community':
        return renderCommunity();
      case 'users':
        return renderUsers();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Success Indicator */}
      <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        ✅ New Admin Panel Working!
      </div>

      {/* Desktop Layout */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 flex flex-col">
          {renderSidebar()}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-16 bg-white/30 backdrop-blur-xl border-b border-white/30 flex items-center justify-between px-6">
            {renderHeader()}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}