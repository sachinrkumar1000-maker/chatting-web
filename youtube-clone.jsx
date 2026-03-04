import { useState, useRef, useEffect } from "react";

// ── Real YouTube video IDs (embeddable) ──────────────────────────────────────
const VIDEOS = [
  {
    id: "dQw4w9WgXcQ", title: "Rick Astley – Never Gonna Give You Up (Official Video)",
    channel: "Rick Astley", avatar: "RA", views: "1.6B views", age: "15 years ago",
    duration: "3:33", subs: "3.8M", liked: false, subscribed: false,
    thumb: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    description: "The official video for "Never Gonna Give You Up" by Rick Astley. A classic 80s hit that defined a generation and became the internet's most beloved meme.",
    tags: ["Pop", "80s", "Classic"],
    comments: [
      { user: "MusicFan99", avatar: "MF", text: "This song literally never gets old. 40 years later and it still hits! 🎵", likes: 4821, time: "2 days ago" },
      { user: "RetroVibes", avatar: "RV", text: "I can't believe I got rickrolled... and I enjoyed every second of it 😂", likes: 2103, time: "5 days ago" },
      { user: "ClassicHits", avatar: "CH", text: "The production quality for 1987 is absolutely remarkable. Timeless.", likes: 987, time: "1 week ago" },
    ]
  },
  {
    id: "9bZkp7q19f0", title: "PSY – GANGNAM STYLE (강남스타일) M/V",
    channel: "officialpsy", avatar: "PS", views: "5.1B views", age: "12 years ago",
    duration: "4:12", subs: "14.6M", liked: false, subscribed: false,
    thumb: "https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg",
    description: "PSY's epic K-Pop anthem that took the world by storm. First YouTube video to reach 1 billion views.",
    tags: ["K-Pop", "Music", "Viral"],
    comments: [
      { user: "KpopLover", avatar: "KL", text: "The video that broke the internet before breaking the internet was a thing 🐴", likes: 8832, time: "3 days ago" },
      { user: "2012Nostalgia", avatar: "2N", text: "I remember watching this in school. Everyone was doing the horse dance!", likes: 5521, time: "1 week ago" },
    ]
  },
  {
    id: "kJQP7kiw5Fk", title: "Luis Fonsi – Despacito ft. Daddy Yankee",
    channel: "LuisFonsiVEVO", avatar: "LF", views: "8.4B views", age: "7 years ago",
    duration: "4:41", subs: "9.1M", liked: false, subscribed: false,
    thumb: "https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
    description: "The most-watched YouTube video of all time. A Latin pop masterpiece featuring Daddy Yankee.",
    tags: ["Latin", "Pop", "Reggaeton"],
    comments: [
      { user: "LatinMusic", avatar: "LM", text: "8 BILLION views. Let that sink in. One in every person on Earth has watched this.", likes: 12400, time: "1 day ago" },
      { user: "SummerVibes", avatar: "SV", text: "Summer 2017 in a song. Pure nostalgia every single time.", likes: 7231, time: "4 days ago" },
    ]
  },
  {
    id: "JGwWNGJdvx8", title: "Ed Sheeran – Shape of You (Official Music Video)",
    channel: "Ed Sheeran", avatar: "ES", views: "6.1B views", age: "7 years ago",
    duration: "4:24", subs: "55.2M", liked: false, subscribed: false,
    thumb: "https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg",
    description: "Ed Sheeran's global smash hit from the album ÷ (Divide). One of Spotify's most streamed songs ever.",
    tags: ["Pop", "Ed Sheeran", "Divide"],
    comments: [
      { user: "EdFan", avatar: "EF", text: "6 billion views and still not enough listens for this banger 🔥", likes: 9201, time: "6 hours ago" },
    ]
  },
  {
    id: "OPf0YbXqDm0", title: "Mark Ronson – Uptown Funk ft. Bruno Mars",
    channel: "MarkRonsonVEVO", avatar: "MR", views: "5.0B views", age: "9 years ago",
    duration: "4:04", subs: "8.7M", liked: false, subscribed: false,
    thumb: "https://img.youtube.com/vi/OPf0YbXqDm0/mqdefault.jpg",
    description: "The unstoppable party anthem. Mark Ronson ft. Bruno Mars delivering pure funk gold.",
    tags: ["Funk", "Pop", "Bruno Mars"],
    comments: [
      { user: "FunkMaster", avatar: "FM", text: "This song walked so that everything else could run. Absolute banger.", likes: 3312, time: "2 days ago" },
    ]
  },
  {
    id: "YqeW9_5kURI", title: "Baby Shark Dance | #babyshark Most Viewed Video",
    channel: "Pinkfong! Kids' Songs & Stories", avatar: "PF", views: "13.6B views", age: "7 years ago",
    duration: "2:17", subs: "46.5M", liked: false, subscribed: false,
    thumb: "https://img.youtube.com/vi/YqeW9_5kURI/mqdefault.jpg",
    description: "The most-viewed YouTube video of all time! Baby Shark Dance by Pinkfong.",
    tags: ["Kids", "Educational", "Dance"],
    comments: [
      { user: "ParentOf3", avatar: "P3", text: "My kids watch this 50 times a day. Send help. But also... doo doo doo doo 🦈", likes: 22100, time: "1 day ago" },
      { user: "WorldRecord", avatar: "WR", text: "13 BILLION. The most watched video in human history. A children's song. I love this planet.", likes: 15800, time: "3 days ago" },
    ]
  },
];

