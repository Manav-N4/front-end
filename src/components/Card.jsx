import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const timeAgo = (timeString) => {
  const now = new Date();
  const past = new Date(timeString);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + " mins ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hours ago";
  return Math.floor(diff / 86400) + " days ago";
};

const Card = ({ data }) => {
  const [bookmarks, setBookmarks] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks_v1") || "{}");
    setBookmarks(saved);
  }, []);

  const updateStorage = (obj) => {
    setBookmarks(obj);
    localStorage.setItem("bookmarks_v1", JSON.stringify(obj));
  };

  const toggleBookmark = (item) => {
    const key = item.url;
    const copy = { ...bookmarks };

    if (copy[key]) {
      delete copy[key];
    } else {
      copy[key] = item;
    }

    updateStorage(copy);
  };

  if (!data || data.length === 0) {
    return (
      <h2 style={{ textAlign: "center", marginTop: 20 }}>
        No news found...
      </h2>
    );
  }

  return (
    <div className="card-container">
      {data.map((curItem, index) => {
        if (!curItem.urlToImage) return null;

        const fullText =
          ((curItem.description || "") + " " + (curItem.content || ""))
            .replace(/\[\+\d+ chars\]/, "")
            .trim();

        const isSaved = bookmarks[curItem.url];

        return (
          <div className="news-card" key={index}>

            <div className="news-img">
              <img src={curItem.urlToImage} alt={curItem.title} />
            </div>

            <div className="news-content">

              <p
                className="news-title"
                onClick={() => window.open(curItem.url, "_blank")}
              >
                {curItem.title}
              </p>

              <p className="news-time">{timeAgo(curItem.publishedAt)}</p>

              <p className="news-desc">{fullText}</p>

              <p
                className="news-more"
                onClick={() => window.open(curItem.url, "_blank")}
              >
                Read More
              </p>

              <div className="bookmark-wrapper">
                <button
                  className="bookmark-btn"
                  onClick={() => toggleBookmark(curItem)}
                >
                  {isSaved ? (
                    <FaBookmark size={22} className="saved-icon" />
                  ) : (
                    <FaRegBookmark size={22} className="unsaved-icon" />
                  )}
                </button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
