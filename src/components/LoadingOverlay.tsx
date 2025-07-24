"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoadingOverlay() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      setLoading(true);
      setPrevPath(pathname);

      const timeout = setTimeout(() => {
        setLoading(false);
      }, 500); // nastav dobu zobrazení spinneru (dynamicky)
    }
  }, [pathname, prevPath]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-[9999]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-100"></div>
    </div>
  );
}