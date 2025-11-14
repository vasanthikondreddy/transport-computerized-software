import axios from 'axios';
import { toast } from 'react-toastify';
import AssignTruck from './AssignTruck';

const ConsignmentRow = ({ consignment }) => {
  const updateStatus = async (newStatus) => {
    try {
      await axios.put(`/consignments/update-status/${consignment._id}`, { status: newStatus });
      toast.success('Status updated');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <tr>
      <td>{consignment.destination}</td>
      <td>{consignment.status}</td>
      <td>{consignment.truck?.number || 'Unassigned'}</td>
      <td><AssignTruck consignmentId={consignment._id} /></td>
      <td>
        <button
          onClick={() => updateStatus('delivered')}
          className="btn-success"
        >
          Mark Delivered
        </button>
      </td>
    </tr>
  );
};

export default ConsignmentRow;
