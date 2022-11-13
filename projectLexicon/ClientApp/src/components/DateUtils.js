


  // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  export function dateStr(dateJson) {
    try {
      const date = new Date(dateJson);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60 * 1000);
      if (localDate.toString() === "Invalid Date") return "Unknown Date";
      return localDate.toISOString().split(".")[0].split("T")[0];
    } catch (err) {
      window.alert(`Err Date: ${dateJson}`);
      return "Unknown Date";
    }
  }