const CATEGORIES = ["All", "Music", "Gaming", "Live", "Podcasts", "Comedy", "News", "Sports", "Technology", "Cooking", "Travel", "Education"];

// ── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, fill = "none", stroke = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const HomeIcon = () => <Icon d="M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3z" />;
const ExploreIcon = () => <Icon d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0" />;
const SubsIcon = () => <Icon d={["M4 6h16M4 12h16M4 18h16"]} />;
const LibraryIcon = () => <Icon d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />;
const HistoryIcon = () => <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
const UploadIcon = () => <Icon d={["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"]} />;
const BellIcon = () => <Icon d={["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 01-3.46 0"]} />;
const SearchIcon = () => <Icon d={["M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"]} />;
const ThumbUpIcon = (filled) => <Icon d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" fill={filled ? "currentColor" : "none"} />;
const ThumbDownIcon = () => <Icon d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />;
const ShareIcon = () => <Icon d={["M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8", "M16 6l-4-4-4 4", "M12 2v13"]} />;
const MoreIcon = () => <Icon d="M12 5h.01M12 12h.01M12 19h.01" sw={2.5} />;
const XIcon = () => <Icon d="M18 6L6 18M6 6l12 12" />;
const MenuIcon = () => <Icon d={["M3 12h18", "M3 6h18", "M3 18h18"]} />;
const VideoIcon = () => <Icon d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.899L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />;

// ── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ initials, size = 32, color = "#ff0000" }) => {
  const colors = { RA:"#e11d48", PS:"#7c3aed", LF:"#0891b2", ES:"#d97706", MR:"#059669", PF:"#db2777", MF:"#6366f1", RV:"#10b981", CH:"#f59e0b", KL:"#8b5cf6", "2N":"#06b6d4", LM:"#ef4444", SV:"#f97316", EF:"#84cc16", FM:"#ec4899", P3:"#0ea5e9", WR:"#a855f7" };
  const bg = colors[initials] || "#6b7280";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: "sans-serif" }}>
      {initials}
    </div>
  );
};

