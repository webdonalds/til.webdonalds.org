import { useEffect } from "react";

export function Comment() {
  useEffect(() => {
    if (!document || document.getElementsByClassName("giscus")[0].hasChildNodes()) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", "webdonalds/til.webdonalds.org");
    script.setAttribute("data-repo-id", "MDEwOlJlcG9zaXRvcnkzOTE2OTA3Mzg");
    script.setAttribute("data-category", "Conversations");
    script.setAttribute("data-category-id", "DIC_kwDOF1i58s4CBHOK");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "ko");

    document.getElementsByClassName("giscus")[0].appendChild(script);
  });

  return <div className="giscus my-8" />;
}
