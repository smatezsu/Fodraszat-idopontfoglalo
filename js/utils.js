export const showMessage = (message, isError = false) => {
    alert((isError ? "❗ " : "✅ ") + message);
  };
  
  export const validateForm = (name, phone, time) => {
    return name.trim() !== "" && phone.trim() !== "" && time !== "";
  };
  