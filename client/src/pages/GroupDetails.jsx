import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function GroupDetails() {
  const { groupId } = useParams();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [balances, setBalances] = useState({});
  const [members, setMembers] = useState([]);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const [memberEmail, setMemberEmail] = useState("");

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
      alert("Failed to load dashboard");
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

  const createSettlement = async () => {
  try {
    await API.post("/settlements/create", {
      groupId,
      payeeId: settlementData.payeeId,
      amount: Number(settlementData.amount)
    });

    alert("Settlement Added Successfully 🤝");

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

    alert(
      error?.response?.data?.message ||
      "Failed to create settlement"
    );
    }
  }; 

  const addMember = async () => {
  try {
    const res = await API.post("/groups/add-member", {
      groupId,
      email: memberEmail
    });

    alert("Member Added Successfully 🚀");

    setShowMemberModal(false);
    setMemberEmail("");

    console.log(res.data);

    fetchDashboard();
    fetchMembers();

  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data?.message ||
      "Failed to add member"
    );
  }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        {dashboard?.groupName} 🚀
      </h1>
      <button
  onClick={() => setShowMemberModal(true)}
  className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg mb-6 font-semibold"
> + Add Member
    </button>

      <div className="grid md:grid-cols-4 gap-6"></div>
              <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-gray-400">
            Members
          </h3>

          <p className="text-4xl font-bold text-green-400 mt-2">
            {dashboard?.totalMembers}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-gray-400">
            Expenses
          </h3>

          <p className="text-4xl font-bold text-blue-400 mt-2">
            ₹{dashboard?.totalExpenses}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-gray-400">
            Settlements
          </h3>

          <p className="text-4xl font-bold text-yellow-400 mt-2">
            ₹{dashboard?.totalSettlements}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-gray-400">
            Records
          </h3>

          <p className="text-2xl font-bold text-purple-400 mt-2">
            {dashboard?.totalExpenseRecords}
          </p>
          </div>

<div className="mt-10">

  <h2 className="text-2xl font-bold mb-4">
    Expense History 💸
  </h2>

  {expenses.length === 0 ? (
    <div className="bg-slate-800 p-5 rounded-xl">
      No Expenses Found
    </div>
  ) : (
    expenses.map((expense) => (
      <div
        key={expense.id}
        className="bg-slate-800 p-5 rounded-xl mb-4"
      >
        <h3 className="text-xl font-semibold">
          {expense.description}
        </h3>

        <p className="text-blue-400 mt-2">
          Amount: ₹{expense.amount}
        </p>

        <p className="text-green-400 mt-2">
          Paid By: {expense.payer?.name}
        </p>
      </div>
    ))
)}
</div>

{/* Members List */}
<div className="mt-10">

  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold">
      Group Members 👥
    </h2>

    <button
      onClick={() => setShowMemberModal(true)}
      className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-semibold"
    >
      + Add Member
    </button>
  </div>

  {members.length === 0 ? (
    <div className="bg-slate-800 p-5 rounded-xl">
      No Members Found
    </div>
  ) : (
    members.map((member) => (
      <div
        key={member.id}
        className="bg-slate-800 p-4 rounded-xl mb-3"
      >
        <p className="text-lg font-semibold text-green-400">
          {member.user?.name}
        </p>

        <p className="text-blue-400">
          {member.user?.email}
        </p>

        <p className="text-yellow-400 mt-1">
          {member.role}
        </p>
      </div>
    ))
  )}

</div>

{/* Balance Summary */}
<div className="mt-10">

  <h2 className="text-2xl font-bold mb-4">
    Balance Summary 💰
  </h2>

  {Object.keys(balances).length === 0 ? (
    <div className="bg-slate-800 p-5 rounded-xl">
      No Balance Data Found
    </div>
  ) : (
    Object.entries(balances).map(([userId, amount]) => (
      <div
        key={userId}
        className="bg-slate-800 p-5 rounded-xl mb-4"
      >
        <p className="text-lg font-semibold">
          User ID:
          <span className="text-blue-400 ml-2">
            {userId}
          </span>
        </p>

        <p
          className={`mt-2 font-bold ${
            amount >= 0
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          Balance: ₹{amount}
        </p>
      </div>
    ))
  )}

</div>
{/* Settlement History */}
<div className="mt-10">

  <h2 className="text-2xl font-bold mb-4">
    Settlement History 🤝
  </h2>

  <button
  onClick={() => setShowSettlementModal(true)}
  className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg mb-4 font-semibold text-black"
>
  + Settle Up
</button>

  {settlements.length === 0 ? (
    <div className="bg-slate-800 p-5 rounded-xl">
      No Settlements Found
    </div>
  ) : (
    settlements.map((settlement) => (
      <div
        key={settlement.id}
        className="bg-slate-800 p-5 rounded-xl mb-4"
      >
        <p className="text-green-400 font-semibold">
          {settlement.payer?.name}
        </p>

        <p className="text-gray-300">
          paid
        </p>

        <p className="text-blue-400 font-semibold">
          {settlement.payee?.name}
        </p>

        <p className="text-yellow-400 mt-2">
          ₹{settlement.amount}
        </p>
      </div>
    ))
  )}

</div>

{/* Add Member Modal */}
{showMemberModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">

    <div className="bg-slate-800 p-6 rounded-xl w-96">

      <h2 className="text-2xl font-bold mb-4">
        Add Member 👥
      </h2>

      <input
        type="email"
        placeholder="Enter User Email"
        value={memberEmail}
        onChange={(e) =>
          setMemberEmail(e.target.value)
        }
        className="w-full p-3 rounded bg-slate-700 mb-4"
      />

      <div className="flex gap-3">

        <button
          onClick={addMember}
          className="bg-green-500 px-4 py-2 rounded w-full"
        >
          Add
        </button>

        <button
          onClick={() =>
            setShowMemberModal(false)
          }
          className="bg-red-500 px-4 py-2 rounded w-full"
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
)}


{/* Settlement Modal */}
{showSettlementModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">

    <div className="bg-slate-800 p-6 rounded-xl w-96">

      <h2 className="text-2xl font-bold mb-4">
        Settle Up 🤝
      </h2>

      <select
  value={settlementData.payeeId}
  onChange={(e) =>
    setSettlementData({
      ...settlementData,
      payeeId: e.target.value
    })
  }
  className="w-full p-3 rounded bg-slate-700 mb-4"
>
  <option value="">
    Select User
  </option>

{members.map((member) => (
  <option
    key={member.user.id}
    value={member.user.id}
  >
    {member.user.name}
  </option>
))}
  </select>

      <input
        type="number"
        placeholder="Amount"
        value={settlementData.amount}
        onChange={(e) =>
          setSettlementData({
            ...settlementData,
            amount: e.target.value
          })
        }
        className="w-full p-3 rounded bg-slate-700 mb-4"
      />

      <div className="flex gap-3">

        <button
          onClick={createSettlement}
          className="bg-green-500 px-4 py-2 rounded w-full"
        >
          Settle
        </button>

        <button
          onClick={() =>
            setShowSettlementModal(false)
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

export default GroupDetails;