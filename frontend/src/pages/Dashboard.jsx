import React, { useState } from "react";

const models = ["GPT-4", "Claude", "LLaMA", "Qwen", "Granite"];

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [selectedModels, setSelectedModels] = useState([]);
  const [response, setResponse] = useState("");

  const toggleModel = (model) =>
    setSelectedModels((prev) => (prev.includes(model) ? [] : [model]));

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // very simple demo logic
    const suspiciousWords = ["inject", "drop", "delete", "prompt"];
    const textToCheck = file ? file.name : message;
    const isInjection = suspiciousWords.some((w) =>
      textToCheck.toLowerCase().includes(w)
    );

    if (isInjection) {
      setResponse("⚠️ Detected potential prompt injection!");
    } else {
      setResponse(
        `LLM Response for “${
          message || file?.name || "no input"
        }” using model: ${selectedModels[0] || "none"}${
          file ? " (document scanned)" : ""
        }`
      );
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-black via-[#0b220b] to-black px-6">
      <div className="bg-[#0d1c0d] p-10 rounded-2xl w-full max-w-6xl flex gap-10 border border-green-700/30 shadow-[0_0_25px_#00994444]">
        {/* LEFT: prompt + file + model */}
        <form onSubmit={handleSubmit} className="flex flex-col w-1/2 space-y-6">
          <h2 className="text-green-400 text-3xl font-bold font-mono tracking-wide">
            Enter your message
          </h2>

          <textarea
            className="resize-none h-32 p-4 bg-transparent border border-green-700/30 text-white rounded-lg outline-none focus:ring-2 focus:ring-green-400 placeholder-green-300 placeholder-opacity-50 shadow-sm"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Document upload */}
          <div>
            <h3 className="text-green-400 font-semibold mb-2 font-mono tracking-wide">
              Or upload a document
            </h3>
            <label className="block w-full cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                onChange={handleFile}
                className="hidden"
              />
              <div className="w-full p-3 bg-transparent border border-green-700/30 rounded-lg text-green-400 hover:bg-green-700/30 transition text-center">
                {file ? file.name : "Choose file"}
              </div>
            </label>
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
            type="submit"
            className="w-full bg-gradient-to-r from-green-600/90 to-green-700/90 text-white hover:from-green-500/90 hover:to-green-600/90 font-semibold py-3 rounded-lg transition shadow-md"
          >
            Submit
          </button>
        </form>

        {/* RIGHT: result */}
        <div className="w-1/2 flex flex-col">
          <h2 className="text-green-400 text-3xl font-bold mb-2 font-mono tracking-wide text-center">
            Response
          </h2>
          <div className="h-64 p-6 bg-transparent border border-green-700/30 text-white rounded-lg overflow-auto whitespace-pre-wrap shadow-inner font-mono">
            {response || "The response will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
