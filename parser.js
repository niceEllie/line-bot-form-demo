exports.parseCommand = (text) => {
  if (text.startsWith("#註冊完成")) {
    const parts = text.split(" ");
    return {
      command: "#註冊完成",
      data: {
        brand: parts[1] || "",
        assistant: parts[2] || "",
        region: parts[3] || "",
        mid: parts[4] || "",
      }
    };
  }

  if (text.startsWith("#上線完成")) {
    const parts = text.split(" ");
    return {
      command: "#上線完成",
      data: {
        brand: parts[1] || "",
      }
    };
  }

  return { command: "", data: {} };
};