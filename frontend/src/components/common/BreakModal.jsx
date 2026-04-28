const BreakModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl">
        <h2 className="text-xl font-bold">Take a Break</h2>
        <p>You’ve been watching for a while 👀</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          OK
        </button>
      </div>
    </div>
  );
};

export default BreakModal;