export async function generateContentFallback(promptText: unknown, customModelOverride?: string): Promise<{text: string, usedModel: string}> {

  console.log("Mock generateContentFallback called with prompt:", promptText);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: "This is a simulated AI response from the Plugin Sandbox's mock aiModels.ts utility. When copy-pasted to the main app, it will call the real Gemini API.",
        usedModel: customModelOverride || "gemini-simulated-model"
      });
    }, 1000);
  });
}
