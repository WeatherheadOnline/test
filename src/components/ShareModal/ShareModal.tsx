"use client";

import { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import "./shareModal.css";

type Props = {
  onClose: () => void;
  homepageUrl: string;
};

export default function ShareModal({ onClose, homepageUrl }: Props) {
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = document.getElementById("bit-capture");
    if (!el) return;

    toPng(el, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    }).then((dataUrl) => {
      fetch(dataUrl).then((r) => r.blob()).then((b) => {
        setPngBlob(b);
        setLoading(false);
      });
    });
  }, []);

  const download = () => {
    if (!pngBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(pngBlob);
    a.download = "my-bit.png";
    a.click();
  };

  const copy = async () => {
    if (!pngBlob) return;
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": pngBlob }),
    ]);
  };

  const shareLink = encodeURIComponent(homepageUrl);

  return (
    <div className="share-backdrop" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Share your bit</h2>

        {loading && <p>Rendering image…</p>}

        <div className="share-actions">
          <button onClick={download} disabled={!pngBlob}>Save image</button>
          <button onClick={copy} disabled={!pngBlob}>Copy image</button>
        </div>

        <div className="share-links">
          <a
            href={`https://twitter.com/intent/tweet?url=${shareLink}`}
            target="_blank"
          >
            Share to X
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}
            target="_blank"
          >
            Facebook
          </a>
          <a
            href={`https://bsky.app/intent/compose?text=${shareLink}`}
            target="_blank"
          >
            Bluesky
          </a>
        </div>

        <button className="share-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}