import React, {useState, useEffect} from 'react';
import './VendorScanGenerator.css';
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { useProfileContext } from '../../../../../../../Providers/RealtorProvider/ProfileProvider';
import { DataStore } from 'aws-amplify/datastore';
import { VendorScanner } from '../../../../../../models';
import { v4 as uuidv4 } from 'uuid'; 

function VendorScanGenerator() {
    const { dbRealtor } = useAuthContext();
    const {name, setName, scanToken, setScanToken, isActive, setIsActive, expiresAt, setExpiresAt} = useProfileContext();
    const [scannerLinks, setScannerLinks] = useState([]); 

    const generateScanner = async () => {
        if (!dbRealtor?.id) {
            alert("No vendor found");
            return;
        }

        // generate new token
        const token = uuidv4();
        setScanToken(token);

        // handle expiresAt: if input empty, store null
        const expiry = expiresAt ? new Date(expiresAt).toISOString() : null;

        const scanner = await DataStore.save(
        new VendorScanner({
            vendorID: dbRealtor.id,
            name: name || "Unnamed Link",
            token,
            isActive,
            expiresAt: expiry, 
        })
        );

        // add newly created scanner to UI immediately
        setScannerLinks((prev) => [...prev, scanner]);

        // Reset Fields to default
        setName("");
        setExpiresAt("");
        setScanToken("");
        setIsActive(true);
    };

    // ✅ Toggle active/revoked
    const toggleActive = async (scanner) => {
        const updated = await DataStore.save(
        VendorScanner.copyOf(scanner, (updated) => {
            updated.isActive = !scanner.isActive;
        })
        );

        setScannerLinks((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
        );
    };

    // ✅ Delete scanner
    const deleteScanner = async (scanner) => {
        await DataStore.delete(scanner);
        setScannerLinks((prev) => prev.filter((s) => s.id !== scanner.id));
    };


    // 🔄 useEffect #1: Auto-expire scanners
    // Runs once on mount → sets up an interval that checks every minute.
    // It fetches all active scanners and deactivates them if their expiry time has passed.
    useEffect(() => {
    const interval = setInterval(async () => {
        const now = new Date();

        // fetch active scanners from DataStore
        const activeScanners = await DataStore.query(VendorScanner, s => s.isActive.eq(true));

        for (const scanner of activeScanners) {
            if (scanner.expiresAt && new Date(scanner.expiresAt) < now) {
                await DataStore.save(
                VendorScanner.copyOf(scanner, updated => {
                    updated.isActive = false;
                })
                );
            }
        }
    }, 60 * 1000); // every minute

    return () => clearInterval(interval);
    }, []);

    // 📥 useEffect #2: Fetch vendor’s scanners
    // Runs whenever `dbRealtor.id` changes (e.g., when vendor logs in).
    // It loads all scanners belonging to this vendor from DataStore into local state.
    useEffect(() => {
        const fetchScanners = async () => {
            if (!dbRealtor?.id) return;
            const scanners = await DataStore.query(VendorScanner, s => s.vendorID.eq(dbRealtor.id));
            setScannerLinks(scanners);
        };
        fetchScanners();

        // 👀 Realtime subscription
        const subscription = DataStore.observe(VendorScanner).subscribe(
            async ({ opType, element }) => {
                if (element.vendorID !== dbRealtor.id) return; // only this vendor’s scanners

                if (opType === "INSERT") {
                    setScannerLinks((prev) => [...prev, element]);
                } else if (opType === "UPDATE") {
                    setScannerLinks((prev) =>
                        prev.map((s) => (s.id === element.id ? element : s))
                    );
                } else if (opType === "DELETE") {
                    setScannerLinks((prev) =>
                        prev.filter((s) => s.id !== element.id)
                    );
                }
            }
        );
        return () => subscription.unsubscribe();
    }, [dbRealtor?.id]);
  return (
    <div className="scanner-container">
        <h2>Scan Access</h2>
        <button 
            className="btn-generate"
            onClick={generateScanner}
        >
            Generate Scanner Link
        </button>

        <label className="">Name of Link</label>
        <input
            className=""
            placeholder="Gate Entrance, John(Staff)"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />

        <label>Expires At</label>
        <input
            className=""
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
        />
        {/* Helper Text */}
        <p className="helper-text">If you want permanent, don't fill</p>

        <ul>
            {scannerLinks.map((scanner) => (
            <li key={scanner.id} className="scanner-item">
                {scanner.name} - 
                <a href={`/realtorcontent/scanner?token=${scanner.token}`} target="_blank" rel="noreferrer">
                    Open Scanner {''}
                </a>

                {scanner.expiresAt && (
                <span> 
                    (expires {new Date(scanner.expiresAt).toLocaleString()})
                </span>
                )}

                {!scanner.isActive && <span> (revoked)</span>}

                {/* Scan Actions */}
                <div className="scanner-actions">
                    <button
                        className="btn-toggle"
                        onClick={() => toggleActive(scanner)}
                    >
                        {scanner.isActive ? 'Revoke' : 'Activate'}
                    </button>
                    <button
                        className="btn-delete"
                        onClick={() => deleteScanner(scanner)}
                    >
                        Delete
                    </button>
                </div>
            </li>
            ))}
        </ul>
    </div>
  )
}

export default VendorScanGenerator
