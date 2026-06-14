import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Folder, 
  DollarSign, 
  Handshake, 
  Plus, 
  LogOut, 
  ArrowRight, 
  Users, 
  FolderPlus, 
  CircleDollarSign, 
  X 
} from "lucide-react";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [groupData, setGroupData] = useState({
    name: "",
    description: ""
  });

  const [expenseData, setExpenseData] = useState({
    groupId: "",
    description: "",
    amount: ""
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchGroups = async () => {
    try {
      const res = await API.get("/groups/my-groups");
      console.log("GROUPS =>", res.data);
      setGroups(res.data.groups || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!groupData.name) return;

    try {
      await API.post("/groups/create", {
        name: groupData.name,
        description: groupData.description
      });
      setShowModal(false);
      setGroupData({
        name: "",
        description: ""
      });
      fetchGroups();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to create group");
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!expenseData.groupId || !expenseData.description || !expenseData.amount) {
      return alert("Please fill all fields");
    }

    try {
      await API.post("/expenses/add", {
        groupId: expenseData.groupId,
        description: expenseData.description,
        amount: Number(expenseData.amount),
        splitType: "EQUAL",
        splits: []
      });

      setShowExpenseModal(false);
      setExpenseData({
        groupId: "",
        description: "",
        amount: ""
      });
      fetchGroups();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to add expense");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] pb-12 relative">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Sticky Glass Navbar */}
      <nav className="sticky top-0 z-40 w-full glass-card border-b border-white/5 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <span className="font-extrabold text-white text-lg">$</span>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            Splitwise
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 rounded-xl transition-all duration-200 shadow-sm"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-10">
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              Dashboard
            </h1>
            <p className="text-slate-400 text-sm font-light">
              Welcome back! Manage your groups, check split balances, and settle bills with friends.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/10 transition-all duration-200 hover:-translate-y-0.5"
            >
              <FolderPlus className="w-4.5 h-4.5" />
              <span>Create Group</span>
            </button>

            <button
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-white border border-white/5 font-semibold text-sm px-5 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <CircleDollarSign className="w-4.5 h-4.5 text-emerald-400" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <Folder className="w-5 h-5" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Total Groups</h3>
            <p className="text-3xl font-bold mt-2 text-white">{groups.length}</p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Total Expenses</h3>
            <p className="text-3xl font-bold mt-2 text-white">₹0</p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
              <Handshake className="w-5 h-5" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Settlements</h3>
            <p className="text-3xl font-bold mt-2 text-white">₹0</p>
          </div>
        </div>

        {/* Groups List */}
        <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>My Groups</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium px-2.5 py-1 bg-slate-800/60 rounded-full border border-white/5">
              Active ({groups.length})
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
              <p className="text-slate-400 text-sm">Loading groups...</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-slate-900/40 border border-dashed border-white/5">
              <FolderPlus className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-white font-medium text-lg">No Groups Yet</h3>
              <p className="text-slate-400 text-sm max-w-sm mt-1 mb-5 font-light">
                Create a group or ask a friend to invite you by email to start splitting bills.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-white border border-white/10 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Create a Group</span>
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {groups.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/group/${item.group.id}`)}
                  className="group relative flex items-start gap-4 p-5 rounded-2xl bg-slate-900/30 hover:bg-slate-900/80 border border-white/5 hover:border-emerald-500/20 cursor-pointer transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 group-hover:from-emerald-500/20 group-hover:to-teal-500/20 group-hover:border group-hover:border-emerald-500/10 flex items-center justify-center shrink-0 shadow-inner transition-all duration-300">
                    <Users className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </div>

                  <div className="flex-grow min-w-0 pr-6">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                      {item.group.name}
                    </h3>
                    <p className="text-slate-400 text-xs font-light mt-1 line-clamp-2">
                      {item.group.description || "No description provided."}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
                        {item.role}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-650 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md glass-modal p-6 rounded-2xl animate-fade-in-up relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FolderPlus className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create Group</h2>
            </div>

            <form onSubmit={createGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Roommates 🏡"
                  value={groupData.name}
                  onChange={(e) =>
                    setGroupData({
                      ...groupData,
                      name: e.target.value
                    })
                  }
                  className="w-full p-3 rounded-xl form-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shared household bills"
                  value={groupData.description}
                  onChange={(e) =>
                    setGroupData({
                      ...groupData,
                      description: e.target.value
                    })
                  }
                  className="w-full p-3 rounded-xl form-input text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/15 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md glass-modal p-6 rounded-2xl animate-fade-in-up relative">
            <button 
              onClick={() => setShowExpenseModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CircleDollarSign className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">Add Expense</h2>
            </div>

            <form onSubmit={addExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Select Group
                </label>
                <select
                  value={expenseData.groupId}
                  onChange={(e) =>
                    setExpenseData({
                      ...expenseData,
                      groupId: e.target.value
                    })
                  }
                  className="w-full p-3 rounded-xl form-input text-sm appearance-none bg-[#0d111c] cursor-pointer"
                  required
                >
                  <option value="">Choose a group</option>
                  {groups.map((item) => (
                    <option
                      key={item.group.id}
                      value={item.group.id}
                    >
                      {item.group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Expense Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grocery shopping"
                  value={expenseData.description}
                  onChange={(e) =>
                    setExpenseData({
                      ...expenseData,
                      description: e.target.value
                    })
                  }
                  className="w-full p-3 rounded-xl form-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={expenseData.amount}
                    onChange={(e) =>
                      setExpenseData({
                        ...expenseData,
                        amount: e.target.value
                      })
                    }
                    className="w-full pl-7 pr-4 py-3 rounded-xl form-input text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/15 transition-all"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;