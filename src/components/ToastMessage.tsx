"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";

type Props = {
  message: string;
  type?: "success" | "error" | "warning";
  duration?: number;
  onClose: () => void;
};

export default function ToastMessage({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
  }[type];

  return (
    <div
      className={classNames(
        "fixed inset-0 flex items-center justify-center z-50",
      )}
    >
      <div
        className={classNames(
          "text-white px-8 py-4 rounded shadow-lg text-lg max-w-lg w-full mx-4 text-center",
          bgColor
        )}
      >
        {message}
      </div>
    </div>
  );
}