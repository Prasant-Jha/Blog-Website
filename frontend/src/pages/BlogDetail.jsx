import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [activeReply, setActiveReply] = useState(null);
  const [openReplies, setOpenReplies] = useState({});

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
        setLikes(data.likes?.length || 0);
        setComments(data.comments || []);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Handle like
  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to like.");

    try {
      const res = await fetch(`http://localhost:4000/api/blogs/${id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to like blog");

      const data = await res.json();
      setLikes(data.likes);
      setIsLiked(data.isLiked);
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  // Handle add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to comment.");
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`http://localhost:4000/api/blogs/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const updatedBlog = await res.json();
      setComments(updatedBlog.comments || []);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  // Handle reply
  const handleReply = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to reply.");
    if (!replyText[commentId]?.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/blogs/${id}/comment/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: replyText[commentId] }),
        }
      );

      if (!res.ok) throw new Error("Failed to post reply");

      const updatedBlog = await res.json();
      setComments(updatedBlog.comments || []);
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setActiveReply(null);
      setOpenReplies((prev) => ({ ...prev, [commentId]: true }));
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (loading) return <p className="text-center py-10">Loading blog...</p>;
  if (!blog) return <p className="text-center py-10">Blog not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      {/* Blog */}
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        By {blog.author?.name || "Unknown"} | {blog.category}
      </p>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Like & Comment */}
      <div className="mt-6 flex items-center gap-6">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded-lg shadow ${isLiked ? "bg-red-500 text-white" : "bg-gray-100"
            }`}
        >
          ❤️ {likes}
        </button>
        <button
          onClick={() => setShowComments(true)}
          className="px-4 py-2 rounded-lg shadow bg-blue-500 text-white"
        >
          💬 {comments.length} Comments
        </button>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className="fixed top-0 right-0 w-[420px] h-full bg-white shadow-xl border-l border-gray-200 z-50 p-5 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Comments</h2>
            <button
              onClick={() => setShowComments(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✖
            </button>
          </div>

          {/* Comment List */}
          <div className="space-y-5 mb-6">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div
                  key={c._id}
                  className="bg-gray-50 p-4 rounded-xl shadow-sm border"
                >
                  {/* Comment header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      {c.user?.name?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {c.user?.name || "Anonymous"}
                      </p>
                      <span className="text-xs text-gray-400">
                        {moment(c.createdAt).fromNow()} {/* ✅ show real time */}
                      </span>
                    </div>
                  </div>

                  {/* Comment text */}
                  <p className="text-gray-700 text-sm mb-2">{c.text}</p>

                  {/* Action buttons */}
                  <div className="flex gap-3 text-xs text-blue-500">
                    {c.replies?.length > 0 && (
                      <button onClick={() => toggleReplies(c._id)}>
                        {openReplies[c._id]
                          ? "Hide Replies"
                          : `View Replies (${c.replies.length})`}
                      </button>
                    )}
                    <button onClick={() => setActiveReply(c._id)}>Reply</button>
                  </div>

                  {/* Replies */}
                  {openReplies[c._id] && c.replies?.length > 0 && (
                    <div className="mt-3 pl-6 border-l-2 border-gray-200 space-y-3">
                      {c.replies.map((r) => (
                        <div
                          key={r._id}
                          className="bg-white p-3 rounded-lg shadow-sm border text-sm"
                        >
                          <p className="font-medium">
                            {r.user?.name || "Anonymous"}
                          </p>
                          <p className="text-gray-600">{r.text}</p>
                          <span className="text-xs text-gray-400">
                            {moment(r.createdAt).fromNow()} {/* ✅ show reply time */}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply box */}
                  {activeReply === c._id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={replyText[c._id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [c._id]: e.target.value,
                          }))
                        }
                        placeholder="Write a reply..."
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                      />
                      <button
                        onClick={() => handleReply(c._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm shadow"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
