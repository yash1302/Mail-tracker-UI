import { FiSearch } from "react-icons/fi";

const data = [
  {
    name: "Maya Tran",
    email: "maya@zenli.io",
    message: "Thanks for reaching out—this looks interesting.",
    date: "Jul 9, 2025",
    status: "Booked",
    org: "Zenli",
    tag: "Top priority"
  },
  {
    name: "Lucas Moreno",
    email: "lucas@syncr.io",
    message: "Let's set something up for early next week.",
    date: "Jul 11, 2025",
    status: "Replied",
    org: "Syncro",
    tag: "Meeting booked"
  }
];

const MessageTable = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border">

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">

        <h2 className="font-semibold">
          Recent messages
        </h2>

      </div>

      {/* Filters */}
      <div className="flex gap-3 p-4 border-b">

        <div className="flex items-center border rounded-lg px-3 py-2 w-72">

          <FiSearch className="text-gray-400" />

          <input
            placeholder="Search messages"
            className="ml-2 outline-none text-sm"
          />

        </div>

        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>Status</option>
        </select>

        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>Organization</option>
        </select>

      </div>

      {/* Table */}
      <table className="w-full text-sm">

        <thead className="text-gray-500 border-b">

          <tr>
            <th className="text-left p-3">Lead</th>
            <th className="text-left">Message</th>
            <th>Date</th>
            <th>Status</th>
            <th>Organization</th>
            <th>Tags</th>
          </tr>

        </thead>

        <tbody>

          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">

              <td className="p-3">
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-gray-400 text-xs">
                    {row.email}
                  </p>
                </div>
              </td>

              <td>{row.message}</td>

              <td>{row.date}</td>

              <td>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                  {row.status}
                </span>
              </td>

              <td>{row.org}</td>

              <td>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                  {row.tag}
                </span>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {/* Pagination */}
      <div className="flex justify-between p-4 text-sm text-gray-500">

        <button className="px-3 py-1 border rounded">
          Previous
        </button>

        <button className="px-3 py-1 border rounded">
          Next
        </button>

      </div>

    </div>
  );
};

export default MessageTable;