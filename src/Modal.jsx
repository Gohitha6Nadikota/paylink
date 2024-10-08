import React from 'react';

const Modal = ({ productName, variants, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Select {productName} Variant</h2>
        <ul>
          {variants.map((variant, index) => (
            <li key={index} onClick={() => onConfirm(variant)}>
              {`${variant["Amount"]} ${variant["Currency"]} - ${variant["Interval"]}`}
            </li>
          ))}
        </ul>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
