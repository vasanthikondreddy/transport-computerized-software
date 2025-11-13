// ConsignmentRow.jsx
import AssignTruck from './AssignTruck';

const ConsignmentRow = ({ consignment }) => {
  const updateStatus = (newStatus) => {
    axios.patch(`/api/consignments/${consignment._id}`, { status: newStatus })
      .then(() => alert('Status updated'))
      .catch(err => alert('Update failed'));
  };

  return (
    <tr>
      <td>{consignment.destination}</td>
      <td>{consignment.status}</td>
      <td>{consignment.truck?.number || 'Unassigned'}</td>
      <td><AssignTruck consignmentId={consignment._id} /></td>
      <td>
        <button onClick={() => updateStatus('Delivered')} className="btn-success">Mark Delivered</button>
      </td>
    </tr>
  );
};
