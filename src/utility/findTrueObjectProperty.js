export default function findTrueObjectProperty(obj) {
  for (var key in obj) {
    if (obj[key] === true) {
      return key;
    }
  }
  return null; // Return null if no true property is found
}
