import React, { useEffect, useState } from "react";
import { FaSearch, FaBookmark, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Card from "../components/Card.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

// Axios global config
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Time ago helper
const timeAgo = (timeString) => {
  const now = new Date();
  const past = new Date(timeString);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + " mins ago";
  return Math.floor(diff / 3600) + " hours ago";
};

// Timeline Component
const Timeline = ({ data }) => {
  const now = new Date();
  const recent = data.filter((item) => {
    const diffHours = (now - new Date(item.publishedAt)) / 3600000;
    return diffHours <= 72;
  });

  const groups = {
    "Last 1 hour": [],
    "Last 3 hours": [],
    "Last 6 hours": [],
    "Last 12 hours": [],
    "Last 24 hours": [],
    "Last 48 hours": [],
    "Last 72 hours": [],
  };

  recent.forEach((item) => {
    const diff = (now - new Date(item.publishedAt)) / 3600000;
    if (diff <= 1) groups["Last 1 hour"].push(item);
    else if (diff <= 3) groups["Last 3 hours"].push(item);
    else if (diff <= 6) groups["Last 6 hours"].push(item);
    else if (diff <= 12) groups["Last 12 hours"].push(item);
    else if (diff <= 24) groups["Last 24 hours"].push(item);
    else if (diff <= 48) groups["Last 48 hours"].push(item);
    else groups["Last 72 hours"].push(item);
  });

  return (
    <div className="timeline-container">
      {Object.keys(groups).map((sec) =>
        groups[sec].length > 0 ? (
          <div key={sec} className="timeline-section">
            <h2 className="timeline-section-title">{sec}</h2>
            {groups[sec].map((item, idx) => (
              <div className="timeline-item" key={idx}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3
                    className="timeline-title"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    {item.title}
                  </h3>
                  <p className="timeline-time">{timeAgo(item.publishedAt)}</p>
                  {item.urlToImage && (
                    <img src={item.urlToImage} alt="" className="timeline-img" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null
      )}
    </div>
  );
};

// Sort by latest
const sortTrending = (articles) =>
  articles
    .filter((a) => a.urlToImage)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const MAIN_CATEGORIES = [
    "Technology",
    "Sports",
    "Business",
    "Entertainment",
    "Health",
    "Science",
  ];

  // Auth check
  useEffect(() => {
    axios
      .get("/me")
      .then((res) => {
        if (!res.data?.email) navigate("/");
      })
      .catch(() => navigate("/"));
  }, []);

  const handleLogout = () => {
    axios.post("/logout").then(() => navigate("/"));
  };

  // Fetch from backend
  const fetchNews = async (query) => {
    const res = await axios.get("/news", { params: { q: query } });
    return res.data.articles || [];
  };

  const getData = async (query = search, cat = category) => {
    setLoading(true);
    try {
      let q = "";

      if (MAIN_CATEGORIES.includes(cat)) q = cat;
      else if (cat === "Startups")
        q = "startup OR funding OR venture OR investor OR unicorn";
      else if (cat === "Markets")
        q = "market OR stock OR nifty OR sensex OR economy OR finance";
      else if (cat === "Timeline")
        q = "breaking OR latest OR update OR news";
      else q = query.trim() ? query : "latest";

      const articles = await fetchNews(q);
      setNewsData(sortTrending(articles));
    } catch (err) {
      console.log(err);
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setVisibleCount(4);
    getData(search, cat);
  };

  return (
    <>
      <header className="navbar">
        <div className="left-section">
          <img src={logo} alt="Logo" className="logo-img" />
          <h1 className="logo-heading">NextRead</h1>
        </div>

        <div className="search-box">
          <FaSearch size={18} color="white" />
          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onKeyDown={(e) => e.key === "Enter" && getData()}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="icons">
          <FaBookmark size={24} id="bookmark" onClick={() => navigate("/saved")} />
          <FaUser size={24} id="user" onClick={() => setOpen(!open)} />
        </div>

        {open && (
          <div className="drop">
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut size={18} color="red" style={{ marginRight: "8px" }} />
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="tabs">
        {[
          "All",
          "Technology",
          "Sports",
          "Business",
          "Entertainment",
          "Health",
          "Science",
          "Startups",
          "Markets",
          "Timeline",
        ].map((cat) => (
          <button
            key={cat}
            className={`tab ${category === cat ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div className="loader"></div>
          <p>Loading news...</p>
        </div>
      )}

      {!loading && newsData && (
        category === "Timeline" ? (
          <Timeline data={newsData} />
        ) : (
          <>
            <Card data={newsData.slice(0, visibleCount)} />
            {visibleCount < newsData.length && (
              <div style={{ textAlign: "center", margin: "20px" }}>
                <button
                  className="load-more"
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )
      )}
    </>
  );
}
