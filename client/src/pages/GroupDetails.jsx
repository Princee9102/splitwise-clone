import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  LogOut, 
  UserPlus, 
  Users, 
  FileText, 
  CircleDollarSign, 
  Handshake, 
  TrendingUp, 
  X 
} from "lucide-react";
import API from "../services/api";

function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [balances, setBalances] = useState({});
  const [members, setMembers] = useState([]);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [memberEmail, setMemberEmail] = useState("");

  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: ""
  });

  const [settlementData, setSettlementData] = useState({
    payeeId: "",
    amount: ""
  });

  const fetchDashboard = async () => {
    try {
      const res = await API.get(
        `/expenses/dashboard/${groupId}`
      );
      console.log("DASHBOARD =>", res.data);
      setDashboard(res.data.dashboard);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await API.get(
        `/expenses/group/${groupId}`
      );
      console.log("EXPENSES =>", res.data);
      setExpenses(res.data.expenses || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSettlements = async () => {
    try {
      const res = await API.get(
        `/settlements/group/${groupId}`
      );
      console.log("SETTLEMENTS =>", res.data);
      setSettlements(res.data.settlements || []);
    } catch (error) {
      console.log(error);
    }
  };

  const createSettlement = async (e) => {
    e.preventDefault();
    if (!settlementData.payeeId || !settlementData.amount) {
      return alert("Please fill all fields");
    }
    try {
      await API.post("/settlements/create", {
        groupId,
        payeeId: settlementData.payeeId,
        amount: Number(settlementData.amount)
      });

      setShowSettlementModal(false);
      setSettlementData({
        payeeId: "",
        amount: ""
      });

      fetchSettlements();
      fetchDashboard();
      fetchBalances();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to create settlement");
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!expenseData.description || !expenseData.amount) {
      return alert("Please fill all fields");
    }
    try {
      await API.post("/expenses/add", {
        groupId,
        description: expenseData.description,
        amount: Number(expenseData.amount),
        splitType: "EQUAL",
        splits: []
      });

      setShowExpenseModal(false);
      setExpenseData({
        description: "",
        amount: ""
      });

      fetchExpenses();
      fetchDashboard();
      fetchBalances();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to add expense");
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!memberEmail) {
      return alert("Enter member email");
    }
    try {
      await API.post("/groups/add-member", {
        groupId,
        email: memberEmail
      });

      setShowMemberModal(false);
      setMemberEmail("");

      fetchDashboard();
      fetchMembers();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to add member");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchBalances = async () => {
    try {
      const res = await API.get(
        `/expenses/balances/${groupId}`
      );
      console.log(JSON.stringify(res.data.balances, null, 2));
      setBalances(res.data.balances || {});
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await API.get(
        `/groups/${groupId}/members`
      );
      console.log("MEMBERS =>", res.data);
      setMembers(res.data.members || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchExpenses();
    fetchBalances();
    fetchSettlements();
    fetchMembers();
  }, []);

  // Helpers for initials and avatar coloring
  const getAvatarColor = (name) => {
    const colors = [
      "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
      "bg-indigo-500/10 border-indigo-500/25 text-indigo-400",
      "bg-amber-500/10 border-amber-500/25 text-amber-400",
      "bg-rose-500/10 border-rose-500/25 text-rose-400",
      "bg-cyan-500/10 border-cyan-500/25 text-cyan-400",
      "bg-purple-500/10 border-purple-500/25 text-purple-400",
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center gap-3">
        <span className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
        <p className="text-slate-400 text-sm">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] pb-16 relative">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Glass Navbar */}
      <nav className="sticky top-0 z-40 w-full glass-card border-b border-white/5 backdrop-blur-md px-6 py-4 flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-white/5 transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {dashboard?.groupName}
            </h1>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 rounded-xl transition-all duration-200 shadow-sm"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        {/* Actions Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-slate-400 text-sm font-light">Group insights, split balances, and settlements history.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowMemberModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/10 transition-all duration-200 hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-white border border-white/5 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <CircleDollarSign className="w-4 h-4 text-emerald-400" />
              <span>Add Expense</span>
            </button>
            <button
              onClick={() => setShowSettlementModal(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-amber-500/10"
            >
              <Handshake className="w-4 h-4" />
              <span>Settle Up</span>
            </button>
          </div>
        </div>

        {/* Stats Grid - CORRECTED GRID WRAPPER */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Members</h3>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">{dashboard?.totalMembers || 0}</p>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Expenses</h3>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">₹{dashboard?.totalExpenses || 0}</p>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Settlements</h3>
            <p className="text-3xl font-extrabold text-amber-400 mt-2">₹{dashboard?.totalSettlements || 0}</p>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Records</h3>
            <p className="text-3xl font-extrabold text-purple-400 mt-2">{dashboard?.totalExpenseRecords || 0}</p>
          </div>
        </div>

        {/* Main Columns */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Expenses & Settlements */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Expense History */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CircleDollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Expense History</span>
                </h2>
                <span className="text-xs text-slate-400 font-medium px-2.5 py-1 bg-slate-800/60 rounded-full border border-white/5">
                  Items ({expenses.length})
                </span>
              </div>

              {expenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-slate-900/20 border border-dashed border-white/5">
                  <FileText className="w-10 h-10 text-slate-600 mb-2" />
                  <p className="text-slate-400 text-sm">No expenses found for this group.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  {expenses.map((expense) => {
                    const initials = getInitials(expense.payer?.name);
                    const colorClass = getAvatarColor(expense.payer?.name);

                    return (
                      <div
                        key={expense.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/35 border border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${colorClass}`}>
                          {initials}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {expense.description}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 font-light">
                            Paid by <span className="text-slate-300 font-medium">{expense.payer?.name || "Unknown"}</span>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-indigo-400">
                            ₹{expense.amount}
                          </p>
                          <span className="text-[10px] text-slate-500 font-light block mt-1">
                            {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Settlements History */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-amber-400" />
                  <span>Settlement History</span>
                </h2>
                <span className="text-xs text-slate-400 font-medium px-2.5 py-1 bg-slate-800/60 rounded-full border border-white/5">
                  Items ({settlements.length})
                </span>
              </div>

              {settlements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-slate-900/20 border border-dashed border-white/5">
                  <Handshake className="w-10 h-10 text-slate-600 mb-2" />
                  <p className="text-slate-400 text-sm">No settlements recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {settlements.map((settlement) => (
                    <div
                      key={settlement.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/35 border border-white/5 hover:border-white/10 transition-all text-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-semibold text-emerald-400 truncate">{settlement.payer?.name}</span>
                        <span className="text-slate-500 font-light shrink-0">paid</span>
                        <span className="font-semibold text-indigo-400 truncate">{settlement.payee?.name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-amber-400">₹{settlement.amount}</p>
                        <span className="text-[10px] text-slate-500 font-light block mt-1">
                          {settlement.createdAt ? new Date(settlement.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Balance Summary & Group Members */}
          <div className="space-y-8">
            
            {/* Balance Summary - CORRECTED LABEL MISMATCH */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span>Balance Summary</span>
              </h2>

              {Object.keys(balances).length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm rounded-2xl bg-slate-900/20 border border-dashed border-white/5">
                  No balance data available.
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(balances).map(([memberName, amount]) => {
                    const owesMoney = amount < 0;
                    const isSettled = amount === 0;

                    return (
                      <div
                        key={memberName}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/30 border border-white/5"
                      >
                        <div className="min-w-0 pr-4">
                          <p className="text-sm font-semibold text-white truncate">
                            {memberName}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          {isSettled ? (
                            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-400 rounded-full border border-white/5">
                              Settled Up
                            </span>
                          ) : owesMoney ? (
                            <span className="text-xs font-semibold px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full">
                              owes ₹{Math.abs(amount)}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                              owed ₹{amount}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Group Members */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Group Members</span>
              </h2>

              {members.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm rounded-2xl bg-slate-900/20 border border-dashed border-white/5">
                  No members found.
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {members.map((member) => {
                    const initials = getInitials(member.user?.name);
                    const colorClass = getAvatarColor(member.user?.name);
                    const isAdmin = member.role === "ADMIN";

                    return (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/20 border border-white/5"
                      >
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${colorClass}`}>
                          {initials}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm font-semibold text-white truncate">{member.user?.name}</span>
                            {isAdmin && (
                              <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded shrink-0">
                                admin
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 block truncate mt-0.5 font-light">
                            {member.user?.email}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md glass-modal p-6 rounded-2xl animate-fade-in-up relative">
            <button 
              onClick={() => setShowMemberModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">Add Member</h2>
            </div>

            <form onSubmit={addMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  User Email Address
                </label>
                <input
                  type="email"
                  placeholder="friend@example.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full p-3 rounded-xl form-input text-sm"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/15 transition-all"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settle Up Modal */}
      {showSettlementModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md glass-modal p-6 rounded-2xl animate-fade-in-up relative">
            <button 
              onClick={() => setShowSettlementModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Handshake className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">Settle Up</h2>
            </div>

            <form onSubmit={createSettlement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Who did you pay?
                </label>
                <select
                  value={settlementData.payeeId}
                  onChange={(e) =>
                    setSettlementData({
                      ...settlementData,
                      payeeId: e.target.value
                    })
                  }
                  className="w-full p-3 rounded-xl form-input text-sm appearance-none bg-[#0d111c] cursor-pointer"
                  required
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option
                      key={member.user.id}
                      value={member.user.id}
                    >
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Amount paid (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={settlementData.amount}
                    onChange={(e) =>
                      setSettlementData({
                        ...settlementData,
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
                  onClick={() => setShowSettlementModal(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-semibold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/10 transition-all"
                >
                  Record Settlement
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
                  Expense Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dinner, utilities, etc."
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
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupDetails;