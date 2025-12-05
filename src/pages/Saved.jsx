import React, { useEffect, useState } from "react";
import { FaBookmark, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Saved() {
  const [saved, setSaved] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookmarks_v1") || "{}");
    setSaved(stored);
  }, []);

  const toggleBookmark = (key) => {
    const copy = { ...saved };
    delete copy[key];
    setSaved(copy);
    localStorage.setItem("bookmarks_v1", JSON.stringify(copy));
  };

  const articles = Object.values(saved);

  return (
    <div className="saved-container">

      <div className="saved-topbar">
        <FaArrowLeft
          className="back"
          size={22}
          onClick={() => navigate("/home")}
        />
        <h1 className="saved-title">Saved Articles</h1>
      </div>

      {articles.length === 0 ? (
        <h2 style={{ textAlign: "center", marginTop: 20 }}>
          No saved articles.
        </h2>
      ) : (
        <div className="card-container">
          {articles.map((item, index) => (
            <div className="news-card" key={index}>

              <div className="news-img">
                <img src={item.urlToImage} alt={item.title} />
              </div>

              <div className="news-content">

                <p
                  className="news-title"
                  onClick={() => window.open(item.url, "_blank")}
                >
                  {item.title}
                </p>

                <p
                  className="news-more"
                  onClick={() => window.open(item.url, "_blank")}
                >
                  Read More
                </p>

                <div className="bookmark-wrapper">
                  <button
                    className="bookmark-btn"
                    onClick={() => toggleBookmark(item.url)}
                  >
                    <FaBookmark size={22} className="saved-icon" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
