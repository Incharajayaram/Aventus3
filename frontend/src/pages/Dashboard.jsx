import React, { useState, useEffect } from "react";

const models = ["Gemini", "LLaMA", "Qwen", "Granite"];

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [selectedModels, setSelectedModels] = useState([]);
  const [response, setResponse] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [reason, setReason] = useState(""); // <-- NEW

  useEffect(() => {
    if (window.pdfjsLib) {
      setPdfJsLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.min.js";
    s.async = true;
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js";
      setPdfJsLoaded(true);
    };
    document.body.appendChild(s);
  }, []);

  const toggleModel = (m) =>
    setSelectedModels((prev) => (prev.includes(m) ? [] : [m]));

  const readFileAsArrayBuffer = (f) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsArrayBuffer(f);
    });

  const extractTextFromPDF = async (pdfFile) => {
    if (!window.pdfjsLib) throw new Error("PDF.js not loaded");
    const buf = await readFileAsArrayBuffer(pdfFile);
    const pdf = await window.pdfjsLib.getDocument(buf).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      text += tc.items.map((t) => t.str).join(" ") + "\n";
    }
    return text;
  };

  const handleSubmit = async () => {
    setIsAlert(false);
    setResponse("");
    setIsLoading(true);

    let inputText = "";
    if (file) {
      if (file.type !== "application/pdf") {
        setResponse("Please upload a PDF file only.");
        setIsLoading(false);
        return;
      }
      try {
        inputText = await extractTextFromPDF(file);
      } catch (e) {
        setResponse(`Error extracting text: ${e.message}`);
        setIsLoading(false);
        return;
      }
    } else if (message.trim()) {
      inputText = message.trim();
    } else {
      setResponse("Please enter a message or upload a PDF file.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Call analyze API first
      const analyzeRes = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        setResponse(`Analyze error: ${analyzeData.error || "Unknown"}`);
        setIsLoading(false);
        return;
      }

      const injected = analyzeData.prediction === 1;
      setIsAlert(injected);
      setReason(injected ? "Fetching explanation..." : "");
      setResponse(
        injected
          ? "⚠️ Prompt-injection suspected!\n\n💡 Rephrase or remove instructions that override system or developer policies."
          : "✅ No injection patterns found.\n\n👍 Looks good, but always double-check sensitive requests."
      );

      // If injection detected, fetch explanation in parallel but don't wait for it
      if (injected) {
        fetch("http://localhost:5000/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.explanation) {
              setReason(data.explanation);
            } else {
              setReason(data.error || "No explanation returned.");
            }
          })
          .catch((e) => {
            setReason(`Explain fetch error: ${e.message}`);
          });
      }

      // 3. If LLaMA selected AND analyze safe (0), call LLaMA ask API
      if (!injected && selectedModels.includes("LLaMA")) {
        // Show loading message for LLaMA call
        setResponse((r) => r + "\n\n⏳ Getting LLaMA response...");

        try {
          const llamaRes = await fetch("http://localhost:5000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: inputText }),
          });
          const llamaData = await llamaRes.json();

          if (llamaRes.ok && llamaData.output) {
            setResponse(
              (r) => r + `\n\n🦙 LLaMA response:\n${llamaData.output}`
            );
          }
        } catch (e) {
          setResponse((r) => r + "\n\n🦙 Failed to reach LLaMA backend.");
        }
      }

      // Gemini model selected
      if (!injected && selectedModels.includes("Gemini")) {
        try {
          setResponse((r) => r + "\n\n⏳ Getting Gemini response...");

          let modelInstruction = "";
          switch (selectedModels[0]) {
            case "GPT-4":
              modelInstruction = "You are GPT-4. ";
              break;
            case "Gemini":
              modelInstruction = "You are Gemini. ";
              break;
            case "LLaMA":
              modelInstruction = "You are Meta's LLaMA model. ";
              break;
            case "Qwen":
              modelInstruction = "You are Qwen, the Alibaba AI model. ";
              break;
            case "Granite":
              modelInstruction = "You are Granite, a secure and robust LLM. ";
              break;
            default:
              modelInstruction = "";
          }

          const fullPrompt = `${modelInstruction}Analyze and respond to the following input:\n\n${inputText}`;

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
              import.meta.env.VITE_GEMINI_API_KEY
            }`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: fullPrompt }],
                  },
                ],
              }),
            }
          );

          const geminiData = await geminiRes.json();

          if (geminiRes.ok) {
            const geminiText =
              geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (geminiText.trim() === "") {
              setResponse(
                (r) => r + "\n\n⚠️ Gemini response was empty. Please try again."
              );
            } else {
              setResponse((r) => r + `\n\n🤖 Gemini says:\n\n${geminiText}`);
            }
          } else {
            setResponse(
              (r) =>
                r +
                `\n\n⚠️ Gemini API error: ${JSON.stringify(
                  geminiData.error || geminiData
                )}`
            );
          }
        } catch (err) {
          setResponse((r) => r + `\n\n❌ Gemini fetch error: ${err.message}`);
        }
      }
    } catch (e) {
      setResponse("❌ Failed to reach Flask analyze backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-black via-[#0b220b] to-black px-6">
      <div className="bg-[#0d1c0d] p-10 rounded-2xl w-full max-w-6xl flex gap-10 border border-green-700/30 shadow-[0_0_25px_#00994444]">
        {/* LEFT */}
        <div className="flex flex-col w-1/2 space-y-6">
          <h2 className="text-green-400 text-3xl font-bold font-mono">
            Enter your message
          </h2>

          <textarea
            rows={6}
            className="resize-none p-4 bg-transparent border border-green-700/30 text-white rounded-lg outline-none"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div>
            <h3 className="text-green-400 font-semibold mb-2 font-mono">
              Or upload a PDF document
            </h3>
            <label className="block w-full cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div className="w-full p-3 bg-transparent border border-green-700/30 rounded-lg text-green-400 text-center">
                {file ? file.name : "Choose PDF file"}
              </div>
            </label>
          </div>

          <div>
            <h3 className="text-green-400 font-semibold mb-2 font-mono">
              Select Model
            </h3>
            <div className="flex flex-wrap gap-3">
              {models.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleModel(m)}
                  className={`px-4 py-2 rounded-lg border font-semibold ${
                    selectedModels.includes(m)
                      ? "bg-green-600 border-green-500 text-white"
                      : "bg-transparent border-green-700/30 text-green-400"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !pdfJsLoaded}
            className="w-full bg-gradient-to-r from-green-600/90 to-green-700/90 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading
              ? "Processing..."
              : !pdfJsLoaded
              ? "Loading PDF.js..."
              : "Submit"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 flex flex-col">
          <h2 className="text-green-400 text-3xl font-bold mb-2 font-mono text-center">
            Response
          </h2>
          <div
            tabIndex={0}
            className={`h-64 p-6 rounded-lg overflow-auto whitespace-pre-wrap border shadow-inner font-mono
              ${
                isLoading
                  ? "bg-transparent border-green-700/30 text-white"
                  : isAlert
                  ? "bg-red-900/20 border-red-500 text-red-300 animate-pulse"
                  : "bg-transparent border-green-700/30 text-white"
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-green-400">Getting response...</span>
              </div>
            ) : (
              response || "The response will appear here."
            )}
          </div>
          {isAlert && (
            <>
              <h3 className="text-yellow-400 text-xl font-bold font-mono text-center">
                Why it was flagged
              </h3>
              <div
                tabIndex={0}
                className="h-48 p-4 rounded-lg overflow-auto whitespace-pre-wrap
                          bg-yellow-900/20 border border-yellow-500 text-yellow-300
                          shadow-inner font-mono"
              >
                {reason || "Analyzing…"}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
