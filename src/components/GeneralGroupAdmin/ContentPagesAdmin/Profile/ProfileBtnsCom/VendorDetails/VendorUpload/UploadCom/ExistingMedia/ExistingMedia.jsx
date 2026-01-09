import { useEffect, useState } from "react";
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
        const session = await fetchAuthSession();
        const token = session.tokens.idToken.toString();

        const res = await fetch(
          `${import.meta.env.VITE_REALTOR_ADMIN_API}/vendor-media?vendorSub=${vendorSub}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch media");
        }

        const data = await res.json();
        setExistingMedia(data);
      } catch (err) {
        console.error("Failed to fetch existing media", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [vendorSub, setExistingMedia]);

  return loading ? <p>Loading...</p> : <MediaGrid />;
};

export default ExistingMedia;
