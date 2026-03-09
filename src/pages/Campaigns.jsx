import Table from "../components/Table";

const Campaigns = () => {

  const columns = [
    "Campaign",
    "Emails Sent",
    "Replies",
    "Reply Rate",
    "Status"
  ];

  const data = [
    {
      campaign: "Node Outreach",
      emails: 120,
      replies: 20,
      rate: "16%",
      status: "Completed"
    }
  ];

  return (
    <Table columns={columns} data={data} />
  );
};

export default Campaigns;