import { useModal } from "../../components/Modals/ModalContext";

const Testing = () => {
  const { showModal, hideModal } = useModal();

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>Homepage Categories</h1>
      <button onClick={() => showModal({ content: <div>Hello modal</div> })}>Show Modal</button>

    </div>
  );
};

export default Testing;