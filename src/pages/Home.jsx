import React, { useEffect, useState } from "react";
import { FaSearch, FaBookmark, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Card from "../components/Card.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const timeAgo = (timeString) => {
  const now = new Date();
  const past = new Date(timeString);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + " mins ago";
  return Math.floor(diff / 3600) + " hours ago";
};

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

  const sections = [
    "Last 1 hour",
    "Last 3 hours",
    "Last 6 hours",
    "Last 12 hours",
    "Last 24 hours",
    "Last 48 hours",
    "Last 72 hours",
  ];

  return (
    <div className="timeline-container">
      {sections.map((sec) =>
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

const sortTrending = (articles) =>
  articles
    .filter((a) => a.urlToImage)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const API_KEY = "8d107bf33a3144cf8e89f70c2b38f6c2";

  const MAIN_CATEGORIES = [
    "Technology",
    "Sports",
    "Business",
    "Entertainment",
    "Health",
    "Science",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3001/me")
      .then((res) => {
        if (!res.data?.email) navigate("/");
      })
      .catch(() => navigate("/"));
  }, []);

  const handleLogout = () => {
    axios.post("http://localhost:3001/logout").then(() => navigate("/"));
  };

  const getData = async (query = search, cat = category) => {
    setLoading(true);
    try {
      let url = "";
      let json = {};

      if (MAIN_CATEGORIES.includes(cat)) {
        url = `https://newsapi.org/v2/top-headlines?category=${cat.toLowerCase()}&language=en&apiKey=${API_KEY}`;
        let res = await fetch(url);
        json = await res.json();

        if (!json.articles?.length) {
          url = `https://newsapi.org/v2/everything?q=${cat}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
          res = await fetch(url);
          json = await res.json();
        }

        setNewsData(json.articles || []);
        return;
      }

      if (cat === "Startups") {
        const q =
          "startup OR funding OR venture OR raised OR investor OR incubator OR founders OR unicorn";
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          q
        )}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
        const res = await fetch(url);
        json = await res.json();
        setNewsData(json.articles || []);
        return;
      }

      if (cat === "Markets") {
        const q =
          "market OR stock OR index OR nifty OR sensex OR NSE OR BSE OR inflation OR finance OR rupee OR economy";
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          q
        )}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
        const res = await fetch(url);
        json = await res.json();
        setNewsData(json.articles || []);
        return;
      }

      if (cat === "Timeline") {
        const q = "breaking OR latest OR update OR news";
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          q
        )}&language=en&sortBy=publishedAt&pageSize=100&apiKey=${API_KEY}`;
        const res = await fetch(url);
        json = await res.json();
        setNewsData(json.articles || []);
        return;
      }

      const q = query.trim() ? query : "latest";
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        q
      )}&language=en&sortBy=publishedAt&pageSize=100&apiKey=${API_KEY}`;
      const res = await fetch(url);
      json = await res.json();

      const sorted = sortTrending(json.articles || []);
      setNewsData(sorted);
    } catch (e) {
      console.log(e);
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
          <img src="src/assets/logo.png" alt="Logo" className="logo-img" />
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
