import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  yellow: '#F5A623',
  yellowDark: '#E09200',
  yellowLight: '#FFF3D4',
  blue: '#1A3C6E',
  blueMid: '#2B5BA8',
  blueLight: '#E8EEFA',
  green: '#1D6F42',
  red: '#E53935',
  redLight: '#FFEBEE',
  gray: '#6B7280',
  grayLight: '#F0F2F5',
  white: '#FFFFFF',
  dark: '#1A1A2E',
  border: '#E5E7EB',
};

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const DEPARTMENTS = ['Cashier','Groceries','Drinks','Toiletries','Household','Electronics','Backstore','Merchandisers'];

const INITIAL_STAFF = [
  {id:'S001',name:'Amaka Okafor',dept:'Cashier',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S002',name:'Bola Adeyemi',dept:'Cashier',shift:'MOR',role:'supervisor',active:true,pin:'1234'},
  {id:'S003',name:'Chidi Eze',dept:'Cashier',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S004',name:'Dupe Fashola',dept:'Cashier',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S005',name:'Emeka Nwosu',dept:'Cashier',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S006',name:'Fatima Usman',dept:'Cashier',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S007',name:'Gbenga Lawal',dept:'Cashier',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S008',name:'Helen Okoro',dept:'Cashier',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S009',name:'Ibrahim Musa',dept:'Cashier',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S010',name:'Jumoke Alabi',dept:'Cashier',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S011',name:'Kunle Adewale',dept:'Cashier',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S012',name:'Lara Sanni',dept:'Cashier',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S013',name:'Musa Bello',dept:'Cashier',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S014',name:'Nike Coker',dept:'Cashier',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S015',name:'Quadri Salami',dept:'Groceries',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S016',name:'Rita Okonkwo',dept:'Groceries',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S017',name:'Seun Adeleke',dept:'Groceries',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S018',name:'Taiwo Abiodun',dept:'Groceries',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S019',name:'Uche Igwe',dept:'Groceries',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S020',name:'Vera Nnamdi',dept:'Drinks',shift:'MOR',role:'supervisor',active:true,pin:'1234'},
  {id:'S021',name:'Wasiu Olawale',dept:'Drinks',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S022',name:'Yusuf Garba',dept:'Drinks',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S023',name:'Zainab Idris',dept:'Drinks',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S024',name:'Priscilla Nwachukwu',dept:'Toiletries',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S025',name:'Rasheed Adebayo',dept:'Toiletries',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S026',name:'Sophia Obi',dept:'Household',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S027',name:'Tunde Bakare',dept:'Household',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S028',name:'Usman Danladi',dept:'Electronics',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S029',name:'Victoria Ojo',dept:'Electronics',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'S030',name:'Wale Afolabi',dept:'Backstore',shift:'MOR',role:'staff',active:true,pin:'1234'},
  {id:'S031',name:'Ximena Egbo',dept:'Backstore',shift:'AFT',role:'staff',active:true,pin:'1234'},
  {id:'ADMIN',name:'Admin',dept:'Management',shift:'MOR',role:'admin',active:true,pin:'1234'},
];

const SHIFT_LABELS = { MOR:'Morning', AFT:'Afternoon', SUN:'Sunday', LNG:'Long Hour', OFF:'Off Day' };
const SHIFT_TIMES  = { MOR:'7:30AM–3:00PM', AFT:'1:30PM–9:00PM', SUN:'9:30AM–9:30PM', LNG:'10:00AM–10:00PM', OFF:'Rest Day' };
const SHIFT_COLORS = {
  MOR:{ bg:'#FFF3D4', text:'#B87E00', border:'#F5A623' },
  AFT:{ bg:'#E8EEFA', text:'#1A3C6E', border:'#2B5BA8' },
  SUN:{ bg:'#E8F5E9', text:'#1D6F42', border:'#1D6F42' },
  LNG:{ bg:'#FCE4EC', text:'#880E4F', border:'#E91E63' },
  OFF:{ bg:'#F3F4F6', text:'#6B7280', border:'#9CA3AF' },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const isoDate = d => {
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
};
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate()+n); return r; };
const startOfWeek = d => { const r = new Date(d); r.setDate(r.getDate() - ((r.getDay()+6)%7)); return r; };
const monthDays = (y, m) => new Date(y, m+1, 0).getDate();
const getInitials = name => name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
const avatarColor = id => { const colors=['#F5A623','#2B5BA8','#1D6F42','#E53935','#7B1FA2','#00838F','#E65100','#AD1457']; let h=0; for(let c of id) h=(h<<5)-h+c.charCodeAt(0); return colors[Math.abs(h)%colors.length]; };
const fmtDate = d => new Date(d+'T00:00:00').toLocaleDateString('en-NG',{weekday:'short',day:'numeric',month:'short'});
const today = () => isoDate(new Date());
const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// Generate roster for a month
function generateMonthRoster(staff, year, month) {
  const roster = {};
  const days = monthDays(year, month);

  staff.filter(s=>s.active && s.id!=='ADMIN').forEach(s => {
    roster[s.id] = {};
    // Get all dates in month
    const allDates = [];
    for(let d=1; d<=days; d++) {
      const dt = new Date(year, month, d);
      allDates.push({ date: isoDate(dt), dow: dt.getDay() }); // 0=Sun,1=Mon...
    }

    // Sundays: alternating MOR/AFT based on week number
    // Week 1 = first Mon-Sun. Week index from start of month
    const firstMon = new Date(year, month, 1);
    while(firstMon.getDay() !== 1) firstMon.setDate(firstMon.getDate()+1);
    // Actually: week index for a date = Math.floor((dayOfMonth - firstMondayDay) / 7)
    const firstMonDay = firstMon.getDate();

    // Assign offs: 6 offs per month. 2 are Sundays (based on alternation), 4 weekdays
    // Sundays in month
    const sundays = allDates.filter(d => d.dow === 0);
    const weekdays = allDates.filter(d => d.dow >= 1 && d.dow <= 6);

    // Determine which Sundays staff works/off based on shift
    // Week 1: MOR works Sunday, AFT off. Week 2: AFT works, MOR off.
    let sundayOffs = [];
    let sundayShifts = {};
    sundays.forEach((s_day, idx) => {
      const weekIdx = idx % 2; // 0=week1,1=week2
      if(s.shift === 'MOR') {
        sundayShifts[s_day.date] = weekIdx === 0 ? 'SUN' : 'OFF';
        if(weekIdx === 1) sundayOffs.push(s_day.date);
      } else {
        sundayShifts[s_day.date] = weekIdx === 0 ? 'OFF' : 'SUN';
        if(weekIdx === 0) sundayOffs.push(s_day.date);
      }
    });

    // Need 4 more weekday offs
    // Buffer rule: Thursday–Tuesday around working Sunday
    const workingSundays = sundays.filter(sd => sundayShifts[sd.date] !== 'OFF').map(sd => sd.date);
    const bufferDates = new Set();
    workingSundays.forEach(sd => {
      const d = new Date(sd+'T00:00:00');
      for(let i=-3; i<=2; i++) { // Thu before to Tue after
        if(i===0) continue;
        const bd = addDays(d, i);
        if(bd.getMonth() === month && bd.getDay() !== 0) bufferDates.add(isoDate(bd));
      }
    });

    // Pick 4 weekday offs from buffer first, then any
    const bufferArr = [...bufferDates].filter(d => weekdays.find(wd=>wd.date===d));
    const nonBuffer = weekdays.filter(wd=>!bufferDates.has(wd.date)).map(wd=>wd.date);
    let weekdayOffs = [];
    // Spread offs: pick every ~7 days
    const candidates = [...bufferArr, ...nonBuffer];
    // simple: pick 4 evenly spaced
    const step = Math.floor(candidates.length / 4);
    for(let i=0;i<4;i++) { if(candidates[i*step]) weekdayOffs.push(candidates[i*step]); }
    // Ensure unique
    weekdayOffs = [...new Set(weekdayOffs)].slice(0,4);
    const allOffDates = new Set([...sundayOffs, ...weekdayOffs]);

    // Assign each day
    allDates.forEach(({date, dow}) => {
      if(allOffDates.has(date)) { roster[s.id][date] = 'OFF'; return; }
      if(dow === 0) { roster[s.id][date] = sundayShifts[date] || 'SUN'; return; }
      roster[s.id][date] = s.shift;
    });

    // Long hour: if partner is OFF. For simplicity, check same dept same shift pairs
    // We'll apply LNG logic post all assignments
  });

  // Apply Long Hour logic
  DEPARTMENTS.forEach(dept => {
    ['MOR','AFT'].forEach(shift => {
      const deptStaff = staff.filter(s => s.active && s.dept === dept && s.shift === shift && s.id!=='ADMIN');
      if(deptStaff.length < 2) return;
      for(let d=1; d<=days; d++) {
        const dt = new Date(year, month, d);
        if(dt.getDay() === 0) continue;
        const date = isoDate(dt);
        const presentStaff = deptStaff.filter(s => roster[s.id] && roster[s.id][date] !== 'OFF');
        const offStaff = deptStaff.filter(s => roster[s.id] && roster[s.id][date] === 'OFF');
        // If exactly one partner is off and only one remains, they get LNG
        if(presentStaff.length === 1 && offStaff.length >= 1) {
          // Check if applying LNG doesn't exceed 1 LNG per shift per dept per day (it's already 1 here)
          roster[presentStaff[0].id][date] = 'LNG';
        }
      }
    });
  });

  return roster;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  app: { minHeight:'100vh', background:T.grayLight, fontFamily:"'Nunito', sans-serif" },

  // Header
  header: { background:`linear-gradient(135deg, ${T.blue} 0%, ${T.blueMid} 100%)`, padding:'0', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 12px rgba(0,0,0,0.2)' },
  headerTop: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px 8px' },
  logoArea: { display:'flex', alignItems:'center', gap:10 },
  logoIcon: { width:38, height:38, background:T.yellow, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 },
  logoText: { display:'flex', flexDirection:'column' },
  logoTitle: { fontFamily:"'Barlow Condensed', sans-serif", fontWeight:800, fontSize:18, color:T.white, lineHeight:1.1, letterSpacing:0.5 },
  logoSub: { fontSize:9, color:'rgba(255,255,255,0.6)', letterSpacing:2, textTransform:'uppercase', marginTop:1 },
  headerRight: { display:'flex', alignItems:'center', gap:8 },

  // Nav Tabs
  navTabs: { display:'flex', borderTop:'1px solid rgba(255,255,255,0.1)', overflowX:'auto' },
  navTab: (active) => ({
    flex: '0 0 auto',
    padding:'10px 16px',
    fontSize:12,
    fontWeight: active ? 800 : 600,
    color: active ? T.yellow : 'rgba(255,255,255,0.6)',
    background: active ? 'rgba(245,166,35,0.15)' : 'transparent',
    borderBottom: active ? `2px solid ${T.yellow}` : '2px solid transparent',
    cursor:'pointer',
    whiteSpace:'nowrap',
    transition:'all 0.2s',
    letterSpacing:0.3,
  }),

  // Cards
  card: { background:T.white, borderRadius:14, padding:16, marginBottom:12, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' },
  cardTitle: { fontSize:12, fontWeight:700, color:T.gray, textTransform:'uppercase', letterSpacing:1, marginBottom:10 },

  // Staff row
  staffRow: { display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${T.border}` },
  avatar: (id) => ({
    width:42, height:42, borderRadius:12, background:avatarColor(id),
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:13, fontWeight:800, color:T.white, flexShrink:0,
  }),
  staffInfo: { flex:1, minWidth:0 },
  staffName: { fontSize:14, fontWeight:700, color:T.dark, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  staffMeta: { fontSize:11, color:T.gray, marginTop:1 },

  // Shift badge
  shiftBadge: (type) => ({
    padding:'3px 8px', borderRadius:6, fontSize:11, fontWeight:700,
    background: SHIFT_COLORS[type]?.bg || '#F3F4F6',
    color: SHIFT_COLORS[type]?.text || T.gray,
    border: `1px solid ${SHIFT_COLORS[type]?.border || '#9CA3AF'}`,
    minWidth:36, textAlign:'center', flexShrink:0,
  }),

  // Dept badge
  deptBadge: (dept) => {
    const deptColors = { Cashier:[T.yellowLight,'#B87E00'], Groceries:['#E8F5E9','#1D6F42'], Drinks:['#E3F2FD','#1565C0'], Toiletries:['#FCE4EC','#880E4F'], Household:['#F3E5F5','#6A1B9A'], Electronics:['#FFF8E1','#F57F17'], Backstore:['#EFEBE9','#4E342E'], Merchandisers:['#E0F2F1','#00695C'] };
    const [bg, text] = deptColors[dept] || ['#F3F4F6',T.gray];
    return { padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700, background:bg, color:text, display:'inline-block' };
  },

  // Buttons
  btn: (variant='primary') => {
    const variants = {
      primary: { background:`linear-gradient(135deg, ${T.yellow}, ${T.yellowDark})`, color:T.dark, border:'none' },
      secondary: { background:T.blueLight, color:T.blue, border:'none' },
      danger: { background:T.redLight, color:T.red, border:'none' },
      ghost: { background:'transparent', color:T.blue, border:`1px solid ${T.border}` },
      success: { background:'#E8F5E9', color:T.green, border:'none' },
    };
    return { ...variants[variant], padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, transition:'all 0.15s' };
  },

  btnSm: (variant='primary') => {
    const base = { padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', border:'none' };
    if(variant==='primary') return {...base, background:T.yellow, color:T.dark};
    if(variant==='danger') return {...base, background:T.redLight, color:T.red};
    return {...base, background:T.blueLight, color:T.blue};
  },

  // Forms
  input: { width:'100%', padding:'11px 14px', borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"'Nunito', sans-serif", outline:'none', background:T.white, color:T.dark, marginBottom:12 },
  label: { fontSize:12, fontWeight:700, color:T.gray, textTransform:'uppercase', letterSpacing:0.8, display:'block', marginBottom:5 },
  select: { width:'100%', padding:'11px 14px', borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"'Nunito', sans-serif", background:T.white, color:T.dark, marginBottom:12, outline:'none' },

  // Modal
  modalOverlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'flex-end', justifyContent:'center' },
  modal: { background:T.white, borderRadius:'20px 20px 0 0', padding:20, width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto', animation:'slideUp 0.25s ease' },
  modalHandle: { width:40, height:4, background:T.border, borderRadius:4, margin:'0 auto 16px', display:'block' },

  // Page
  page: { padding:'12px 14px', paddingBottom:80 },
  pageHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 },
  pageTitle: { fontSize:20, fontWeight:900, color:T.dark, fontFamily:"'Barlow Condensed', sans-serif", letterSpacing:0.5 },

  // Status strip
  statusStrip: { background:`linear-gradient(135deg, ${T.yellow}, ${T.yellowDark})`, padding:'10px 16px', display:'flex', alignItems:'center', gap:10, marginBottom:0 },

  // Day column for roster
  dayCol: { flexShrink:0, textAlign:'center', width:52 },
  dayLabel: { fontSize:10, fontWeight:700, color:T.gray, textTransform:'uppercase' },
  dayNum: { fontSize:16, fontWeight:900, color:T.dark },

  // Bottom nav
  bottomNav: { position:'fixed', bottom:0, left:0, right:0, background:T.white, borderTop:`1px solid ${T.border}`, display:'flex', zIndex:90, boxShadow:'0 -2px 12px rgba(0,0,0,0.08)' },
  bottomNavItem: (active) => ({ flex:1, padding:'10px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer', background: active ? T.yellowLight : 'transparent', transition:'all 0.2s' }),
  bottomNavIcon: { fontSize:20 },
  bottomNavLabel: (active) => ({ fontSize:10, fontWeight: active ? 800 : 600, color: active ? T.yellowDark : T.gray }),
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ShiftBadge({ type }) {
  return <span style={S.shiftBadge(type)}>{type}</span>;
}

function Avatar({ staff }) {
  return <div style={S.avatar(staff.id)}>{getInitials(staff.name)}</div>;
}

function Modal({ show, onClose, title, children }) {
  if (!show) return null;
  return (
    <div style={S.modalOverlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={S.modal}>
        <span style={S.modalHandle} />
        {title && <h3 style={{fontSize:18,fontWeight:900,color:T.dark,marginBottom:16}}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color=T.yellow }) {
  return (
    <div style={{...S.card, display:'flex', alignItems:'center', gap:12, padding:'12px 14px', marginBottom:8}}>
      <div style={{width:44,height:44,borderRadius:12,background:color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{icon}</div>
      <div>
        <div style={{fontSize:22,fontWeight:900,color:T.dark,lineHeight:1}}>{value}</div>
        <div style={{fontSize:12,color:T.gray,fontWeight:600,marginTop:2}}>{label}</div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ staff, onLogin }) {
  const [id, setId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const upper = id.trim().toUpperCase();
      const user = staff.find(s => s.id === upper);
      if (!user) { setError('Staff ID not found.'); setLoading(false); return; }
      if (!user.active) { setError('Account is deactivated.'); setLoading(false); return; }
      if (user.pin !== pin) { setError('Incorrect PIN.'); setLoading(false); return; }
      onLogin(user);
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{minHeight:'100vh', background:`linear-gradient(160deg, ${T.blue} 0%, ${T.blueMid} 50%, ${T.dark} 100%)`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24}}>
      <style>{`@keyframes slideUp { from { transform:translateY(40px); opacity:0 } to { transform:translateY(0); opacity:1 } }`}</style>
      {/* Logo */}
      <div style={{textAlign:'center', marginBottom:40, animation:'slideUp 0.4s ease'}}>
        <div style={{width:80,height:80,background:T.yellow,borderRadius:24,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,margin:'0 auto 16px',boxShadow:'0 8px 32px rgba(245,166,35,0.4)'}}>🛒</div>
        <div style={{fontFamily:"'Barlow Condensed', sans-serif",fontWeight:900,fontSize:28,color:T.white,letterSpacing:1}}>JUSTRITE SUPERSTORE</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.5)',letterSpacing:3,textTransform:'uppercase',marginTop:4}}>Ile-Ife · Staff Portal</div>
      </div>

      {/* Card */}
      <div style={{width:'100%',maxWidth:360,background:'rgba(255,255,255,0.07)',backdropFilter:'blur(20px)',borderRadius:20,padding:24,border:'1px solid rgba(255,255,255,0.12)', animation:'slideUp 0.5s ease 0.1s both'}}>
        <div style={{fontSize:14,fontWeight:700,color:'rgba(255,255,255,0.7)',marginBottom:20,textAlign:'center'}}>Sign in to your workspace</div>

        <label style={{...S.label, color:'rgba(255,255,255,0.6)'}}>Staff ID</label>
        <input
          value={id}
          onChange={e=>setId(e.target.value)}
          placeholder="e.g. S001"
          style={{...S.input, background:'rgba(255,255,255,0.1)', border:'1.5px solid rgba(255,255,255,0.2)', color:T.white, marginBottom:14}}
          onKeyDown={e=>e.key==='Enter' && handleLogin()}
        />

        <label style={{...S.label, color:'rgba(255,255,255,0.6)'}}>PIN</label>
        <input
          value={pin}
          onChange={e=>setPin(e.target.value)}
          placeholder="4-digit PIN"
          type="password"
          maxLength={4}
          style={{...S.input, background:'rgba(255,255,255,0.1)', border:'1.5px solid rgba(255,255,255,0.2)', color:T.white, marginBottom:14}}
          onKeyDown={e=>e.key==='Enter' && handleLogin()}
        />

        {error && <div style={{background:T.redLight,color:T.red,padding:'8px 12px',borderRadius:8,fontSize:13,fontWeight:600,marginBottom:12}}>{error}</div>}

        <button onClick={handleLogin} disabled={loading} style={{...S.btn('primary'), width:'100%', justifyContent:'center', padding:'13px', fontSize:15, opacity:loading?0.7:1}}>
          {loading ? '⏳ Signing in...' : '🔐 Sign In'}
        </button>

        <div style={{textAlign:'center',marginTop:16,fontSize:11,color:'rgba(255,255,255,0.4)'}}>Default PIN is 1234 • Change under Profile</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ currentUser, staff, roster, assignments, monthKey }) {
  const todayStr = today();
  const myRoster = roster[currentUser.id] || {};
  const todayShift = myRoster[todayStr] || '--';

  // Get current week
  const weekStart = startOfWeek(new Date());
  const weekDates = Array.from({length:7}, (_,i) => isoDate(addDays(weekStart, i)));

  const offCount = Object.values(myRoster).filter(v=>v==='OFF').length;

  // Find partner
  const partner = staff.find(s => s.id !== currentUser.id && s.dept === currentUser.dept && s.shift === currentUser.shift && s.active);

  // My pending assignments
  const myAssignments = assignments.filter(a =>
    a.active && (a.departments.includes(currentUser.dept) || a.departments.includes('All'))
  );

  return (
    <div style={S.page}>
      {/* Welcome banner */}
      <div style={{...S.card, background:`linear-gradient(135deg, ${T.yellow} 0%, ${T.yellowDark} 100%)`, padding:'14px 16px', marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:700,color:'rgba(0,0,0,0.5)',marginBottom:2}}>WELCOME BACK</div>
        <div style={{fontSize:22,fontWeight:900,color:T.dark,fontFamily:"'Barlow Condensed', sans-serif"}}>{currentUser.name}</div>
        <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}>
          <span style={S.deptBadge(currentUser.dept)}>{currentUser.dept}</span>
          <span style={{...S.deptBadge(currentUser.dept), background:T.blueLight, color:T.blue}}>{currentUser.role.toUpperCase()}</span>
          {currentUser.shift !== 'MOR' ? null : <span style={{...S.deptBadge(currentUser.dept), background:'#E8F5E9', color:T.green}}>Morning Shift</span>}
          {currentUser.shift !== 'AFT' ? null : <span style={{...S.deptBadge(currentUser.dept), background:T.blueLight, color:T.blue}}>Afternoon Shift</span>}
        </div>
      </div>

      {/* Today's status */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12}}>
        <div style={{...S.card, textAlign:'center', padding:'12px 8px', marginBottom:0}}>
          <div style={{fontSize:11,fontWeight:700,color:T.gray,marginBottom:4}}>TODAY'S SHIFT</div>
          <ShiftBadge type={todayShift} />
          <div style={{fontSize:10,color:T.gray,marginTop:4}}>{SHIFT_TIMES[todayShift] || '—'}</div>
        </div>
        <div style={{...S.card, textAlign:'center', padding:'12px 8px', marginBottom:0}}>
          <div style={{fontSize:11,fontWeight:700,color:T.gray,marginBottom:4}}>DAYS OFF</div>
          <div style={{fontSize:22,fontWeight:900,color:T.dark}}>{offCount}<span style={{fontSize:12,color:T.gray}}>/6</span></div>
          <div style={{fontSize:10,color:T.gray}}>This Month</div>
        </div>
      </div>

      {/* This week */}
      <div style={S.card}>
        <div style={S.cardTitle}>This Week</div>
        <div style={{display:'flex', gap:6, overflowX:'auto', paddingBottom:4}}>
          {weekDates.map((d, i) => {
            const shift = myRoster[d] || '--';
            const isToday = d === todayStr;
            return (
              <div key={d} style={{flexShrink:0, textAlign:'center', width:50}}>
                <div style={{fontSize:10,fontWeight:700,color:isToday?T.yellowDark:T.gray}}>{weekDays[i]}</div>
                <div style={{fontSize:13,fontWeight:900,color:isToday?T.yellow:T.dark, margin:'2px 0'}}>{new Date(d+'T00:00:00').getDate()}</div>
                <div style={{...S.shiftBadge(shift), padding:'2px 4px', fontSize:10, display:'block'}}>{shift}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Partner */}
      {partner && (
        <div style={S.card}>
          <div style={S.cardTitle}>Your Partner</div>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <Avatar staff={partner} />
            <div>
              <div style={{fontSize:14,fontWeight:700,color:T.dark}}>{partner.name}</div>
              <div style={{fontSize:11,color:T.gray}}>{partner.dept} · {partner.id}</div>
            </div>
            <div style={{marginLeft:'auto'}}>
              <ShiftBadge type={partner.shift} />
            </div>
          </div>
        </div>
      )}

      {/* Assignments */}
      {myAssignments.length > 0 && (
        <div style={S.card}>
          <div style={S.cardTitle}>Active Assignments ({myAssignments.length})</div>
          {myAssignments.slice(0,3).map(a => (
            <div key={a.id} style={{...S.staffRow, paddingLeft:0}}>
              <div style={{width:36,height:36,background:T.yellowLight,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>📋</div>
              <div style={S.staffInfo}>
                <div style={{fontSize:13,fontWeight:700,color:T.dark}}>{a.title}</div>
                <div style={{fontSize:11,color:T.gray}}>{a.steps.filter(s=>s.done).length}/{a.steps.length} steps done</div>
              </div>
              <span style={S.btnSm('secondary')}>{a.steps.filter(s=>s.done).length === a.steps.length ? '✅' : '🔄'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ROSTER VIEW ─────────────────────────────────────────────────────────────
function RosterView({ currentUser, staff, roster, rosterStatus, monthKey, onMonthChange }) {
  const [selectedDept, setSelectedDept] = useState('All');
  const [viewMode, setViewMode] = useState('week'); // week | month
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const todayStr = today();
  const weekStart = startOfWeek(new Date());
  const weekDates = Array.from({length:7}, (_,i) => isoDate(addDays(weekStart, i)));

  const [year, month] = monthKey.split('-').map(Number);
  const days = monthDays(year, month);
  const monthDates = Array.from({length:days}, (_,i) => {
    const d = new Date(year, month, i+1);
    return { date: isoDate(d), dow: d.getDay(), day: i+1 };
  });

  const filteredStaff = staff.filter(s => s.active && s.id !== 'ADMIN' && (selectedDept === 'All' || s.dept === selectedDept));

  const selectedStaff = staff.find(s => s.id === selectedStaffId);
  const selectedRoster = selectedStaff ? (roster[selectedStaff.id] || {}) : {};

  const isAdmin = currentUser.role === 'admin';
  const isSup = currentUser.role === 'supervisor';
  const canViewAll = isAdmin || isSup;

  const displayStaff = canViewAll ? filteredStaff : filteredStaff.filter(s => s.id === currentUser.id || (s.dept === currentUser.dept));

  return (
    <div style={S.page}>
      {/* Status banner */}
      {rosterStatus && (
        <div style={{background: rosterStatus==='published'?T.green:rosterStatus==='approved'?T.blueMid:T.yellowDark, color:T.white, padding:'8px 14px', borderRadius:10, marginBottom:12, fontSize:12, fontWeight:700}}>
          {rosterStatus==='published' ? '✅ Roster Published & Active' : rosterStatus==='approved' ? '✅ Roster Approved – Pending Publish' : '📋 Roster Draft'}
        </div>
      )}

      {/* Controls */}
      <div style={{display:'flex', gap:8, marginBottom:12, overflowX:'auto'}}>
        <button onClick={()=>setViewMode('week')} style={{...S.btnSm(viewMode==='week'?'primary':'ghost'), flexShrink:0}}>Week</button>
        <button onClick={()=>setViewMode('month')} style={{...S.btnSm(viewMode==='month'?'primary':'ghost'), flexShrink:0}}>Month</button>
        <div style={{flex:1}} />
        <select value={selectedDept} onChange={e=>setSelectedDept(e.target.value)} style={{...S.select, marginBottom:0, padding:'6px 10px', fontSize:12, width:'auto', flexShrink:0}}>
          <option value="All">All Depts</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Month navigator */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
        <button onClick={()=>onMonthChange(-1)} style={S.btnSm('ghost')}>◀</button>
        <div style={{fontSize:16,fontWeight:800,color:T.dark}}>
          {new Date(year, month, 1).toLocaleDateString('en-NG',{month:'long', year:'numeric'})}
        </div>
        <button onClick={()=>onMonthChange(1)} style={S.btnSm('ghost')}>▶</button>
      </div>

      {/* Staff roster rows */}
      {displayStaff.map(s => {
        const r = roster[s.id] || {};
        const dates = viewMode === 'week' ? weekDates : monthDates.map(d=>d.date);
        return (
          <div key={s.id} style={{...S.card, padding:'10px 12px', marginBottom:8}} onClick={()=>setSelectedStaffId(s.id)}>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
              <Avatar staff={s} />
              <div style={S.staffInfo}>
                <div style={S.staffName}>{s.name}</div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  <span style={S.deptBadge(s.dept)}>{s.dept}</span>
                  {s.role==='supervisor' && <span style={{...S.deptBadge(s.dept),background:T.blueLight,color:T.blue}}>SUP</span>}
                </div>
              </div>
              <div style={{fontSize:10,color:T.gray,textAlign:'right'}}>
                <div style={{fontWeight:700}}>OFF</div>
                <div style={{fontSize:14,fontWeight:900,color:T.dark}}>{Object.values(r).filter(v=>v==='OFF').length}/6</div>
              </div>
            </div>
            <div style={{display:'flex', gap:4, overflowX:'auto', paddingBottom:2}}>
              {dates.slice(0, viewMode==='week'?7:31).map((d,i) => {
                const shift = r[d];
                if(!shift) return null;
                const isToday = d===todayStr;
                return (
                  <div key={d} style={{flexShrink:0, textAlign:'center', minWidth:36}}>
                    {viewMode==='week' && <div style={{fontSize:9,color:isToday?T.yellowDark:T.gray,fontWeight:700}}>{weekDays[i]}</div>}
                    {viewMode==='week' && <div style={{fontSize:11,fontWeight:800,color:isToday?T.yellow:T.dark}}>{new Date(d+'T00:00:00').getDate()}</div>}
                    <div style={{...S.shiftBadge(shift), padding:'2px 5px', fontSize:10, display:'block'}}>{shift}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Staff detail modal */}
      <Modal show={!!selectedStaff} onClose={()=>setSelectedStaffId(null)} title={selectedStaff?.name}>
        {selectedStaff && (
          <div>
            <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
              <span style={S.deptBadge(selectedStaff.dept)}>{selectedStaff.dept}</span>
              <ShiftBadge type={selectedStaff.shift} />
              <span style={{...S.deptBadge(selectedStaff.dept),background:T.blueLight,color:T.blue}}>{selectedStaff.id}</span>
            </div>
            <div style={S.cardTitle}>Monthly Schedule</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4}}>
              {['M','T','W','T','F','S','S'].map((d,i) => <div key={i} style={{textAlign:'center',fontSize:10,fontWeight:700,color:T.gray}}>{d}</div>)}
              {/* Offset for first day */}
              {Array.from({length: (new Date(year,month,1).getDay()+6)%7}).map((_,i) => <div key={'e'+i} />)}
              {monthDates.map(({date,day}) => {
                const shift = selectedRoster[date] || '--';
                const sc = SHIFT_COLORS[shift];
                return (
                  <div key={date} style={{textAlign:'center', padding:'3px 2px', borderRadius:6, background:sc?.bg||'#F3F4F6', border:`1px solid ${sc?.border||T.border}`}}>
                    <div style={{fontSize:9,fontWeight:700,color:sc?.text||T.gray}}>{day}</div>
                    <div style={{fontSize:8,fontWeight:800,color:sc?.text||T.gray}}>{shift}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── DIRECTORY ────────────────────────────────────────────────────────────────
function Directory({ currentUser, staff, onUpdateStaff, onAddStaff, onDeactivate }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [form, setForm] = useState({ name:'', dept:'Cashier', shift:'MOR', role:'staff', id:'' });

  const isAdmin = currentUser.role === 'admin';
  const isSup = currentUser.role === 'supervisor';

  const filtered = staff.filter(s =>
    s.id !== 'ADMIN' &&
    (search==='' || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())) &&
    (deptFilter==='All' || s.dept===deptFilter)
  );

  const startAdd = () => { setForm({name:'',dept:'Cashier',shift:'MOR',role:'staff',id:''}); setEditStaff(null); setShowAdd(true); };
  const startEdit = (s) => { setForm({name:s.name,dept:s.dept,shift:s.shift,role:s.role,id:s.id}); setEditStaff(s); setShowAdd(true); };

  const handleSave = () => {
    if(!form.name.trim()) return;
    if(editStaff) {
      onUpdateStaff({...editStaff, ...form});
    } else {
      const newId = form.id.trim().toUpperCase() || 'S'+String(Date.now()).slice(-4);
      onAddStaff({...form, id:newId, active:true, pin:'1234'});
    }
    setShowAdd(false);
  };

  return (
    <div style={S.page}>
      {/* Search + filter */}
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search staff..." style={{...S.input, marginBottom:0, flex:1}} />
        {(isAdmin||isSup) && <button onClick={startAdd} style={S.btn('primary')}>+</button>}
      </div>
      <div style={{display:'flex',gap:6,overflowX:'auto',marginBottom:12,paddingBottom:4}}>
        {['All',...DEPARTMENTS].map(d => (
          <button key={d} onClick={()=>setDeptFilter(d)} style={{...S.btnSm(deptFilter===d?'primary':'ghost'), flexShrink:0, fontSize:11}}>{d}</button>
        ))}
      </div>

      {/* Count */}
      <div style={{fontSize:12,color:T.gray,marginBottom:8,fontWeight:600}}>{filtered.filter(s=>s.active).length} active · {filtered.filter(s=>!s.active).length} inactive</div>

      {/* Staff list */}
      {filtered.map(s => (
        <div key={s.id} style={{...S.card, padding:'12px 14px', marginBottom:8, opacity:s.active?1:0.5}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Avatar staff={s} />
            <div style={S.staffInfo}>
              <div style={S.staffName}>{s.name} {!s.active && <span style={{fontSize:10,color:T.red,fontWeight:700}}>INACTIVE</span>}</div>
              <div style={{display:'flex',gap:4,marginTop:3,flexWrap:'wrap'}}>
                <span style={S.deptBadge(s.dept)}>{s.dept}</span>
                <ShiftBadge type={s.shift} />
                {s.role==='supervisor' && <span style={{...S.deptBadge(s.dept),background:T.blueLight,color:T.blue}}>SUP</span>}
                <span style={{fontSize:10,color:T.gray,padding:'2px 6px',background:T.grayLight,borderRadius:20,fontWeight:600}}>{s.id}</span>
              </div>
            </div>
            {(isAdmin || isSup) && (
              <div style={{display:'flex',gap:4,flexShrink:0}}>
                <button onClick={()=>startEdit(s)} style={S.btnSm('secondary')}>✏️</button>
                {isAdmin && <button onClick={()=>onDeactivate(s.id)} style={S.btnSm('danger')}>{s.active?'🚫':'✅'}</button>}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add/Edit Modal */}
      <Modal show={showAdd} onClose={()=>setShowAdd(false)} title={editStaff?'Edit Staff':'Add Staff'}>
        {!editStaff && (
          <>
            <label style={S.label}>Staff ID (optional)</label>
            <input value={form.id} onChange={e=>setForm(f=>({...f,id:e.target.value}))} placeholder="e.g. S045" style={S.input} />
          </>
        )}
        <label style={S.label}>Full Name</label>
        <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full Name" style={S.input} />
        <label style={S.label}>Department</label>
        <select value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value}))} style={S.select}>
          {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
        </select>
        <label style={S.label}>Shift</label>
        <select value={form.shift} onChange={e=>setForm(f=>({...f,shift:e.target.value}))} style={S.select}>
          <option value="MOR">Morning (7:30AM–3:00PM)</option>
          <option value="AFT">Afternoon (1:30PM–9:00PM)</option>
        </select>
        <label style={S.label}>Role</label>
        <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={S.select}>
          <option value="staff">Staff</option>
          <option value="supervisor">Supervisor</option>
          {currentUser.role==='admin' && <option value="admin">Admin</option>}
        </select>
        <div style={{display:'flex',gap:8}}>
          <button onClick={handleSave} style={{...S.btn('primary'),flex:1,justifyContent:'center'}}>💾 Save</button>
          <button onClick={()=>setShowAdd(false)} style={{...S.btn('ghost'),flex:1,justifyContent:'center'}}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── ASSIGNMENTS ──────────────────────────────────────────────────────────────
function Assignments({ currentUser, staff, assignments, onUpdateAssignments }) {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAssign, setSelectedAssign] = useState(null);
  const [comment, setComment] = useState('');
  const [form, setForm] = useState({ title:'', description:'', departments:['All'], steps:[''] });
  const [tab, setTab] = useState('active');

  const isAdmin = currentUser.role === 'admin';
  const isSup = currentUser.role === 'supervisor';
  const canCreate = isAdmin || isSup;

  const myDeptAssignments = assignments.filter(a =>
    a.active && (a.departments.includes('All') || a.departments.includes(currentUser.dept))
  );

  const handleCreate = () => {
    const steps = form.steps.filter(s=>s.trim()).map((s,i) => ({id:i, text:s, done:false, completedBy:null, completedAt:null}));
    if(!form.title.trim() || steps.length===0) return;
    const newA = {
      id: 'A'+Date.now(),
      title: form.title,
      description: form.description,
      departments: form.departments,
      steps,
      comments: [],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      active: true,
    };
    onUpdateAssignments([...assignments, newA]);
    setShowCreate(false);
    setForm({title:'',description:'',departments:['All'],steps:['']});
  };

  const handleStepComplete = (assignId, stepIdx) => {
    onUpdateAssignments(assignments.map(a => {
      if(a.id !== assignId) return a;
      // Only allow completing in order
      if(stepIdx > 0 && !a.steps[stepIdx-1]?.done) return a;
      const steps = a.steps.map((s,i) => i===stepIdx ? {...s, done:true, completedBy:currentUser.name, completedAt:new Date().toISOString()} : s);
      return {...a, steps};
    }));
  };

  const handleComment = (assignId) => {
    if(!comment.trim()) return;
    onUpdateAssignments(assignments.map(a => {
      if(a.id !== assignId) return a;
      return {...a, comments:[...a.comments, {text:comment, by:currentUser.name, at:new Date().toISOString()}]};
    }));
    setComment('');
  };

  const handleArchive = (assignId) => {
    onUpdateAssignments(assignments.map(a => a.id===assignId ? {...a, active:false} : a));
  };

  const activeAssign = assignments.filter(a=>a.active);
  const archivedAssign = assignments.filter(a=>!a.active);
  const displayList = tab==='active' ? activeAssign : archivedAssign;

  return (
    <div style={S.page}>
      <div style={{display:'flex',gap:8,marginBottom:14}}>
        <button onClick={()=>setTab('active')} style={S.btnSm(tab==='active'?'primary':'ghost')}>Active ({activeAssign.length})</button>
        <button onClick={()=>setTab('archived')} style={S.btnSm(tab==='archived'?'primary':'ghost')}>Archived ({archivedAssign.length})</button>
        <div style={{flex:1}}/>
        {canCreate && <button onClick={()=>setShowCreate(true)} style={S.btn('primary')}>+ New</button>}
      </div>

      {displayList.length === 0 && (
        <div style={{...S.card, textAlign:'center', padding:32, color:T.gray}}>
          <div style={{fontSize:36,marginBottom:8}}>📋</div>
          <div style={{fontSize:14,fontWeight:700}}>No {tab} assignments</div>
        </div>
      )}

      {displayList.map(a => {
        const doneCount = a.steps.filter(s=>s.done).length;
        const pct = Math.round(doneCount/a.steps.length*100);
        const creatorName = staff.find(s=>s.id===a.createdBy)?.name || a.createdBy;
        return (
          <div key={a.id} style={{...S.card, marginBottom:10}} onClick={()=>setSelectedAssign(a)}>
            <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
              <div style={{width:40,height:40,borderRadius:12,background:T.yellowLight,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>📋</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:800,color:T.dark}}>{a.title}</div>
                <div style={{fontSize:11,color:T.gray,marginTop:2}}>{a.departments.join(', ')} · by {creatorName}</div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
                  <div style={{flex:1,height:6,background:T.border,borderRadius:4,overflow:'hidden'}}>
                    <div style={{width:`${pct}%`,height:'100%',background:pct===100?T.green:T.yellow,borderRadius:4,transition:'width 0.3s'}} />
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:pct===100?T.green:T.gray}}>{doneCount}/{a.steps.length}</div>
                </div>
              </div>
              {pct===100 && <span style={{fontSize:20}}>✅</span>}
            </div>
          </div>
        );
      })}

      {/* Assignment detail modal */}
      {selectedAssign && (
        <Modal show={!!selectedAssign} onClose={()=>setSelectedAssign(null)} title={selectedAssign.title}>
          {selectedAssign.description && <p style={{fontSize:13,color:T.gray,marginBottom:14}}>{selectedAssign.description}</p>}

          <div style={S.cardTitle}>Steps</div>
          {selectedAssign.steps.map((step, idx) => {
            const locked = idx > 0 && !selectedAssign.steps[idx-1]?.done;
            return (
              <div key={idx} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:10,opacity:locked?0.4:1}}>
                <button
                  disabled={locked || step.done}
                  onClick={e=>{e.stopPropagation(); handleStepComplete(selectedAssign.id, idx);}}
                  style={{width:28,height:28,borderRadius:8,border:`2px solid ${step.done?T.green:T.border}`,background:step.done?T.green:'transparent',color:T.white,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,cursor:locked?'not-allowed':'pointer',fontSize:14}}
                >{step.done?'✓':idx+1}</button>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:step.done?T.green:locked?T.gray:T.dark, textDecoration:step.done?'line-through':'none'}}>{step.text}</div>
                  {step.done && <div style={{fontSize:10,color:T.gray}}>✓ {step.completedBy} · {new Date(step.completedAt).toLocaleString('en-NG',{dateStyle:'short',timeStyle:'short'})}</div>}
                  {locked && <div style={{fontSize:10,color:T.red}}>🔒 Complete step {idx} first</div>}
                </div>
              </div>
            );
          })}

          <div style={{marginTop:16}}>
            <div style={S.cardTitle}>Comments ({selectedAssign.comments.length})</div>
            {selectedAssign.comments.map((c,i) => (
              <div key={i} style={{background:T.grayLight,borderRadius:8,padding:'8px 10px',marginBottom:6}}>
                <div style={{fontSize:11,fontWeight:700,color:T.blue}}>{c.by}</div>
                <div style={{fontSize:13,color:T.dark,marginTop:2}}>{c.text}</div>
                <div style={{fontSize:10,color:T.gray,marginTop:2}}>{new Date(c.at).toLocaleString('en-NG',{dateStyle:'short',timeStyle:'short'})}</div>
              </div>
            ))}
            <div style={{display:'flex',gap:6,marginTop:8}}>
              <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add comment..." style={{...S.input,marginBottom:0,flex:1}} onKeyDown={e=>e.key==='Enter'&&handleComment(selectedAssign.id)} />
              <button onClick={()=>handleComment(selectedAssign.id)} style={S.btnSm('primary')}>Send</button>
            </div>
          </div>

          {canCreate && selectedAssign.active && (
            <button onClick={()=>{handleArchive(selectedAssign.id); setSelectedAssign(null);}} style={{...S.btn('danger'),marginTop:12,width:'100%',justifyContent:'center'}}>Archive Assignment</button>
          )}
        </Modal>
      )}

      {/* Create modal */}
      <Modal show={showCreate} onClose={()=>setShowCreate(false)} title="New Assignment">
        <label style={S.label}>Title</label>
        <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Assignment title" style={S.input} />

        <label style={S.label}>Description</label>
        <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Optional description" style={S.input} />

        <label style={S.label}>Departments</label>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
          {['All',...DEPARTMENTS].map(d => (
            <button key={d} onClick={()=>setForm(f=>({...f, departments: f.departments.includes(d) ? f.departments.filter(x=>x!==d) : [...f.departments, d]}))}
              style={{...S.btnSm(form.departments.includes(d)?'primary':'ghost'), fontSize:11}}>
              {d}
            </button>
          ))}
        </div>

        <label style={S.label}>Steps (in order)</label>
        {form.steps.map((s,i) => (
          <div key={i} style={{display:'flex',gap:6,marginBottom:6}}>
            <input value={s} onChange={e=>{const ss=[...form.steps]; ss[i]=e.target.value; setForm(f=>({...f,steps:ss}));}} placeholder={`Step ${i+1}`} style={{...S.input,marginBottom:0,flex:1}} />
            {form.steps.length>1 && <button onClick={()=>setForm(f=>({...f,steps:f.steps.filter((_,j)=>j!==i)}))} style={S.btnSm('danger')}>✕</button>}
          </div>
        ))}
        <button onClick={()=>setForm(f=>({...f,steps:[...f.steps,'']}))} style={{...S.btn('ghost'), marginBottom:14, width:'100%', justifyContent:'center'}}>+ Add Step</button>

        <div style={{display:'flex',gap:8}}>
          <button onClick={handleCreate} style={{...S.btn('primary'),flex:1,justifyContent:'center'}}>Create</button>
          <button onClick={()=>setShowCreate(false)} style={{...S.btn('ghost'),flex:1,justifyContent:'center'}}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── SHARE & NOTIFY ────────────────────────────────────────────────────────────
function ShareNotify({ staff, roster, monthKey, rosterStatus, onApprove, onPublish, currentUser }) {
  const [copyMsg, setCopyMsg] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [pwAction, setPwAction] = useState(null);
  const [pwError, setPwError] = useState('');

  const isAdmin = currentUser.role === 'admin';
  const [year, month] = monthKey.split('-').map(Number);
  const monthName = new Date(year, month, 1).toLocaleDateString('en-NG',{month:'long', year:'numeric'});

  const generateMessage = (s) => {
    const r = roster[s.id] || {};
    const days = Object.entries(r).sort((a,b)=>a[0].localeCompare(b[0]));
    const lines = days.map(([date, shift]) => `${fmtDate(date)}: ${SHIFT_LABELS[shift]||shift}`).join('\n');
    return `Hello ${s.name}! 👋\nHere is your *Justrite Superstore* roster for *${monthName}*:\n\n${lines}\n\n_Dept: ${s.dept} | Shift: ${SHIFT_LABELS[s.shift]}_\n_Justrite Ile-Ife Roster System_`;
  };

  const handleCopyAll = () => {
    const all = staff.filter(s=>s.active && s.id!=='ADMIN').map(s=>generateMessage(s)).join('\n\n---\n\n');
    navigator.clipboard.writeText(all).then(()=>{ setCopyMsg('Copied!'); setTimeout(()=>setCopyMsg(''),2000); });
  };

  const handleShare = (s) => {
    const msg = generateMessage(s);
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,'_blank');
  };

  const handlePwSubmit = () => {
    if(adminPw !== 'justrt2024') { setPwError('Incorrect password'); return; }
    if(pwAction==='approve') onApprove();
    if(pwAction==='publish') onPublish();
    setAdminPw(''); setPwAction(null); setPwError('');
  };

  return (
    <div style={S.page}>
      {/* Roster status */}
      <div style={S.card}>
        <div style={S.cardTitle}>Roster Status</div>
        <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:14, flexWrap:'wrap'}}>
          {['draft','approved','published'].map(st => (
            <div key={st} style={{display:'flex',alignItems:'center',gap:6, padding:'6px 12px', borderRadius:8, background: rosterStatus===st?T.yellowLight:T.grayLight, border:`1.5px solid ${rosterStatus===st?T.yellow:T.border}`}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:rosterStatus===st?(st==='published'?T.green:T.yellow):'#D1D5DB'}} />
              <span style={{fontSize:12,fontWeight:700,color:rosterStatus===st?T.yellowDark:T.gray,textTransform:'capitalize'}}>{st}</span>
            </div>
          ))}
        </div>

        {isAdmin && (
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {rosterStatus==='draft' && <button onClick={()=>setPwAction('approve')} style={S.btn('secondary')}>✅ Approve Roster</button>}
            {rosterStatus==='approved' && <button onClick={()=>setPwAction('publish')} style={S.btn('primary')}>📢 Publish Roster</button>}
            {rosterStatus==='published' && <button onClick={()=>setPwAction('approve')} style={S.btn('ghost')}>🔓 Unlock (Re-approve)</button>}
          </div>
        )}
      </div>

      {/* Share section */}
      <div style={S.card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <div style={S.cardTitle}>WhatsApp Share</div>
          <button onClick={handleCopyAll} style={S.btnSm('primary')}>{copyMsg||'📋 Copy All'}</button>
        </div>
        {staff.filter(s=>s.active&&s.id!=='ADMIN').map(s => (
          <div key={s.id} style={{...S.staffRow, paddingLeft:0}}>
            <Avatar staff={s} />
            <div style={S.staffInfo}>
              <div style={S.staffName}>{s.name}</div>
              <div style={S.staffMeta}>{s.dept}</div>
            </div>
            <button onClick={()=>handleShare(s)} style={S.btnSm('success')}>📱 Send</button>
          </div>
        ))}
      </div>

      {/* ICS Export */}
      <div style={S.card}>
        <div style={S.cardTitle}>Calendar Export</div>
        <div style={{fontSize:13,color:T.gray,marginBottom:10}}>Export your schedule to Apple Calendar, Google Calendar, or Outlook.</div>
        <ICSExport staff={staff.find(s=>s.id===currentUser.id)} roster={roster[currentUser.id]||{}} monthKey={monthKey} />
      </div>

      {/* Password modal */}
      <Modal show={!!pwAction} onClose={()=>{setPwAction(null);setPwError('');setAdminPw('');}}>
        <div style={{textAlign:'center',marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:8}}>🔐</div>
          <div style={{fontSize:16,fontWeight:800,color:T.dark}}>Admin Password Required</div>
          <div style={{fontSize:12,color:T.gray,marginTop:4}}>To {pwAction} this roster</div>
        </div>
        <input value={adminPw} onChange={e=>setAdminPw(e.target.value)} type="password" placeholder="Enter admin password" style={S.input} onKeyDown={e=>e.key==='Enter'&&handlePwSubmit()} />
        {pwError && <div style={{color:T.red,fontSize:12,marginBottom:8,fontWeight:600}}>{pwError}</div>}
        <button onClick={handlePwSubmit} style={{...S.btn('primary'),width:'100%',justifyContent:'center'}}>Confirm</button>
      </Modal>
    </div>
  );
}

// ICS Export
function ICSExport({ staff, roster, monthKey }) {
  if(!staff) return null;
  const [year, month] = monthKey.split('-').map(Number);

  const makeICS = (entries) => {
    const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Justrite Roster//EN','CALSCALE:GREGORIAN'];
    entries.forEach(({ date, shift }) => {
      if(!shift || shift==='OFF') return;
      const [y,m,d] = date.split('-');
      const times = { MOR:'073000', AFT:'133000', SUN:'093000', LNG:'100000' };
      const endTimes = { MOR:'150000', AFT:'210000', SUN:'213000', LNG:'220000' };
      lines.push('BEGIN:VEVENT',
        `DTSTART:${y}${m}${d}T${times[shift]||'080000'}`,
        `DTEND:${y}${m}${d}T${endTimes[shift]||'160000'}`,
        `SUMMARY:${SHIFT_LABELS[shift]||shift} – Justrite Superstore`,
        `DESCRIPTION:${SHIFT_TIMES[shift]||''} | ${staff.dept}`,
        `LOCATION:Justrite Superstore, Ile-Ife`,
        'BEGIN:VALARM','TRIGGER:-PT30M','ACTION:DISPLAY','DESCRIPTION:Shift Reminder','END:VALARM',
        'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  };

  const downloadICS = (content, filename) => {
    const blob = new Blob([content], {type:'text/calendar'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportMonth = () => {
    const entries = Object.entries(roster).filter(([d]) => d.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).map(([date,shift])=>({date,shift}));
    downloadICS(makeICS(entries), `justrite-roster-${monthKey}.ics`);
  };

  const exportWeek = () => {
    const ws = startOfWeek(new Date());
    const weekDates = Array.from({length:7},(_,i)=>isoDate(addDays(ws,i)));
    const entries = weekDates.map(d=>({date:d, shift:roster[d]})).filter(e=>e.shift);
    downloadICS(makeICS(entries), `justrite-week-${isoDate(ws)}.ics`);
  };

  return (
    <div style={{display:'flex',gap:8}}>
      <button onClick={exportWeek} style={{...S.btn('secondary'),flex:1,justifyContent:'center'}}>📅 This Week</button>
      <button onClick={exportMonth} style={{...S.btn('secondary'),flex:1,justifyContent:'center'}}>📆 Full Month</button>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({ currentUser, staff, onUpdateUser, onLogout }) {
  const [editPin, setEditPin] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(currentUser.name);

  const myRoster = staff.find(s=>s.id===currentUser.id);
  const offCount = 0; // would come from roster

  const handleChangePin = () => {
    if(oldPin !== currentUser.pin) { setPinMsg('❌ Current PIN is wrong'); return; }
    if(newPin.length !== 4 || isNaN(newPin)) { setPinMsg('❌ PIN must be 4 digits'); return; }
    if(newPin !== confirmPin) { setPinMsg('❌ PINs do not match'); return; }
    onUpdateUser({...currentUser, pin:newPin});
    setEditPin(false); setOldPin(''); setNewPin(''); setConfirmPin('');
    setPinMsg('✅ PIN changed successfully');
    setTimeout(()=>setPinMsg(''),3000);
  };

  return (
    <div style={S.page}>
      {/* Profile card */}
      <div style={{...S.card, textAlign:'center', padding:24, background:`linear-gradient(135deg, ${T.blue}, ${T.blueMid})`}}>
        <div style={{...S.avatar(currentUser.id), width:70, height:70, fontSize:24, margin:'0 auto 12px', borderRadius:18, boxShadow:'0 4px 16px rgba(0,0,0,0.2)'}}>{getInitials(currentUser.name)}</div>
        <div style={{fontSize:22, fontWeight:900, color:T.white, fontFamily:"'Barlow Condensed', sans-serif"}}>{currentUser.name}</div>
        <div style={{fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:4}}>{currentUser.id}</div>
        <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:10,flexWrap:'wrap'}}>
          <span style={{...S.deptBadge(currentUser.dept), border:'none'}}>{currentUser.dept}</span>
          <span style={{background:'rgba(255,255,255,0.15)',color:T.white,padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:700}}>{currentUser.role.toUpperCase()}</span>
          <ShiftBadge type={currentUser.shift} />
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
        <div style={{...S.card,marginBottom:0,textAlign:'center',padding:14}}>
          <div style={{fontSize:24,fontWeight:900,color:T.yellow}}>{SHIFT_LABELS[currentUser.shift]}</div>
          <div style={{fontSize:11,color:T.gray,fontWeight:600}}>Fixed Shift</div>
        </div>
        <div style={{...S.card,marginBottom:0,textAlign:'center',padding:14}}>
          <div style={{fontSize:24,fontWeight:900,color:T.blue}}>{SHIFT_TIMES[currentUser.shift]}</div>
          <div style={{fontSize:11,color:T.gray,fontWeight:600}}>Work Hours</div>
        </div>
      </div>

      {/* Change name */}
      <div style={S.card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:editName?12:0}}>
          <div style={{fontSize:14,fontWeight:700,color:T.dark}}>Display Name</div>
          <button onClick={()=>setEditName(!editName)} style={S.btnSm('secondary')}>{editName?'Cancel':'Edit'}</button>
        </div>
        {editName && (
          <>
            <input value={newName} onChange={e=>setNewName(e.target.value)} style={{...S.input,marginTop:10}} />
            <button onClick={()=>{onUpdateUser({...currentUser,name:newName}); setEditName(false);}} style={{...S.btn('primary'),width:'100%',justifyContent:'center'}}>Save Name</button>
          </>
        )}
      </div>

      {/* Change PIN */}
      <div style={S.card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:editPin?12:0}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:T.dark}}>Change PIN</div>
            <div style={{fontSize:11,color:T.gray}}>4-digit login PIN</div>
          </div>
          <button onClick={()=>setEditPin(!editPin)} style={S.btnSm('secondary')}>{editPin?'Cancel':'Change'}</button>
        </div>
        {editPin && (
          <>
            <label style={S.label}>Current PIN</label>
            <input type="password" value={oldPin} onChange={e=>setOldPin(e.target.value)} maxLength={4} placeholder="Current PIN" style={S.input} />
            <label style={S.label}>New PIN</label>
            <input type="password" value={newPin} onChange={e=>setNewPin(e.target.value)} maxLength={4} placeholder="New 4-digit PIN" style={S.input} />
            <label style={S.label}>Confirm PIN</label>
            <input type="password" value={confirmPin} onChange={e=>setConfirmPin(e.target.value)} maxLength={4} placeholder="Confirm new PIN" style={S.input} />
            <button onClick={handleChangePin} style={{...S.btn('primary'),width:'100%',justifyContent:'center'}}>Update PIN</button>
          </>
        )}
        {pinMsg && <div style={{fontSize:12,fontWeight:600,color:pinMsg.startsWith('✅')?T.green:T.red,marginTop:8}}>{pinMsg}</div>}
      </div>

      {/* Logout */}
      <button onClick={onLogout} style={{...S.btn('danger'),width:'100%',justifyContent:'center',marginTop:4}}>🚪 Sign Out</button>
    </div>
  );
}

// ─── ADMIN PANEL ───────────────────────────────────────────────────────────────
function AdminPanel({ staff, roster, monthKey, onRegenerateRoster, onMonthChange }) {
  const [year, month] = monthKey.split('-').map(Number);
  const byDept = {};
  DEPARTMENTS.forEach(d => {
    byDept[d] = staff.filter(s => s.active && s.dept === d && s.id!=='ADMIN');
  });

  const coverage = useMemo(() => {
    const days = monthDays(year, month);
    const issues = [];
    DEPARTMENTS.forEach(dept => {
      const deptStaff = staff.filter(s=>s.active&&s.dept===dept&&s.id!=='ADMIN');
      if(deptStaff.length===0) return;
      ['MOR','AFT'].forEach(shift => {
        const shiftStaff = deptStaff.filter(s=>s.shift===shift);
        if(shiftStaff.length===0) return;
        for(let d=1;d<=days;d++) {
          const date = isoDate(new Date(year,month,d));
          const present = shiftStaff.filter(s=>(roster[s.id]||{})[date]!=='OFF').length;
          if(present < Math.ceil(shiftStaff.length*0.5)) {
            issues.push({dept,shift,date,present,total:shiftStaff.length});
          }
        }
      });
    });
    return issues.slice(0,10);
  }, [staff, roster, year, month]);

  return (
    <div style={S.page}>
      <div style={{...S.card, background:`linear-gradient(135deg, ${T.blue}, ${T.dark})`, padding:16, marginBottom:12}}>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.5)',letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>Admin Panel</div>
        <div style={{fontSize:20,fontWeight:900,color:T.white,fontFamily:"'Barlow Condensed', sans-serif"}}>Roster Management</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.6)',marginTop:4}}>{new Date(year,month,1).toLocaleDateString('en-NG',{month:'long',year:'numeric'})}</div>
      </div>

      {/* Dept summary */}
      <div style={S.card}>
        <div style={S.cardTitle}>Department Summary</div>
        {DEPARTMENTS.map(d => (
          <div key={d} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:`1px solid ${T.border}`}}>
            <span style={S.deptBadge(d)}>{d}</span>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <span style={{fontSize:12,fontWeight:700,color:T.dark}}>{byDept[d].length} staff</span>
              <span style={{fontSize:11,color:T.gray}}>{byDept[d].filter(s=>s.shift==='MOR').length} MOR / {byDept[d].filter(s=>s.shift==='AFT').length} AFT</span>
            </div>
          </div>
        ))}
      </div>

      {/* Coverage issues */}
      {coverage.length > 0 && (
        <div style={{...S.card, border:`1.5px solid ${T.red}`}}>
          <div style={{...S.cardTitle, color:T.red}}>⚠️ Coverage Warnings ({coverage.length})</div>
          {coverage.map((iss,i) => (
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${T.border}`,fontSize:12}}>
              <span style={{fontWeight:700,color:T.dark}}>{iss.dept} · {iss.shift}</span>
              <span style={{color:T.gray}}>{fmtDate(iss.date)}</span>
              <span style={{color:T.red,fontWeight:700}}>{iss.present}/{iss.total} present</span>
            </div>
          ))}
        </div>
      )}

      {/* Regenerate */}
      <div style={S.card}>
        <div style={S.cardTitle}>Roster Engine</div>
        <p style={{fontSize:12,color:T.gray,marginBottom:12}}>Regenerate the auto-roster for this month. This will replace all current assignments for the selected month.</p>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>onMonthChange(-1)} style={S.btnSm('ghost')}>◀</button>
          <div style={{flex:1,textAlign:'center',fontSize:14,fontWeight:700,lineHeight:'32px'}}>{new Date(year,month,1).toLocaleDateString('en-NG',{month:'long',year:'numeric'})}</div>
          <button onClick={()=>onMonthChange(1)} style={S.btnSm('ghost')}>▶</button>
        </div>
        <button onClick={onRegenerateRoster} style={{...S.btn('primary'),width:'100%',justifyContent:'center',marginTop:10}}>🔄 Regenerate Roster</button>
      </div>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [staff, setStaff] = useState(() => {
    try { const saved = localStorage.getItem('jr_staff'); return saved ? JSON.parse(saved) : INITIAL_STAFF; } catch { return INITIAL_STAFF; }
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [rosterStatus, setRosterStatus] = useState(() => {
    try { return localStorage.getItem('jr_roster_status') || 'draft'; } catch { return 'draft'; }
  });

  const todayDate = new Date();
  const defaultMonthKey = `${todayDate.getFullYear()}-${todayDate.getMonth()}`;
  const [monthKey, setMonthKey] = useState(defaultMonthKey);

  const [roster, setRoster] = useState(() => {
    try { const saved = localStorage.getItem('jr_roster_'+defaultMonthKey); return saved ? JSON.parse(saved) : {}; } catch { return {}; }
  });

  const [assignments, setAssignments] = useState(() => {
    try { const saved = localStorage.getItem('jr_assignments'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  // Generate roster on first load if empty
  useEffect(() => {
    if(Object.keys(roster).length === 0) {
      const [y,m] = monthKey.split('-').map(Number);
      const generated = generateMonthRoster(staff, y, m);
      setRoster(generated);
    }
  }, []);

  // Persist
  useEffect(() => { try { localStorage.setItem('jr_staff', JSON.stringify(staff)); } catch {} }, [staff]);
  useEffect(() => { try { localStorage.setItem('jr_roster_'+monthKey, JSON.stringify(roster)); } catch {} }, [roster, monthKey]);
  useEffect(() => { try { localStorage.setItem('jr_roster_status', rosterStatus); } catch {} }, [rosterStatus]);
  useEffect(() => { try { localStorage.setItem('jr_assignments', JSON.stringify(assignments)); } catch {} }, [assignments]);

  const handleMonthChange = (dir) => {
    const [y,m] = monthKey.split('-').map(Number);
    const newDate = new Date(y, m+dir, 1);
    const newKey = `${newDate.getFullYear()}-${newDate.getMonth()}`;
    setMonthKey(newKey);
    try {
      const saved = localStorage.getItem('jr_roster_'+newKey);
      if(saved) { setRoster(JSON.parse(saved)); }
      else {
        const gen = generateMonthRoster(staff, newDate.getFullYear(), newDate.getMonth());
        setRoster(gen);
      }
    } catch {}
  };

  const handleRegenerateRoster = () => {
    const [y,m] = monthKey.split('-').map(Number);
    const gen = generateMonthRoster(staff, y, m);
    setRoster(gen);
    setRosterStatus('draft');
  };

  const handleUpdateStaff = (updated) => {
    setStaff(s => s.map(x => x.id===updated.id ? updated : x));
    if(currentUser?.id === updated.id) setCurrentUser(updated);
  };

  const handleAddStaff = (newS) => {
    if(staff.find(s=>s.id===newS.id)) { alert('Staff ID already exists'); return; }
    setStaff(s => [...s, newS]);
  };

  const handleDeactivate = (id) => {
    setStaff(s => s.map(x => x.id===id ? {...x, active:!x.active} : x));
  };

  const isAdmin = currentUser?.role === 'admin';

  const TABS = [
    { id:'home', icon:'🏠', label:'Home' },
    { id:'roster', icon:'📅', label:'Roster' },
    { id:'directory', icon:'👥', label:'Staff' },
    { id:'tasks', icon:'📋', label:'Tasks' },
    ...(isAdmin ? [{ id:'admin', icon:'⚙️', label:'Admin' }] : []),
    { id:'share', icon:'📤', label:'Share' },
    { id:'profile', icon:'👤', label:'Profile' },
  ];

  if (!currentUser) {
    return <LoginScreen staff={staff} onLogin={setCurrentUser} />;
  }

  const renderTab = () => {
    switch(activeTab) {
      case 'home': return <Dashboard currentUser={currentUser} staff={staff} roster={roster} assignments={assignments} monthKey={monthKey} />;
      case 'roster': return <RosterView currentUser={currentUser} staff={staff} roster={roster} rosterStatus={rosterStatus} monthKey={monthKey} onMonthChange={handleMonthChange} />;
      case 'directory': return <Directory currentUser={currentUser} staff={staff} onUpdateStaff={handleUpdateStaff} onAddStaff={handleAddStaff} onDeactivate={handleDeactivate} />;
      case 'tasks': return <Assignments currentUser={currentUser} staff={staff} assignments={assignments} onUpdateAssignments={setAssignments} />;
      case 'admin': return <AdminPanel staff={staff} roster={roster} monthKey={monthKey} onRegenerateRoster={handleRegenerateRoster} onMonthChange={handleMonthChange} />;
      case 'share': return <ShareNotify staff={staff} roster={roster} monthKey={monthKey} rosterStatus={rosterStatus} currentUser={currentUser} onApprove={()=>setRosterStatus('approved')} onPublish={()=>setRosterStatus('published')} />;
      case 'profile': return <Profile currentUser={currentUser} staff={staff} onUpdateUser={handleUpdateStaff} onLogout={()=>{setCurrentUser(null);setActiveTab('home');}} />;
      default: return null;
    }
  };

  return (
    <div style={S.app}>
      <style>{`
        @keyframes slideUp { from { transform:translateY(40px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        input::placeholder { color: #9CA3AF; }
        input:focus, select:focus { border-color: #F5A623 !important; box-shadow: 0 0 0 3px rgba(245,166,35,0.15); }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.headerTop}>
          <div style={S.logoArea}>
            <div style={S.logoIcon}>🛒</div>
            <div style={S.logoText}>
              <span style={S.logoTitle}>JUSTRITE SUPERSTORE</span>
              <span style={S.logoSub}>Ile-Ife · Roster System</span>
            </div>
          </div>
          <div style={S.headerRight}>
            <div style={{...S.avatar(currentUser.id), width:34, height:34, fontSize:11, borderRadius:10, border:`2px solid ${T.yellow}`, cursor:'pointer'}} onClick={()=>setActiveTab('profile')}>
              {getInitials(currentUser.name)}
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <div style={S.navTabs}>
          {TABS.map(tab => (
            <div key={tab.id} style={S.navTab(activeTab===tab.id)} onClick={()=>setActiveTab(tab.id)}>
              {tab.icon} {tab.label}
            </div>
          ))}
        </div>
      </div>

      {/* Page title bar */}
      <div style={{background:T.white, padding:'10px 16px 10px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{fontSize:16, fontWeight:900, color:T.dark, fontFamily:"'Barlow Condensed', sans-serif", letterSpacing:0.5}}>
          {TABS.find(t=>t.id===activeTab)?.icon} {TABS.find(t=>t.id===activeTab)?.label?.toUpperCase()}
        </div>
        <div style={{fontSize:11, color:T.gray, fontWeight:600}}>
          {new Date().toLocaleDateString('en-NG',{weekday:'short',day:'numeric',month:'short'})}
        </div>
      </div>

      {/* Content */}
      <div style={{paddingBottom:12}}>
        {renderTab()}
      </div>
    </div>
  );
}
