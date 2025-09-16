export function extractText(response) {
  if (response.text) return response.text;
  if (response.candidates?.length) {
    return response.candidates
      .map((c) => c.content?.parts?.map((p) => p.text).join(" "))
      .join("\n");
  }
  return "";
}
