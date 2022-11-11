export function jsonReader (file) {
  try {
    const reader = new FileReader();
    const jsonPromise = new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => resolve(JSON.parse(reader.result));
    });
    reader.readAsText(file);
    return jsonPromise;
  } catch (e) {
    return null;
  }
}
