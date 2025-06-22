import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const [milestones, setMilestones] = useState([]);
  const [tips, setTips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/analytics/popular-milestones`)
      .then((res) => setMilestones(res.data));
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/analytics/top-tips`)
      .then((res) => setTips(res.data));
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={() => navigate("/milestones")}
        className="mb-4 text-blue-600 underline"
      >
        ← Back to Milestones
      </button>
      <h2 className="text-xl font-bold mb-2">Most Common Milestones</h2>
      <ul className="mb-4">
        {milestones.map((m, i) => (
          <li key={i}>
            {m._id} — {m.count}
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-bold mb-2">Most Liked Tips</h2>
      <ul>
        {tips.map((t, i) => (
          <li key={i}>
            {t.content} ({t.likes} likes)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Analytics;
