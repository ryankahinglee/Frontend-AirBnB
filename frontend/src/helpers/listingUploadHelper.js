export function jsonReader (file) {
  try {
    const reader = new FileReader();
    const jsonPromise = new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => {
        try {
          resolve(JSON.parse(reader.result));
        } catch (e) {
          resolve(null);
        }
      }
    });
    reader.readAsText(file);
    return jsonPromise;
  } catch (e) {
    return null;
  }
}
