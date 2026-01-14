import { useEffect, useState, useMemo } from "react";
import '../../SelectMedia.css';
import { fetchAuthSession } from "aws-amplify/auth";
import { useUploadContext } from "../../../../../../../../../../Providers/RealtorProvider/UploadProvider";
import { useSearchParams, useNavigate } from "react-router-dom";
import MediaGrid from "./MediaGrid/MediaGrid";

const ExistingMedia = () => {
    const [loading, setLoading] = useState(false);
    const { existingMedia, setExistingMedia, setMedia } = useUploadContext();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const vendorSub = searchParams.get("vendorSub");

    const selectedCount = useMemo(
        () => existingMedia.filter(m => m.selected).length,
        [existingMedia]
    );

    useEffect(() => {
        if (!vendorSub) return;

        const fetchMedia = async () => {
        setLoading(true);

        try {
            const session = await fetchAuthSession();
            const token = session.tokens.idToken.toString();

            const url = `${import.meta.env.VITE_REALTOR_ADMIN_API}/vendor-media?vendorSub=${vendorSub}`;

            const res = await fetch(url, {
            headers: { Authorization: token },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            // Ensure selected flag exists
            setExistingMedia(data.map(m => ({ ...m, selected: false })));
        } catch (err) {
            console.error("Failed to fetch existing media:", err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchMedia();
    }, [vendorSub, setExistingMedia]);

    const goNext = () => {
        const selected = existingMedia.filter(m => m.selected);

        if (!selected.length) return;

        // 🔁 Normalize to vendor upload format
        const normalizedMedia = selected.map(m => ({
            uri: m.url,              // HTTPS S3 URL
            key: m.key,              // S3 key (IMPORTANT)
            type: m.type,            // "image" | "video"
            name: m.key.split("/").pop(), // optional but useful
        }));

        // ✅ This is the critical line
        setMedia(normalizedMedia);

        navigate(`/admin/vendor_select_address?vendorSub=${vendorSub}`);
    };

    if (loading) {
        return <div className="media-admin-page">Loading media…</div>;
    }

  return (
    <div className="media-admin-page">
      <div className="media-admin-header">
        <h2>Select media for this vendor</h2>
        <p>Choose existing images or videos from storage</p>
      </div>

      <MediaGrid />

      <div className="media-admin-footer">
        <span>{selectedCount} selected</span>

        <button
          className="media-admin-next-btn"
          disabled={selectedCount === 0}
          onClick={goNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ExistingMedia;
