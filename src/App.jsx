import { useEffect, useMemo, useReducer, useState } from 'react';
import {
  Home,
  PlusCircle,
  BarChart3,
  UserCircle,
  Flame,
  Dumbbell,
  MessageCircle,
  Send,
  Hand,
  Zap,
  Trophy,
  Search,
  Users,
  Share2,
  Timer,
  ChevronUp,
  ChevronDown,
  X,
  Bell,
  Shield,
  Ruler,
  Moon,
  LogOut
} from 'lucide-react';
import Confetti from 'react-confetti';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

const KEY = 'fitpack-state-v2';

const AVATARS = ['🥷', '🦾', '🏋️', '🥇', '⚡', '🚀', '🐺', '🔥'];
const GOALS = ['Bulk / Muscle Gain', 'Cut / Fat Loss', 'Maintain / Recomp', 'Endurance / Cardio', 'General Fitness'];
const GROUPS = [
  { id: 'g1', name: 'Iron Brotherhood 🏋️', members: 12, activity: 'Very Active' },
  { id: 'g2', name: 'Cardio Killers 🏃', members: 19, activity: 'Active' },
  { id: 'g3', name: 'Strength Sisters 💥', members: 14, activity: 'Very Active' }
];

const EXERCISE_LIBRARY = [
  'Bench Press', 'Incline Bench Press', 'Dumbbell Press', 'Push Up', 'Chest Fly',
  'Deadlift', 'Romanian Deadlift', 'Barbell Row', 'Seated Row', 'Pull Up',
  'Lat Pulldown', 'Squat', 'Front Squat', 'Bulgarian Split Squat', 'Lunge',
  'Leg Press', 'Leg Extension', 'Leg Curl', 'Calf Raise', 'Hip Thrust',
  'Shoulder Press', 'Lateral Raise', 'Face Pull', 'Biceps Curl', 'Hammer Curl',
  'Triceps Pushdown', 'Skull Crusher', 'Dip', 'Plank', 'Crunch',
  'Russian Twist', 'Mountain Climber', 'Burpee', 'Jump Rope', 'Running',
  'Cycling', 'Rowing', 'Stair Master', 'Farmer Carry', 'Sled Push',
  'Kettlebell Swing', 'Goblet Squat', 'Arnold Press', 'Cable Crossover', 'Good Morning',
  'Glute Bridge', 'Box Jump', 'Chin Up', 'Treadmill Walk', 'Bike Sprint'
];

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs', 'Full Body', 'Cardio'];

const dateFromNow = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const shortDate = (iso) => new Date(iso).toISOString().slice(5, 10);


