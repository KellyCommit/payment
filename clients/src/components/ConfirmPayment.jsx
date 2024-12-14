import React, { useState } from "react";
import "./confirmpayment.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ConfirmPayment = ({ onFormSubmit, onSuccessSubmit, onFailureSubmit }) => {
  const { id } = useParams(); // This is the Path ID
  const location = useLocation();

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    transactionID: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { transactionID } = formData;

    try {
      const response = await axios.get(
        `https://ipayment.onrender.com/api/v2/monify/verify-transaction/${transactionID}`
      );

      if (response.data && response.data.responseMessage === "success") {
        onSuccessSubmit();
        onFormSubmit();
        //save payment response

        setTimeout(() => {
          const { transactionID, someOtherData } = response.data;
          // / Redirect to the transfer route with transactionId in the URL
          // Construct the URL
          const redirectURL = `http://localhost:3000/Detail/${id}?transactionID=${encodeURIComponent(
            transactionID
          )}&otherData=${encodeURIComponent(someOtherData)}`;
          // Redirect
          window.location.href = redirectURL;
        }, 5000);
      } else {
        setError("Payment verification failed. Please try again.");
        onFailureSubmit(); // Trigger failure callback
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred during the transaction."
      );
      onFailureSubmit(); // Trigger failure callback
    }
  };

  return (
    <div className="confirmpayment">
      <div className="confirm-header">
        <p>Please fill in your details to confirm your transaction</p>
      </div>
      <div className="confirm-body">
        <form onSubmit={handleSubmit}>
          <div className="sender-info">
            <input
              type="text"
              placeholder="Transaction ID"
              name="transactionID"
              value={formData.transactionID}
              onChange={handleChange}
            />
          </div>
          <p>
            <span>ⓘ</span> Please fill in the note as the transaction ID
          </p>
          <p className="desc">Submit the detail to confirm your transaction</p>
          <button type="submit">Submit Transaction ID</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ConfirmPayment;
