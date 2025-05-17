import React, { useState, useEffect } from "react";

const models = ["GPT-4", "Claude", "LLaMA", "Qwen", "Granite"];

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [selectedModels, setSelectedModels] = useState([]);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);

  // Load PDF.js dynamically
  useEffect(() => {
    // Create script elements for PDF.js and worker
    const loadPdfJs = () => {
      // Check if already loaded
      if (window.pdfjsLib) {
        setPdfJsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.min.js";
      script.async = true;

      script.onload = () => {
        // Now configure the worker
        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js";
        setPdfJsLoaded(true);
      };

      document.body.appendChild(script);
    };

    loadPdfJs();

    // Cleanup
    return () => {
      // Cleanup if needed
    };
  }, []);

  const toggleModel = (model) =>
    setSelectedModels((prev) => (prev.includes(model) ? [] : [model]));

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromPDF = async (pdfFile) => {
    try {
      setIsLoading(true);

      if (!window.pdfjsLib) {
        setResponse("PDF.js library not loaded yet. Please try again.");
        setIsLoading(false);
        return null;
      }

      // Read the file as ArrayBuffer
      const arrayBuffer = await readFileAsArrayBuffer(pdfFile);

      // Use PDF.js
      const pdfjsLib = window.pdfjsLib;

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;

      // Extract text from all pages
      let fullText = "";
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += `Page ${i}:\n${pageText}\n\n`;
      }

      setResponse(fullText);
      setIsLoading(false);
      return fullText;
    } catch (error) {
      console.error("PDF extraction error:", error);
      setIsLoading(false);
      setResponse(`Error extracting text: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async () => {
    // Reset response
    setResponse("");

    // If there's a file and it's a PDF, extract text from it
    if (file) {
      if (file.type === "application/pdf") {
        await extractTextFromPDF(file);
      } else {
        setResponse(
          `The file ${file.name} is not a PDF file. Please upload a PDF document.`
        );
      }
    } else if (message) {
      // Simple logic for text messages (same as original)
      const suspiciousWords = ["inject", "drop", "delete", "prompt"];
      const isInjection = suspiciousWords.some((w) =>
        message.toLowerCase().includes(w)
      );

      if (isInjection) {
        setResponse("⚠️ Detected potential prompt injection!");
      } else {
        setResponse(
          `LLM Response for "${message}" using model: ${
            selectedModels[0] || "none"
          }`
        );
      }
    } else {
      setResponse("Please enter a message or upload a PDF file.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-black via-[#0b220b] to-black px-6">
      <div className="bg-[#0d1c0d] p-10 rounded-2xl w-full max-w-6xl flex gap-10 border border-green-700/30 shadow-[0_0_25px_#00994444]">
        {/* LEFT: prompt + file + model */}
        <div className="flex flex-col w-1/2 space-y-6">
          <h2 className="text-green-400 text-3xl font-bold font-mono tracking-wide">
            Enter your message
          </h2>

          <textarea
            className="resize-none h-32 p-4 bg-transparent border border-green-700/30 text-white rounded-lg outline-none focus:ring-2 focus:ring-green-400 placeholder-green-300 placeholder-opacity-50 shadow-sm"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Document upload (PDF only) */}
          <div>
            <h3 className="text-green-400 font-semibold mb-2 font-mono tracking-wide">
              Or upload a PDF document
            </h3>
            <label className="block w-full cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFile}
                className="hidden"
              />
              <div className="w-full p-3 bg-transparent border border-green-700/30 rounded-lg text-green-400 hover:bg-green-700/30 transition text-center">
                {file ? file.name : "Choose PDF file"}
              </div>
            </label>
            {file && file.type !== "application/pdf" && (
              <p className="mt-2 text-red-400 text-sm">Please select a PDF file</p>
            )}
          </div>

          {/* Model selector */}
          <div>
            <h3 className="text-green-400 font-semibold mb-2 font-mono tracking-wide">
              Select Model
            </h3>
            <div className="flex flex-wrap gap-3">
              {models.map((model) => (
                <button
                  type="button"
                  key={model}
                  onClick={() => toggleModel(model)}
                  className={`px-4 py-2 rounded-lg border font-semibold transition ${
                    selectedModels.includes(model)
                      ? "bg-green-600 border-green-500 text-white shadow-[0_0_10px_#009944bb]"
                      : "bg-transparent border-green-700/30 text-green-400 hover:bg-green-700/50 hover:border-green-700 hover:text-white"
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !pdfJsLoaded}
            className="w-full bg-gradient-to-r from-green-600/90 to-green-700/90 text-white hover:from-green-500/90 hover:to-green-600/90 font-semibold py-3 rounded-lg transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Processing..."
              : !pdfJsLoaded
              ? "Loading PDF.js..."
              : "Submit"}
          </button>
        </div>

      {/* RIGHT: result */}
<div className="w-1/2 flex flex-col">
  <h2 className="text-green-400 text-3xl font-bold mb-2 font-mono tracking-wide text-center">
    Response
  </h2>
  <div
    tabIndex={0}
    className="h-64 p-6 bg-transparent border border-green-700/30 text-white rounded-lg overflow-auto whitespace-pre-wrap shadow-inner font-mono"
  >
    {isLoading ? (
      <div className="flex items-center justify-center h-full">
        <div className="text-green-400">Extracting text from PDF...</div>
      </div>
    ) : (
      response || "The response will appear here..."
    )}
  </div>
</div>

      </div>
    </div>
  );
};

export default Dashboard;
