import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Loader from "../Loader";
import { weekMessages } from "../data";
const socket = io(import.meta.env.VITE_API_URL);

const Milestones = () => {
  const handleLikeTip = async (tipId, milestoneId) => {
    try {
      setLikeLoading(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tips/${tipId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedTips = tips[milestoneId].map((t) => {
        if (t._id === tipId) return { ...t, likes: (t.likes || 0) + 1 };
        return t;
      });
      setTips((prev) => ({ ...prev, [milestoneId]: updatedTips }));
    } catch (err) {
      alert(err.response.data.message);
    } finally {
      setLikeLoading(false);
    }
  };
  const [milestones, setMilestones] = useState([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [saveEditLoading, setSaveEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addMilestoneLoading, setAddMilestoneLoading] = useState(false);
  const [submitTipLoading, setSubmitTipLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [tips, setTips] = useState({});
  const [newTip, setNewTip] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [likingTipId, setLikingTipId] = useState(null);
  const [editData, setEditData] = useState({});
  const [tipAddingId, setTipAddingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const pregnancyStartDate = localStorage.getItem("pregnancyStartDate");
  const pregnancyWeek = pregnancyStartDate
    ? Math.ceil(
        (Date.now() - new Date(pregnancyStartDate)) / (7 * 24 * 60 * 60 * 1000)
      )
    : null;
  useEffect(() => {
    if (!token) navigate("/");
    setMilestonesLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/milestones`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMilestones(res.data);
        setMilestonesLoading(false);
      })
      .catch((e) => {
        alert(e.message);
        setMilestonesLoading(false);
      });
  }, [token, navigate]);
  console.log(tips);
  useEffect(() => {
    milestones
      .map((m) => m._id)
      .forEach((mId) => {
        fetchTips(mId);
        socket.on(`new-tip-${mId}`, (tip) => {
          setTips((prev) => ({
            ...prev,
            [mId]: [...(prev[mId] || []), tip],
          }));
        });
      });

    return () => socket.off();
  }, [milestones]);

  const addMilestone = async () => {
    if (!title || !date) {
      alert("Enter Title and Date fields");
      return;
    }

    try {
      setAddMilestoneLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/milestones`,
        {
          title,
          date,
          notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.reload();
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setAddMilestoneLoading(false);
    }
  };

  const deleteMilestone = async (id) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      try {
        setDeleteLoading(true);
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/milestones/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMilestones(milestones.filter((m) => m._id !== id));
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const startEditing = (m) => {
    setEditingId(m._id);
    setEditData({
      title: m.title,
      date: m.date?.split("T")[0],
      notes: m.notes,
    });
  };

  const saveEdit = async (id) => {
    try {
      setSaveEditLoading(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/milestones/${id}`,
        editData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updated = milestones.map((m) =>
        m._id === id ? { ...m, ...editData } : m
      );
      setMilestones(updated);
      setEditingId(null);
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setSaveEditLoading(false);
    }
  };

  const fetchTips = async (id) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/milestones/${id}/tips`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTips((prev) => ({ ...prev, [id]: res.data }));
  };

  const submitTip = async (mId) => {
    if (newTip.length < 5) {
      alert("Tip has to be at least 5 characters");
      return;
    }
    try {
      setSubmitTipLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/milestones/${mId}/tips`,
        {
          content: newTip,
          author: "User",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewTip("");
      setTipAddingId(null);
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setSubmitTipLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">
          Welcome! Pregnancy Week: {pregnancyWeek}
        </h2>
        <div className="flex gap-6 items-center">
          {name}
          <button onClick={logout} className="text-lg text-red-500">
            Logout
          </button>
        </div>
      </div>
      {weekMessages[pregnancyWeek] && (
        <div className="p-2 mt-2 bg-yellow-100 border border-yellow-300 rounded">
          <p>{weekMessages[pregnancyWeek]}</p>
        </div>
      )}

      <h3 className="font-semibold">Add Milestone</h3>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-1 mr-2"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-1 mr-2"
      />
      <input
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border p-1 mr-2"
      />
      <button
        onClick={addMilestone}
        className="bg-blue-600 text-white px-2 py-1"
      >
        {addMilestoneLoading ? <Loader color="white" /> : "Add"}
      </button>
      <div>
        <h3 className="font-semibold mt-4">All Milestones</h3>
        {milestonesLoading ? (
          <Loader size="4rem" />
        ) : (
          milestones.map((m) => (
            <div key={m._id} className="border p-2 mt-2 space-y-1">
              {editingId === m._id ? (
                <>
                  <input
                    className="border p-1 w-full"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                  />
                  <input
                    className="border p-1 w-full"
                    type="date"
                    value={editData.date}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                  />
                  <input
                    className="border p-1 w-full"
                    value={editData.notes}
                    onChange={(e) =>
                      setEditData({ ...editData, notes: e.target.value })
                    }
                  />
                  <div className="space-x-2">
                    <button
                      onClick={() => saveEdit(m._id)}
                      className="text-green-600"
                    >
                      {saveEditLoading ? <Loader size="1rem" /> : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <strong>{m.title}</strong> (
                    {new Date(m.date).toLocaleDateString()}){"  "}
                    <span className="text-sm">
                      created by{"   "}
                      <span className="font-semibold text-md">
                        {m.userId.name}
                      </span>
                    </span>
                  </p>
                  <p>{m.notes}</p>
                  <div className="space-x-4 text-sm">
                    <button
                      onClick={() => startEditing(m)}
                      className="text-orange-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeletingId(m._id);
                        deleteMilestone(m._id);
                      }}
                      className="text-red-500"
                    >
                      {deleteLoading && deletingId == m._id ? (
                        <Loader color="red" size="1rem" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </>
              )}

              {tips[m._id]?.length > 0 && (
                <div className="mt-2">
                  <p>Tips</p>
                  {tips[m._id]?.map((t) => (
                    <div
                      key={t._id}
                      className="text-sm flex items-center justify-between"
                    >
                      <span>- {t.content}</span>
                      <div className="text-xs text-gray-600 flex items-center gap-2">
                        <span>{t.likes || 0} likes</span>
                        <button
                          onClick={() => {
                            setLikingTipId(t._id);
                            handleLikeTip(t._id, m._id);
                          }}
                          className="text-blue-500 hover:underline disabled:opacity-50"
                        >
                          {likeLoading && likingTipId == t._id ? (
                            <Loader size="0.5rem" />
                          ) : (
                            "Like"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setTipAddingId(m._id)}
                className="bg-blue-400 text-white px-2 py-1 text-sm"
              >
                Add Tip
              </button>
              {tipAddingId == m._id && (
                <div>
                  <input
                    value={newTip}
                    onChange={(e) => setNewTip(e.target.value)}
                    className="border p-1 mt-1"
                    placeholder="Add a tip"
                  />
                  <button
                    onClick={() => {
                      submitTip(m._id);
                    }}
                    className="bg-green-600 text-white px-2 py-1 ml-2"
                  >
                    {submitTipLoading ? <Loader color="white" /> : "Submit Tip"}
                  </button>
                  <button
                    className="border-red-500 px-2 py-1 border-2 ml-2 text-red-500"
                    onClick={() => setTipAddingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <button
        onClick={() => navigate("/analytics")}
        className="mt-4 text-blue-600 underline"
      >
        View Analytics
      </button>
    </div>
  );
};

export default Milestones;