// ── Video Card ────────────────────────────────────────────────────────────────
const VideoCard = ({ video, onClick, horizontal = false }) => {
  const [hovered, setHovered] = useState(false);
  if (horizontal) return (
    <div onClick={() => onClick(video)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", gap: 10, cursor: "pointer", marginBottom: 10 }}>
      <div style={{ position: "relative", flexShrink: 0, width: 168, height: 94, borderRadius: 8, overflow: "hidden", background: "#1a1a1a" }}>
        <img src={video.thumb} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.3s" }} />
        <div style={{ position: "absolute", bottom: 4, right: 6, background: "rgba(0,0,0,0.85)", color: "#fff", fontSize: 10, padding: "1px 5px", borderRadius: 3, fontWeight: 600 }}>{video.duration}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.4, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{video.title}</div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>{video.channel}</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>{video.views} · {video.age}</div>
      </div>
    </div>
  );
  return (
    <div onClick={() => onClick(video)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer", borderRadius: 12, overflow: "hidden", background: "transparent" }}>
      <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: "#1a1a1a", aspectRatio: "16/9" }}>
        <img src={video.thumb} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.4s ease" }} />
        <div style={{ position: "absolute", bottom: 6, right: 8, background: "rgba(0,0,0,0.85)", color: "#fff", fontSize: 11, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>{video.duration}</div>
      </div>
      <div style={{ padding: "10px 2px 6px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Avatar initials={video.avatar} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.4, marginBottom: 3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{video.title}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 1 }}>{video.channel}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{video.views} · {video.age}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Upload Modal ──────────────────────────────────────────────────────────────
const UploadModal = ({ onClose }) => {
  const [step, setStep] = useState(0); // 0=drop, 1=details, 2=done
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [progress, setProgress] = useState(0);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (file) { setFileName(file.name); setTitle(file.name.replace(/\.[^/.]+$/, "")); setStep(1); }
  };

  const simulateUpload = () => {
    setStep(2);
    let p = 0;
    const iv = setInterval(() => { p += Math.random() * 15; if (p >= 100) { p = 100; clearInterval(iv); } setProgress(Math.round(p)); }, 200);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 14, width: 620, maxWidth: "95vw", maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #1e1e1e" }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>Upload video</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 4 }}><XIcon /></button>
        </div>
        <div style={{ padding: 24 }}>
          {step === 0 && (
            <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
              style={{ border: `2px dashed ${dragging ? "#ff0000" : "#2a2a2a"}`, borderRadius: 12, padding: "60px 20px", textAlign: "center", transition: "border-color 0.2s", background: dragging ? "rgba(255,0,0,0.04)" : "transparent" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎬</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>Drag and drop video files to upload</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>Your videos will be private until you publish them.</div>
              <label style={{ background: "#3ea6ff", color: "#0f0f0f", padding: "10px 24px", borderRadius: 20, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                SELECT FILES
                <input type="file" accept="video/*" style={{ display: "none" }} onChange={handleDrop} />
              </label>
            </div>
          )}
          {step === 1 && (
            <div>
              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 6 }}>Title (required)</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, padding: "10px 12px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 6 }}>Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, padding: "10px 12px", color: "#e2e8f0", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} placeholder="Tell viewers about your video..." />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 10 }}>Visibility</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Private", "Unlisted", "Public"].map(v => (
                    <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "#e2e8f0" }}>
                      <input type="radio" name="vis" defaultChecked={v === "Public"} style={{ accentColor: "#ff0000" }} /> {v}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={() => setStep(0)} style={{ background: "none", border: "1px solid #2a2a2a", color: "#94a3b8", padding: "9px 20px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>Back</button>
                <button onClick={simulateUpload} style={{ background: "#ff0000", color: "#fff", border: "none", padding: "9px 24px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Upload & Publish</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{progress === 100 ? "✅" : "⏳"}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#e2e8f0", marginBottom: 12 }}>{progress === 100 ? "Upload complete!" : `Uploading… ${progress}%`}</div>
              <div style={{ background: "#1a1a1a", borderRadius: 20, height: 6, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #ff0000, #ff6b6b)", transition: "width 0.2s", borderRadius: 20 }} />
              </div>
              {progress === 100 && <button onClick={onClose} style={{ background: "#ff0000", color: "#fff", border: "none", padding: "10px 28px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Done</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Comment Section ───────────────────────────────────────────────────────────
const Comments = ({ video }) => {
  const [comments, setComments] = useState(video.comments);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState({});

  const postComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [{ user: "You", avatar: "YO", text: newComment, likes: 0, time: "just now" }, ...prev]);
    setNewComment("");
  };

  return (
    <div style={{ marginTop: 28 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 20 }}>{comments.length} Comments</h3>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Avatar initials="YO" size={36} color="#6366f1" />
        <div style={{ flex: 1 }}>
          <input value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === "Enter" && postComment()}
            placeholder="Add a comment…"
            style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid #2a2a2a", color: "#e2e8f0", fontSize: 13.5, padding: "6px 0", outline: "none", boxSizing: "border-box" }} />
          {newComment && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
              <button onClick={() => setNewComment("")} style={{ background: "none", border: "none", color: "#94a3b8", padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13 }}>Cancel</button>
              <button onClick={postComment} style={{ background: "#3ea6ff", color: "#0f0f0f", border: "none", padding: "6px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Comment</button>
            </div>
          )}
        </div>
      </div>
      {comments.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <Avatar initials={c.avatar} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#e2e8f0" }}>{c.user}</span>
              <span style={{ fontSize: 11, color: "#64748b" }}>{c.time}</span>
            </div>
            <div style={{ fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.55, marginBottom: 6 }}>{c.text}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setLikedComments(p => ({ ...p, [i]: !p[i] }))}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: likedComments[i] ? "#3ea6ff" : "#94a3b8", cursor: "pointer", fontSize: 12, padding: 0 }}>
                👍 {c.likes + (likedComments[i] ? 1 : 0)}
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 12, padding: 0 }}>👎</button>
              <button style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 12, padding: 0 }}>Reply</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────
export default function YouTube() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [likedVideos, setLikedVideos] = useState({});
  const [subscribedChannels, setSubscribedChannels] = useState({});
  const [notification, setNotification] = useState(null);
  const catRef = useRef(null);

  const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 2500); };

  const toggleLike = (videoId) => {
    setLikedVideos(p => { const n = { ...p, [videoId]: !p[videoId] }; showNotif(n[videoId] ? "Added to liked videos" : "Removed from liked videos"); return n; });
  };

  const toggleSubscribe = (channel) => {
    setSubscribedChannels(p => { const n = { ...p, [channel]: !p[channel] }; showNotif(n[channel] ? `Subscribed to ${channel}` : `Unsubscribed from ${channel}`); return n; });
  };

  const SideNav = () => (
    <div style={{ width: sidebarOpen ? 220 : 72, flexShrink: 0, transition: "width 0.25s ease", overflowX: "hidden", height: "calc(100vh - 56px)", position: "sticky", top: 56, overflowY: "auto", paddingTop: 8 }}>
      {[
        { icon: <HomeIcon />, label: "Home", active: !currentVideo },
        { icon: <ExploreIcon />, label: "Explore" },
        { icon: <SubsIcon />, label: "Subscriptions" },
        { icon: <LibraryIcon />, label: "Library" },
        { icon: <HistoryIcon />, label: "History" },
      ].map(({ icon, label, active }) => (
        <div key={label} onClick={() => { if (label === "Home") setCurrentVideo(null); }}
          style={{ display: "flex", alignItems: "center", gap: sidebarOpen ? 16 : 0, padding: sidebarOpen ? "10px 20px" : "10px", justifyContent: sidebarOpen ? "flex-start" : "center", borderRadius: 10, margin: "2px 8px", cursor: "pointer", background: active ? "#272727" : "transparent", color: active ? "#fff" : "#aaa", transition: "background 0.15s" }}>
          {icon}
          {sidebarOpen && <span style={{ fontSize: 13, fontWeight: active ? 700 : 400 }}>{label}</span>}
        </div>
      ))}
      {sidebarOpen && <div style={{ borderTop: "1px solid #1e1e1e", margin: "10px 12px" }} />}
      {sidebarOpen && <div style={{ padding: "8px 20px 4px", fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em" }}>Subscriptions</div>}
      {sidebarOpen && VIDEOS.slice(0, 4).map(v => (
        <div key={v.id} onClick={() => setCurrentVideo(v)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 20px", cursor: "pointer", borderRadius: 10, margin: "1px 8px", color: subscribedChannels[v.channel] ? "#fff" : "#94a3b8" }}>
          <Avatar initials={v.avatar} size={24} />
          <span style={{ fontSize: 12.5, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{v.channel}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff", fontFamily: "'Roboto', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0f0f0f; }
        ::-webkit-scrollbar-thumb { background: #272727; border-radius: 4px; }
        input:focus { outline: none; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        .video-grid > * { animation: fadeIn 0.35s ease both; }
        .video-grid > *:nth-child(1){animation-delay:0s}
        .video-grid > *:nth-child(2){animation-delay:0.05s}
        .video-grid > *:nth-child(3){animation-delay:0.1s}
        .video-grid > *:nth-child(4){animation-delay:0.15s}
        .video-grid > *:nth-child(5){animation-delay:0.2s}
        .video-grid > *:nth-child(6){animation-delay:0.25s}
        .nav-btn:hover { background: #272727 !important; }
        .action-btn:hover { background: #272727 !important; }
      `}</style>

      {/* ── Navbar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, height: 56, background: "#0f0f0f", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", padding: "0 16px", gap: 16 }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 200 }}>
          <button onClick={() => setSidebarOpen(p => !p)} className="nav-btn" style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex" }}><MenuIcon /></button>
          <div onClick={() => setCurrentVideo(null)} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
            <div style={{ background: "#ff0000", borderRadius: 6, padding: "3px 7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px", color: "#fff" }}>YouTube</span>
          </div>
        </div>

        {/* Center - Search */}
        <div style={{ flex: 1, maxWidth: 560, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, display: "flex", background: "#121212", border: `1px solid ${searchFocused ? "#3ea6ff" : "#303030"}`, borderRadius: 20, overflow: "hidden", transition: "border-color 0.2s" }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              placeholder="Search" style={{ flex: 1, background: "none", border: "none", color: "#e2e8f0", fontSize: 14, padding: "8px 16px" }} />
            <button style={{ background: "#272727", border: "none", color: "#aaa", padding: "0 16px", cursor: "pointer", borderLeft: "1px solid #303030", display: "flex", alignItems: "center" }}><SearchIcon /></button>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 200, justifyContent: "flex-end" }}>
          <button onClick={() => setShowUpload(true)} className="nav-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#e2e8f0", cursor: "pointer", padding: "7px 12px", borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
            <VideoIcon /> <span>Create</span>
          </button>
          <button className="nav-btn" style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex" }}><BellIcon /></button>
          <Avatar initials="YO" size={32} />
        </div>
      </div>

      {/* ── Notification Toast ── */}
      {notification && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#272727", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, zIndex: 500, animation: "slideDown 0.25s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          {notification}
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

      {/* ── Body ── */}
      <div style={{ display: "flex" }}>
        <SideNav />

        <div style={{ flex: 1, minWidth: 0, overflowY: "auto", maxHeight: "calc(100vh - 56px)" }}>
          {!currentVideo ? (
            /* ── Home Page ── */
            <div>
              {/* Category pills */}
              <div ref={catRef} style={{ display: "flex", gap: 8, padding: "12px 20px 8px", overflowX: "auto", position: "sticky", top: 0, background: "#0f0f0f", zIndex: 10, borderBottom: "1px solid #1a1a1a" }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)} style={{ flexShrink: 0, background: category === c ? "#fff" : "#272727", color: category === c ? "#0f0f0f" : "#e2e8f0", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>{c}</button>
                ))}
              </div>

              {/* Video Grid */}
              <div className="video-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px 16px", padding: "20px 20px 40px" }}>
                {VIDEOS.filter(v => !searchQuery || v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.channel.toLowerCase().includes(searchQuery.toLowerCase())).map(v => (
                  <VideoCard key={v.id} video={v} onClick={setCurrentVideo} />
                ))}
              </div>
            </div>
          ) : (
            /* ── Video Player Page ── */
            <div style={{ display: "flex", gap: 24, padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>
              {/* Main */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Embed */}
                <div style={{ borderRadius: 12, overflow: "hidden", background: "#000", aspectRatio: "16/9", marginBottom: 14 }}>
                  <iframe
                    width="100%" height="100%"
                    src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ display: "block", width: "100%", height: "100%" }}
                  />
                </div>

                {/* Title */}
                <h1 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.4, marginBottom: 12 }}>{currentVideo.title}</h1>

                {/* Channel row */}
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={currentVideo.avatar} size={40} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{currentVideo.channel}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{currentVideo.subs} subscribers</div>
                    </div>
                  </div>
                  <button onClick={() => toggleSubscribe(currentVideo.channel)}
                    style={{ background: subscribedChannels[currentVideo.channel] ? "#272727" : "#ff0000", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}>
                    {subscribedChannels[currentVideo.channel] ? "✔ Subscribed" : "Subscribe"}
                  </button>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    {/* Like/Dislike */}
                    <div style={{ display: "flex", background: "#272727", borderRadius: 20, overflow: "hidden" }}>
                      <button onClick={() => toggleLike(currentVideo.id)} className="action-btn"
                        style={{ display: "flex", alignItems: "center", gap: 7, background: likedVideos[currentVideo.id] ? "#3ea6ff22" : "none", border: "none", color: likedVideos[currentVideo.id] ? "#3ea6ff" : "#e2e8f0", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                        👍 Like
                      </button>
                      <div style={{ width: 1, background: "#333" }} />
                      <button className="action-btn" style={{ background: "none", border: "none", color: "#e2e8f0", padding: "8px 14px", cursor: "pointer", fontSize: 13 }}>👎</button>
                    </div>
                    <button className="action-btn" style={{ display: "flex", alignItems: "center", gap: 6, background: "#272727", border: "none", color: "#e2e8f0", padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                      <ShareIcon /> Share
                    </button>
                    <button className="action-btn" style={{ background: "#272727", border: "none", color: "#e2e8f0", padding: "8px 12px", borderRadius: 20, cursor: "pointer" }}><MoreIcon /></button>
                  </div>
                </div>

                {/* Description */}
                <div style={{ background: "#1a1a1a", borderRadius: 10, padding: "14px 16px", marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{currentVideo.views} · {currentVideo.age}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{currentVideo.description}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    {currentVideo.tags.map(t => <span key={t} style={{ fontSize: 12, color: "#3ea6ff" }}>#{t}</span>)}
                  </div>
                </div>

                <Comments video={currentVideo} />
              </div>

              {/* Sidebar - Up Next */}
              <div style={{ width: 380, flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 14 }}>Up next</div>
                {VIDEOS.filter(v => v.id !== currentVideo.id).map(v => (
                  <VideoCard key={v.id} video={v} onClick={setCurrentVideo} horizontal />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
