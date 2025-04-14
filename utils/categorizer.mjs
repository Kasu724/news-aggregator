export async function getCategory(text) {
  try {
    const response = await fetch("http://localhost:8000/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (!response.ok) {
      throw new Error("Classifier service error: " + response.statusText);
    }
    const result = await response.json();
    return result.category || "General";
  } catch (error) {
    console.error("Error calling classifier service:", error.message);
    return "General";
  }
}