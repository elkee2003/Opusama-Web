import '../../../SelectMedia.css';
import { useUploadContext } from "../../../../../../../../../../../Providers/RealtorProvider/UploadProvider";

const MediaGrid = () => {
  const { existingMedia, setExistingMedia } = useUploadContext();

  const toggleSelect = (item) => {
    setExistingMedia((prev) =>
      prev.map((m) =>
        m.key === item.key
          ? { ...m, selected: !m.selected }
          : m
      )
    );
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    if (e.target.paused) {
      e.target.play();
    } else {
      e.target.pause();
    }
  };

  return (
    <div className="media-grid-admin">
      {existingMedia.map((item) => (
        <div
          key={item.key}
          className={`media-item-admin ${item.selected ? "selected" : ""} ${item.type === "video" ? "video" : ""}`}
          onClick={() => toggleSelect(item)}
        >
          {item.type === "image" ? (
            <img src={item.url} alt="" />
          ) : (
            <video
              src={item.url}
              muted
              onClick={handleVideoClick}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
