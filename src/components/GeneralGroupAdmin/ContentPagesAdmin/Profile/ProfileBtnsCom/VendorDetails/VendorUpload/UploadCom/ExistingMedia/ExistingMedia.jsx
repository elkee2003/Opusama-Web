import { useEffect, useState } from "react";
import '../../SelectMedia.css';
import { fetchAuthSession } from "aws-amplify/auth";
import { useUploadContext } from "../../../../../../../../../../Providers/RealtorProvider/UploadProvider";
import { useSearchParams } from "react-router-dom";
import MediaGrid from "./MediaGrid/MediaGrid";

const ExistingMedia = () => {
  const [loading, setLoading] = useState(false);
  const { setExistingMedia } = useUploadContext();
  const [searchParams] = useSearchParams();

  const vendorSub = searchParams.get("vendorSub");

  useEffect(() => {
    if (!vendorSub) return;

    const fetchMedia = async () => {
      setLoading(true);

      try {
        // 1️⃣ Get Cognito token
        const session = await fetchAuthSession();
        const token = session.tokens.idToken.toString();

        // 2️⃣ Call API
        const url = `${import.meta.env.VITE_REALTOR_ADMIN_API}/vendor-media?vendorSub=${vendorSub}`;

        const res = await fetch(url, {
          headers: {
            Authorization: token,
          },
        });

        // 3️⃣ Validate response type
        const contentType = res.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error("Non-JSON response: " + text);
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        // 4️⃣ Parse data
        const data = await res.json();
        setExistingMedia(data);

      } catch (err) {
        console.error("Failed to fetch existing media:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [vendorSub, setExistingMedia]);

  return loading ? <p>Loading...</p> : <MediaGrid />;
};

export default ExistingMedia;
