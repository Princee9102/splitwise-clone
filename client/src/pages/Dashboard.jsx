import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      alert("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    try {
      const res = await API.post("/groups/create", {
        name: groupData.name,
        description: groupData.description
      });

      console.log(res.data);

      alert("Group Created Successfully 🚀");

      setShowModal(false);

      setGroupData({
        name: "",
        description: ""
      });

      fetchGroups();

    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Failed to create group"
      );
    }
  };

  const addExpense = async () => {
    try {
      await API.post("/expenses/add", {
        groupId: expenseData.groupId,
        description: expenseData.description,
        amount: Number(expenseData.amount),
        splitType: "EQUAL",
        splits: []
      });

      alert("Expense Added Successfully 🚀");

      setShowExpenseModal(false);

      setExpenseData({
        groupId: "",
        description: "",
        amount: ""
      });

    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Failed to add expense"
      );
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-slate-700">
        <h1 className="text-3xl font-bold text-green-400">
          Splitwise 💸
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Welcome */}
      <div className="p-8">
        <h2 className="text-4xl font-bold mb-2">
          Dashboard 🚀
        </h2>

        <p className="text-gray-400">
          Manage your groups, expenses and settlements.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 px-8">

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-gray-400">
            Total Groups
          </h3>

          <p className="text-4xl font-bold mt-3 text-green-400">
            {groups.length}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-gray-400">
            Total Expenses
          </h3>

          <p className="text-4xl font-bold mt-3 text-blue-400">
            ₹0
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-gray-400">
            Settlements
          </h3>

          <p className="text-4xl font-bold mt-3 text-yellow-400">
            ₹0
          </p>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex gap-4 px-8 mt-10">

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold"
        >
          + Create Group
        </button>

        <button
          onClick={() => setShowExpenseModal(true)}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold"
        >
          + Add Expense
        </button>

      </div>

      {/* Groups */}
      <div className="px-8 mt-10">
        <h2 className="text-2xl font-bold mb-4">
          My Groups
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : groups.length === 0 ? (
          <div className="bg-slate-800 p-5 rounded-xl">
            No Groups Found
          </div>
        ) : (
          groups.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                navigate(`/group/${item.group.id}`)
              }
              className="bg-slate-800 p-5 rounded-xl mb-4 cursor-pointer hover:bg-slate-700"
            >
              <h3 className="text-xl font-semibold">
                {item.group.name}
              </h3>

              <p className="text-gray-400 mt-2">
                {item.group.description}
              </p>

              <p className="text-green-400 mt-2">
                Role: {item.role}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Create Group Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">

          <div className="bg-slate-800 p-6 rounded-xl w-96">

            <h2 className="text-2xl font-bold mb-4">
              Create Group
            </h2>

            <input
              type="text"
              placeholder="Group Name"
              value={groupData.name}
              onChange={(e) =>
                setGroupData({
                  ...groupData,
                  name: e.target.value
                })
              }
              className="w-full p-3 rounded bg-slate-700 mb-4"
            />

            <input
              type="text"
              placeholder="Description"
              value={groupData.description}
              onChange={(e) =>
                setGroupData({
                  ...groupData,
                  description: e.target.value
                })
              }
              className="w-full p-3 rounded bg-slate-700 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={createGroup}
                className="bg-green-500 px-4 py-2 rounded w-full"
              >
                Create
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 px-4 py-2 rounded w-full"
              >
                Cancel
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">

          <div className="bg-slate-800 p-6 rounded-xl w-96">

            <h2 className="text-2xl font-bold mb-4">
              Add Expense
            </h2>

            <select
              value={expenseData.groupId}
              onChange={(e) =>
                setExpenseData({
                  ...expenseData,
                  groupId: e.target.value
                })
              }
              className="w-full p-3 rounded bg-slate-700 mb-4"
            >
              <option value="">
                Select Group
              </option>

              {groups.map((item) => (
                <option
                  key={item.group.id}
                  value={item.group.id}
                >
                  {item.group.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Expense Description"
              value={expenseData.description}
              onChange={(e) =>
                setExpenseData({
                  ...expenseData,
                  description: e.target.value
                })
              }
              className="w-full p-3 rounded bg-slate-700 mb-4"
            />

            <input
              type="number"
              placeholder="Amount"
              value={expenseData.amount}
              onChange={(e) =>
                setExpenseData({
                  ...expenseData,
                  amount: e.target.value
                })
              }
              className="w-full p-3 rounded bg-slate-700 mb-4"
            />

            <div className="flex gap-3">

              <button
                onClick={addExpense}
                className="bg-green-500 px-4 py-2 rounded w-full"
              >
                Add
              </button>

              <button
                onClick={() =>
                  setShowExpenseModal(false)
                }
                className="bg-red-500 px-4 py-2 rounded w-full"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;