const makeId = () => {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const timeAgo = (iso) => {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

const initialUsers = [
  { id: 'u1', name: 'Dany Ortiz', username: '@danyfit', bio: 'Bulk mode all year.', avatar: '🔥', goal: 'Bulk / Muscle Gain', memberSince: '2025-09-01' },
  { id: 'u2', name: 'Nina Shore', username: '@ninagrinds', bio: 'Leg day believer.', avatar: '⚡', goal: 'Cut / Fat Loss', memberSince: '2025-07-14' },
  { id: 'u3', name: 'Marcus Lee', username: '@ironmark', bio: 'PR hunter.', avatar: '🦾', goal: 'Bulk / Muscle Gain', memberSince: '2025-06-10' },
  { id: 'u4', name: 'Tori Banks', username: '@tori.train', bio: 'Cardio + strength.', avatar: '🚀', goal: 'Maintain / Recomp', memberSince: '2025-08-19' },
  { id: 'u5', name: 'Sam Knox', username: '@samsets', bio: 'Consistency over hype.', avatar: '🐺', goal: 'General Fitness', memberSince: '2025-10-05' }
];

const initialPosts = Array.from({ length: 10 }).map((_, i) => {
  const user = initialUsers[i % initialUsers.length];
  const createdAt = dateFromNow(i);
  const exercises = [
    { name: EXERCISE_LIBRARY[i], sets: 4, reps: 8 + (i % 4), weight: 95 + i * 10, notes: i % 2 ? 'Explosive concentric' : '' },
    { name: EXERCISE_LIBRARY[i + 1], sets: 3, reps: 10, weight: 65 + i * 6, notes: '' }
  ];

  return {
    id: `p${i + 1}`,
    userId: user.id,
    createdAt,
    workoutDate: createdAt,
    title: i % 2 ? 'Morning Push Day 💥' : 'Full Body Builder',
    caption: i % 2 ? 'Hit a fresh rep PR and felt unstoppable.' : 'Steady work > hype. Focused tempo all session.',
    exercises,
    duration: 48 + i,
    totalVolume: exercises.reduce((a, e) => a + e.sets * e.reps * e.weight, 0),
    muscleGroups: MUSCLE_GROUPS.slice(0, (i % 4) + 1),
    mood: (i % 5) + 1,
    prBadges: i % 3 === 0 ? ['Bench Press'] : [],
    reactions: { fire: 7 + i, strong: 4 + i, clap: 2 + i, hype: 3 + i },
    comments: [
      { id: `c-${i}-1`, userId: 'u1', text: 'Huge work rate! 🔥', createdAt },
      { id: `c-${i}-2`, userId: 'u2', text: 'You’re leveling up.', createdAt }
    ]
  };
});

const initialCheckins = Array.from({ length: 30 }).map((_, i) => ({
  date: shortDate(dateFromNow(29 - i)),
  iso: dateFromNow(29 - i),
  weight: Number((167 + i * 0.3).toFixed(1)),
  bodyFat: Number((18.5 - i * 0.03).toFixed(1)),
  energy: (i % 5) + 1
}));

const initialPRs = [
  { exercise: 'Bench Press', weight: 225, date: '2026-04-01' },
  { exercise: 'Squat', weight: 315, date: '2026-03-26' },
  { exercise: 'Deadlift', weight: 365, date: '2026-03-15' },
  { exercise: 'Shoulder Press', weight: 145, date: '2026-03-10' },
  { exercise: 'Hip Thrust', weight: 405, date: '2026-04-07' }
];

const initialState = {
  auth: { mode: 'splash', loading: false },
  sessionUserId: 'u1',
  unit: 'lbs',
  users: initialUsers,
  group: GROUPS[0],
  posts: initialPosts,
  checkins: initialCheckins,
  prs: initialPRs,
  chat: [
    { id: 'm1', userId: 'u3', text: 'Anyone hitting legs tonight?', ts: dateFromNow(0) },
    { id: 'm2', userId: 'u1', text: 'Yep — posting my volume in an hour 👀', ts: dateFromNow(0) }
  ],
  settings: { notifications: true, privacy: 'group-only', darkMode: true, units: 'lbs' }
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : initialState;
  } catch {
    return initialState;
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH_MODE':
      return { ...state, auth: { ...state.auth, mode: action.mode } };
    case 'SET_LOADING':
      return { ...state, auth: { ...state.auth, loading: action.value } };
    case 'SET_USER':
      return { ...state, sessionUserId: action.userId };
    case 'SET_GROUP':
      return { ...state, group: action.group };
    case 'ADD_POST':
      return { ...state, posts: [action.post, ...state.posts], prs: action.newPr ? [action.newPr, ...state.prs] : state.prs };
    case 'ADD_REACTION':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.postId
            ? { ...post, reactions: { ...post.reactions, [action.reaction]: post.reactions[action.reaction] + 1 } }
            : post
        )
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.postId ? { ...post, comments: [...post.comments, action.comment] } : post
        )
      };
    case 'ADD_CHECKIN':
      return { ...state, checkins: [...state.checkins, action.checkin] };
    case 'ADD_CHAT':
      return { ...state, chat: [...state.chat, action.message] };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);
  const [activeTab, setActiveTab] = useState('feed');
  const [toast, setToast] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [search, setSearch] = useState('');
  const [burst, setBurst] = useState(false);

  const me = state.users.find((u) => u.id === state.sessionUserId);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const notify = (text) => {
    setToast(text);
    setTimeout(() => setToast(''), 2200);
  };

  const asyncAction = (cb) => {
    dispatch({ type: 'SET_LOADING', value: true });
    setTimeout(() => {
      cb();
      dispatch({ type: 'SET_LOADING', value: false });
    }, 800);
  };

  const filteredPosts = useMemo(() => {
    const q = search.toLowerCase().trim();
    return state.posts
      .filter((post) => {
        const u = state.users.find((user) => user.id === post.userId);
        return !q || [post.title, post.caption, u?.name, post.muscleGroups.join(',')].join(' ').toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [state.posts, search, state.users]);

  if (state.auth.mode !== 'app') {
    return (
      <SplashAndOnboarding
        loading={state.auth.loading}
        mode={state.auth.mode}
        onLogin={() => asyncAction(() => dispatch({ type: 'SET_AUTH_MODE', mode: 'app' }))}
        onCreate={() => asyncAction(() => dispatch({ type: 'SET_AUTH_MODE', mode: 'onboard' }))}
        onFinish={(payload) => {
          dispatch({ type: 'SET_GROUP', group: payload.group });
          dispatch({ type: 'SET_AUTH_MODE', mode: 'app' });
          notify('Welcome to FitPack!');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F0C] text-white pb-24">
      {burst && <Confetti recycle={false} numberOfPieces={280} onConfettiComplete={() => setBurst(false)} />}

      <header className="sticky top-0 z-10 p-4 border-b border-lime-300/20 bg-black/75 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bebas text-3xl tracking-wider">FITPACK</h1>
            <div className="text-xs text-lime-300">{state.group.name} · {state.group.members} members · {state.group.activity}</div>
          </div>
          <button className="chip" onClick={() => setProfileId(me.id)}><Users size={14} /> Online now 7</button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {activeTab === 'feed' && (
          <FeedTab
            users={state.users}
            posts={filteredPosts}
            onReaction={(postId, reaction) => {
              dispatch({ type: 'ADD_REACTION', postId, reaction });
              notify('Reaction added 💪');
            }}
            onComment={(postId, text) => {
              dispatch({ type: 'ADD_COMMENT', postId, comment: { id: makeId(), userId: me.id, text, createdAt: new Date().toISOString() } });
              notify('Comment posted');
            }}
            onProfile={setProfileId}
            onShare={() => notify('Shared with group ✅')}
            search={search}
            setSearch={setSearch}
          />
        )}

        {activeTab === 'log' && (
          <LogWorkoutTab
            user={me}
            posts={state.posts}
            prs={state.prs}
            unit={state.settings.units}
            onPost={(post, newPr, streakToast) => {
              dispatch({ type: 'ADD_POST', post, newPr });
              setBurst(true);
              notify('Workout posted! 🔥');
              if (streakToast) setTimeout(() => notify(streakToast), 350);
              if (newPr) setTimeout(() => notify(`🏆 New PR: ${newPr.exercise} ${newPr.weight}${state.settings.units}`), 700);
              setActiveTab('feed');
            }}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressTab
            checkins={state.checkins}
            posts={state.posts}
            prs={state.prs}
            goal={me.goal}
            units={state.settings.units}
            onSaveCheckin={(checkin, msg) => {
              dispatch({ type: 'ADD_CHECKIN', checkin });
              notify('Check-in saved!');
              if (msg) setTimeout(() => notify(msg), 450);
            }}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            me={me}
            users={state.users}
            posts={state.posts}
            chat={state.chat}
            settings={state.settings}
            onOpenProfile={setProfileId}
            onChat={(text) => dispatch({ type: 'ADD_CHAT', message: { id: makeId(), userId: me.id, text, ts: new Date().toISOString() } })}
            onUpdateSettings={(settings) => dispatch({ type: 'UPDATE_SETTINGS', settings })}
          />
        )}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
      {toast && <div className="toast">{toast}</div>}

      {profileId && (
        <ProfileModal
          user={state.users.find((u) => u.id === profileId)}
          posts={state.posts.filter((p) => p.userId === profileId)}
          onClose={() => setProfileId(null)}
        />
      )}
    </div>
  );
}

function SplashAndOnboarding({ loading, mode, onLogin, onCreate, onFinish }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', confirm: '', avatar: AVATARS[0],
    weight: '', height: '', age: '', sex: 'Prefer not to say', bodyFat: '',
    goal: GOALS[0], frequency: 4, targetWeight: '', targetDate: '',
    groupMode: 'join', joinGroupId: GROUPS[0].id, groupName: '', groupEmoji: '🏋️', groupDesc: ''
  });

  const validate = () => {
    const nextErrors = {};
    if (step === 1) {
      if (!form.name.trim()) nextErrors.name = 'Name is required';
      if (!form.username.trim()) nextErrors.username = 'Username is required';
      if (!form.email.includes('@')) nextErrors.email = 'Valid email required';
      if (form.password.length < 6) nextErrors.password = 'Minimum 6 characters';
      if (form.password !== form.confirm) nextErrors.confirm = 'Passwords must match';
    }
    if (step === 2) {
      if (!form.weight) nextErrors.weight = 'Current weight is required';
      if (!form.height) nextErrors.height = 'Height is required';
      if (!form.age) nextErrors.age = 'Age is required';
    }
    if (step === 4 && form.groupMode === 'create' && !form.groupName.trim()) nextErrors.groupName = 'Group name is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  if (mode !== 'onboard') {
    return (
      <div className="min-h-screen splash p-6 flex flex-col justify-center gap-6">
        <h1 className="font-bebas text-7xl leading-none tracking-widest">FIT<br/>PACK</h1>
        <p className="text-slate-200 text-lg">Train together. Grow together.</p>
        <button className="btn-primary" onClick={onLogin}>Log In</button>
        <button className="btn-ghost" onClick={onCreate}>Create Account</button>
        {loading && <div className="text-lime-200 animate-pulse">Loading...</div>}
      </div>
    );
  }

  const finish = () => {
    const group = form.groupMode === 'join'
      ? GROUPS.find((g) => g.id === form.joinGroupId)
      : { id: makeId(), name: `${form.groupName} ${form.groupEmoji}`, members: 1, activity: 'New' };
    onFinish({ group });
  };

  return (
    <div className="min-h-screen splash p-4">
      <div className="card mt-10 space-y-4">
        <div className="text-lime-200">Step {step}/4</div>
        <div className="progress"><span style={{ width: `${step * 25}%` }} /></div>

        {step === 1 && (
          <div className="space-y-2">
            <h2 className="font-semibold">Account Info</h2>
            <input className="input" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="error">{errors.name}</p>}
            <input className="input" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            {errors.username && <p className="error">{errors.username}</p>}
            <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p className="error">{errors.email}</p>}
            <div className="grid grid-cols-2 gap-2">
              <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <input className="input" type="password" placeholder="Confirm" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
            </div>
            {(errors.password || errors.confirm) && <p className="error">{errors.password || errors.confirm}</p>}
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((avatar) => <button key={avatar} className={`chip ${form.avatar === avatar ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, avatar })}>{avatar}</button>)}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <h2 className="font-semibold">Body Stats</h2>
            <div className="grid grid-cols-2 gap-2">
              <input className="input" placeholder="Current Weight" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              <input className="input" placeholder="Height" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
              <input className="input" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              <input className="input" placeholder="Body Fat % (optional)" value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} />
            </div>
            <select className="input" value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })}>
              <option>Male</option><option>Female</option><option>Prefer not to say</option>
            </select>
            {(errors.weight || errors.height || errors.age) && <p className="error">{errors.weight || errors.height || errors.age}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            <h2 className="font-semibold">Fitness Goals</h2>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map((goal) => <button key={goal} className={`chip text-left ${form.goal === goal ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, goal })}>{goal}</button>)}
            </div>
            <label className="text-sm">Workout Frequency Target: {form.frequency} days/week</label>
            <input type="range" min="1" max="7" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: Number(e.target.value) })} className="w-full accent-lime-300" />
            <div className="grid grid-cols-2 gap-2">
              <input className="input" placeholder="Target Weight (optional)" value={form.targetWeight} onChange={(e) => setForm({ ...form, targetWeight: e.target.value })} />
              <input className="input" type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h2 className="font-semibold">Group Setup</h2>
            <div className="flex gap-2">
              <button className={`chip ${form.groupMode === 'join' ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, groupMode: 'join' })}>Join Existing</button>
              <button className={`chip ${form.groupMode === 'create' ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, groupMode: 'create' })}>Create New</button>
            </div>

            {form.groupMode === 'join' ? (
              <div className="space-y-2">
                {GROUPS.map((group) => (
                  <button key={group.id} className={`group-card ${form.joinGroupId === group.id ? 'ring-1 ring-lime-300' : ''}`} onClick={() => setForm({ ...form, joinGroupId: group.id })}>
                    <div className="font-semibold">{group.name}</div>
                    <div className="text-xs text-slate-400">{group.members} members · {group.activity}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <input className="input col-span-3" placeholder="Group name" value={form.groupName} onChange={(e) => setForm({ ...form, groupName: e.target.value })} />
                  <input className="input" placeholder="Emoji" value={form.groupEmoji} onChange={(e) => setForm({ ...form, groupEmoji: e.target.value })} />
                </div>
                {errors.groupName && <p className="error">{errors.groupName}</p>}
                <textarea className="input min-h-20" placeholder="Short description" value={form.groupDesc} onChange={(e) => setForm({ ...form, groupDesc: e.target.value })} />
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button className="btn-ghost flex-1" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>Back</button>
          {step < 4 ? (
            <button className="btn-primary flex-1" onClick={() => validate() && setStep((s) => s + 1)}>Continue</button>
          ) : (
            <button className="btn-primary flex-1" onClick={() => validate() && finish()}>Finish</button>
          )}
        </div>
      </div>
    </div>
  );
}

function FeedTab({ posts, users, onReaction, onComment, onProfile, onShare, search, setSearch }) {
  const leaderboard = useMemo(() => {
    const countByUser = posts.reduce((acc, post) => ({ ...acc, [post.userId]: (acc[post.userId] || 0) + 1 }), {});
    return Object.entries(countByUser)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([userId, workouts], idx) => ({ rank: idx + 1, user: users.find((u) => u.id === userId), workouts }));
  }, [posts, users]);

  return (
    <section className="space-y-3">
      <div className="card">
        <div className="font-semibold mb-2">Weekly leaderboard</div>
        <div className="flex gap-2 overflow-x-auto">
          {leaderboard.map((entry) => (
            <button key={entry.user.id} className="chip" onClick={() => onProfile(entry.user.id)}>
              <Trophy size={14} /> #{entry.rank} {entry.user.name.split(' ')[0]} · {entry.workouts} workouts
            </button>
          ))}
        </div>
      </div>

      <div className="card flex items-center gap-2">
        <Search size={15} className="text-lime-200" />
        <input className="bg-transparent outline-none w-full text-sm" placeholder="Search workouts, users, muscle groups..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} users={users} onReaction={onReaction} onComment={onComment} onProfile={onProfile} onShare={onShare} />
      ))}

      {!posts.length && <div className="card text-center text-slate-400">No posts match your search.</div>}
    </section>
  );
}

