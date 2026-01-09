import { useEffect, useState } from "react";
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

  return (
    <div className="media-grid">
      {existingMedia.map((item) => (
        <div
          key={item.key}
          className={`media-item ${
            item.selected ? "selected" : ""
          }`}
          onClick={() => toggleSelect(item)}
        >
          {item.type === "image" ? (
            <img src={item.url} />
          ) : (
            <video src={item.url} />
          )}
        </div>
      ))}
    </div>
  );
};


export default MediaGrid;