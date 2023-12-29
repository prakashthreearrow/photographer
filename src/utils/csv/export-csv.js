export const downloadCSVData = (data, fileName) => {
  if (typeof window !== "undefined") {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("hidden", "");
    downloadLink.setAttribute("href", url);
    downloadLink.setAttribute("download", `${fileName || "report"}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
};
