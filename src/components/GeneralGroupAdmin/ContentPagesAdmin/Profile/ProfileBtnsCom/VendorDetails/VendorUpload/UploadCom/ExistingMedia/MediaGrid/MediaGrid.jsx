import '../../../SelectMedia.css';
import { useUploadContext } from "../../../../../../../../../../../Providers/RealtorProvider/UploadProvider";

const MediaGrid = () => {
  const { existingMedia, setExistingMedia } = useUploadContext();

  const toggleSelect = (key) => {
    setExistingMedia(prev =>
      prev.map(m =>
        m.key === key ? { ...m, selected: !m.selected } : m
      )
    );
  };

  const toggleVideoPlayback = (e) => {
    e.stopPropagation(); // prevent selection
    const video = e.currentTarget;
    video.paused ? video.play() : video.pause();
  };

  return (
    <div className="media-grid-admin">
      {existingMedia.map(item => (
        <div
          key={item.key}
          className={`media-item-admin ${item.selected ? "selected" : ""}`}
        >
          {/* SELECTION LAYER */}
          <div
            className="media-select-layer"
            onClick={() => toggleSelect(item.key)}
          />

          {item.type === "image" ? (
            <img src={item.url} alt="" />
          ) : (
            <div className="video-wrapper">
                <video
                    src={item.url}
                    muted
                    playsInline
                />

                {/* PLAY BUTTON */}
                <button
                    className="video-play-btn"
                    onClick={(e) => {
                    e.stopPropagation();
                    const video = e.currentTarget.previousSibling;
                    video.paused ? video.play() : video.pause();
                    }}
                >
                    ▶
                </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