function PostCard({ post, users, onReaction, onComment, onProfile, onShare }) {
  const user = users.find((u) => u.id === post.userId);
  const [openComments, setOpenComments] = useState(false);
  const [comment, setComment] = useState('');
  const reactions = [
    { id: 'fire', icon: Flame, label: 'Fire', color: 'hover:bg-orange-500/20' },
    { id: 'strong', icon: Dumbbell, label: 'Strong', color: 'hover:bg-lime-500/20' },
    { id: 'clap', icon: Hand, label: 'Clap', color: 'hover:bg-cyan-500/20' },
    { id: 'hype', icon: Zap, label: 'Hype', color: 'hover:bg-fuchsia-500/20' }
  ];

  return (
    <article className="card space-y-3">
      <button className="flex items-center gap-2" onClick={() => onProfile(user.id)}>
        <span className="text-2xl">{user.avatar}</span>
        <div className="text-left">
          <div className="font-semibold">{user.name}</div>
          <div className="text-xs text-slate-400">{user.username} · {timeAgo(post.createdAt)}</div>
        </div>
      </button>

      <div className="font-semibold">{post.title}</div>
      <p className="text-sm text-slate-300">{post.caption}</p>

      <div className="space-y-1 text-sm">
        {post.exercises.map((exercise, idx) => (
          <div key={`${post.id}-${idx}`} className="text-slate-200">
            {exercise.name} — {exercise.sets} × {exercise.reps} @ {exercise.weight}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="chip">🔥 Volume {post.totalVolume}</span>
        <span className="chip"><Timer size={12} /> {post.duration} mins</span>
        <span className="chip">💪 {post.muscleGroups.join(', ')}</span>
        {post.prBadges.map((pr) => <span key={pr} className="chip chip-active">🏆 {pr} PR</span>)}
      </div>

      <div className="flex gap-2 flex-wrap">
        {reactions.map((reaction) => (
          <button key={reaction.id} className={`chip hover:scale-110 transition ${reaction.color}`} onClick={() => onReaction(post.id, reaction.id)}>
            <reaction.icon size={14} /> {post.reactions[reaction.id]}
          </button>
        ))}
        <button className="chip" onClick={() => setOpenComments((v) => !v)}><MessageCircle size={14} /> {post.comments.length}</button>
        <button className="chip" onClick={() => onShare(post.id)}><Share2 size={14} /> Share</button>
      </div>

      {openComments && (
        <div className="space-y-2 border-t border-white/10 pt-2">
          {post.comments.map((c) => (
            <div key={c.id} className="text-sm text-slate-300">
              <span className="text-lime-300">{users.find((u) => u.id === c.userId)?.username}</span> {c.text}
            </div>
          ))}
          <div className="flex gap-2">
            <input className="input" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
            <button className="btn-primary" onClick={() => { if (!comment.trim()) return; onComment(post.id, comment.trim()); setComment(''); }}><Send size={14} /></button>
          </div>
        </div>
      )}
    </article>
  );
}

function LogWorkoutTab({ user, posts, prs, unit, onPost }) {
  const [loading, setLoading] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [form, setForm] = useState({
    title: '', caption: '', duration: 45, workoutDate: new Date().toISOString().slice(0, 10),
    muscles: ['Chest'], mood: 4,
    exercises: [{ name: EXERCISE_LIBRARY[0], sets: 4, reps: 8, weight: 135, notes: '' }]
  });

  const toggleMuscle = (muscle) => {
    const exists = form.muscles.includes(muscle);
    setForm({ ...form, muscles: exists ? form.muscles.filter((m) => m !== muscle) : [...form.muscles, muscle] });
  };

  const move = (index, direction) => {
    const next = [...form.exercises];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setForm({ ...form, exercises: next });
  };

  const onSubmit = () => {
    if (!form.title.trim() || !form.exercises.length) return;
    setLoading(true);
    setTimeout(() => {
      const totalVolume = form.exercises.reduce((acc, e) => acc + (e.sets || 0) * (e.reps || 0) * (e.weight || 0), 0);
      const post = {
        id: makeId(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        workoutDate: form.workoutDate,
        title: form.title,
        caption: form.caption,
        exercises: form.exercises,
        duration: Number(form.duration),
        totalVolume,
        muscleGroups: form.muscles,
        mood: form.mood,
        prBadges: [],
        reactions: { fire: 0, strong: 0, clap: 0, hype: 0 },
        comments: []
      };

      let newPr = null;
      for (const exercise of form.exercises) {
        const bestExisting = prs.find((pr) => pr.exercise === exercise.name);
        if (!bestExisting || exercise.weight > bestExisting.weight) {
          newPr = { exercise: exercise.name, weight: exercise.weight, date: new Date().toISOString().slice(0, 10) };
          post.prBadges.push(exercise.name);
          break;
        }
      }

      const streakDays = calculateStreak(posts.map((p) => p.workoutDate));
      const streakToast = (streakDays + 1) % 7 === 0 ? `🔥 ${streakDays + 1}-day streak! You're on fire!` : '';

      onPost(post, newPr, streakToast);
      setLoading(false);
    }, 800);
  };

  return (
    <section className="card space-y-3">
      <h2 className="font-bebas text-3xl">What did you crush today? 🏋️</h2>
      <input className="input" placeholder="Workout Name (Push Day, Pull Day, Leg Day...)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

      {form.exercises.map((exercise, index) => (
        <div key={index} className="rounded-xl border border-white/10 p-2 space-y-2">
          <div className="flex gap-2">
            <select className="input" value={exercise.name} onChange={(e) => setForm({ ...form, exercises: form.exercises.map((row, i) => i === index ? { ...row, name: e.target.value } : row) })}>
              {EXERCISE_LIBRARY.map((name) => <option key={name}>{name}</option>)}
            </select>
            <button className="chip" onClick={() => move(index, -1)}><ChevronUp size={14} /></button>
            <button className="chip" onClick={() => move(index, 1)}><ChevronDown size={14} /></button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['sets', 'reps', 'weight'].map((key) => (
              <input
                key={key}
                className="input"
                type="number"
                placeholder={key}
                value={exercise[key]}
                onChange={(e) => setForm({ ...form, exercises: form.exercises.map((row, i) => i === index ? { ...row, [key]: Number(e.target.value) } : row) })}
              />
            ))}
          </div>

          <input className="input" placeholder="Notes (optional)" value={exercise.notes || ''} onChange={(e) => setForm({ ...form, exercises: form.exercises.map((row, i) => i === index ? { ...row, notes: e.target.value } : row) })} />
          <button className="chip" onClick={() => setForm({ ...form, exercises: form.exercises.filter((_, i) => i !== index) })}><X size={12} /> Delete</button>
        </div>
      ))}

      <button className="btn-ghost" onClick={() => setForm({ ...form, exercises: [...form.exercises, { name: EXERCISE_LIBRARY[1], sets: 3, reps: 10, weight: 95, notes: '' }] })}>+ Add Exercise</button>

      <div className="grid grid-cols-2 gap-2">
        <input className="input" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duration (min)" />
        <input className="input" type="date" value={form.workoutDate} onChange={(e) => setForm({ ...form, workoutDate: e.target.value })} />
      </div>

      <button className={`chip ${timerOn ? 'chip-active' : ''}`} onClick={() => setTimerOn((v) => !v)}><Timer size={14} /> Auto timer {timerOn ? 'On' : 'Off'}</button>

      <div className="grid grid-cols-2 gap-2">
        {MUSCLE_GROUPS.map((muscle) => (
          <button key={muscle} className={`chip ${form.muscles.includes(muscle) ? 'chip-active' : ''}`} onClick={() => toggleMuscle(muscle)}>{muscle}</button>
        ))}
      </div>

      <div>
        <div className="text-sm mb-1">Mood / Energy</div>
        <div className="flex gap-2">{['😴', '😑', '😊', '💪', '🔥'].map((emoji, idx) => <button key={emoji} className={`chip ${form.mood === idx + 1 ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, mood: idx + 1 })}>{emoji}</button>)}</div>
      </div>

      <textarea className="input min-h-20" placeholder="Add a note for the group…" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
      <button className="btn-primary" disabled={loading || !form.title.trim()} onClick={onSubmit}>{loading ? 'Posting...' : `Post to FitPack (${unit}) 🔥`}</button>
    </section>
  );
}

function ProgressTab({ checkins, posts, prs, goal, units, onSaveCheckin }) {
  const [range, setRange] = useState(30);
  const [form, setForm] = useState({ weight: '', bodyFat: '', energy: 4, notes: '' });

  const filtered = checkins.slice(-range);
  const start = filtered[0]?.weight || 0;
  const current = filtered[filtered.length - 1]?.weight || 0;
  const goalWeight = goal.includes('Bulk') ? current + 8 : current - 8;

  const workoutByWeek = useMemo(() => {
    const map = {};
    posts.forEach((post) => {
      const d = new Date(post.createdAt);
      const key = `${d.getFullYear()}-W${Math.ceil((d.getDate() + 6 - d.getDay()) / 7)}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).slice(-8).map(([week, workouts]) => ({ week: week.slice(5), workouts }));
  }, [posts]);

  const volumeByWeek = useMemo(() => {
    const map = {};
    posts.forEach((post) => {
      const d = new Date(post.createdAt);
      const key = `${d.getFullYear()}-W${Math.ceil((d.getDate() + 6 - d.getDay()) / 7)}`;
      map[key] = (map[key] || 0) + post.totalVolume;
    });
    return Object.entries(map).slice(-8).map(([week, volume]) => ({ week: week.slice(5), volume }));
  }, [posts]);

  const streak = calculateStreak(posts.map((post) => post.workoutDate));

  return (
    <section className="space-y-3">
      <div className="card space-y-2">
        <div className="font-semibold">+ Log Today's Check-In</div>
        <div className="grid grid-cols-2 gap-2">
          <input className="input" placeholder={`Weight (${units})`} value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
          <input className="input" placeholder="Body fat %" value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} />
        </div>
        <input className="input" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <div className="flex gap-2">{['😴', '😑', '😊', '💪', '🔥'].map((emoji, idx) => <button key={emoji} className={`chip ${form.energy === idx + 1 ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, energy: idx + 1 })}>{emoji}</button>)}</div>
        <button className="btn-primary" onClick={() => {
          if (!form.weight) return;
          const latest = checkins[checkins.length - 1];
          const newWeight = Number(form.weight);
          const msg = newWeight > latest.weight && goal.includes('Bulk') ? `📈 Up ${(newWeight - latest.weight).toFixed(1)} ${units} — Keep bulking!` : '';
          onSaveCheckin({ iso: new Date().toISOString(), date: shortDate(new Date().toISOString()), weight: newWeight, bodyFat: Number(form.bodyFat || 0), energy: form.energy, notes: form.notes }, msg);
          setForm({ weight: '', bodyFat: '', energy: 4, notes: '' });
        }}>Save Check-In</button>
      </div>

      <div className="card">
        <div className="flex gap-2 mb-2">{[30, 90, 180].map((n) => <button key={n} className={`chip ${range === n ? 'chip-active' : ''}`} onClick={() => setRange(n)}>Last {n}</button>)}</div>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
              <XAxis dataKey="date" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <ReferenceLine y={goalWeight} stroke="#C6FF00" strokeDasharray="4 4" />
              <Line dataKey="weight" stroke="#4FC3F7" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chip mt-2">Net change: {(current - start).toFixed(1)} {units}</div>
      </div>

      <ChartShell title="Workout Frequency"><BarChart data={workoutByWeek}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" /><XAxis dataKey="week" stroke="#94A3B8" /><YAxis stroke="#94A3B8" /><Tooltip /><Bar dataKey="workouts" fill="#8BC34A" radius={[8, 8, 0, 0]} /></BarChart></ChartShell>
      <ChartShell title="Volume Over Time"><LineChart data={volumeByWeek}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" /><XAxis dataKey="week" stroke="#94A3B8" /><YAxis stroke="#94A3B8" /><Tooltip /><Line dataKey="volume" stroke="#C6FF00" dot={false} strokeWidth={2} /></LineChart></ChartShell>

      <div className="card">
        <div className="font-semibold mb-2">Streak heatmap</div>
        <div className="grid grid-cols-10 gap-1">{Array.from({ length: 30 }).map((_, i) => <div key={i} className={`h-4 rounded ${i < streak ? 'bg-lime-300' : 'bg-white/10'}`} />)}</div>
      </div>

      <div className="card grid grid-cols-2 gap-2 text-sm">
        <div className="chip">🔥 Current Streak: {streak} days</div>
        <div className="chip">📅 Workouts this month: {posts.length}</div>
        <div className="chip">💪 Total volume: {posts.reduce((a, p) => a + p.totalVolume, 0)}</div>
        <div className="chip">🏆 PR entries: {prs.length}</div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">PR Tracker</div>
        {prs.map((pr) => (
          <div key={`${pr.exercise}-${pr.date}`} className="flex justify-between text-sm border-b border-white/10 py-1">
            <span>{pr.exercise}</span>
            <span>{pr.weight}{units} · {pr.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChartShell({ title, children }) {
  return (
    <div className="card">
      <div className="font-semibold mb-2">{title}</div>
      <div className="h-56"><ResponsiveContainer>{children}</ResponsiveContainer></div>
    </div>
  );
}

function ProfileTab({ me, users, posts, chat, settings, onOpenProfile, onChat, onUpdateSettings }) {
  const [message, setMessage] = useState('');
  const myPosts = posts.filter((post) => post.userId === me.id);

  const muscleFocus = useMemo(() => {
    if (me.goal.includes('Bulk')) return { Chest: 'High', Back: 'High', Shoulders: 'Medium', Arms: 'Medium', Core: 'Low', Legs: 'High' };
    if (me.goal.includes('Cut')) return { Chest: 'Medium', Back: 'Medium', Shoulders: 'Medium', Arms: 'Medium', Core: 'High', Legs: 'High' };
    return { Chest: 'Medium', Back: 'Medium', Shoulders: 'Medium', Arms: 'Low', Core: 'Medium', Legs: 'Medium' };
  }, [me.goal]);

  return (
    <section className="space-y-3">
      <div className="card">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{me.avatar}</span>
          <div>
            <div className="font-semibold text-lg">{me.name}</div>
            <div className="text-sm text-slate-400">{me.username} · Member since {me.memberSince}</div>
            <div className="chip mt-2 inline-flex">Goal: {me.goal}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="chip justify-center">Posts {myPosts.length}</div>
          <div className="chip justify-center">Workouts {myPosts.length}</div>
          <div className="chip justify-center">PRs {5}</div>
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">See member profiles</div>
        <div className="grid grid-cols-2 gap-2">
          {users.filter((u) => u.id !== me.id).map((user) => <button key={user.id} className="chip" onClick={() => onOpenProfile(user.id)}>{user.avatar} {user.name}</button>)}
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Group progress chat</div>
        <div className="space-y-2 max-h-48 overflow-auto mb-2">
          {chat.map((line) => (
            <div key={line.id} className="text-sm">
              <span className="text-lime-300">{users.find((u) => u.id === line.userId)?.username}</span> {line.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share what you did today..." />
          <button className="btn-primary" onClick={() => { if (!message.trim()) return; onChat(message.trim()); setMessage(''); }}><Send size={14} /></button>
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Training section by muscle details</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(muscleFocus).map(([muscle, focus]) => <div key={muscle} className="chip">{muscle}: {focus} focus</div>)}
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Settings</div>
        <div className="space-y-2 text-sm">
          <button className="chip" onClick={() => onUpdateSettings({ notifications: !settings.notifications })}><Bell size={14} /> Notifications: {settings.notifications ? 'On' : 'Off'}</button>
          <button className="chip" onClick={() => onUpdateSettings({ units: settings.units === 'lbs' ? 'kg' : 'lbs' })}><Ruler size={14} /> Units: {settings.units}</button>
          <button className="chip" onClick={() => onUpdateSettings({ privacy: settings.privacy === 'group-only' ? 'public' : 'group-only' })}><Shield size={14} /> Privacy: {settings.privacy}</button>
          <button className="chip" onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}><Moon size={14} /> Theme: {settings.darkMode ? 'Dark' : 'Light'}</button>
          <button className="chip"><LogOut size={14} /> Log out</button>
        </div>
      </div>
    </section>
  );
}

function ProfileModal({ user, posts, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 p-4 z-20" onClick={onClose}>
      <div className="card max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{user.avatar}</span>
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-slate-400">{user.username}</div>
            </div>
          </div>
          <button className="chip" onClick={onClose}><X size={14} /></button>
        </div>
        <p className="text-sm text-slate-300 mt-2">{user.bio}</p>
        <div className="mt-2 text-xs text-lime-300">Goal: {user.goal}</div>
        <div className="mt-3 space-y-1">
          {posts.slice(0, 6).map((post) => <div key={post.id} className="chip">{post.title} · {shortDate(post.createdAt)}</div>)}
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'feed', icon: Home, label: 'Feed' },
    { id: 'log', icon: PlusCircle, label: 'Log Workout' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
    { id: 'profile', icon: UserCircle, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 p-2 border-t border-lime-300/20 bg-black/85 grid grid-cols-4 gap-2">
      {tabs.map((tab) => (
        <button key={tab.id} className={`rounded-xl py-2 text-xs flex flex-col items-center gap-1 transition ${active === tab.id ? 'bg-lime-300/20 text-lime-200' : 'text-slate-400'}`} onClick={() => onChange(tab.id)}>
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

function calculateStreak(workoutDates) {
  const set = new Set(workoutDates.filter(Boolean).map((d) => d.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (set.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default App;
