import React, { useEffect, useState } from "react";
import { DataStore } from "aws-amplify/datastore";
import './ManualPayouts.css'
import { VendorBalance, VendorTransaction, Booking, Realtor, Notification, } from "../../../../../../models";
const ManualPayouts = () => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const API_BASE = "/.netlify/functions";

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const allBalances = await DataStore.query(VendorBalance);
      // only show those with pendingBalance > 0
      const pending = allBalances.filter((b) => b.pendingBalance > 0);
      // augment with realtor contact info
      const withRealtor = await Promise.all(
        pending.map(async (b) => {
          const realtor = await DataStore.query(Realtor, b.realtorID);
          return { balance: b, realtor };
        })
      );
      setBalances(withRealtor);
    } catch (err) {
      console.error("Error fetching balances:", err);
    } finally {
      setLoading(false);
    }
  };

  // Payout a single vendor
  const payoutVendor = async (balanceObj) => {
    const { balance, realtor } = balanceObj;
    if (!realtor || !balance.pendingBalance) return;
    setProcessing(true);

    const amountToPay = balance.pendingBalance;
        try {
            const payload = {
                account_number: realtor.accountNumber,
                bank_code: realtor.bankCode,
                amount: amountToPay,
                narration: `Manual payout to realtor ${realtor.id}`,
            };

            const res = await fetch(`${API_BASE}/send-payout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data && data.success) {
                // Update VendorBalance
                const updatedBalance = await DataStore.save(
                    VendorBalance.copyOf(balance, (updated) => {
                        updated.totalPaid = (updated.totalPaid || 0) + amountToPay;
                        updated.pendingBalance = updated.totalEarned - updated.totalPaid;
                        updated.lastPayoutDate = new Date().toISOString();
                    })
                );

                // Create PAYOUT transaction
                await DataStore.save(
                    new VendorTransaction({
                        vendorBalanceID: updatedBalance.id,
                        realtorID: realtor.id,
                        bookingID: "MANUAL_BATCH", // if this is not tied to a booking, or put a real booking id
                        type: "PAYOUT",
                        amount: amountToPay,
                        status: "COMPLETED",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    })
                );

                // Optional notify realtor
                await DataStore.save(
                    new Notification({
                        recipientID: realtor.id,
                        recipientType: "REALTOR",
                        type: "PAYOUT",
                        message: `₦${amountToPay.toLocaleString()} has been paid to your account.`,
                        read: false,
                    })
                );

                alert(`Payout of ₦${amountToPay.toLocaleString()} succeeded for ${realtor.id}`);
            } else {
                // Log failed transaction
                await DataStore.save(
                    new VendorTransaction({
                        vendorBalanceID: balance.id,
                        realtorID: realtor.id,
                        bookingID: "MANUAL_BATCH",
                        type: "PAYOUT",
                        amount: amountToPay,
                        status: "FAILED",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    })
                );
                alert(`Payout failed for ${realtor.id} — check logs`);
            }
        } catch (err) {
            console.error("Manual payout error:", err);
            alert("Payout error — check console");
        } finally {
            setProcessing(false);
            fetchBalances();
        }
    };

        // Auto-payout runner: pays bookings whose booking.status is CHECKED_IN, VIEWING, VISITING
        const runAutoPayouts = async () => {
        setProcessing(true);
        try {
            const today = new Date();
            const dayOfWeek = today.getDay(); // Sunday = 0
            const isEndOfWeek = dayOfWeek === 5; // only pay on Fridays = 5)

            const statusesToPay = ["CHECKED_IN", "VISITING", "VIEWING"];
            const allBookings = await DataStore.query(Booking);
            const targetBookings = allBookings.filter((b) =>
            statusesToPay.includes(b.status)
            );

            const txns = await DataStore.query(VendorTransaction);
            const allBalances = await DataStore.query(VendorBalance);

            for (const bk of targetBookings) {
                const realtor = await DataStore.query(Realtor, bk.realtorID);
                if (!realtor || realtor.directPayment) continue;

                const vb = allBalances.find((v) => v.realtorID === realtor.id);
                if (!vb) continue;

                // find or create a pending CREDIT transaction
                let creditTxn = txns.find(
                    (t) =>
                    t.bookingID === bk.id &&
                    t.realtorID === realtor.id &&
                    t.type === "CREDIT"
                );

                if (!creditTxn) {
                    // create a pending credit (represents what platform owes)
                    creditTxn = await DataStore.save(
                        new VendorTransaction({
                            vendorBalanceID: vb.id,
                            realtorID: realtor.id,
                            bookingID: bk.id,
                            type: "CREDIT",
                            amount: bk.amount || 0, // you may need to replace with actual commission or earnings
                            status: "PENDING",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        })
                    );

                    // update VendorBalance to reflect pending earnings
                    await DataStore.save(
                        VendorBalance.copyOf(vb, (updated) => {
                            updated.totalEarned = (updated.totalEarned || 0) + (bk.amount || 0);
                            updated.pendingBalance =
                            (updated.pendingBalance || 0) + (bk.amount || 0);
                        })
                    );
                }

                // only perform payout if it’s the end of week
                if (!isEndOfWeek) continue;

                // skip already paid credits
                if (creditTxn.status === "COMPLETED") continue;

                // Pay realtor at end of week
                const payload = {
                    account_number: realtor.accountNumber,
                    bank_code: realtor.bankCode,
                    amount: creditTxn.amount,
                    narration: `Weekly payout for booking ${bk.id}`,
                };

                const res = await fetch(`${API_BASE}/send-payout`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();

                if (data && data.success) {
                    // mark credit as completed
                    await DataStore.save(
                        VendorTransaction.copyOf(creditTxn, (updated) => {
                            updated.status = "COMPLETED";
                            updated.updatedAt = new Date().toISOString();
                        })
                    );

                    // create PAYOUT transaction
                    await DataStore.save(
                        new VendorTransaction({
                            vendorBalanceID: vb.id,
                            realtorID: realtor.id,
                            bookingID: bk.id,
                            type: "PAYOUT",
                            amount: creditTxn.amount,
                            status: "COMPLETED",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        })
                    );

                    // update balance
                    await DataStore.save(
                        VendorBalance.copyOf(vb, (updated) => {
                            updated.totalPaid = (updated.totalPaid || 0) + creditTxn.amount;
                            updated.pendingBalance =
                            updated.totalEarned - updated.totalPaid;
                            updated.lastPayoutDate = new Date().toISOString();
                        })
                    );

                    // optional notification
                    await DataStore.save(
                        new Notification({
                            recipientID: realtor.id,
                            recipientType: "REALTOR",
                            type: "PAYOUT",
                            message: `₦${creditTxn.amount.toLocaleString()} weekly payout sent for booking ${bk.id}`,
                            read: false,
                        })
                    );
                }
            }

            alert("Weekly auto payout process completed");
        } catch (err) {
            console.error("Error in weekly auto payout:", err);
            alert("Weekly payout error — check console");
        } finally {
            setProcessing(false);
            fetchBalances();
        }
    }

  return (
    <div className="manual-payouts-container">
      <div className="manual-payout-header">
        <h2>Manual Payouts</h2>
        <div className="actions">
          <button
            className="payout-btn refresh-btn"
            onClick={fetchBalances}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            className="payout-btn auto-btn"
            onClick={runAutoPayouts}
            disabled={processing}
          >
            {processing ? "Processing..." : "Run Auto Payouts"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="status-msg">Loading balances...</p>
      ) : balances.length === 0 ? (
        <p className="status-msg">No pending balances</p>
      ) : (
        <div className="table-wrapper">
          <table className="balances-table">
            <thead>
              <tr>
                <th>Realtor</th>
                <th>Phone / Email</th>
                <th>Pending Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {balances.map(({ balance, realtor }) => (
                <tr key={balance.id}>
                  <td>{realtor?.username || realtor?.firstName || realtor?.id}</td>
                  <td>
                    {realtor?.phoneNumber} <br />
                    <small>{realtor?.email}</small>
                  </td>
                  <td className="payout-amount">
                    ₦{Number(balance.pendingBalance).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="payout-btn pay-btn"
                      onClick={() => payoutVendor({ balance, realtor })}
                      disabled={processing}
                    >
                      {processing ? "Paying..." : "Pay now"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManualPayouts;