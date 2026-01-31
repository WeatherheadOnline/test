"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import "./shareModal.css";
import "@/styles/globals.css";

type Props = {
  onClose: () => void;
  homepageUrl: string;
};

export default function ShareModal({ onClose, homepageUrl }: Props) {
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveMessage, setLiveMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // For displaying image size in share-modal image preview:
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const isReady = !loading && !!pngBlob;

  // Related to mobile-vs-desktop defaults

  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const shareImage = async () => {
    if (!pngBlob) return;
    if (typeof navigator.share !== "function") return;

    const file = new File([pngBlob], "my-bit.png", { type: "image/png" });

    await navigator.share({
      files: [file],
      text: "Check out my bit",
      url: homepageUrl,
    });
  };

  //   Aria: announce image dimensions after image loads
  useEffect(() => {
    if (imageSize) {
      setLiveMessage(
        `Image ready. ${imageSize.width} by ${imageSize.height} pixels.`,
      );
    }
  }, [imageSize]);

  //   Aria: prevent re-reading on re-render
  useEffect(() => {
    if (liveMessage === "Image ready") {
      const id = setTimeout(() => setLiveMessage(""), 500);
      return () => clearTimeout(id);
    }
  }, [liveMessage]);

  // Focus management + ESC

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();

    const getFocusable = () => {
      if (!modalRef.current) return [];
      return Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const focusables = getFocusable();
      if (focusables.length === 0) return;

      const currentIndex = focusables.indexOf(
        document.activeElement as HTMLElement,
      );

      // ESC closes
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Arrow-key navigation
      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp"
      ) {
        e.preventDefault();

        const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;

        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + delta + focusables.length) % focusables.length;

        const el = focusables[nextIndex];
        el.focus();

        const label =
          el.getAttribute("aria-label") ||
          el.textContent ||
          el.getAttribute("title");

        if (label) {
          setLiveMessage(label.trim());
        }

        return;
      }

      // Tab trapping
      if (e.key !== "Tab") return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [onClose]);

  // Image render
  useEffect(() => {
    const el = document.getElementById("bit-capture");
    if (!el) return;

    toPng(el, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    }).then((dataUrl) =>
      fetch(dataUrl)
        .then((r) => r.blob())
        .then((b) => {
          setPngBlob(b);
          setPreviewUrl(URL.createObjectURL(b));
          setLoading(false);
          setLiveMessage("Image ready");
        }),
    );
  }, []);

  // clean up, prevent memory leaks

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const download = () => {
    if (!pngBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(pngBlob);
    a.download = "my-bit.png";
    a.click();
  };

  // const copy = async () => {
  //   if (!pngBlob) return;
  //   await navigator.clipboard.write([
  //     new ClipboardItem({ "image/png": pngBlob }),
  //   ]);
  // };
  const copy = async () => {
    if (!pngBlob) return;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);

      setShowCopiedToast(true);
    } catch (err) {
      console.error("Failed to copy image", err);
    }
  };

  useEffect(() => {
    if (!showCopiedToast) return;

    const timeout = setTimeout(() => {
      setShowCopiedToast(false);
    }, 1200); // visible duration

    return () => clearTimeout(timeout);
  }, [showCopiedToast]);

  const shareLink = encodeURIComponent(homepageUrl);

  return (
    <div className="share-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="share-modal"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        aria-label="Share options"
      >
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {liveMessage}
        </div>

        <h2>Share your bit</h2>

        {previewUrl && (
          <div className="share-preview">
            {/* OPTION: Without image dimensions listed */}
            {/* <img
      src={previewUrl}
      alt="Preview of your bit"
      draggable={false}
    /> */}
            {/* OPTION: With image dimensions listed  */}
            <img
              src={previewUrl}
              alt="Preview of your bit"
              draggable={false}
              onLoad={(e) => {
                const img = e.currentTarget;
                setImageSize({
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
              }}
            />
            {imageSize && (
              <p className="share-image-size">
                {imageSize.width} × {imageSize.height}px
              </p>
            )}
          </div>
        )}

        {loading && (
          <p role="status" aria-live="polite">
            Rendering image…
          </p>
        )}

        {/* OPTION: without mobile-vs-desktop defaults */}
        {/* <div className="share-actions">
          <button onClick={download} disabled={!pngBlob}>
            Save image (for Instagram, mobile)
          </button>
          <button onClick={copy} disabled={!pngBlob}>
            Copy image (for Discord, chat apps)
          </button>
        </div> */}

        {/* OPTION: with mobile-vs-desktop defaults  */}
        <div className="share-actions">
          {isMobile && canShare && (
            <button
              onClick={shareImage}
              disabled={!isReady}
              aria-disabled={!isReady}
            >
              Share image
            </button>
          )}

          <button
            onClick={download}
            disabled={!isReady}
            aria-disabled={!isReady}
          >
            Save image
          </button>

          {!isMobile && (
            <button onClick={copy} disabled={!isReady} aria-disabled={!isReady}>
              Copy image
            </button>
          )}
        </div>

        {isMobile && (
          <p className="share-hint">
            Use “Share image” for Instagram, Messages, or chat apps.
          </p>
        )}

        {showCopiedToast && (
          <div className="copy-toast" role="status" aria-live="polite">
            Copied
          </div>
        )}

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

        <button className="share-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
