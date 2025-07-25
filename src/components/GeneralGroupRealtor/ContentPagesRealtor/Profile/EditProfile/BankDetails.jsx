import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash"; 
import { useProfileContext } from "../../../../../../Providers/RealtorProvider/ProfileProvider";

//Get the base URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BankDetails = () => {
    const [bankList, setBankList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const {
      bankName, 
      setBankName,
      bankCode, 
      setBankCode,
      accountName, 
      setAccountName, 
      accountNumber, 
      setAccountNumber,
    } = useProfileContext();

    // Step 1: Fetch bank list from your backend
    useEffect(() => {
        const fetchBanks = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/banks`);
            setBankList(response.data.data);
        } catch (err) {
            console.error("Failed to fetch bank list:", err);
        }
        };

        fetchBanks();
    }, []);

    // Step 2: Set bank code when bank name changes
    useEffect(() => {
        if (!bankName) return;
        const bank = bankList.find(
        (b) => b.name.toLowerCase() === bankName.toLowerCase()
        );

        if (bank) {
        setBankCode(bank.code);
        } else {
        setBankCode("");
        }
    }, [bankName, bankList]);

    // Step 3: Verify account number using your backend
    // Step 3: Verify account number (debounced)
  const debouncedVerify = useCallback(
    debounce(async (accountNumber, bankCode) => {
      if (accountNumber.length !== 10 || !bankCode) {
        setAccountName("");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const res = await axios.post(`${API_BASE_URL}/resolve-account`, {
          account_number: accountNumber,
          bank_code: bankCode,
        });
        setAccountName(res.data.data.account_name);
      } catch (err) {
        console.error("Verification error:", err.response?.data || err);
        setError("Unable to verify account. Please check details.");
        setAccountName("");
      } finally {
        setLoading(false);
      }
    }, 800), [] // empty dependency ensures debounce function is created only once
  );

  useEffect(() => {
    debouncedVerify(accountNumber, bankCode);

    return () => {
      debouncedVerify.cancel(); // Cleanup debounce
    };
  }, [accountNumber, bankCode, debouncedVerify]);

  return (
    <div >
      {/* <h2>Bank Account Verification</h2> */}

        {/* <textarea
            value={bankname}
            onChange={(e) => setBankname(e.target.value)}
            placeholder="Bank name"
            className="realtorProfileInput"
        />

        <textarea
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Account name"
            className="realtorProfileInput"
        />

        <textarea
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Account number"
            className="realtorProfileInputLast"
        /> */}

      <div style={{ marginBottom: 10 }}>
        {/* <label>Bank Name:</label> */}
        <input
          type="text"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          placeholder="Bank name"
          list="banks"
          style={{ width: "100%", padding: 8 }}
        />
        <datalist id="banks">
          {bankList.map((bank) => (
            <option key={bank.code} value={bank.name} />
          ))}
        </datalist>
      </div>

      <div style={{ marginBottom: 10 }}>
        {/* <label>Account Number:</label> */}
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          maxLength={10}
          placeholder="Account number"
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      {loading && <p>Verifying...</p>}
      {accountName && !loading && (
        <p className='accountName'>{accountName}</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default BankDetails;