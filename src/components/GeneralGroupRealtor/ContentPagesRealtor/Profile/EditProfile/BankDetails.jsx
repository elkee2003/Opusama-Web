import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import { debounce } from "lodash";
import { useProfileContext } from "../../../../../../Providers/RealtorProvider/ProfileProvider";

// Get the base URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://opusama-web-nc9b.vercel.app/api';
console.log("API_BASE_URL:", API_BASE_URL);

const BankDetails = () => {
  const [bankOptions, setBankOptions] = useState([]);
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

  // Fetch bank list from backend
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bank`);
        console.log("Bank API response:", response.data);

        const banks = response?.data?.data || [];

        if (!Array.isArray(banks) || banks.length === 0) {
          console.warn("No banks received:", response.data);
          return;
        }

        const formattedOptions = banks.map((bank) => ({
          value: bank.code,
          label: bank.name,
        }));

        setBankOptions(formattedOptions);
      } catch (err) {
        console.error("Failed to fetch bank list:", err);
      }
    };

    fetchBanks();
  }, []);

  // Debounced account verification
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
    }, 800),
    []
  );

  useEffect(() => {
    debouncedVerify(accountNumber, bankCode);

    return () => {
      debouncedVerify.cancel();
    };
  }, [accountNumber, bankCode, debouncedVerify]);

  return (
    <div >
      {/* Bank selection */}
      <div className="realtorProfileInputBankCon">
        <Select
          options={bankOptions}
          value={
            bankOptions.find((opt) => opt.label === bankName) || null
          }
          onChange={(selected) => {
            if (selected) {
              setBankCode(selected.value);
              setBankName(selected.label);
            } else {
              setBankCode("");
              setBankName("");
            }
          }}
          placeholder="Select or search bank"
          className="realtorProfileInputBank"
        />
      </div>

      {/* Account number */}
      <div className="realtorProfileInputBankConLast">
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => {
            const value = e.target.value;
            // Allow only digits and max 10 characters
            if (/^\d{0,10}$/.test(value)) {
              setAccountNumber(value);
            }
          }}
          placeholder="Account number"
          className="realtorProfileInputBank"
        />
      </div>

      {/* Account name and feedback */}
      {loading && <p>Verifying...</p>}
      {accountName && !loading && (
        <p className="accountName">{accountName}</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default BankDetails;